import { Route, Routes, useNavigate } from 'react-router-dom'
import Welcome from '../pages/Welcome'
import ServerConfig from '../pages/ServerConfig'
import TorServerConfig from '../pages/TorServerConfig'
import AppOpen from '../pages/AppOpen'
import { useEffect } from 'react'
import WalletHome from '../pages/WalletHome'
import CoreConfig from '../pages/CoreConfig'
import NewWalletPrompt from '../pages/NewWalletPrompt'
import { invoke } from '@tauri-apps/api'
import Settings from '../pages/Settings'

const ConfigurationRouter = () => {
  const navigate = useNavigate()

  useEffect(() => {
    invoke('begin_tor_service').then(() => {
      console.log("tor started successfully")
    }).catch(() => {
      console.log("tor could not connect")
    }).finally(() => {
      navigate("/welcome")
    })
  }, [])

  return (
    <Routes>
        <Route path='/' element={<AppOpen/>}/>
        <Route path='/welcome' element={<Welcome/>}/>
        <Route path='/configelectrum' element={<TorServerConfig/>}/>
        <Route path='/configrpc' element={<CoreConfig/>}/>
        <Route path='/serverconfig' element={<ServerConfig/>}/>
        <Route path='/home' element={<WalletHome/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/newwallet' element={<NewWalletPrompt/>}/>
    </Routes>
  )
}

export default ConfigurationRouter