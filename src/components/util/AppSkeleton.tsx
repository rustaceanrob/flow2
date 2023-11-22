import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdSettings } from 'react-icons/io'
import { FaRegCircleCheck } from "react-icons/fa6";
import { listen } from '@tauri-apps/api/event'
import Fades from './Fades'
import { BsWifi, BsWifiOff } from 'react-icons/bs'
import { CgSpinnerTwoAlt } from 'react-icons/cg'
import TauriMessage from '../../interfaces/TauriMessage'
import FromLeft from './FromLeft';

type Props = {
    children: React.ReactNode,
    centerChildren: boolean,
}

const AppSkeleton = ({ children, centerChildren }: Props) => {
    const [tauriMessage, setTauriMessage] = useState<string>('')
    const navigate = useNavigate()

    const refresh = () => {
        
    }

    useEffect(() => {
        (async () => {
            await listen('message', (event) => {
                setTauriMessage((event.payload as TauriMessage).message)
            }) 
        })()
    }, [])

    return (
        <div className='flex flex-col h-screen transition-all ease-in-out'>
            <div className='w-full flex flex-row justify-between items-center p-2 pl-4'>
                <div className='flex flex-row justify-center items-center space-x-2'>
                    {navigator.onLine ? 
                        <BsWifi className="text-green-600"/>
                    : <BsWifiOff className="text-red-600"/>}
                </div>
                {tauriMessage !== "" ? 
                <div className='flex flex-row justify-end items-center'>
                    <Fades style='flex flex-row justify-center items-center space-x-1' delay={200}>
                        <CgSpinnerTwoAlt className="text-green-600 animate-spin" size={14}/>
                        <h1 className='dark:text-zinc-300 text-xs'>{tauriMessage}</h1>
                    </Fades>
                </div>
                : 
                <div className='flex flex-row justify-end items-center'>
                    <button className='flex flex-row justify-center items-center space-x-1' onClick={() => refresh() }>
                        <FaRegCircleCheck className="text-green-600" size={12}/>
                        <h1 className='dark:text-zinc-300 text-xs'>Updated</h1>
                    </button>
                </div>}
            </div>
            <div className='flex flex-row h-full overflow-scroll scrollbar-hide'>
                <FromLeft style='flex flex-col justify-end items-center pb-5 pl-2 pr-2' delay={100}>
                    <button className='hover:text-green-600 dark:text-zinc-200 duration-300 flex flex-col justify-center items-center space-y-1'
                     onClick={() => navigate("/settings")}
                    >
                        <IoMdSettings className="hover:animate-spin" size={20}/>
                    </button>
                </FromLeft>
                <div className={`w-full min-h-full flex flex-col border-l border-t rounded-md dark:border-zinc-700 border-zinc-300 dark:bg-zinc-900 p-2 bg-white ${centerChildren ? "justify-center items-center": ""} overflow-auto`}>
                    { children }
                </div>
            </div>
        </div>
    )
}

export default AppSkeleton