import { useState } from 'react';
import Fades from '../../util/Fades'
import { IoCopyOutline } from "react-icons/io5";
import { clipboard } from '@tauri-apps/api';
import { Utxo } from '../../../interfaces/UtxoMessage';
import { GiTwoCoins } from 'react-icons/gi';

type Props = {
    utxo: Utxo
    hasBorder: boolean
    index: number
}

const UtxoItem = ({ utxo, hasBorder, index }: Props) => {
    const [copied, setCopied] = useState<boolean>(false)

    const copyToClip = () => {
      setCopied(true)
      setTimeout(() => {
        clipboard.writeText(utxo.txid).then().catch().finally(() => setCopied(false))
      }, 2000)
    }

    return (
        <Fades style={`justify-between items-start flex flex-col w-full border-zinc-300 dark:border-zinc-700 ${hasBorder && "border-b"} px-5 py-5 space-y-2`} delay={index * 100}>
            <div className='flex flex-row justify-center items-center space-x-1'>
                <button onClick={() => copyToClip()} className={`hover:animate-pulse ${copied ? "text-green-600" : "dark:text-zinc-300 text-zinc-700"} duration-200 ease-in-out`}>
                    <IoCopyOutline />
                </button>
                {/* <h1 className='dark:text-zinc-300 text-zinc-700 font-bold text-sm'>TXID</h1> */}
                <h1 className='text-sm justify-center items-center dark:text-zinc-300 text-zinc-700 '>{utxo.txid}</h1>
            </div>
            <div className='flex flex-row justify-center items-center space-x-1'>
                <GiTwoCoins className="text-green-600" size={15}/>
                <h1 className='text-sm font-bold justify-center items-center dark:text-white'>{utxo.value.toLocaleString()} Satoshis</h1>
            </div>
      </Fades>
  )
}

export default UtxoItem