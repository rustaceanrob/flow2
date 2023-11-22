// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Window;
use flow::{settings::root::{SettingsConfig, pull_settings, push_settings}, tor::root::start_tor, wallet::root::{import_single_from_hw, get_all_metadata, UserWalletData, import_keystone_from_txt}, server::root::{emit_and_sync, list_next_addresses, UserAddress, UserUtxo, list_utxos, get_next_address, export_wallet, WalletExport, emit_wallet_view}};
use std::env;

#[derive(Clone, serde::Serialize)]
struct Payload {
	message: String,
}

fn emit_message(message: &str, window: Window) -> Result<(), String> {
	match window.emit("message", Payload { message: message.into() }) {
		Ok(_) => {
			Ok(())
		}
		Err(_) => {
			Err("Could not emit message".into())
		},
	}
}

#[tauri::command]
async fn begin_tor_service(window: Window) {
	let _ = emit_message("Starting Tor", window);
	start_tor().await;
}

#[tauri::command]
async fn load_settings(window: Window) -> Result<SettingsConfig, String> {
	emit_message("Loading your settings", window.clone())?;
	match pull_settings().await {
		Ok(settings) => { 
			emit_message("", window)?;
			Ok(settings)
		},
		Err(..) => {
			Err("Could not find/fetch settings".to_string())
		}
	}
}

#[tauri::command]
async fn new_settings(has_configured: bool, integrated_tor: bool, public_server: bool, wrapped_segwit: bool, rpc_username: String, rpc_password: String, window: Window) -> Result<(), String> {
	emit_message("Saving your settings", window.clone())?;
	match push_settings(has_configured, integrated_tor, public_server, wrapped_segwit, rpc_username, rpc_password).await {
		Ok(()) => { 
			emit_message("", window)?;
			Ok(())
		},
		Err(..) => {
			Err("Could not save settings".to_string())
		}
	}
}

#[tauri::command]
async fn sync_wallet(id: String, window: Window) -> Result<(), String> {
	emit_message("Loading your wallet information", window.clone())?;
	match emit_and_sync(&id, window.clone()).await {
		Ok(..) => { 
			emit_message("", window)?;
			Ok(()) 
		},
		Err(err) => {
			println!("{:?}", err);
			Err("Unable to fetch wallet information".to_string())
		}
	}
}

#[tauri::command]
async fn get_wallet_view(id: String, window: Window) -> Result<(), String> {
	emit_message("Loading your wallet information", window.clone())?;
	match emit_wallet_view(&id, window.clone()).await {
		Ok(..) => { 
			emit_message("", window)?;
			Ok(()) 
		},
		Err(err) => {
			println!("{:?}", err);
			Err("Unable to fetch wallet information".to_string())
		}
	}
}

#[tauri::command]
async fn get_all_wallet_ids(window: Window) -> Result<Vec<UserWalletData>, String> {
	emit_message("Fetching existing wallets", window.clone())?;
	match get_all_metadata().await {
		Ok(ids) => {
			emit_message("", window)?;
			Ok(ids)
		} ,
		Err(err) => {
			println!("{:?}", err);
			Err("Could not fetch wallets".to_string())
		}
	}
}

#[tauri::command]
async fn get_addresses(id: String, window: Window) -> Result<Vec<UserAddress>, String> {
	emit_message("Fetching addresses", window.clone())?;
	match list_next_addresses(&id, window.clone()).await {
		Ok(addresses) => {
			emit_message("", window)?;
			Ok(addresses)
		} ,
		Err(err) => {
			println!("{:?}", err);
			Err("Could not fetch addresses".to_string())
		}
	}
}

#[tauri::command]
async fn next_unused(id: String, window: Window) -> Result<UserAddress, String> {
	match get_next_address(&id, window.clone()).await {
		Ok(address) => {
			emit_message("", window)?;
			Ok(address)
		} ,
		Err(err) => {
			println!("{:?}", err);
			Err("Could not get the next unused address".to_string())
		}
	}
}

#[tauri::command]
async fn get_utxos(id: String, window: Window) -> Result<Vec<UserUtxo>, String> {
	emit_message("Fetching UTXOs", window.clone())?;
	match list_utxos(&id, window.clone()).await {
		Ok(utxos) => {
			emit_message("", window)?;
			Ok(utxos)
		} ,
		Err(err) => {
			println!("{:?}", err);
			Err("Could not find UTXOs".to_string())
		}
	}
}

#[tauri::command]
async fn export(id: String, window: Window) -> Result<WalletExport, String> {
	emit_message("Exporting", window.clone())?;
	match export_wallet(&id, window.clone()).await {
		Ok(wallet) => {
			emit_message("", window)?;
			Ok(wallet)
		} ,
		Err(err) => {
			println!("{:?}", err);
			Err("Could not export".to_string())
		}
	}
}

#[tauri::command]
async fn import_single_hw(acct: u32, name: String, window: Window) -> Result<String, String> {
	emit_message("Importing your wallet", window)?;
	let mut account: Option<u32> = None;
	if acct > 0 {
		account = Some(acct);
	}
	match import_single_from_hw(account, &name).await {
		Ok(id) => {
			Ok(id)
		},
		Err(..) => {
			Err("Unable to import".to_string())
		}
	}
}

#[tauri::command]
async fn read_keystone(file: &str, name: &str, window: Window) -> Result<String, String>{
	emit_message("Importing your wallet", window)?;
	match import_keystone_from_txt(file, name).await {
		Ok(id) => {
			Ok(id)
		},
		Err(err) => {
			println!("{:?}", err);
			Err(err.to_string())
		}
	}
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![begin_tor_service, load_settings, new_settings, 
												import_single_hw, read_keystone, get_all_wallet_ids, sync_wallet, 
												get_addresses, get_utxos, next_unused, export, get_wallet_view])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

