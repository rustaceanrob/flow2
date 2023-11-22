import Fades from '../../util/Fades'
import { useNavigate } from 'react-router-dom'
import { CiFileOn } from "react-icons/ci";
import { CiSquareAlert } from 'react-icons/ci'
import AppSkeleton from '../../util/AppSkeleton'
import { Dispatch, SetStateAction, useState } from 'react'
import { invoke } from '@tauri-apps/api'
import { CgSpinnerTwoAlt } from 'react-icons/cg'
import Keystone from '../../../assets/cobo-vault.png'
import Coldcard from '../../../assets/coldcard.png'
import { open } from '@tauri-apps/api/dialog';

type Props = {
    setSelectedId: Dispatch<SetStateAction<string>>
}

const ImportSingleFile = ({ setSelectedId }: Props ) => {
    const [walletName, setWalletName] = useState<string>("")
    const [err, setErr] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    const openTxtForImport = async () => {
        setLoading(true)
        try {
            let fileName = await open({ filters: [{name: '', extensions: ['txt']}]})
            console.log(fileName)
            let id = await invoke('read_keystone', { file: fileName, name: walletName }) as string
            setSelectedId(id)
            navigate("/home")
        } catch (err) {
            setErr(true)
        } finally {
            setLoading(false)
        }
    }

    const openJsonForImport = async () => {
        setLoading(true)
        try {
            let fileName = await open({ filters: [{name: '', extensions: ['json']}]})
            await invoke('read_coldcard', { path: fileName })
            // navigate("/home")
        } catch {
            setErr(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AppSkeleton centerChildren={false}>
            <Fades delay={100} style='flex flex-col justify-start items-start space-y-5 pl-40 pr-40 pt-10 lg:pl-[200px] lg:pr-[200px] xl:pl-[350px] xl:pr-[350px] 2xl:pl-[500px] 2xl:pr-[500px]'>
                    <Fades style='flex flex-row justify-center items-center space-x-1' delay={200}>
                        <CiFileOn size={21} className="text-green-600"/>
                        <h1 className='text-2xl font-bold dark:text-white'>Hardware Device File Import</h1>
                    </Fades>
                    <div className={`flex flex-row justify-start items-start w-full border dark:border-zinc-700 border-zinc-300 rounded-sm transition-all ease-in-out duration-200`}>
                        <div className='flex flex-col justify-start items-start px-5 py-5 space-y-1'>
                            <h1 className='dark:text-white text-bold text-md'>Export the configuration file from your hardware wallet and select from the options below.</h1>
                        </div>   
                    </div>
                    <Fades style='flex flex-col justify-center items-start w-full' delay={200}>
                        <h1 className='dark:text-white font-bold pb-2'>Give a name to your wallet</h1>
                        <input className='border dark:border-zinc-700 border-zinc-300 dark:text-white dark:bg-zinc-800 w-full px-2 py-2 rounded-sm focus:border-green-500 focus:outline-none focus:ring-0' placeholder='My wallet'
                            onChange={(e) => setWalletName(e.target.value)}
                        ></input>
                    </Fades>
                    <div className='flex flex-row justify-start items-center space-x-5 w-full border dark:border-zinc-700 border-zinc-300 rounded-sm px-5 py-5 '>
                        <button className='flex flex-row justify-center items-center space-x-1 hover:animate-pulse' onClick={() => openTxtForImport()}>
                            <img src={Keystone} className='w-5 l-5'></img>
                            <h1 className='font-bold dark:text-white text-lg'>Keystone</h1>
                        </button>
                        <button className='flex flex-row justify-center items-center space-x-1 hover:animate-pulse'>
                            <img src={Coldcard} className='w-5 l-5'></img>
                            <h1 className='font-bold dark:text-white text-lg'>Coldcard</h1>
                        </button>
                        {/* <Fades style='flex flex-row justify-center items-center space-x-1' delay={300}>
                            <h1 className='font-bold dark:text-white'></h1>
                        </Fades> */}
                    </div>
                    <Fades style='flex flex-row justify-center items-center w-full' delay={300}>
                        <button className='dark:text-white font-bold dark:bg-zinc-800 bg-white border border-zinc-300 dark:border-zinc-700 px-5 py-5 rounded-sm w-full hover:animate-pulse' onClick={() => navigate("/home")}>Cancel</button>
                    </Fades>
                </Fades>
                {loading && <Fades style='flex flex-row justify-center items-center space-x-1 justify-center items-center pt-10' delay={100}>
                            <CgSpinnerTwoAlt className="text-green-600 animate-spin" size={16}/>
                            <h1 className='dark:text-zinc-300 text-sm'>Importing your wallet</h1>
                    </Fades>}
                {!loading && err && <Fades style=' space-x-1 justify-center items-center pt-10 pl-40 pr-40 lg:pl-[200px] lg:pr-[200px] xl:pl-[350px] xl:pr-[350px] 2xl:pl-[500px] 2xl:pr-[500px]' delay={100}>
                        <div className='flex flex-row justify-center items-center space-x-1 px-2 py-2 rounded-sm bg-gradient-to-tl border dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800 from-zinc-100 to-white '>
                            <CiSquareAlert className="text-red-600" size={23}/>
                            <h1 className='font-bold dark:text-white'>There was an error importing your wallet.</h1>
                        </div>
                </Fades>}
        </AppSkeleton>
    )
}

export default ImportSingleFile