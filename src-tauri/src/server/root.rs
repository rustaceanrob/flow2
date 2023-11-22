use std::cmp::Ordering;

use bdk::SyncOptions;
use bdk::TransactionDetails;
use bdk::Wallet;
use bdk::bitcoin::Network;
use bdk::blockchain::ConfigurableBlockchain;
use bdk::blockchain::ElectrumBlockchainConfig;
use bdk::blockchain::LogProgress;
use bdk::blockchain::electrum::ElectrumBlockchain;
use bdk::sled;
use bdk::sled::Tree;
use bdk::wallet::AddressIndex;
use tauri::Window;
use crate::wallet::root::pull_wallet_metadata;

const DB_MAGIC: &str = "flow-data";
const WALLET_FOLDER: &str = "wallets";
const SERVICE: &str = "Flow Bitcoin Wallet";

#[derive(Clone, serde::Serialize)]
struct Payload {
	message: String,
}

#[derive(Clone, serde::Serialize)]
struct BalancePayload {
	balance: u64,
}

#[derive(Clone, serde::Serialize)]
struct TransactionPayload {
	transactions: Vec<UserTransaction>,
}

#[derive(Clone, Debug, serde::Serialize)]
struct UserTransaction {
	id: String,
	received: u64,
	sent: u64, 
	fee: u64,
	unix_time: u64,
}

#[derive(Clone, serde::Serialize)]
pub struct UserAddress {
	pub address: String,
	pub path: u32,
}

#[derive(Clone, serde::Serialize)]
pub struct UserUtxo {
	pub value: u64,
	pub txid: String,
}

#[derive(Clone, serde::Serialize)]
pub struct WalletExport {
	pub generic: String,
	pub receive: String,
	pub change: String
}

#[derive(Clone, serde::Serialize)]
pub struct SyncStatus {
	pub is_syncing: bool,
}

fn order_transactions(txs: Vec<TransactionDetails>) -> Result<Vec<UserTransaction>, Box<dyn std::error::Error>> {
	let mut tx_vec = Vec::new();
	for tx in txs {
		let mut confirmed = 0;
		match tx.confirmation_time {
			Some(time) => {
				confirmed = time.timestamp;
			},
			None => { confirmed = 0},
		}
		match tx.fee {
			Some(fee) => tx_vec.push(UserTransaction { id: tx.txid.to_string(), received: tx.received, sent: tx.sent, fee, unix_time: confirmed }),
			None => tx_vec.push(UserTransaction { id: tx.txid.to_string(), received: tx.received, sent: tx.sent, fee: 0, unix_time: confirmed }),
		}
	}

	tx_vec.sort_by(|a, b| {
		if a.unix_time == 0 {
            Ordering::Less
        } else if b.unix_time == 0 {
            Ordering::Greater
        } else {
            if a.unix_time > b.unix_time {
                Ordering::Less
            } else {
                Ordering::Greater
            }
        }
	});
	Ok(tx_vec)
}

fn get_local_db(id: &str) -> Result<Tree, Box<dyn std::error::Error>> {
	let mut datadir = dirs_next::desktop_dir().expect("Desktop dir not found");
	datadir.push(DB_MAGIC);
	let database = sled::open(datadir)?;
	let db_tree = database.open_tree(id)?;
	Ok(db_tree)
}

pub async fn emit_wallet_view(id: &str, window: Window) -> Result<(), Box<dyn std::error::Error>> { 
	let metadata = pull_wallet_metadata(id)?;
	let db_tree = get_local_db(id)?;

	let wallet = Wallet::new(&metadata.receive, Some(&metadata.change), Network::Testnet,db_tree)?;
	
	let balance = wallet.get_balance()?.confirmed + wallet.get_balance()?.trusted_pending + wallet.get_balance()?.untrusted_pending + wallet.get_balance()?.immature;
	let txs = wallet.list_transactions(false)?;
	let tx_vec = order_transactions(txs)?;

	window.emit("balance", BalancePayload { balance })?;
	window.emit("transactions", TransactionPayload { transactions: tx_vec })?;
	Ok(())

}

