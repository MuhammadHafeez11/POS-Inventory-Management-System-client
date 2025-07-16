import { useRef, useState, useEffect } from "react";
import { useNavigate, Link, json } from "react-router-dom";
import swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { login, loginUser, refreshTokken } from "../../actions/userAction";
import usePersist from "../../hooks/usePersist";
import BusinessIcon from "@mui/icons-material/Business"
import LoginPageImage from "./LoginPageImage.jpg"
import FBRLogo from "./fbr-pakistan-logo-png.png"
import companyLogo from "./companyLogo.png"
import logo from './logo.png'
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PageLoader from "../../Components/Loader/PageLoader"
import MetaData from "../../MetaData"
import { COMPANY_SHORT, COMPANY_FULL, COMPANY_TAGLINE, COMPANYHEADER, QURESHI_ELECTRONICS, QURESHI_ELECTRONICSWithFBR, QURESHI_ELECTRONICSWithOUTFBR, QURESHI_ELECTRONICS_WITH_FBR } from "../../constants/companyNameContants";
import  Concept  from "../../Components/Side_NavBar/Concept";
import { getDeviceId, loginData } from "./deviceIdData";
const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loginAgain, setLoginAgain] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [unAllowedRoles, setUnAllowedRoles] = useState(false)
  const [tooManyAttempts, setTooManyAttempts] = useState(false)
  const [rolesMessage, setRolesMessage] = useState()
  const [persist, setPersist] = usePersist();
  const [buttonLoading, setButtonLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user, isAuthenticated, error } = useSelector((state) => state.user);

  // useEffect(() => {
  //   userRef.current.focus();
  // }, []);

  useEffect(()=>{
    if(!isAuthenticated && error?.data === "Your Subscription Has Been Ended Please Contact With Softwise Sol Team")
    {
      swal.fire({
        icon: "error",
        // title: t("titleError"),
        text: error?.data,
        showConfirmButton: false,
        timer: 5000,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }
    if(!isAuthenticated && error?.data?.message === "Unauthorized"){
      setUnauthorized(true)
      
    }
  }, [error, isAuthenticated])

  useEffect(()=>{
    console.log('force', user)
    if(isAuthenticated && user?.success)
    {
      let userID = user?.user?._id
      let isAdministrator = user?.user?.roles.roleName === "Administrator";
      let isSuperAdmin = user?.user?.roles?.roleName === "superAdmin";
      let isAdmin = user?.user?.roles?.roleName === "Admin";
      let isSalesman = user?.user?.roles?.roleName === "Salesman";
      let isStockManager = user?.user?.roles?.roleName === "Stock Manager";
      let username = user?.user?.username;
      let name = user?.user?.name;
      let status = user?.user?.active;
      let address = user?.user?.shopNo?.storageAddress;
      let shopNo = user?.user?.shopNo?.shopCode;
      let godownNo = user?.godowns;
      let posId = user?.user?.posId;
      let phoneNo = user?.user?.shopNo?.storagePhoneNo;
      let isLoggedIn = true;
      localStorage.setItem("SoftwareWithFBR",JSON.stringify(QURESHI_ELECTRONICS) === JSON.stringify(QURESHI_ELECTRONICSWithFBR))
      localStorage.setItem("SoftwareWithoutFBR",JSON.stringify(QURESHI_ELECTRONICS) ===  JSON.stringify(QURESHI_ELECTRONICSWithOUTFBR))
     
      localStorage.setItem("userId", JSON?.stringify(userID));
      localStorage.setItem(
        "roles",
        JSON.stringify(user?.user?.roles.roleName)
      );
      localStorage.setItem(
        "userRoleId",
        JSON.stringify(user?.user?.roles._id)
      );
      localStorage.setItem(
        "isAdministrator",
        JSON?.stringify(isAdministrator)
      );
      localStorage.setItem("loggedIn", JSON?.stringify(isLoggedIn))
      localStorage.setItem("isSuperAdmin", JSON?.stringify(isSuperAdmin));
      localStorage.setItem("isStockManager", JSON?.stringify(isStockManager));
      localStorage.setItem("isAdmin", JSON?.stringify(isAdmin));
      localStorage.setItem("isSalesman", JSON?.stringify(isSalesman));
      localStorage.setItem("username", JSON?.stringify(username));
      localStorage.setItem("name", JSON?.stringify(name));
      localStorage.setItem("status", JSON?.stringify(status));
      localStorage.setItem("shopId", JSON?.stringify(shopNo));
      localStorage.setItem("godownId", JSON?.stringify(godownNo));
      localStorage.setItem("posId", JSON.stringify(posId));
      localStorage.setItem("address", JSON?.stringify(address));
      localStorage.setItem("phoneNo", JSON?.stringify(phoneNo));
      localStorage.setItem("theme-color", "theme-blue");
      localStorage.setItem("token", JSON.stringify(user?.token) )
       
      console.log('calledi')
      if (JSON.parse(localStorage.getItem("loggedIn"))) 
        {
          navigate("/dashboard");
        }
      // const res = await loginData(user)
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const token = await refreshTokken();
    console.log(token);
    if (token?.data === "Please login to acces this resource") {
     return content
    }
  };

  const handleForgotPassword = async (e) => {
    navigate("/passwordForgot");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let loadingAlert = null;
    try {
      console.log("chie");
      console.log(username, password)
      const deviceId = getDeviceId(); // Get the deviceId
      dispatch(loginUser(username, password, deviceId));
      let data = await login(username, password, deviceId);
    
      console.log(data);
      if(data?.message === "Already logged in on a different device")
      {
        swal.fire({
          icon: "error",
          title: data?.message,
          text: data?.prompt,
          showCancelButton: true,
          confirmButtonText: t("Yes"),
          cancelButtonText: t("No"),
          customClass: {
            popup: "custom-swal-popup", // This is the custom class you're adding
          },
        }).then(async(result) =>{
          if(result?.value)
          {
            console.log("Success")
            console.log(result?.value);
            const force = true
            dispatch(loginUser(username, password, deviceId, force));
            // const data = await login(username, password, deviceId,force)
            // console.log(data)
            // const res = await loginData(data)
            // console.log(res)
          }
        });
      }
      console.log(data)
      if (data?.success) {
        const res=await loginData(data)
        console.log(res)
        if(res)
        {
          navigate("/dashboard")
        }
        // let isAdministrator = data?.user?.roles.roleName === "Administrator";
        // let isSuperAdmin = data?.user?.roles?.roleName === "superAdmin";
        // let isAdmin = data?.user?.roles?.roleName === "Admin";
        // let isSalesman = data?.user?.roles?.roleName === "Salesman";
        // let isStockManager = data?.user?.roles?.roleName === "Stock Manager";
        // let username = data?.user?.username;
        // let name = data?.user?.name;
        // let status = data?.user?.active;
        // let address = data?.user?.shopNo?.storageAddress;
        // let shopNo = data?.user?.shopNo?.shopCode;
        // let godownNo = data?.godowns;
        // let posId = data?.user?.posId;
        // let phoneNo = data?.user?.shopNo?.storagePhoneNo;
        // let isLoggedIn = true;
        // localStorage.setItem("SoftwareWithFBR",JSON.stringify(QURESHI_ELECTRONICS) === JSON.stringify(QURESHI_ELECTRONICSWithFBR))
        // localStorage.setItem("SoftwareWithoutFBR",JSON.stringify(QURESHI_ELECTRONICS) ===  JSON.stringify(QURESHI_ELECTRONICSWithOUTFBR))
        // localStorage.setItem(
        //   "roles",
        //   JSON.stringify(data?.user?.roles.roleName)
        // );
        // localStorage.setItem(
        //   "userRoleId",
        //   JSON.stringify(data?.user?.roles._id)
        // );
        // localStorage.setItem(
        //   "isAdministrator",
        //   JSON?.stringify(isAdministrator)
        // );
        // localStorage.setItem("loggedIn", JSON?.stringify(isLoggedIn))
        // localStorage.setItem("isSuperAdmin", JSON?.stringify(isSuperAdmin));
        // localStorage.setItem("isStockManager", JSON?.stringify(isStockManager));
        // localStorage.setItem("isAdmin", JSON?.stringify(isAdmin));
        // localStorage.setItem("isSalesman", JSON?.stringify(isSalesman));
        // localStorage.setItem("username", JSON?.stringify(username));
        // localStorage.setItem("name", JSON?.stringify(name));
        // localStorage.setItem("status", JSON?.stringify(status));
        // localStorage.setItem("shopId", JSON?.stringify(shopNo));
        // localStorage.setItem("godownId", JSON?.stringify(godownNo));
        // localStorage.setItem("posId", JSON.stringify(posId));
        // localStorage.setItem("address", JSON?.stringify(address));
        // localStorage.setItem("phoneNo", JSON?.stringify(phoneNo));
        // localStorage.setItem("theme-color", "theme-blue");
        // localStorage.setItem("token", JSON.stringify(data?.token) )
         
        // console.log('calledi')
        // if (JSON.parse(localStorage.getItem("loggedIn"))) {
        //   // loadingAlert.close();
        //   navigate("/dashboard");
        // }
      }
      else 
      if(data === "You Subscription Has Been Ended Please Contact With Softwise Sol Team")
      { 
        console.log()
        // loadingAlert.close();
       
      }else if(data?.message === "Unauthorized"){
        console.log('fei')
        loadingAlert.close();
        setUnauthorized(true)
        setTooManyAttempts(false)
      }
      else if(data?.message === "Too many login attempts from this IP, please try again after a 60 second pause")
      {
        setUnauthorized(false)
        // loadingAlert.close();
        setTooManyAttempts(true)
      }
    
    } catch (err) {
      console.log(err)
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      if (loadingAlert) {
        loadingAlert.close();
      }
      // errRef?.current.focus();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleUserInput = (e) => {
    setUnAllowedRoles(false)
    setUnauthorized(false);
    setUsername(e.target.value);
  };

  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  const errClass = errMsg ? "errmsg" : "offscreen";
  const content = (
    <>
      <MetaData title={`${COMPANY_SHORT} ~~Login`} />
      <div className="qe_auth_container">
        <div className="qe_auth_glassBox">
          <div className="qe_auth_content">
            <div className="qe_auth_header">
              <BusinessIcon className="qe_auth_logo" />
              <h1 className="qe_auth_title">{COMPANYHEADER}</h1>
              <p className="qe_auth_subtitle">Sign in to access your account</p>
            </div>

            <form className="qe_auth_form" ref={userRef} onSubmit={handleSubmit}>
              {/* Error Messages */}
              {(unauthorized || tooManyAttempts || loginAgain || unAllowedRoles) && (
                <div className="qe_auth_error">
                  {unauthorized && "Invalid Username & password"}
                  {tooManyAttempts && "Too many login attempts from this IP, please try again after a 60 second pause"}
                  {loginAgain && "Please Check Your Internet Connection && Login Again"}
                  {unAllowedRoles && rolesMessage}
                </div>
              )}

              <div className="qe_auth_inputWrapper">
                <div className="qe_auth_inputGroup">
                  <MailOutlineIcon className="qe_auth_inputIcon" />
                  <input
                    type="text"
                    placeholder="Enter UserName"
                    ref={userRef}
                    value={username}
                    onChange={handleUserInput}
                    autoComplete="off"
                    required
                    className="qe_auth_input"
                  />
                  <div className="qe_auth_inputBorder"></div>
                </div>

                <div className="qe_auth_inputGroup">
                  <LockOpenIcon className="qe_auth_inputIcon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    id="password"
                    onChange={handlePwdInput}
                    value={password}
                    required
                    className="qe_auth_input"
                  />
                  <div className="qe_auth_passwordToggle" onClick={togglePasswordVisibility}>
                    {showPassword ? (
                      <VisibilityOffIcon className="qe_auth_visibilityIcon" />
                    ) : (
                      <VisibilityIcon className="qe_auth_visibilityIcon" />
                    )}
                  </div>
                  <div className="qe_auth_inputBorder"></div>
                </div>
              </div>

              <button type="submit" className="qe_auth_button">
                Login
                <span className="qe_auth_buttonGlow"></span>
              </button>

              <Link to="/passwordForgot" className="qe_auth_forgotLink">
                Forgot Password?
              </Link>
            </form>

            <div className="qe_auth_footer">
              <div className="qe_auth_company">
                <div className="qe_auth_companyText">
                  <span className="qe_auth_poweredBy">Powered by</span>
                  <img
                    src={logo}
                    alt="Qureshi Electronics"
                    className="qe_auth_companyLogo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

    const content2 = (
      <>
      <MetaData title={`${COMPANY_SHORT} ~~Login`} />
    <div className="qe_fbr_container">
    <div className="qe_fbr_imageSection">
    <div className="qe_fbr_brandingWrapper">
          <h1 className="qe_fbr_brandLogo">
            <span className="qe_fbr_brandQ">{COMPANY_SHORT.charAt(0)}</span>
            {COMPANY_FULL.split(" ")[0].substring(1)}
          </h1>
          <h2 className="qe_fbr_brandText">{COMPANY_FULL.split(" ")[1]}</h2>
          <div className="qe_fbr_brandDivider"></div>
          <p className="qe_fbr_brandTagline">{COMPANY_TAGLINE}</p>
        </div>
    </div>

    <div className="qe_fbr_loginSection">
      <div className="qe_fbr_loginWrapper">
        <div className="qe_fbr_header">
        <div className="qe_fbr_logoWrapper">
              <h1 className="qe_fbr_logo">
                <span className="qe_fbr_logoQ">{COMPANY_SHORT.charAt(0)}</span>
                {COMPANY_SHORT.substring(1)}
              </h1>
              <div className="qe_fbr_logoText">{COMPANY_FULL}</div>
            </div>
          <h2 className="qe_fbr_title">SIGN IN TO YOUR ACCOUNT</h2>
        </div>

        <form className="qe_fbr_form" ref={userRef} onSubmit={handleSubmit}>
          {/* Error Messages */}
          {(unauthorized || tooManyAttempts || loginAgain || unAllowedRoles) && (
            <div className="qe_fbr_error">
              {unauthorized && "Invalid Username & password"}
              {tooManyAttempts && "Too many login attempts from this IP, please try again after a 60 second pause"}
              {loginAgain && "Please Check Your Internet Connection && Login Again"}
              {unAllowedRoles && rolesMessage}
            </div>
          )}

          <div className="qe_fbr_inputGroup">
            <MailOutlineIcon className="qe_fbr_inputIcon" />
            <input
              type="text"
              placeholder="Enter UserName"
              value={username}
              onChange={handleUserInput}
              autoComplete="off"
              required
              className="qe_fbr_input"
            />
          </div>

          <div className="qe_fbr_inputGroup">
            <LockOpenIcon className="qe_fbr_inputIcon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              id="password"
              onChange={handlePwdInput}
              value={password}
              required
              className="qe_fbr_input"
            />
            <div className="qe_fbr_passwordToggle" onClick={togglePasswordVisibility}>
              {showPassword ? (
                <VisibilityOffIcon className="qe_fbr_visibilityIcon" />
              ) : (
                <VisibilityIcon className="qe_fbr_visibilityIcon" />
              )}
            </div>
          </div>

          <button type="submit" className="qe_fbr_button">
            Login
            <span className="qe_fbr_buttonGlow"></span>
          </button>

          <Link to="/passwordForgot" className="qe_fbr_forgotLink">
            Forgot Password?
          </Link>
        </form>

        <div className="qe_fbr_footer">
            <div className="qe_fbr_poweredBy">
              <span>Powered by</span>
              <img src={logo} alt="SoftWiseSol" className="qe_fbr_swsLogo" />
            </div>
            <div className="qe_fbr_supportedBy">
              <span>Integrated with</span>
              <img src={FBRLogo} alt="FBR" className="qe_fbr_fbrLogo" />
              {/* <strong>FBR</strong> */}
              {/* <div className="qe_fbr_fbrText">Federal Board of Revenue</div> */}
            </div>
          </div>
      </div>
    </div>
  </div>
  </>
  );


  // return !JSON.parse(localStorage.getItem("username"))
  //   ? (<>{
    return  !loading  ? (<>{(!loading && isAuthenticated && JSON.parse(localStorage.getItem("loggedIn"))  ) ? (()=>{
      <Concept />
       navigate("/dashboard")}) : (
      QURESHI_ELECTRONICS === "QURESHI_ELECTRONICS_WITH_FBR" ? (content2) :
      content )
      // )
      }
      </>) : (<
        PageLoader />)
//     }</>
//     )
//     : (() => {
//         localStorage.clear();
//         window.location.reload();
//       })();
};

export default Login