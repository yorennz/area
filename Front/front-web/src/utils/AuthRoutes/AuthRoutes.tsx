import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { StatusCodes } from "http-status-codes";

const AuthRoutes = () => {
    const navigate = useNavigate();
    const [cookies] = useCookies();

    const checkToken = async () => {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/user/me`,
                {
                    headers: {
                        Authorization: `Bearer ${cookies?.user?.access_token}`,
                    },
                }
            );
            if (response.status === StatusCodes.OK) {
                navigate("/areas");
            }
        } catch (error) {}
    };

    useEffect(() => {
        checkToken();
    }, []);

    return <Outlet />;
};

export default AuthRoutes;
