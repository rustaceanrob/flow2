import { useState } from 'react'
import Fades from '../util/Fades'
import { useNavigate } from 'react-router-dom'
import { MdOutlinePrivacyTip } from 'react-icons/md'
import AppSkeleton from '../util/AppSkeleton'

const NewWalletPrompt = () => {

    const navigate = useNavigate()
    const [selected, setSelected] = useState<string>("single")

    const navigateNextStep = () => {
        navigate("/home")
    }
    return (
        <AppSkeleton centerChildren={true}>
            <Fades delay={100} style='flex flex-col justify-start items-start space-y-5'>
                    <Fades style='flex flex-row justify-center items-center space-x-1' delay={200}>
                        <MdOutlinePrivacyTip size={22} className="text-green-600"/>
                        <h1 className='text-2xl font-bold dark:text-white'>Choose your security model</h1>
                    </Fades>
                    <div className={`flex flex-row justify-start items-start w-full border ${selected === "single" ? "border-green-300 bg-green-600 text-white" : "dark:border-zinc-700 border-zinc-300 hover:animate-pulse"} rounded-sm transition-all ease-in-out duration-200`}>
                        <button className='flex flex-col justify-start items-start px-5 py-5 space-y-1' onClick={() => setSelected("single")}>
                            <h1 className='dark:text-white font-bold text-xl'>One Signature</h1>
                            <h1 className='dark:text-white text-xs'>You have a single hardware wallet or are new to Bitcoin</h1>
                        </button>   
                    </div>
                    <div className={`flex flex-row justify-start items-start w-full border ${selected === "multi" ? "border-green-300 bg-green-600 text-white" : "dark:border-zinc-700 border-zinc-300 hover:animate-pulse"} rounded-sm transition-all ease-in-out duration-200`}>
                        <button className='flex flex-col justify-start items-start px-5 py-5 space-y-1' onClick={() => setSelected("multi")}>
                            <h1 className='dark:text-white font-bold text-xl'>Multisignature</h1>
                            <h1 className='dark:text-white text-xs'>You're a pro and have multiple hardware wallets.</h1>
                        </button>   
                    </div>
                    <Fades style='flex flex-row justify-center items-center w-full' delay={200}>
                        <button className='text-white font-bold bg-green-600 border border-green-300 px-5 py-5 rounded-sm w-full hover:animate-pulse' onClick={() => navigateNextStep()}>Next</button>
                    </Fades>
                    <Fades style='flex flex-row justify-center items-center w-full' delay={200}>
                        <button className='dark:text-white font-bold dark:bg-zinc-800 bg-white border border-zinc-300 dark:border-zinc-700 px-5 py-5 rounded-sm w-full hover:animate-pulse' onClick={() => navigate("/home")}>Cancel</button>
                    </Fades>
                </Fades>
        </AppSkeleton>
    )
}

export default NewWalletPrompt