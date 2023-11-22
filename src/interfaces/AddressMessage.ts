export default interface AddressMessage {
    addresses: AddressStruct[]
}

export interface AddressStruct {
    address: string,
    path: number,
}