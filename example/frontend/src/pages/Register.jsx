/* eslint-disable react-refresh/only-export-components */
import { observer } from 'mobx-react-lite'
import RegisterForm from '../components/RegisterForm/RegisterForm'

function Register() {
    return (
        <div className='MainBlock'>
            <RegisterForm />
        </div>
    )
}

export default observer(Register)