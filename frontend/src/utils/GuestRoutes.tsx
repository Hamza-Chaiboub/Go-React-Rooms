import { Outlet, Navigate } from "react-router-dom"
import { useProtectedRoutes } from "../hooks/useProtectedRoutes";

interface GuestRoutesProps {
    redirectTo? : string;
}

const GuestRoutes = ({ redirectTo = "/dashboard" } : GuestRoutesProps) => {    
    const [user, isLoading] = useProtectedRoutes()

    if (isLoading) {
        return <div>Loading ...</div>
    }
    
    return user ?<Navigate to={redirectTo} /> : <Outlet/> ;
}

export default GuestRoutes