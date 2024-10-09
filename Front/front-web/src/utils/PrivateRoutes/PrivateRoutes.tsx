import { useCookies } from "react-cookie";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const [cookies] = useCookies();

  return !cookies?.user?.access_token ? <Navigate to="/login" /> : <Outlet />;
};

export default PrivateRoutes;
