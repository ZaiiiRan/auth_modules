/* eslint-disable react-refresh/only-export-components */
import { observer } from 'mobx-react-lite'
import UserSettingsForm from '../components/UserSettingsForm/UserSettingsForm'

function UserSettings() {
    return (
        <div className='MainBlock FormBlock'>
            <h1>Настройки пользователя</h1>
            <div>Измените только, то что нужно</div>
            <UserSettingsForm />
        </div>
    )
}

export default observer(UserSettings)