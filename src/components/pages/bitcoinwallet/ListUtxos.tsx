import AppSkeleton from '../../util/AppSkeleton'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Fades from '../../util/Fades'
import UtxoItem from './UtxoItem'
import { GiTwoCoins } from 'react-icons/gi'
import fetchUtxos from '../../../hooks/fetchUtxos'

type Props = {
    selectedId: string,
}

const ListUxos = ({ selectedId }: Props) => {
    const navigate = useNavigate()
    const { loading, error, utxos } = fetchUtxos({selectedId})

    return (
        <AppSkeleton centerChildren={false}>
            <button onClick={() => navigate("/wallet")} className='pl-1 pt-2 pb-5'>
                <FaArrowLeft className="text-green-600" size={12}/>
            </button>
            <div className='pl-20 pr-20 lg:pl-[200px] lg:pr-[200px] xl:pl-[350px] xl:pr-[350px] 2xl:pl-[500px] 2xl:pr-[500px] pb-10 overflow-scroll scrollbar-hide'>
                <div className='flex flex-row justify-start items-center space-x-1 pb-5'>
                    <GiTwoCoins className="text-green-600" size={15}/>
                    <h1 className='dark:text-white font-bold'>Your Unspent Transaction Outputs</h1>
                </div>
                <Fades style={`border border-zinc-300 dark:border-zinc-700 rounded-sm w-full overflow-scroll scrollbar-hide`} delay={100}>
                    { !loading && !error && utxos?.map((item, index) => {
                        return (<UtxoItem key={index} index={index} hasBorder={index < utxos?.length - 1} utxo={item}/>)
                    })}
                </Fades>
                {error && <h1 className=''>An error occured</h1>}
            </div>
        </AppSkeleton>
    )
}

export default ListUxos