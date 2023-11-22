import AppSkeleton from '../../util/AppSkeleton'
import { FaArrowLeft, FaKey } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Fades from '../../util/Fades'
import AddressItem from './AddressItem'
import fetchAddresses from '../../../hooks/fetchAddresses'

type Props = {
    selectedId: string,
}

const ListAddresses = ({ selectedId }: Props) => {
    const navigate = useNavigate()
    const { loading, error, addresses } = fetchAddresses({selectedId})

    return (
        <AppSkeleton centerChildren={false}>
            <button onClick={() => navigate("/wallet")} className='pl-1 pt-2 pb-5'>
                <FaArrowLeft className="text-green-600" size={12}/>
            </button>
            <div className='pl-20 pr-20 lg:pl-[200px] lg:pr-[200px] xl:pl-[350px] xl:pr-[350px] 2xl:pl-[500px] 2xl:pr-[500px] overflow-scroll scrollbar-hide '>
                <div className='flex flex-row justify-start items-center space-x-1 pb-5'>
                    <FaKey className="text-green-600" size={15}/>
                    <h1 className='dark:text-white font-bold'>Your Addresses</h1>
                </div>
                {!loading && !error && <Fades style={`border border-zinc-300 dark:border-zinc-700 rounded-sm w-full overflow-scroll scrollbar-hide`} delay={100}>
                    { addresses?.map((item, index) => {
                        return (<AddressItem key={index} index={index} hasBorder={index < addresses?.length - 1} address={item.address} path={item.path}/>)
                    })}
                </Fades>}
                {error && <h1 className='pt-2 font-bold'>An error occured</h1>}
            </div>
        </AppSkeleton>
    )
}

export default ListAddresses