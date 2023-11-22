import { useEffect, useState } from 'react'
import AppSkeleton from '../../util/AppSkeleton'
import { clipboard, invoke } from '@tauri-apps/api'
import Fades from '../../util/Fades'
import { CgSpinnerTwoAlt } from 'react-icons/cg'
import UpdatingQR from './UpdatingQR'
import { AddressStruct } from '../../../interfaces/AddressMessage'
import { IoCopyOutline } from 'react-icons/io5'
import { GrBitcoin } from 'react-icons/gr'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

type Props = {
    selectedId: string
}

const Receive = ({ selectedId }: Props) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [address, setAddress] = useState<string>("")
    const [path, setPath] = useState<number>()
    const [label, setLabel] = useState<string>("")
    const [copied, setCopied] = useState<boolean>(false)

    const copyToClip = () => {
      setCopied(true)
      setTimeout(() => {
        clipboard.writeText(address).then().catch().finally(() => setCopied(false))
      }, 2000)
    }

    useEffect(() => {
        setLoading(true)
        invoke('next_unused', { id: selectedId }).then((res) => {
            setAddress((res as AddressStruct).address)
            setPath((res as AddressStruct).path)
        }).catch().finally(() => setLoading(false))
    }, [])


    return (
        <AppSkeleton centerChildren={false}>
            <button onClick={() => navigate("/wallet")} className='pl-1 pt-2 pb-5'>
                <FaArrowLeft className="text-green-600" size={12}/>
            </button>
            {
                loading ? (
                    <Fades style='border border-zinc' delay={100}>
                        <div className='flex flex-row justify-center items-center'>
                            <CgSpinnerTwoAlt className="text-green-600 animate-spin" size={16}/>
                            <h1 className='dark:text-zinc-300 text-sm'>Getting your next address</h1>
                        </div>
                    </Fades>
                ) : (
                    <div className='flex flex-col justify-center items-center space-y-5 pl-40 pr-40 lg:pl-[25%] lg:pr-[25%] xl:pl-[32%] xl:pr-[32%] 2xl:pl-[35%] 2xl:pr-[35%] pt-20'>
                        <Fades style='flex flex-row justify-center items-center space-x-1' delay={100}>
                            <GrBitcoin size={16} className="text-green-600"/>
                            <h1 className='text-md font-bold dark:text-white'>Ready for Bitcoin</h1>
                        </Fades>
                        <Fades style='' delay={100}>
                            <UpdatingQR address={address} label={label}/>
                        </Fades>
                        <div className='flex flex-row justify-center items-center space-x-2 font-mono dark:text-white px-2 py-3 rounded-sm bg-gradient-to-tl border dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800 from-zinc-100 to-white w-full'>
                            <button onClick={() => copyToClip()} className={`hover:animate-pulse ${copied ? "text-green-600" : "dark:text-zinc-300 text-zinc-700"} duration-200 ease-in-out`}>
                                <IoCopyOutline />
                            </button>
                            <h1 className='dark:text-white text-sm'>{address}</h1>
                        </div>
                        <Fades style='flex flex-col justify-center items-start w-full space-y-1' delay={300}>
                            <h1 className='dark:text-white text-sm font-bold'>Optional Label</h1>
                            <input className='border dark:border-zinc-700 border-zinc-300 dark:text-white dark:bg-zinc-800 w-full px-2 py-2 rounded-sm focus:border-green-500 focus:outline-none focus:ring-0' type='text'
                                placeholder='Lunch'
                                onChange={(e) => setLabel(e.target.value)}
                            ></input>
                        </Fades>
                        {/* <Fades style='flex flex-row justify-center items-center w-full' delay={500}>
                            <button className='text-white font-bold bg-green-600 border border-green-300 px-2 py-2 rounded-sm w-full hover:animate-pulse' onClick={() => navigate("/wallet")}>Finish</button>
                        </Fades> */}
                    </div>
                )
            }
        </AppSkeleton>
    )
}

export default Receive