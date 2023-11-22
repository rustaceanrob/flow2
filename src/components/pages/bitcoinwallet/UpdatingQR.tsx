import bip21 from 'bip21'
import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { SATS_TO_BTC } from '../../../constants'

type Props = {
    address: string,
    amount?: number,
    label?: string,
}

const UpdatingQR = ({ address, amount, label }: Props) => {
    const [uri, setUri] = useState<string>(bip21.encode(address))
    const convert = (val: number) => {
        return (val * SATS_TO_BTC).toFixed(4)
    }
    useEffect(() => {
        if (amount && label) {
            setUri(bip21.encode(address, { amount: convert(amount), label: label }))
        } else if (amount && !label) {
            setUri(bip21.encode(address, { amount: convert(amount) }))
        } else if (!amount && label) {
            setUri(bip21.encode(address, { label: label }))
        } else {
            setUri(bip21.encode(address))
        }
    }, [address, amount, label])

    return (
        <div className='rounded-md bg-gradient-to-tl border dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800 from-zinc-100 to-white px-5 py-5'>
            <QRCode value={uri} level='Q' size={150}/>
        </div>
    )
}

export default UpdatingQR