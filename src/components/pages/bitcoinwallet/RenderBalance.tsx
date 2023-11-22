import { listen } from '@tauri-apps/api/event'
import { useEffect, useState } from 'react'
import BalanceMessage from '../../../interfaces/BalanceMessage'
import Fades from '../../util/Fades'
import { CgSpinnerTwoAlt } from 'react-icons/cg'
import { GrBitcoin } from 'react-icons/gr'

type Props = {
    loading: boolean
}

const RenderBalance = ({ loading }: Props) => {
    const [satoshis, setSatoshis] = useState<number>(-1)
    const [bitcoin, setBitcoin] = useState<number>(-1)

    useEffect(() => {
        (async () => {
            await listen('balance', (event) => {
                let satoshis = (event.payload as BalanceMessage).balance
                setSatoshis(satoshis)
                setBitcoin(satoshis / 100000000)
            })
        })()
    }, [loading])

    return (
        <div className='flex flex-col justify-center items-center w-[300px] h-40'>
            {satoshis < 0 ? (
                <Fades style='flex flex-row justify-center items-center space-x-1 justify-center items-center' delay={100}>
                    <CgSpinnerTwoAlt className="text-green-600 animate-spin" size={16}/>
                    <h1 className='text-zinc-500 text-sm'>Loading last balance</h1>
                </Fades>
            ) : (
                <Fades style='flex flex-col justify-center items-center space-y-1' delay={100}>
                    <div className='flex flex-row justify-center items-center space-x-1'>
                        <GrBitcoin size={20} className="text-green-600"/>
                        <h1 className='dark:text-white font-extrabold'>{ bitcoin.toPrecision(4) }</h1>
                    </div>
                    <h1 className='dark:text-white text-xs font-mono'>{ satoshis.toLocaleString() } satoshis</h1>
                </Fades>
            )}
        </div>
    )
}

export default RenderBalance