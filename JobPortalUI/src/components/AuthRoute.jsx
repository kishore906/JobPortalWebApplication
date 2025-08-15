import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRoute = ({ children, role }) => {
  const { user, isAuthenticated } = useSelector((state) => state.authResult);

  // Not logged In -> go to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Role check - if provided and doesn't match go to "/"
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  // everything satisfies -> render protected content
  return children ? children : <Outlet />;
};

export default AuthRoute;
