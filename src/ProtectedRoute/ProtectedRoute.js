import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Navigate,useNavigate, useLocation } from "react-router-dom";
import swal from "sweetalert2";
import { useTranslation, initReactI18next } from "react-i18next";
import { loadUser, refreshTokken } from "../actions/userAction";
import { useAnimate } from "framer-motion";
import  Concept  from "../Components/Side_NavBar/Concept";
const ProtectedRoute = React.memo(({ component: Component, allowedRoles }) => {
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useSelector(state => state.user);
  const navigate = useNavigate()
  const userRoles = user?.user?.roles?.roleName;
  const isAuthorized = isAuthenticated && allowedRoles.includes(userRoles);
  const location = useLocation();

  useEffect(() => {
    getToken()
  }, [Component]);
  const getToken = async () => {
    const token = await refreshTokken();
    if (token?.data === "Please login to acces this resource") {
        localStorage.clear()
        dispatch(loadUser())
        navigate('/login')
        console.log('hdfil')
        return <Concept />
        // return <Navigate to="/login" replace />;
    }
  };
  return <Component />;
});

export default ProtectedRoute;
