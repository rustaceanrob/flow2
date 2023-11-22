import { useState } from 'react'
import Fades from '../../util/Fades'
import { useNavigate } from 'react-router-dom'
import { MdDevices } from 'react-icons/md'
import AppSkeleton from '../../util/AppSkeleton'


const ImportSingle = () => {

    const navigate = useNavigate()
    const [selected, setSelected] = useState<string>("usb")

    const navigateNextStep = () => {
        if (selected === "usb") {
            navigate("/importsingleusb")
        } else if (selected === "file") {
            navigate("/importsinglefile")
        } else {
            navigate("/home")
        }
    }
    return (
        <AppSkeleton centerChildren={false}>
            <Fades delay={100} style='flex flex-col justify-start items-start space-y-5 pl-40 pr-40 pt-10 lg:pl-[200px] lg:pr-[200px] xl:pl-[350px] xl:pr-[350px] 2xl:pl-[500px] 2xl:pr-[500px]'>
                    <Fades style='flex flex-row justify-center items-center space-x-1' delay={200}>
                        <MdDevices size={25} className="text-green-600"/>
                        <h1 className='text-2xl font-bold dark:text-white pl-1'>Choose how to import your wallet</h1>
                    </Fades>
                    <button className={`flex flex-row justify-start items-start w-full border ${selected === "usb" ? "border-green-300 bg-green-600 text-white" : "dark:border-zinc-700 border-zinc-300 hover:animate-pulse"} rounded-sm transition-all ease-in-out duration-200`} onClick={() => setSelected("usb")}>
                        <div className='flex flex-col justify-start items-start px-5 py-5 space-y-1'>
                            <h1 className='dark:text-white font-bold text-xl'>Connected Device</h1>
                            <h1 className='dark:text-white text-xs'>Import your wallet by USB connection.</h1>
                        </div>   
                    </button>
                    <button className={`flex flex-row justify-start items-start w-full border ${selected === "file" ? "border-green-300 bg-green-600 text-white" : "dark:border-zinc-700 border-zinc-300 hover:animate-pulse"} rounded-sm transition-all ease-in-out duration-200`} onClick={() => setSelected("file")}>
                        <div className='flex flex-col justify-start items-start px-5 py-5 space-y-1' >
                            <h1 className='dark:text-white font-bold text-xl'>From File</h1>
                            <h1 className='dark:text-white text-xs'>Import your wallet from a configuration file.</h1>
                        </div>   
                    </button>
                    {/* <button className={`flex flex-row justify-start items-start w-full border ${selected === "qr" ? "border-green-300 bg-green-600 text-white" : "dark:border-zinc-700 border-zinc-300 hover:animate-pulse"} rounded-sm transition-all ease-in-out duration-200`} onClick={() => setSelected("qr")}>
                        <div className='flex flex-col justify-start items-start px-5 py-5 space-y-1'>
                            <h1 className='dark:text-white font-bold text-xl'>QR Code</h1>
                            <h1 className='dark:text-white text-xs'>Scan a QR code on your device.</h1>
                        </div>   
                    </button> */}
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

export default ImportSingle