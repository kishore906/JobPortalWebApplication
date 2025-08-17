import { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../features/api/authApi";
import { setLogoutUser } from "../features/slice/userSlice";

export function useLogout() {
  const [logout, { isSuccess, error, data }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      console.log(error);
    }

    if (isSuccess) {
      toast.success(data.message);
      dispatch(setLogoutUser());
      navigate("/");
    }
  }, [error, isSuccess, data, navigate, dispatch]);

  return { logout };
}
