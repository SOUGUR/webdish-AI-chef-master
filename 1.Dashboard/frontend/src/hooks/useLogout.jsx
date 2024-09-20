import { useAuthContext } from './useAuthContext'
import {toast} from "react-toastify";

export const useLogout = () => {
    const { dispatch } = useAuthContext();
    
    const logout = async () => {

        const response = await fetch(`${import.meta.env.VITE_API_URL}/chef/logout`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        })

        const json = await response.json()

        localStorage.removeItem('user');
        dispatch({type: 'LOGOUT'})
        toast.success(json.message)
    }

    return { logout }
}