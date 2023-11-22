export default interface UtxoMessage {
    utxos: Utxo[]
}

export interface Utxo {
    txid: string,
    value: number,
}