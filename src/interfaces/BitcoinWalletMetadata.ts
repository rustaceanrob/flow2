export default interface BitcoinWalletMetadata {
    id: string,
    name: string,
    policy: Policy,
}

export enum Policy {
    Local,
    Connected,
    Airgapped,
	Multi,
}