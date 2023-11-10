import { useState } from 'react'
import { GrBitcoin } from 'react-icons/gr'
import Fades from '../util/Fades'
import { useNavigate } from 'react-router-dom'

const ServerConfig = () => {
    const navigate = useNavigate()
    const [selected, setSelected] = useState<string>("electrum")

    const navigateNextStep = () => {
        if (selected === "electrum") {
            navigate('/configelectrum')
        } else {
            navigate('/configrpc')
        }
    }
 
    return (
        <div className='flex flex-row justify-center items-center w-full h-screen'>
            <Fades delay={100} style='flex flex-col justify-start items-start space-y-5'>
                <Fades style='flex flex-row justify-center items-center space-x-1' delay={100}>
                    <GrBitcoin size={20} className="text-green-600"/>
                    <h1 className='text-2xl font-bold dark:text-white'>Choose your data source</h1>
                </Fades>
                <div className={`flex flex-row justify-start items-start w-full border ${selected === "electrum" ? "border-green-300 bg-green-600 text-white" : "dark:border-zinc-700 border-zinc-300 hover:animate-pulse"} rounded-sm transition-all ease-in-out duration-200`}>
                    <button className='flex flex-col justify-start items-start px-5 py-5 space-y-1' onClick={() => setSelected("electrum")}>
                        <h1 className='dark:text-white font-bold text-xl'>Public Bitcoin Server</h1>
                        <h1 className='dark:text-white text-xs'>The best option for new users and computers with low storage</h1>
                    </button>   
                </div>
                <div className={`flex flex-row justify-start items-start w-full border ${selected === "rpc" ? "border-green-300 bg-green-600 text-white" : "dark:border-zinc-700 border-zinc-300 hover:animate-pulse"} rounded-sm transition-all ease-in-out duration-200`}>
                    <button className='flex flex-col justify-start items-start px-5 py-5 space-y-1' onClick={() => setSelected("rpc")}>
                        <h1 className='dark:text-white font-bold text-xl'>Bitcoin Core</h1>
                        <h1 className='dark:text-white text-xs'>Communicates with your Bitcoin Full Node to get your wallet data</h1>
                    </button>   
                </div>
                <Fades style='flex flex-row justify-center items-center w-full' delay={200}>
                    <button className='text-white font-bold bg-green-600 border border-green-300 px-5 py-5 rounded-sm w-full hover:animate-pulse' onClick={() => navigateNextStep()}>Next</button>
                </Fades>
            </Fades>
        </div>
  )
}

export default ServerConfig