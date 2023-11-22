import { useState } from 'react';
import Fades from '../../util/Fades'
import { IoCopyOutline } from "react-icons/io5";
import { clipboard } from '@tauri-apps/api';

type Props = {
    address: string
    path: number
    hasBorder: boolean
    index: number
}

const AddressItem = ({ address, path, hasBorder, index }: Props) => {
    const [copied, setCopied] = useState<boolean>(false)

    const copyToClip = () => {
      setCopied(true)
      setTimeout(() => {
        clipboard.writeText(address).then().catch().finally(() => setCopied(false))
      }, 2000)
    }

    return (
        <Fades style={`justify-between items-center flex flex-row w-full border-zinc-300 dark:border-zinc-700 ${hasBorder && "border-b"} px-5 py-5`} delay={index * 100}>
            <div className='flex flex-row justify-center items-center space-x-2'>
              <h1 className='text-sm justify-center items-center text-zinc-500'>0/{path}</h1>
              <h1 className='text-sm font-mono justify-center items-center dark:text-white px-2 py-2 rounded-md bg-gradient-to-tl border dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800 from-zinc-100 to-white'>{address}</h1>
            </div>
            <button onClick={() => copyToClip()} className={`hover:animate-pulse ${copied ? "text-green-600" : "dark:text-zinc-300 text-zinc-700"} duration-200 ease-in-out`}>
              <IoCopyOutline />
            </button>
      </Fades>
  )
}

export default AddressItem