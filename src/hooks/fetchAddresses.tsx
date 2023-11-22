import { invoke } from '@tauri-apps/api';
import { useState, useEffect } from 'react';
import { AddressStruct } from '../interfaces/AddressMessage';

type Props = {
  selectedId: string
}

export default function fetchAddresses({ selectedId }: Props) {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [addresses, setAddresses] = useState<AddressStruct[]>()
    
    useEffect(() => {
        setLoading(true)
        invoke('get_addresses', { id: selectedId }).then((res) => {
            setAddresses(res as AddressStruct[])
        }).catch(() => {
            setError(true)
        }).finally(() => setLoading(false)) 
      }, [selectedId])

    return { loading, error, addresses }
}