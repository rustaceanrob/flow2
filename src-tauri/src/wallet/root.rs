extern crate bdk;
use std::fs;
use std::fs::File;
use std::io::Read;
use std::io::Write;
use std::path::Path;
use std::path::PathBuf;
use bdk::bitcoin;
use bdk::bitcoin::Network;
use bdk::bitcoin::secp256k1::Secp256k1;
use bdk::hwi::HWIClient;
use bdk::hwi::types::HWIDescriptor;
use bdk::wallet::wallet_name_from_descriptor;
use serde::Deserialize;
use serde::Serialize;
use keyring::Entry;
use xyzpub::convert_version;

const DB_MAGIC: &str = "flow-data";
const WALLET_FOLDER: &str = "wallets";
const SERVICE: &str = "Flow Bitcoin Wallet";

#[derive(Clone, serde::Serialize)]
struct Payload {
	message: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum WalletPolicy {
	Local,
    Connected,
    Airgapped,
	Multi,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WalletMetadata {
    id: String,
    pub name: String,
    pub policy: WalletPolicy,
    pub receive: String,
    pub change: String,
}

#[derive(Clone, serde::Serialize)]
pub struct UserWalletData {
	id: String,
	name: String, 
	policy: WalletPolicy
}

pub async fn import_single_from_hw(acct: Option<u32>, name: &str) -> Result<String, Box<dyn std::error::Error>> {
    let (resc, chng) = get_single_segwit_descriptor_from_hw(acct)?;
    let id = wallet_name_from_descriptor(&resc, Some(&chng), Network::Testnet, &Secp256k1::new())?;
    push_wallet_metadata(&id, name, WalletPolicy::Connected, &resc, &chng)?;
    Ok(id)
}

pub async fn import_keystone_from_txt(path: &str, name: &str) -> Result<String, Box<dyn std::error::Error>> {
    let mut file = File::open(path)?;
    let mut content = String::new();
    file.read_to_string(&mut content)?;
    let resc = content.clone();
    let chng = content.replace("/0/", "/1/");
    println!("{:?}", resc);
    println!("{:?}", chng);
    // unexpected xpub format needs conversion
    let id = wallet_name_from_descriptor(&resc, Some(&chng), Network::Testnet, &Secp256k1::new())?;
    push_wallet_metadata(&id, name, WalletPolicy::Airgapped, &resc, &chng)?;
    Ok(id)
}

// pub async fn import_coldcard_file(acct: Option<u32>, name: &str) -> Result<String, Box<dyn std::error::Error>> {
//     let (resc, chng) = get_single_segwit_descriptor_from_hw(acct)?;
//     let id = wallet_name_from_descriptor(&resc, Some(&chng), Network::Testnet, &Secp256k1::new())?;
//     push_wallet_metadata(&id, name, WalletPolicy::Connected, &resc, &chng)?;
//     Ok(id)
// }

fn ensure_directory_exists(directory_path: PathBuf) -> Result<(), std::io::Error> {
    if !Path::new(&directory_path).exists() {
        fs::create_dir(directory_path)?;
    }
    Ok(())
}

fn push_wallet_metadata(id: &str, name: &str, policy: WalletPolicy, recieve: &str, change: &str) -> Result<(), Box<dyn std::error::Error>>{
	let mut wallet_dir = dirs_next::desktop_dir().expect("Desktop dir not found");
	wallet_dir.push(DB_MAGIC);
    ensure_directory_exists(wallet_dir.clone())?;
	wallet_dir.push(WALLET_FOLDER);
    ensure_directory_exists(wallet_dir.clone())?;
	let metadata = WalletMetadata {
        id: id.to_string(),
        name: name.to_string(),
        policy,
        receive: recieve.to_string(), 
        change: change.to_string(),
    };
	let json_data = serde_json::to_string(&metadata)?;
    wallet_dir.push(format!("{}.json", id));
	let mut file = File::create(wallet_dir)?;
    file.write_all(json_data.as_bytes())?;
    Ok(())
}

pub fn pull_wallet_metadata(id: &str) -> Result<WalletMetadata, Box<dyn std::error::Error>> {
	let mut wallet_dir = dirs_next::desktop_dir().expect("error finding desktop dir");
	wallet_dir.push(DB_MAGIC);
	wallet_dir.push(WALLET_FOLDER);
    ensure_directory_exists(wallet_dir.clone())?;
    wallet_dir.push(format!("{}.json", id));
    let mut file = File::open(&wallet_dir)?;
    let mut json_data = String::new();
    file.read_to_string(&mut json_data)?;
    let metadata: WalletMetadata = serde_json::from_str(&json_data)?;
    Ok(metadata)
}

fn _fetch_ids(folder_path: &PathBuf) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let entries = fs::read_dir(folder_path)?;
    let wallet_ids: Vec<String> = entries
        .filter_map(|entry| {
            if let Ok(entry) = entry {
                if let Some(file_name) = entry.file_name().to_str() {
                    if file_name.ends_with(".json") {
                        Some(file_name.trim_end_matches(".json").to_string())
                    } else {
                        None
                    }
                } else {
                    None
                }
            } else {
                None
            }
        })
        .collect();

    Ok(wallet_ids)
}

fn fetch_ids() -> Result<Vec<String>, Box<dyn std::error::Error>> { 
    let mut wallet_dir = dirs_next::desktop_dir().expect("error finding desktop dir");
	wallet_dir.push(DB_MAGIC);
	wallet_dir.push(WALLET_FOLDER);
    ensure_directory_exists(wallet_dir.clone())?;
    let ids = _fetch_ids(&wallet_dir)?;
	Ok(ids)
}

pub async fn get_all_metadata() -> Result<Vec<UserWalletData>, Box<dyn std::error::Error>> {
    let mut wallets = Vec::new();
    let ids = fetch_ids()?;
    for id in ids {
        let metadata = pull_wallet_metadata(&id)?;
        wallets.push(UserWalletData { id: id.to_string(), name: metadata.name, policy: metadata.policy });
    }
    Ok(wallets)
}

// fn format_key(id: &str, is_internal: bool) -> String {
//     if is_internal {
//         format!("{}_INTERNAL", id)
//     } else {
//         format!("{}_EXTERNAL", id)
//     }
// }

// fn push_secret(key: &str, val: &str) -> Result<(), Box<dyn std::error::Error>> {
//     let entry = Entry::new(SERVICE, key)?;
//     entry.set_password(val)?;
//     Ok(())
// }

// fn pull_secret(key: &str) -> Result<String, Box<dyn std::error::Error>>{
//     let entry = Entry::new(SERVICE, key)?;
//     let sec = entry.get_password()?;
//     println!("{:?}", sec);
//     Ok(sec)
// }

// fn pull_descriptors(id: &str) -> Result<(String, String), Box<dyn std::error::Error>> {
//     let internal_descriptor_key = format_key(id, false);
//     let external_descriptor_key = format_key(id, true);
//     let internal_descriptor = pull_secret(&internal_descriptor_key)?;
//     let external_descriptor = pull_secret(&external_descriptor_key)?;
//     Ok((internal_descriptor, external_descriptor))
// }


// TODO: make segwit passed as an argument
fn get_single_segwit_descriptor_from_hw(acct: Option<u32>) -> Result<(String, String), Box<dyn std::error::Error>> {
    match HWIClient::enumerate()?.first() {
        Some(hw) => {
            match hw {
                Ok(hw) => {
                    let client = HWIClient::get_client(&hw, false, bitcoin::Network::Testnet.into())?;
					match acct {
						Some(acct) => {
							let d: HWIDescriptor<String> = client.get_descriptors(Some(acct))?;
							let internal = &d.internal[1];
							let external = &d.receive[1];
							Ok((external.into(), internal.into()))
						},
						None => {
							let d: HWIDescriptor<String> = client.get_descriptors(None)?;
							let internal = &d.internal[1];
							let external = &d.receive[1];
							Ok((external.into(), internal.into()))
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