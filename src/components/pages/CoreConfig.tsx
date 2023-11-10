import { useState } from 'react'
import { GrBitcoin } from 'react-icons/gr'
import Fades from '../util/Fades'
import { useNavigate } from 'react-router-dom'

const CoreConfig = () => {

    const navigate = useNavigate()
    
    const navigateNextStep = () => {
        navigate("/home")
    }
 
    return (
        <form className='flex flex-col justify-center items-center h-full w-full' onSubmit={() => navigateNextStep()}>
            <Fades delay={100} style='flex flex-col justify-center items-start space-y-5 w-[500px]'>
                <Fades style='flex flex-row justify-center items-center space-x-1' delay={100}>
                    <GrBitcoin size={20} className="text-green-600"/>
                    <h1 className='text-2xl font-bold dark:text-white'>Configure Your RPC Server</h1>
                </Fades>
                <Fades style='flex flex-row justify-center items-center ' delay={200}>
                    <h1 className='dark:text-white text-sm bg-white border-zinc-300 dark:bg-zinc-800 border dark:border-zinc-700 px-5 py-5 rounded-md'>If you have not configured RPC with Bitcoin Core, follow <a className='text-green-600 hover:cursor-pointer'>this video</a> or set a username and password in the <span className='font-mono'>bitcoin.conf</span> file.</h1>
                </Fades>
                <Fades style='flex flex-col justify-center items-start w-full' delay={300}>
                    <h1 className='dark:text-white'>RPC Username</h1>
                    <input className='border dark:border-zinc-700 border-zinc-300 dark:text-white dark:bg-zinc-800 w-full px-2 py-2 rounded-md focus:border-green-500 focus:outline-none focus:ring-0' type='text'></input>
                </Fades>
                <Fades style='flex flex-col justify-center items-start w-full' delay={400}>
                    <h1 className='dark:text-white'>RPC Password</h1>
                    <input className='border dark:border-zinc-700 border-zinc-300 dark:text-white dark:bg-zinc-800 w-full px-2 py-2 rounded-md focus:border-green-500 focus:outline-none focus:ring-0' type='password'></input>
                </Fades>
                <Fades style='flex flex-row justify-center items-center w-full' delay={500}>
                    <button className='text-white font-bold bg-green-600 border border-green-300 px-5 py-5 rounded-sm w-full hover:animate-pulse' onClick={() => navigateNextStep()}>Finish</button>
                </Fades>
            </Fades>
        </form>
  )
}

export default CoreConfig