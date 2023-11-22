import { useNavigate } from 'react-router-dom'
import Fades from '../../util/Fades'

const NewWallet = () => {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col justify-center items-center'>
        <Fades style='flex flex-row justify-center items-center w-[300px]' delay={100}>
            <button className='text-white font-bold bg-green-600 border border-green-300 px-5 py-5 rounded-sm w-full hover:animate-pulse' onClick={() => { 
              navigate("/newwallet") 
            }}>
                Create Wallet
            </button>
        </Fades>
    </div>
  )
}

export default NewWallet