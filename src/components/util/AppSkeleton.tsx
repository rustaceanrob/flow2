import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdSettings, IoMdRefresh } from 'react-icons/io'
import { GoDotFill } from 'react-icons/go'
import { listen } from '@tauri-apps/api/event'
import Fades from './Fades'
import { CgSpinnerTwoAlt } from 'react-icons/cg'
import { invoke } from '@tauri-apps/api'

type Props = {
    children: React.ReactNode,
    centerChildren: boolean,
}

const AppSkeleton = ({ children, centerChildren }: Props) => {
    const [tauriMessage, setTauriMessage] = useState<string>('')
    const navigate = useNavigate()

    const refresh = () => {
        invoke('get_balance').then((res) => {
            console.log(res)
        }).catch((e) => {
            console.log(e)
        }).finally(() => {
            console.log("function execution completed")
            setTauriMessage("")
        })
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
            {tauriMessage !== "" ? 
            <div className='flex flex-row justify-end items-center p-3'>
                <Fades style='flex flex-row justify-center items-center space-x-1' delay={200}>
                    <CgSpinnerTwoAlt className="text-green-600 animate-spin" size={14}/>
                    <h1 className='dark:text-zinc-300 text-xs'>{tauriMessage}</h1>
                </Fades>
            </div>
            : 
            <div className='flex flex-row justify-end items-center p-3'>
                <button className='flex flex-row justify-center items-center space-x-1' onClick={() => refresh() }>
                    <IoMdRefresh className="text-green-600"/>
                    <h1 className='dark:text-zinc-300 text-xs'>Refresh</h1>
                </button>
            </div>               }
            <div className='flex flex-row h-full'>
                <div className='flex flex-col justify-end items-center pb-5 pl-2 pr-2'>
                    <button className='hover:text-green-600 dark:text-zinc-200 duration-300 flex flex-col justify-center items-center space-y-1'
                     onClick={() => navigate("/settings")}
                    >
                        <IoMdSettings className="hover:animate-spin" size={20}/>
                    </button>
                </div>
                <div className={`w-full min-h-full flex flex-col border-l border-t rounded-md dark:border-zinc-700 border-zinc-300 dark:bg-zinc-900 bg-white p-5 ${centerChildren ? "justify-center items-center": ""} overflow-auto`}>
                    { children }
                </div>
            </div>
        </div>
    )
}

export default AppSkeleton