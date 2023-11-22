import { useState, useEffect } from 'react'
import { MdCallMade, MdCallReceived } from 'react-icons/md'
import Fades from '../../util/Fades'
import TransactionObject from '../../../interfaces/TransactionObject'

type Props = {
    delay: number,
    hasBorder: boolean,
    tx: TransactionObject,
}

const TranscationItem = ({ delay, hasBorder, tx }: Props) => {
    const [wasSent, setWasSent] = useState<boolean>(false);
    const [val, setVal] = useState<number>()

    useEffect(() => {
        if (tx.received < tx.sent) {
            setWasSent(true)
            setVal(tx.sent)
        } else {
            setVal(tx.received)
        }
    }, [])

    return (
        <Fades style={`justify-between items-start flex flex-row w-full border-zinc-300 dark:border-zinc-700 ${hasBorder && "border-b"} px-5 py-3`} delay={delay}>
            <div className='flex flex-col justify-end items-start space-y-1'>
                <h1 className={`${!wasSent ? "text-green-600": "text-red-600"} font-bold text-sm`}>{wasSent ? "Sent": "Received"}</h1>
                <h1 className=' dark:text-white font-bold text-sm'>{val?.toLocaleString()} Satoshis</h1>
                <h1 className='text-zinc-500 text-xs font-mono font-semibold'>{tx.fee.toLocaleString()} fee</h1>
            </div>
            <div className='flex flex-col justify-center items-end space-y-2'>
                <div className='border dark:border-zinc-700 border-zinc-300 px-2 py-2 rounded-lg'>
                    {wasSent ? <MdCallMade className="dark:text-zinc-300" size={17}/>: <MdCallReceived className="dark:text-zinc-300" size={17}/>}
                </div>
                <div className='flex flex-row justify-center items-center'>
                    <h1 className='text-zinc-500 text-xs font-bold'>{tx.unix_time > 0 ? "Confirmed" : "Unconfirmed"}</h1>
                </div>
            </div>
        </Fades>
    )
}

export default TranscationItem