import { useEffect, useState } from 'react'
import AppSkeleton from '../../util/AppSkeleton'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { clipboard, invoke } from '@tauri-apps/api'
import WalletExport from '../../../interfaces/WalletExport'
import Fades from '../../util/Fades'
import QRCode from 'react-qr-code'
import { IoCopyOutline } from 'react-icons/io5'
import { CgSpinnerTwoAlt } from 'react-icons/cg'

type Props = {
    selectedId: string
}

const Export = ({ selectedId }: Props) => {
    const navigate = useNavigate()
    const [_, setGeneric] = useState<string>("")
    const [rec, setRec] = useState<string>("")
    const [__, setChng] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
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
            <button onClick={() => navigate("/wallet")} className='pl-1 pt-2 pb-5'>
                <FaArrowLeft className="text-green-600" size={12}/>
            </button>
            {!loading ? ( <Fades style='flex flex-col justify-center items-center pt-10 space-y-5 pl-40 pr-40 lg:pl-[200px] lg:pr-[200px] xl:pl-[350px] xl:pr-[350px] 2xl:pl-[500px] 2xl:pr-[500px]' delay={100}>
                <div className='rounded-md bg-gradient-to-tl border dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800 from-zinc-100 to-white px-5 py-5'>
                    <QRCode value={rec} level='Q' size={150}/>
                </div>
                {/* <div className='flex flex-col justify-start items-start space-y-1'>
                    <h1 className='dark:text-white'>Generalized Descriptor</h1>
                    <div className='flex flex-row justify-center items-center space-x-2 font-mono dark:text-white px-2 py-2 rounded-md bg-gradient-to-tl border dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800 from-zinc-100 to-white'>
                        <button onClick={() => copyToClip(generic)} className={`hover:animate-pulse ${copied === generic ? "text-green-600" : "dark:text-zinc-300 text-zinc-700"} duration-200 ease-in-out`}>
                            <IoCopyOutline />
                        </button>
                        <h1 className='dark:text-white text-xs break-all'>{generic}</h1>
                    </div>
                </div> */}
                <div className='flex flex-col justify-start items-start space-y-1'>
                    <h1 className='dark:text-white font-bold'>Receive Descriptor</h1>
                    <div className='flex flex-row justify-center items-center space-x-2 font-mono dark:text-white px-2 py-2 rounded-sm bg-gradient-to-tl border dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800 from-zinc-100 to-white'>
                        <button onClick={() => copyToClip(rec)} className={`hover:animate-pulse ${copied === rec ? "text-green-600" : "dark:text-zinc-300 text-zinc-700"} duration-200 ease-in-out`}>
                            <IoCopyOutline />
                        </button>
                        <h1 className='dark:text-white text-xs break-all'>{rec}</h1>
                    </div>
                </div>
                {/* <div className='flex flex-col justify-start items-start space-y-1'>
                    <h1 className='dark:text-white'>Change Descriptor</h1>
                    <div className='flex flex-row justify-center items-center space-x-2 font-mono dark:text-white px-2 py-2 rounded-md bg-gradient-to-tl border dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800 from-zinc-100 to-white'>
                        <button onClick={() => copyToClip(chng)} className={`hover:animate-pulse ${copied === chng ? "text-green-600" : "dark:text-zinc-300 text-zinc-700"} duration-200 ease-in-out`}>
                            <IoCopyOutline />
                        </button>
                        <h1 className='dark:text-white text-xs break-all'>{chng}</h1>
                    </div>
                </div> */}
                <p className='dark:text-white text-sm bg-white border-zinc-300 dark:bg-zinc-800 border dark:border-zinc-700 px-5 py-5 rounded-sm break-word'>
                    You can use this QR code, text or file to receive funds to your wallet from your mobile device or another computer. 
                    You <span className='text-red-600 font-bold'>cannot</span> send bitcoin from your mobile wallet with this information, only receive transactions. 
                </p>
                <Fades style='flex flex-row justify-center items-center w-full' delay={200}>
                    <button className='text-white font-bold bg-green-600 border border-green-300 px-2 py-2 rounded-sm w-full hover:animate-pulse' onClick={() => (navigate("/wallet"))}>Download File</button>
                </Fades>
            </Fades>) : (
                <Fades style='border border-zinc' delay={100}>
                    <div className='flex flex-row justify-center items-center'>
                        <CgSpinnerTwoAlt className="text-green-600 animate-spin" size={16}/>
                        <h1 className='dark:text-zinc-300 text-xs'>Exporting wallet information</h1>
                    </div>
                </Fades>
            )}
        </AppSkeleton>
    )
}

export default Export