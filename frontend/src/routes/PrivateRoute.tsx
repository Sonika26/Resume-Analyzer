import {useContext}  from "react";
import { Navigate } from "react-router-dom";
import { AuthContext} from "../Context/AuthContext";
import type {ReactNode} from "react";


const PrivateRoute = ({children} :{children : ReactNode}) =>{
    const {token} =useContext(AuthContext);
    if(!token) return <Navigate to="/login" replace />
    return children;
};

export default PrivateRoute;