import { FC, ReactNode, useEffect, useState } from "react";
import { getCurrentUser, GetCurrentUserOutput } from "@aws-amplify/auth";
import { Navigate } from "react-router";

const PrivateRoute: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<GetCurrentUserOutput | null>(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        getCurrentUser()
            .then((data) => {
                setUser(data);
                setLoading(false); 
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Cargando...</div>; 

    if (user === null) return <Navigate to="/" />; 

    return <>{children}</>;
};

export default PrivateRoute;