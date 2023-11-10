import AppSkeleton from '../util/AppSkeleton'
import NewWallet from './NewWallet'

const WalletHome = () => {
    return (
      <AppSkeleton centerChildren={true}>
        <NewWallet/>
      </AppSkeleton>
    )
}

export default WalletHome