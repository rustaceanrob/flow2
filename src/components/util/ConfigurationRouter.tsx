import { Route, Routes, useNavigate } from 'react-router-dom'
import Welcome from '../pages/setup/Welcome'
import ServerConfig from '../pages/setup/ServerConfig'
import TorServerConfig from '../pages/setup/TorServerConfig'
import AppOpen from '../pages/setup/AppOpen'
import { useEffect, useState } from 'react'
import WalletHome from '../pages/bitcoinwallet/WalletHome'
import CoreConfig from '../pages/setup/CoreConfig'
import NewWalletPrompt from '../pages/imports/NewWalletPrompt'
import { invoke } from '@tauri-apps/api'
import Settings from '../pages/Settings'
import SettingsConfig from '../../interfaces/Settings'
import SingleSigConfig from '../pages/imports/SingleSigConfig'
import ImportSingle from '../pages/imports/ImportSingle'
import ImportSingleUsb from '../pages/imports/ImportSingleUsb'
import fetchWalletMetadata from '../../hooks/fetchWalletMetadata'
import WalletView from '../pages/bitcoinwallet/WalletView'
import ListAddresses from '../pages/bitcoinwallet/ListAddresses'
import ListUxos from '../pages/bitcoinwallet/ListUtxos'
import Receive from '../pages/bitcoinwallet/Receive'
import Export from '../pages/bitcoinwallet/Export'
import BitcoinWalletMetadata from '../../interfaces/BitcoinWalletMetadata'
import WalletInfo from '../pages/bitcoinwallet/WalletInfo'
import ImportSingleFile from '../pages/imports/ImportSingleFile'

const ConfigurationRouter = () => {
  const [selectedId, setSelectedId] = useState<string>('')
  const [selectedWallet, setSelectedWallet] = useState<BitcoinWalletMetadata>()
  const { idsLoading, ids } = fetchWalletMetadata({ selectedId })
  const navigate = useNavigate()

  useEffect(() => {
    invoke('load_settings').then((res) => {
      let settings = res as SettingsConfig
      if (settings.has_configured) {
        navigate("/home")
      } else {
        navigate("/welcome")
      }
    })
  }, [])

  return (
    <Routes>
        <Route path='/' element={<AppOpen/>}/>
        <Route path='/welcome' element={<Welcome/>}/>
        <Route path='/configelectrum' element={<TorServerConfig/>}/>
        <Route path='/configrpc' element={<CoreConfig/>}/>
        <Route path='/serverconfig' element={<ServerConfig/>}/>

        <Route path='/home' element={<WalletHome key={selectedId} selectedWallet={setSelectedWallet} ids={ids} loading={idsLoading} setSelectedId={setSelectedId}/>}/>
        <Route path='/wallet' element={<WalletView selectedId={selectedId} selectedWallet={selectedWallet}/>}/>
        <Route path='/receive' element={<Receive selectedId={selectedId}/>}/>
        <Route path='/addresses' element={<ListAddresses selectedId={selectedId}/>}/>
        <Route path='/coins' element={<ListUxos selectedId={selectedId}/>}/>
        <Route path='/export' element={<Export selectedId={selectedId}/>}/>
        <Route path='/info' element={<WalletInfo selectedId={selectedId} selectedWallet={selectedWallet}/>}/>
        
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/newwallet' element={<NewWalletPrompt/>}/>
        <Route path='/singlesigconfig' element={<SingleSigConfig/>}/>
        <Route path='/importsingle' element={<ImportSingle/>}/>
        <Route path='/importsingleusb' element={<ImportSingleUsb setSelectedId={setSelectedId}/>}/>
        <Route path='/importsinglefile' element={<ImportSingleFile setSelectedId={setSelectedId}/>}/>
    </Routes>
  )
}

export default ConfigurationRouter