import { useEffect, useState } from 'react'
import { MdOutlinePrivacyTip } from 'react-icons/md'
import Fades from '../../util/Fades'
import { useNavigate } from 'react-router-dom'
import { invoke } from '@tauri-apps/api'
import { listen } from '@tauri-apps/api/event'
import TauriMessage from '../../../interfaces/TauriMessage'
import { CgSpinnerTwoAlt } from 'react-icons/cg'

const TorServerConfig = () => {
    const navigate = useNavigate()
    const [selected, setSelected] = useState<string>("tor")
    const [tauriMessage, setTauriMessage] = useState<string>('')
    const [saving, setSaving] = useState<boolean>(false)

    const navigateNextStep = () => {
        let tor = selected === "tor"
        setSaving(true)
        invoke('new_settings', { hasConfigured: true, integratedTor: tor, publicServer: true, wrappedSegwit: false, rpcUsername: "", rpcPassword: "" }).then().catch().finally(() => {
            setSaving(false)
            navigate("/home")
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
        <div className='flex flex-row justify-center items-center w-full h-screen'>
            <Fades delay={100} style='flex flex-col justify-start items-start space-y-5'>
                <Fades style='flex flex-row justify-center items-center space-x-1' delay={100}>
                    <MdOutlinePrivacyTip size={22} className="text-green-600"/>
                    <h1 className='text-2xl font-bold dark:text-white'>Choose your privacy level</h1>
                </Fades>
                <button className={`flex flex-row justify-start items-start w-full border ${selected === "tor" ? "border-green-300 bg-green-600 text-white" : "dark:border-zinc-700 border-zinc-300 hover:animate-pulse"} rounded-sm transition-all ease-in-out duration-200`} onClick={() => setSelected("tor")}>
                    <div className='flex flex-col justify-start items-start px-5 py-5 space-y-1' onClick={() => setSelected("tor")}>
                        <h1 className='dark:text-white font-bold text-xl'>Integrated Tor Routing</h1>
                        <h1 className='dark:text-white text-xs'>Your privacy is significantly increased, but wallet updates will be slow.</h1>
                    </div>   
                </button>
                <button className={`flex flex-row justify-start items-start w-full border ${selected === "default" ? "border-green-300 bg-green-600 text-white" : "dark:border-zinc-700 border-zinc-300 hover:animate-pulse"} rounded-sm transition-all ease-in-out duration-200`} onClick={() => setSelected("default")}>
                    <div className='flex flex-col justify-start items-start px-5 py-5 space-y-1'>
                        <h1 className='dark:text-white font-bold text-xl'>Default Routing</h1>
                        <h1 className='dark:text-white text-xs'>Fast wallet updates with little privacy.</h1>
                    </div>   
                </button>
                <Fades style='flex flex-row justify-center items-center w-full' delay={200}>
                    <button className='text-white font-bold bg-green-600 border border-green-300 px-5 py-5 rounded-sm w-full hover:animate-pulse' onClick={() => navigateNextStep()}>Finish</button>
                </Fades>
                {saving && <Fades style='flex flex-row justify-center items-center space-x-1 justify-center items-center' delay={200}>
                    <CgSpinnerTwoAlt className="text-green-600 animate-spin" size={16}/>
                    <h1 className='dark:text-zinc-300 text-sm'>{tauriMessage}</h1>
                </Fades>}
            </Fades>
        </div>
  )
}

export default TorServerConfig