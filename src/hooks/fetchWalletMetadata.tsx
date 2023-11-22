import { invoke } from '@tauri-apps/api';
import { useState, useEffect } from 'react';
import BitcoinWalletMetadata from '../interfaces/BitcoinWalletMetadata';

type Props = {
  selectedId: string
}

export default function fetchWalletMetadata({ selectedId }: Props) {
    const [ids, setIds] = useState<BitcoinWalletMetadata[]>([])
    const [idsLoading, setIdsLoading] = useState<boolean>(false)
    const [idsError, setIdsError] = useState<boolean>(false)
    
    useEffect(() => {
        setIdsLoading(true)
        invoke('get_all_wallet_ids').then((res) => {
          setIds(res as BitcoinWalletMetadata[])
        }).catch(() => {
            setIdsError(true)
        }).finally(() => setIdsLoading(false)) 
      }, [selectedId])

    return { idsLoading, idsError, ids }
}