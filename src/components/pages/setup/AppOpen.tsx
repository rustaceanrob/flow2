import { CgSpinnerTwoAlt } from 'react-icons/cg'
import Fades from '../../util/Fades'
import { useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import TauriMessage from '../../../interfaces/TauriMessage'

const AppOpen = () => {
  const [tauriMessage, setTauriMessage] = useState<string>('')

  useEffect(() => {
    (async () => {
        await listen('message', (event) => {
            setTauriMessage((event.payload as TauriMessage).message)
        }) 
    })()
  }, [])

  return (
    <Fades style='flex flex-row justify-center items-center w-full h-screen' delay={50}>
        <CgSpinnerTwoAlt className="text-green-600 animate-spin" size={12}/>
        <h1 className='pl-1 text-xs font-extrabold dark:text-white'>{tauriMessage}</h1>
    </Fades>
  )
}

export default AppOpen