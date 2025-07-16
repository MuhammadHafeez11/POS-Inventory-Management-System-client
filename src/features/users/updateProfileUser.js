import { useEffect, useState } from "react"
import MetaData from "../../MetaData"
import PageLoader from "../../Components/Loader/PageLoader"
import { useNavigate } from "react-router-dom"
import userchecked from "./icon48.png"
import { useTranslation } from "react-i18next"
import swal from "sweetalert2"
import { Button } from "semantic-ui-react"
import UpdateIcon from "@mui/icons-material/Update"
import { getOneUserByUserName, getVerifiedUserMessage, updateUserPassword } from "../../actions/userAction"
// import "./updateProfileUser.css"

const UpdateProfileUser = () => {
  //useState for update user Profile
  const [error, seterror] = useState("")
  const [isCalled, setIsCalled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [confirmPasswordBool, setConfirmPasswordBool] = useState(false)

  const [username, setUsername] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [userConfirmPassword, setUserConfirmPassword] = useState("")
  const [userOldPassword, setUserOldPassword] = useState("")
  const [colorTheme, setColorTheme] = useState("theme-white")
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    setUserPassword("")
    setUserOldPassword("")
    setConfirmPasswordBool(false)
    isCalled && getUserByUserName()
  }, [isCalled])

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color")
    if (currentThemeColor) {
      setColorTheme(currentThemeColor)
      document.body.className = currentThemeColor
    }
  }, [colorTheme])

  const getUserByUserName = async () => {
    const result = await getOneUserByUserName(JSON.parse(localStorage.getItem("username")))
    setIsCalled(false)
    setIsLoading(true) // to wait for the data to load before loading the page
    setUsername(result?.username)
  }

  //check that user has written old password right or not
  const handleverifiedOldPassword = async () => {
    if (!username || !userOldPassword) {
      return swal.fire({
        icon: "error",
        title: t("titleError"),
        text: t("textEnterOldPassword"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup",
        },
      })
    } else {
      seterror("")
      const result = await getVerifiedUserMessage(username, userOldPassword)
      result?.message === "Unauthorized" ? seterror("Invalid Password") : setIsVerified(true)
    }
  }

  //to sbmit the new password
  const handleSubmit = async () => {
    if (!userPassword) {
      return swal.fire({
        icon: "error",
        title: t("titleError"),
        text: t("textNewPassword"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup",
        },
      })
    } else if (confirmPasswordBool === false) {
      return swal.fire({
        icon: "error",
        title: t("titleError"),
        text: t("textPasswordNotMatched"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup",
        },
      })
    } else {
      const result = await updateUserPassword(username, userPassword)
      if (result?.message === "Password updated") {
        swal
          .fire({
            icon: "success",
            title: t("titleAdded"),
            text: `${username} ${t("textPasswordUpdatedSuccessfully")}`,
            showConfirmButton: true,
            customClass: {
              popup: "custom-swal-popup",
            },
          })
          .then(() => {
            // navigate("/");
          })
      } else {
        return swal.fire({
          icon: "error",
          title: t("titleError"),
          text: t("textErrorUpdatingPassword"),
          showConfirmButton: true,
          customClass: {
            popup: "custom-swal-popup",
          },
        })
      }
    }
  }

  return (
    <>
      <MetaData title="QE ~~UpdateProfile" />
      <div className="settingSecondContainer">
        <div className={`User ${colorTheme}`}>
          <div className="profileSecondContainer">
            {isLoading ? (
              <div className="form">
                <div className="formRow">
                  <div className="inputSection">
                    {error && <label htmlFor="error">{error}</label>}
                    <label>{t("currentPassword")}</label>
                    <input
                      type="password"
                      placeholder={t("enterCurrentPassword")}
                      name="currentPassword"
                      autoComplete="off"
                      maxLength="40"
                      disabled={isVerified}
                      value={userOldPassword}
                      onChange={(e) => {
                        setUserOldPassword(e.target.value)
                        seterror("")
                      }}
                    />
                  </div>
                  {isVerified && (
                    <button className="button-back" disabled>
                      <img src={userchecked || "/placeholder.svg"} alt="Verified" />
                    </button>
                  )}
                </div>

                {isVerified && (
                  <>
                    <div className="formRow">
                      <div className="inputSection">
                        <label>{t("newPassword")}</label>
                        <input
                          type="password"
                          placeholder={t("enterNewPassword")}
                          name="newPassword"
                          autoComplete="off"
                          maxLength="40"
                          required
                          value={userPassword}
                          onChange={(e) => setUserPassword(e.target.value)}
                        />
                      </div>
                      <div className="inputSection">
                        <label>{t("Confirm Password")}</label>
                        <input
                          type="password"
                          placeholder={t("Please Confirm your Password")}
                          name="confirmPassword"
                          autoComplete="off"
                          maxLength="40"
                          required
                          value={userConfirmPassword}
                          onChange={(e) => {
                            setUserConfirmPassword(e.target.value)
                            if (userPassword === e.target.value) {
                              setConfirmPasswordBool(true)
                            } else {
                              setConfirmPasswordBool(false)
                            }
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="buttonRow">
                  {!isVerified && (
                    <button className="button-back" onClick={handleverifiedOldPassword}>
                      {t("verify")}
                    </button>
                  )}
                  <Button
                    onClick={handleSubmit}
                    type="button"
                    disabled={!confirmPasswordBool}
                    className="button-add-product"
                    floated="right"
                  >
                    {t("updatePassword")}&nbsp;&nbsp;
                    <UpdateIcon />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="formInput">
                <PageLoader />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default UpdateProfileUser;