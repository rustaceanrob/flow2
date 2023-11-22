import { useEffect, useState } from 'react'
// import TransactionMessage from '../../../interfaces/TransactionMessage'
import TranscationItem from './TransactionItem'
import { listen } from '@tauri-apps/api/event'
import TransactionObject from '../../../interfaces/TransactionObject'
import TransactionMessage from '../../../interfaces/TransactionMessage'
import Fades from '../../util/Fades'

type Props = {
    loading: boolean
}

const RenderTransactions = ({ loading }: Props) => {
    const [message, setMessage] = useState<TransactionObject[]>()

    useEffect(() => {
        (async () => {
            await listen('transactions', (event) => {
                setMessage((event.payload as TransactionMessage).transactions)
            })
        })()
    }, [])

    return (
        <Fades style={`border border-zinc-300 dark:border-zinc-700 rounded-sm w-full overflow-scroll scrollbar-hide`} delay={100}>
            {message ? message.map((item, index) => {
                return <TranscationItem key={item.id} delay={index * 100} hasBorder={index < message?.length - 1} tx={item}/>
            }): !loading && <h1 className='dark:text-white text-sm justify-center items-center text-zinc-500 px-2 py-5'></h1>}
        </Fades>
    )
}

export default RenderTransactions