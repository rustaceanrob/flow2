import { invoke } from '@tauri-apps/api';
import { useState, useEffect } from 'react';

type Props = {
  selectedId: string
}

export default function resync({ selectedId }: Props) {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    
    useEffect(() => {
        (async () => {
            setLoading(true)
            setError(false)
            try {
              await invoke('sync_wallet', { id: selectedId })
            } catch {
              setError(true)
            } finally {
              setLoading(false)
            }
        })()
      }, [selectedId])

    return { loading, error }
}