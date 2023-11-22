import { invoke } from '@tauri-apps/api';
import { useState, useEffect } from 'react';
import { Utxo } from '../interfaces/UtxoMessage';

type Props = {
  selectedId: string
}

export default function fetchUtxos({ selectedId }: Props) {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [utxos, setUxos] = useState<Utxo[]>()
    
    useEffect(() => {
        setLoading(true)
        invoke('get_utxos', { id: selectedId }).then((res) => {
            setUxos(res as Utxo[])
        }).catch(() => {
            setError(true)
        }).finally(() => setLoading(false)) 
      }, [selectedId])

    return { loading, error, utxos }
}