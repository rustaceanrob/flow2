import { Dispatch, SetStateAction } from 'react'
import AppSkeleton from '../../util/AppSkeleton'
import NewWallet from '../imports/NewWallet'
import Fades from '../../util/Fades'
import { CgSpinnerTwoAlt } from 'react-icons/cg'
import { BiAddToQueue } from 'react-icons/bi'
import BitcoinWalletMetadata from '../../../interfaces/BitcoinWalletMetadata'
import { GrBitcoin } from 'react-icons/gr'
import { BsWallet2 } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { invoke } from '@tauri-apps/api'


type Props = {
  loading: boolean
  ids: BitcoinWalletMetadata[]
  setSelectedId: Dispatch<SetStateAction<string>>
  selectedWallet: Dispatch<SetStateAction<BitcoinWalletMetadata | undefined>>
}

const WalletHome = ({ loading, ids, setSelectedId, selectedWallet }: Props) => {
    const navigate = useNavigate()

    const renderHome = () => {
      if (loading) {
        return (
          <Fades style='flex flex-row justify-center items-center space-x-1 justify-center items-center' delay={100}>
            <CgSpinnerTwoAlt className="text-green-600 animate-spin" size={16}/>
            <h1 className='dark:text-zinc-300 text-sm'>Loading wallets</h1>
          </Fades>
        )
      } else if (ids.length > 0) {
        return (
          <div className='flex flex-col justify-start items-start pl-40 pr-40 lg:pl-[200px] lg:pr-[200px] xl:pl-[350px] xl:pr-[350px] 2xl:pl-[500px] 2xl:pr-[500px] w-full'>
            <Fades style='flex flex-row justify-center items-center space-x-1 pb-5' delay={100}>
                <GrBitcoin size={16} className="text-green-600"/>
                <h1 className='text-lg font-bold dark:text-white'>Your wallets</h1>
            </Fades>
            <Fades style='flex flex-col justify-center items-center border dark:border-zinc-700 border-zinc-300 rounded-sm w-full' delay={200}>
              { ids.map((item) => {
                return (
                  <button key={item.id} className='flex flex-row justify-center items-center hover:animate-pulse border-b border-zinc-300 dark:border-zinc-700 px-2 py-3 w-full space-x-1' onClick={() => {
                    setSelectedId(item.id)
                    selectedWallet(item)
                    navigate("/wallet")
                    // invoke('sync_wallet', { id: item.id }).then().catch().finally()
                  }}>
                    <BsWallet2 className="text-green-600"/>
                    <h1 className='dark:text-white font-bold'>{item.name}</h1>
                  </button>
                )
              })}
              <button className='flex flex-row justify-center items-center hover:animate-pulse border-zinc-300 dark:border-zinc-700 px-2 py-3 w-full space-x-1' onClick={() => navigate("/newwallet")}>
                <BiAddToQueue className="text-green-600"/>
                <h1 className='dark:text-white font-bold'>Create New</h1>
              </button>
            </Fades>
          </div>
        )
      } else {
        return ( 
          <NewWallet/> 
        )
      }
    }

    return (
      //centerChildren={loading || ids.length < 1}
      <AppSkeleton centerChildren={true}>
        { renderHome() }
      </AppSkeleton>
    )
}

export default WalletHome