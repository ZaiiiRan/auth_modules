/* eslint-disable react-refresh/only-export-components */
import { observer } from 'mobx-react-lite'
import UserSettingsForm from '../components/UserSettingsForm/UserSettingsForm'

function UserSettings() {
    return (
        <div className='MainBlock'>
            <UserSettingsForm />
        </div>
    )
}

export default observer(UserSettings)