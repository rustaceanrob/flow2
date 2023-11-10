// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::thread;
use std::time::Duration;
use bdk::SyncOptions;
use bdk::Wallet;
use bdk::bitcoin;
use bdk::bitcoin::Network;
use bdk::blockchain::ConfigurableBlockchain;
use bdk::blockchain::ElectrumBlockchainConfig;
use bdk::blockchain::LogProgress;
use bdk::database::MemoryDatabase;
use bdk::blockchain::electrum::ElectrumBlockchain;
use bdk::hwi::HWIClient;
use bdk::hwi::types::HWIDescriptor;
use libtor::{Tor, TorFlag};
use tauri::Window;
use std::env;

#[derive(Clone, serde::Serialize)]
struct Payload {
	message: String,
}

#[tauri::command]
async fn begin_tor_service(window: Window) {
	window.emit("message", Payload { message: "Tor starting".into() }).unwrap();
	start_tor().await;
	window.emit("message", Payload { message: "Tor connected".into() }).unwrap();	
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn get_balance(window: Window) -> Result<u64, String> {
	window.emit("message", Payload { message: "Refreshing".into() }).unwrap();
    let b = balance().await;
	match b {
        Ok(b) => {
            Ok(b)
        }, 
        Err(..) => {
            Err("Error fetching wallet info".to_string())
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_balance, begin_tor_service])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

pub async fn start_tor() {
	let socks_port = 9050;
	let _ = Tor::new()
		.flag(TorFlag::DataDirectory("/tmp/tor-rust".into()))
		.flag(TorFlag::SocksPort(socks_port))
		.flag(TorFlag::KeepalivePeriod(10000))
		.start_background();
	
	thread::sleep(Duration::from_secs(10));
}

fn get_segwit_descriptors_from_hw(acct: Option<u32>) -> Result<(String, String), Box<dyn std::error::Error>> {
    match HWIClient::enumerate()?.first() {
        Some(hw) => {
            match hw {
                Ok(hw) => {
                    let client = HWIClient::get_client(&hw, false, bitcoin::Network::Bitcoin.into())?;
					match acct {
						Some(acct) => {
							let d: HWIDescriptor<String> = client.get_descriptors(Some(acct))?;
							let internal = &d.internal[1];
							let external = &d.receive[1];
							Ok((internal.into(), external.into()))
						},
						None => {
							let d: HWIDescriptor<String> = client.get_descriptors(None)?;
							let internal = &d.internal[1];
							let external = &d.receive[1];
							Ok((internal.into(), external.into()))
						},
					}
                },
                Err(_) => {
                    Err("Hardware Not Found".to_string().into())
                },
            }
        }
        None => {
            Err("Hardware Not Found".to_string().into())
        },
    }
}

async fn balance() -> Result<u64, Box<dyn std::error::Error>> {
    let (desc, rec) = get_segwit_descriptors_from_hw(None)?;
	let url = "ssl://electrum.blockstream.info:50002";
	let config = ElectrumBlockchainConfig {
		url: url.to_owned(),
		socks5: Some(format!("127.0.0.1:{}", 9050)),
		retry: 2,
		timeout: Some(30),
		stop_gap: 20,
		validate_domain: false,
	};
	println!("Configuring the blockchain");
	let blockchain = ElectrumBlockchain::from_config(&config)?;
	let wallet = Wallet::new(&desc, Some(&rec), Network::Bitcoin,MemoryDatabase::default())?;
	println!("Syncing...");
	wallet.sync(&blockchain, SyncOptions{ progress: Some(Box::new(LogProgress)) })?;
	let balance = wallet.get_balance().unwrap().confirmed;
	println!("Wallet Balance: {:?}", balance);
	Ok(balance)
}
