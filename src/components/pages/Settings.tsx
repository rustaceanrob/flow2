import { BsWallet2 } from 'react-icons/bs'
import { FaArrowLeft, FaBitcoin } from 'react-icons/fa'
import AppSkeleton from '../util/AppSkeleton'
import { useNavigate } from 'react-router-dom'
import Fades from '../util/Fades'
import { useState } from 'react'

const Settings = () => {
    const navigate = useNavigate()
    const [nested, setNested] = useState<boolean>(false)

    return (
        <AppSkeleton centerChildren={false}>
            <Fades style='' delay={100}>
                <button onClick={() => navigate("/home")} className='pl-1'>
                    <FaArrowLeft className="text-green-600" size={12}/>
                </button>
                <div className='flex flex-col justify-start items-start space-y-5 pl-40 pr-40 pt-20 lg:pl-[200px] lg:pr-[200px] xl:pl-[350px] xl:pr-[350px]'>
                    <div className='flex flex-col justify-center items-center'>
                        <div className='flex flex-row justify-center items-center space-x-1'>
                            <BsWallet2 className="text-green-600"/>
                            <h1 className='text-xl font-bold dark:text-white'>
                                Wallet
                            </h1>
                        </div>
                    </div>
                    <div className='flex flex-col border dark:bg-zinc-900 dark:border-zinc-700 border-zinc-300 bg-white w-full p-3 rounded-md space-y-3'>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="number" placeholder={"20"} className="dark:bg-zinc-800 dark:text-white bg-white border border-zinc-300 dark:border-zinc-800 focus:border-green-500 focus:outline-none focus:ring-0 w-[50px] px-1 py-1 rounded-md"/>
                            <span className="ml-3 dark:text-white">Scanning Gap</span>
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={nested} onChange={() => setNested(!nested)} className="sr-only peer"/>
                            <div className="w-11 h-6 bg-zinc-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-600 dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-700 peer-checked:bg-green-600"></div>
                            <span className="ml-3 dark:text-white">Show Nested-Segwit Balance</span>
                        </label>
                    </div>
                </div>
                <div className='flex flex-col justify-start items-start space-y-5 pl-40 pr-40 pt-20 lg:pl-[200px] lg:pr-[200px] xl:pl-[350px] xl:pr-[350px]'>
                    <div className='flex flex-col justify-center items-center'>
                        <div className='flex flex-row justify-center items-center space-x-1'>
                            <FaBitcoin className="text-green-600"/>
                            <h1 className='text-xl font-bold dark:text-white'>
                                Server
                            </h1>
                        </div>
                    </div>
                    <div className='flex flex-col border dark:bg-zinc-900 dark:border-zinc-700 border-zinc-300 bg-white w-full p-3 rounded-md space-y-3'>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer"/>
                            <div className="w-11 h-6 bg-zinc-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-600 dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-700 peer-checked:bg-green-600"></div>
                            <span className="ml-3 dark:text-white">Use Tor Routing</span>
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer"/>
                            <div className="w-11 h-6 bg-zinc-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-600 dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-700 peer-checked:bg-green-600"></div>
                            <span className="ml-3 dark:text-white">Use RPC Server</span>
                        </label>
                    </div>
                </div>
            </Fades>
        </AppSkeleton>
    )
}

export default Settings