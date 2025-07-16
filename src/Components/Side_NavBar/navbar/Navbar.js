import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./styles.css";
import joe from "./joe.png";
import Tooltip from '@material-ui/core/Tooltip';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import logo from "./logo.svg";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {COMPANYHEADER} from "../../../constants/companyNameContants"
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { CLEAR_DEVICE_ID, LOAD_USER_FAIL } from "../../../constants/userConstants";
import SettingsIcon from '@mui/icons-material/Settings';
import { logout } from "../../../actions/userAction";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { getSubscriptionDetails } from "../../../actions/subscriptionAction";
import swal from "sweetalert2";
export const Navbar = ({ setIsOpen }) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [subscriptionError, setSubcriptionError] = useState(false)
  const {subscriptionDetail, subscriptionDetailLoading} = useSelector((state)=> state.subscriptionDetail)
  const {loading, isAuthenticated, user} = useSelector((state)=> state.user)

const HandleLogoClick =()=>{
  navigate('/dashboard')
}

useEffect(() => {
  if (subscriptionError) {
    const timeout = setTimeout(() => {
      setSubcriptionError(false);
    }, 15000); 
    return () => clearTimeout(timeout);
  }
}, [subscriptionError]);



useEffect(()=>{
  dispatch(getSubscriptionDetails())
}, [])

useState(()=> {
  if(!subscriptionDetailLoading && subscriptionDetail?.length > 0)
  {
    setSubcriptionError(true)
  }

}, [subscriptionDetail, subscriptionDetailLoading])


const Logout = async()=>{
  swal
  .fire({
    icon: "warning",
    title: t("AreYouSureYouWantToLogout"),
    showCancelButton: true,
    confirmButtonText: t("yes"),
    cancelButtonText: t("no"),
    customClass: {
      popup: "custom-swal-popup", // This is the custom class you're adding
    },
  })
  .then(async (result) => {
    if (result.value) {
    console.log('called')

    dispatch(logout(user?.user?._id));
    dispatch({ type: LOAD_USER_FAIL });
    dispatch({ type: CLEAR_DEVICE_ID })
    // console.log('HII')
   
    
    // window.location.reload()
    navigate("/login");
    }
  })
}

useEffect(()=> {
  if(!loading && !isAuthenticated)
  {  localStorage.clear()
    navigate("/login");
  }
}, [loading, isAuthenticated])

const handleSubscription = () =>
{
  setSubcriptionError(false)
}

const settings = async() =>{
  navigate("/settings")
}
 return(
  <>
  <nav className="navbar">
    <button
      onClick={() => setIsOpen(true)}
      className="burger material-symbols-outlined"
    >
          <MenuIcon className="svgClass"/>
    </button>
    <div className="logo" onClick={HandleLogoClick}>
      {/* <img src={logo} alt="Logo" /> */}
      <CatchingPokemonIcon className='svgClass'/>
        <p>{COMPANYHEADER}</p>
    </div>
    <div className="center">
    </div>
    <nav className="secondNav">
    
    <button className="material-symbols-outlined"><LiaFileInvoiceDollarSolid className='svgClass'/></button>
    <button className="material-symbols-outlined"><LiaFileInvoiceDollarSolid className='svgClass'/></button>
    <p>{JSON.parse(localStorage.getItem("name"))}</p>
    {/* <button className="material-symbols-outlined"><LiaFileInvoiceDollarSolid /></button> */}
    <button className="material-symbols-outlined">
      <span className="badge">9+</span>  <NotificationsNoneIcon className='svgClass'/>
    </button>
    <Tooltip title="Profile" arrow>
    <button className="material-symbols-outlined">
    {/* <img src={joe} alt="Joe" /> */}
    <AccountCircleIcon  className="svgClass"/>
    </button>
    </Tooltip>
    <Tooltip title="Settings" arrow><button className="material-symbols-outlined" onClick={settings}><SettingsIcon className='svgClass'/></button></Tooltip>
    <Tooltip title="Logout" arrow><button className="material-symbols-outlined" onClick={Logout}><LogoutIcon className='svgClass'/></button></Tooltip>
   

  </nav>
  </nav>
  {/* {
    subscriptionError && ( 
      <div className="slider">
      <div className="slide-track">
        <div className="slide">{subscriptionDetail[0]?.expirationDays}</div>
        <div className="slide">{subscriptionDetail[0]?.expirationDays}</div>
        <div className="slide">{subscriptionDetail[0]?.expirationDays}</div>
        <div className="slide">{subscriptionDetail[0]?.expirationDays}</div>
      </div>
    </div>
    )
  } */}

{subscriptionError && (
  <div className="subscription-banner">
    <div className="subscription-content">
      <p>
        <strong>{subscriptionDetail[0]?.expirationDays}</strong> 
      </p>
      <HighlightOffIcon className="close-icon" onClick={handleSubscription} />
    </div>
  </div>
)}
  {/* {
    subscriptionError && (
      <div className={`SubcriptionAlert ${subscriptionError ? 'show' : ''}`}>
      <div className="SubcriptionAlertSecond">
        <p>{subscriptionDetail[0]?.expirationDays}</p>
        <HighlightOffIcon onClick={handleSubscription}/>
        </div>
    </div>
    )
  } */}
 
  </>
 )
    }