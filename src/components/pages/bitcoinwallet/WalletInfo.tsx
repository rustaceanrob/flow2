import { useEffect, useState } from 'react'
import AppSkeleton from '../../util/AppSkeleton'
import BitcoinWalletMetadata from '../../../interfaces/BitcoinWalletMetadata'
import { useNavigate } from 'react-router-dom'
import { clipboard, invoke } from '@tauri-apps/api'
import WalletExport from '../../../interfaces/WalletExport'
import PolicyIcon from '../../util/PolicyIcon'
import { FaArrowLeft } from 'react-icons/fa'
import { IoCopyOutline } from 'react-icons/io5'
import { MdInfoOutline } from 'react-icons/md'
import Fades from '../../util/Fades'

type Props = {
    selectedWallet: BitcoinWalletMetadata | undefined,
    selectedId: string,
}

const WalletInfo = ({ selectedId, selectedWallet }: Props) => {
    const navigate = useNavigate()
    const [genertic, setGeneric] = useState<string>("")
    const [rec, setRec] = useState<string>("")
    const [__, setChng] = useState<string>("")
    const [_, setLoading] = useState<boolean>(false)
    const [copied, setCopied] = useState<string>("")

    const copyToClip = (content: string) => {
      setCopied(content)
      setTimeout(() => {
        clipboard.writeText(content).then().catch().finally(() => setCopied(""))
      }, 2000)
    }

    useEffect(() => {
        setLoading(true)
        invoke('export', { id: selectedId}).then((res) => {
            let wallet = res as WalletExport
            setGeneric(wallet.generic)
            setRec(wallet.receive)
            setChng(wallet.change)
        }).catch().finally(() => setLoading(false))

    }, [selectedId])

    return (
        <AppSkeleton centerChildren={false}>
            <Fades style='flex flex-col justify-start items-start overflow-scroll scrollbar-hide' delay={100}>
                <button onClick={() => navigate("/wallet")} className=' pb-5 pl-1 pt-2'>
                    <FaArrowLeft className="text-green-600" size={12}/>
                </button>
                <div className='flex flex-col justify-start items-start pt-10 pl-40 pr-40 lg:pl-[200px] lg:pr-[200px] xl:pl-[350px] xl:pr-[350px] 2xl:pl-[500px] 2xl:pr-[500px]'>
                    <div className='flex flex-row justify-center items-center pb-2 space-x-1'>
                        <MdInfoOutline className="text-green-600" size={15}/>
                        <h1 className='dark:text-white font-bold'>Wallet Information</h1>
                    </div>
                    <div className='flex flex-col justify-start items-start dark:text-white bg-white border-zinc-300 dark:bg-zinc-800 border dark:border-zinc-700 px-5 py-5 rounded-md space-y-5'>
                        <div className='flex flex-row justify-start items-center w-full space-x-5'>
                            <div className='flex flex-col justify-start items-start'>
                                <h1 className='dark:text-white font-bold'>Wallet Name</h1>
                                <h1 className='dark:text-white text-sm'>{selectedWallet?.name}</h1>
                            </div>
                        </div>
                        <div className='flex flex-col justify-start items-start'>
                            <h1 className='dark:text-white font-bold'>Wallet Type</h1>
                            <div className='flex flex-row justify-center items-center'>
                                {selectedWallet && <PolicyIcon policy={selectedWallet?.policy}/>}
                                <h1 className='dark:text-white text-sm'>{selectedWallet?.policy}</h1>
                            </div>
                        </div>
                        <div className='flex flex-col justify-start items-start space-y-1'>
                            <h1 className='dark:text-white font-bold'>Output Descriptor</h1>
                            <div className='flex flex-row justify-center items-center space-x-2 font-mono dark:text-white px-2 py-2 rounded-sm bg-gradient-to-tl border dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800 from-zinc-100 to-white'>
                                <button onClick={() => copyToClip(genertic)} className={`hover:animate-pulse ${copied === genertic ? "text-green-600" : "dark:text-zinc-300 text-zinc-700"} duration-200 ease-in-out`}>
                                    <IoCopyOutline />
                                </button>
                                <h1 className='dark:text-white text-xs break-all'>{genertic}</h1>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-center items-center pt-5 pb-2 space-x-1'>
                        <MdInfoOutline className="text-green-600" size={15}/>
                        <h1 className='dark:text-white font-bold'>Application Information</h1>
                    </div>
                    <div className='flex flex-col justify-center items-center pb-10'>
                        <p className='text-sm dark:text-white bg-white border-zinc-300 dark:bg-zinc-800 border dark:border-zinc-700 px-5 py-5 rounded-md'>This application is built with two programming langauges, Rust and Typescript, along with <a href='' target='_blank' className='font-bold text-orange-500 hover:animate-pulse'>Bitcoin Development Kit</a> (BDK) as the core to the application. 
                        BDK is a robust, well-tested, and open-source framework to build Bitcoin wallets in Rust. 
                        The goal of this application is to leverage BDK to bring the best hardware wallet experience to Bitcoin users of all experience levels.
                        You may notice most features are unavailable while your wallet is syncing with the Bitcoin network. 
                        This is to ensure none of your Bitcoin addresses are ever reused in a transaction, maximizing your privacy.
                        To discuss issues, features, and enhancements to this application, get in touch on <a href='' className='text-green-600 font-bold hover:animate-pulse'>Github</a>.
                        </p>
                    </div>
                </div>
            </Fades>
            
        </AppSkeleton>
    )
}

export default WalletInfo