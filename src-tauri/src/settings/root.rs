use serde::{Serialize, Deserialize};

const APP_NAME_MAGIC: &str = "FRACTAL";

#[derive(Debug, Serialize, Deserialize)]
pub struct SettingsConfig {
    pub has_configured: bool,
    pub integrated_tor: bool,
    pub public_server: bool,
    pub wrapped_segwit: bool,
    pub rpc_username: String,
    pub rpc_password: String,
}

impl Default for SettingsConfig {
    fn default() -> Self {
        SettingsConfig { has_configured: false, 
            integrated_tor: false, public_server: true, 
            wrapped_segwit: false, 
            rpc_username: "".to_string(), 
            rpc_password: "".to_string() 
        }
    }
}

pub async fn push_settings(has_configured: bool, integrated_tor: bool, public_server: bool, wrapped_segwit: bool, rpc_username: String, rpc_password: String) -> Result<(), Box<dyn std::error::Error>> {
    let cfg = SettingsConfig { has_configured, integrated_tor, public_server, wrapped_segwit, rpc_username, rpc_password };
    confy::store(APP_NAME_MAGIC, None, cfg)?;
    Ok(())
}

pub async fn pull_settings() -> Result<SettingsConfig, Box<dyn std::error::Error>> {
    let cfg: SettingsConfig= confy::load(APP_NAME_MAGIC, None)?;
    Ok(cfg)
}