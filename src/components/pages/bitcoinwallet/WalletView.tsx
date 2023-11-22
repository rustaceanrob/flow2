import { useEffect, useState } from 'react'
import { FaArrowLeft, FaKey } from "react-icons/fa";
import { GiTwoCoins } from "react-icons/gi";
import { CiShare1 } from "react-icons/ci";
import { MdInfoOutline } from "react-icons/md";
import AppSkeleton from '../../util/AppSkeleton'
import { invoke } from '@tauri-apps/api'
import RenderBalance from './RenderBalance'
import Fades from '../../util/Fades'
import { useNavigate } from 'react-router-dom';
import { TbArrowsExchange } from 'react-icons/tb'
import RenderTransactions from './RenderTransactions';
import { listen } from '@tauri-apps/api/event';
import SyncingMessage from '../../../interfaces/SyncingMessage';
import BitcoinWalletMetadata from '../../../interfaces/BitcoinWalletMetadata';
import fetchWalletView from '../../../hooks/fetchWalletViewAndSync';
import fetchWalletViewAndSync from '../../../hooks/fetchWalletViewAndSync';

type Props = {
  selectedId: string
  selectedWallet: BitcoinWalletMetadata | undefined
}

const WalletView = ({ selectedId, selectedWallet }: Props) => {
  const { loading, error } = fetchWalletViewAndSync({ selectedId })
  const navigate = useNavigate()

  return (
    <AppSkeleton centerChildren={false}>
        <div className='flex flex-row justify-between items-center pb-2 scrollbar-hide'>
          <button onClick={() => navigate("/home")} className='pl-1 flex flex-row justify-center items-center space-x-2 hover:animate-pulse'>
              <FaArrowLeft className="text-green-600" size={12}/>
              <h1 className='font-bold text-xs justify-center items-center dark:text-white'>{selectedWallet?.name}</h1>
          </button>
          <div className='flex flex-row justify-center items-center'>
            {!loading && <Fades style="" delay={100}>
              <button className='flex flex-row justify-center items-center px-2 py-1 rounded-sm space-x-1 hover:animate-pulse' onClick={() => { navigate("/addresses") }
                }>
                <FaKey className="text-green-600" size={11}/>
                <h1 className='text-sm dark:text-zinc-300'>Addresses</h1>
              </button>
            </Fades>}
            {!loading && <Fades style="" delay={200}>
              <button className='flex flex-row justify-center items-center px-2 py-1 rounded-sm space-x-1 hover:animate-pulse'
                onClick={() => navigate("/coins")}
              >
                <GiTwoCoins className="text-green-600" size={15}/>
                <h1 className='text-sm dark:text-zinc-300'>Coins</h1>
              </button>
            </Fades>}
            <Fades style="" delay={300}>
              <button className='flex flex-row justify-center items-center px-2 py-1 rounded-sm space-x-1 hover:animate-pulse'
                onClick={() => navigate("/export")}
              >
                <CiShare1 className="text-green-600" size={15}/>
                <h1 className='text-sm dark:text-zinc-300'>Export</h1>
              </button>
            </Fades>
            <Fades style="" delay={400}>
              <button className='flex flex-row justify-center items-center px-2 py-1 rounded-sm hover:animate-pulse space-x-1'
                onClick={() => navigate("/info")}
              >
                <MdInfoOutline className="text-green-600" size={15}/>
                <h1 className='text-sm dark:text-zinc-300'>Info</h1>
              </button>
            </Fades>
          </div>
        </div>
        <div className='flex flex-col justify-center items-center w-full border-t border-zinc-300 dark:border-zinc-700'>
          <RenderBalance loading={loading}/>
          <Fades style='flex flex-row justify-center items-center space-x-2' delay={100}>
            <button className='hover:animate-pulse border border-green-300 bg-green-600 w-[150px] py-2 rounded-sm'>
              <h1 className='text-white font-bold'>Send</h1>
            </button>
            <button className='hover:animate-pulse border border-green-300 bg-green-600 w-[150px] py-2 rounded-sm'
              onClick={() => {
                  if (loading) {
                    alert("Please wait for your wallet to sync")
                  } else {
                    navigate("/receive")
                  }
              }}>
              <h1 className='text-white font-bold'>Receive</h1>
            </button>
          </Fades>
        </div>
        <div className='flex flex-row justify-start items-center pl-40 pr-40 lg:pl-[200px] lg:pr-[200px] xl:pl-[350px] xl:pr-[350px] 2xl:pl-[500px] 2xl:pr-[500px] pt-10'>
              <TbArrowsExchange className="text-green-600" size={23}/>
              <h1 className='pl-1 font-bold dark:text-white'>Transactions</h1>
          </div>
        <div className='flex flex-col justify-center items-center pt-5 pb-10 pl-40 pr-40 lg:pl-[200px] lg:pr-[200px] xl:pl-[350px] xl:pr-[350px] 2xl:pl-[500px] 2xl:pr-[500px] overflow-scroll scrollbar-hide'>
          <RenderTransactions loading={loading}/>
        </div>
    </AppSkeleton>
  )
}

export default WalletView