import { Navigate, Outlet, useLocation } from "react-router-dom";
import useTokenStore from "../store/TokenStore";

const PrivateRoutes = () => {
  const tokenResponse = useTokenStore((s) => s.tokenResponse);
  const location = useLocation();

  if (!tokenResponse.token || tokenResponse.userId === 0) {
    return (
      <Navigate
        to="/login"
        state={{ destino: location.pathname }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default PrivateRoutes;
