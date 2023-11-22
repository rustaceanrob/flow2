import { Policy } from '../../interfaces/BitcoinWalletMetadata'
import { IoHardwareChipOutline } from "react-icons/io5";
import { BsFillUsbPlugFill } from "react-icons/bs";
import { GiLaptop } from "react-icons/gi";
import { MdOutlineDevices } from "react-icons/md";

type Props = {
    policy: Policy | undefined
}

const PolicyIcon = ({ policy }: Props) => {

    const renderIcon = () => {
        if (policy === Policy.Airgapped) {
            return (
                <IoHardwareChipOutline/>
            )

        } else if (policy === Policy.Connected) {
            return (
                <BsFillUsbPlugFill className="text-green-600"/>
            )
        }
        else if (policy === Policy.Local) {
            return (
                <GiLaptop/>
            )
            
        } else if (policy === Policy.Multi) {
            return (
                <MdOutlineDevices/>
            )
        } else {
            return (<></>)
        }
    }


    return (
        <>
        {
            renderIcon()
        }
        </>
    )
}

export default PolicyIcon