/*
	emit the necessary wallet information to the user and sync the wallet with the source
*/
pub async fn emit_and_sync(id: &str, window: Window) -> Result<(), Box<dyn std::error::Error>> {
    
	let metadata = pull_wallet_metadata(id)?;

	// implementation independent
	let url = "ssl://electrum.blockstream.info:60002";
	let config = ElectrumBlockchainConfig {
		url: url.to_owned(),
		socks5: None,
		retry: 2,
		timeout: Some(30),
		stop_gap: 20,
		validate_domain: false,
	};
	window.emit("message", Payload { message: "Connecting to server".into() })?;

	let db_tree = get_local_db(id)?;

	let wallet = Wallet::new(&metadata.receive, Some(&metadata.change), Network::Testnet,db_tree)?;
	window.emit("message", Payload { message: "Syncing with the blockchain".into() })?;
	let blockchain = ElectrumBlockchain::from_config(&config)?;

	window.emit("is_syncing", SyncStatus { is_syncing: true })?;
	wallet.sync(&blockchain, SyncOptions{ progress: Some(Box::new(LogProgress)) })?;
	
	let balance = wallet.get_balance()?.confirmed + wallet.get_balance()?.trusted_pending + wallet.get_balance()?.untrusted_pending + wallet.get_balance()?.immature;
	let txs = wallet.list_transactions(false)?;
	let tx_vec = order_transactions(txs)?;

	window.emit("balance", BalancePayload { balance })?;
	window.emit("transactions", TransactionPayload { transactions: tx_vec })?;
	window.emit("is_syncing", SyncStatus { is_syncing: false })?;

	Ok(())
}

/*
	list the 10 next addresses to receive bitcoin
*/
pub async fn list_next_addresses(id: &str, window: Window) -> Result<Vec<UserAddress>, Box<dyn std::error::Error>> {
	let metadata = pull_wallet_metadata(id)?;
	window.emit("message", Payload { message: "Fetching addresses".into() })?;

	let db_tree = get_local_db(id)?;
	let wallet = Wallet::new(&metadata.receive, Some(&metadata.change), Network::Testnet,db_tree)?;

	let mut addresses = Vec::new();
	let next_address = wallet.get_address(AddressIndex::LastUnused)?;
	addresses.push(UserAddress { address: next_address.address.to_string(), path: next_address.index });
	for i in next_address.index + 1..next_address.index + 10 {
		let next_address = wallet.get_address(AddressIndex::Peek(i))?;
		addresses.push(UserAddress { address: next_address.address.to_string(), path: next_address.index });
	}
	Ok(addresses)
}

/*
	the next unused address to send bitcoin to
*/
pub async fn get_next_address(id: &str, window: Window) -> Result<UserAddress, Box<dyn std::error::Error>> {
	let metadata = pull_wallet_metadata(id)?;
	window.emit("message", Payload { message: "Getting an address".into() })?;
	let db_tree = get_local_db(id)?;
	let wallet = Wallet::new(&metadata.receive, Some(&metadata.change), Network::Testnet,db_tree)?;
	let next_address = wallet.get_address(AddressIndex::LastUnused)?;
	Ok(UserAddress { address: next_address.address.to_string(), path: next_address.index })
}

/*
	list the unspent transactions of a wallet and sort them in ascending order
*/
pub async fn list_utxos(id: &str, window: Window) -> Result<Vec<UserUtxo>, Box<dyn std::error::Error>> {
	let metadata = pull_wallet_metadata(id)?;
	window.emit("message", Payload { message: "Fetching addresses".into() })?;

	let db_tree = get_local_db(id)?;
	let wallet = Wallet::new(&metadata.receive, Some(&metadata.change), Network::Testnet,db_tree)?;

	let mut utxo_vec = Vec::new();
	let utxos = wallet.list_unspent()?;
	for utxo in utxos {
		let value = utxo.txout.value;
		let txid = utxo.outpoint.txid.to_string();
		utxo_vec.push(UserUtxo { value, txid })
	}
	utxo_vec.sort_by(|a, b| {
		if a.value < b.value {
            Ordering::Less
        } else {
            Ordering::Greater
        }
	});
	Ok(utxo_vec)
}

pub async fn export_wallet(id: &str, window: Window) -> Result<WalletExport, Box<dyn std::error::Error>> {
	let metadata = pull_wallet_metadata(id)?;
	window.emit("message", Payload { message: "Preparing your export".into() })?;
	let receive = metadata.receive;
	let change = metadata.change;
	let generic = receive.replace("/0/*", "/*");
	if let Some(index) = generic.find('#') {
        let truncated_string = &generic[..index];
		Ok(WalletExport { generic: truncated_string.to_owned(), receive, change})
    } else {
        Ok(WalletExport { generic, receive, change})
    }
}