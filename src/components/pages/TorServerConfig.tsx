import { useState } from 'react'
import { MdOutlinePrivacyTip } from 'react-icons/md'
import Fades from '../util/Fades'
import { useNavigate } from 'react-router-dom'

const TorServerConfig = () => {
    const navigate = useNavigate()
    const [selected, setSelected] = useState<string>("tor")

    const navigateNextStep = () => {
        navigate("/home")
    }
 
    return (
        <div className='flex flex-row justify-center items-center w-full h-screen'>
            <Fades delay={100} style='flex flex-col justify-start items-start space-y-5'>
                <Fades style='flex flex-row justify-center items-center space-x-1' delay={100}>
                    <MdOutlinePrivacyTip size={22} className="text-green-600"/>
                    <h1 className='text-2xl font-bold dark:text-white'>Choose your privacy level</h1>
                </Fades>
                <div className={`flex flex-row justify-start items-start w-full border ${selected === "tor" ? "border-green-300 bg-green-600 text-white" : "dark:border-zinc-700 border-zinc-300 hover:animate-pulse"} rounded-sm transition-all ease-in-out duration-200`}>
                    <button className='flex flex-col justify-start items-start px-5 py-5 space-y-1' onClick={() => setSelected("tor")}>
                        <h1 className='dark:text-white font-bold text-xl'>Integrated Tor Routing</h1>
                        <h1 className='dark:text-white text-xs'>Your privacy is significantly increased, but wallet updates will be slow.</h1>
                    </button>   
                </div>
                <div className={`flex flex-row justify-start items-start w-full border ${selected === "default" ? "border-green-300 bg-green-600 text-white" : "dark:border-zinc-700 border-zinc-300 hover:animate-pulse"} rounded-sm transition-all ease-in-out duration-200`}>
                    <button className='flex flex-col justify-start items-start px-5 py-5 space-y-1' onClick={() => setSelected("default")}>
                        <h1 className='dark:text-white font-bold text-xl'>Default Routing</h1>
                        <h1 className='dark:text-white text-xs'>Fast wallet updates with little privacy.</h1>
                    </button>   
                </div>
                <Fades style='flex flex-row justify-center items-center w-full' delay={200}>
                    <button className='text-white font-bold bg-green-600 border border-green-300 px-5 py-5 rounded-sm w-full hover:animate-pulse' onClick={() => navigateNextStep()}>Finish</button>
                </Fades>
            </Fades>
        </div>
  )
}

export default TorServerConfig