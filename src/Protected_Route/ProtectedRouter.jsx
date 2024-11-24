import { Outlet } from 'react-router-dom';
import AuthContext from '../Context/auth_context';
import { useContext } from 'react';


export default function ProtectedRoutes() {
    const {cookies} =  useContext(AuthContext);
    return cookies.token ? <Outlet /> : <h1>You are not Authorized to View</h1>
}