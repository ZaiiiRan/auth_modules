/* eslint-disable react-refresh/only-export-components */
import { observer } from 'mobx-react-lite'
import LoginForm from '../components/LoginForm/LoginForm'


function Login() {
    return (
        <div className='MainBlock'>
            <LoginForm />
        </div>
    )
}

export default observer(Login)