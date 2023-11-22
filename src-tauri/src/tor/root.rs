use std::{time::Duration, thread};
use libtor::{Tor, TorFlag};

pub async fn start_tor() {
	let socks_port = 9050;
	let _ = Tor::new()
		.flag(TorFlag::DataDirectory("/tmp/tor-rust".into()))
		.flag(TorFlag::SocksPort(socks_port))
		.start_background();
	
	thread::sleep(Duration::from_secs(10));
}