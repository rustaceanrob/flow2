import { FaHandSpock } from 'react-icons/fa'
import Fades from '../../util/Fades'
import { useNavigate } from 'react-router-dom'

const Welcome = () => {
    const navigate = useNavigate()
    return (
        <div className='flex flex-row justify-center items-center w-full h-screen'>
            <div className='flex flex-col justify-start items-start space-y-5'>
                <Fades style='flex flex-row justify-center items-center space-x-1' delay={100}>
                    <FaHandSpock size={20} className="text-green-600"/>
                    <h1 className='text-2xl font-bold dark:text-white'>Welcome</h1>
                </Fades>
                <Fades style='flex flex-row justify-center items-center' delay={200}>
                    <h1 className='dark:text-white text-sm bg-white border-zinc-300 dark:bg-zinc-800 border dark:border-zinc-700 px-5 py-5 rounded-sm'>Let's configure your settings. You can always change these later.</h1>
                </Fades>
                <Fades style='flex flex-row justify-center items-center w-full' delay={300}>
                    <button onClick={() => navigate("/serverconfig")}
                    className='text-white font-bold bg-green-600 border border-green-300 px-5 py-5 rounded-sm w-full hover:animate-pulse'>I'm ready!</button>
                </Fades>
            </div>
        </div>
    )
}

export default Welcome