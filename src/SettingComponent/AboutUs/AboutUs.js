import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { LASTUPDATED, VERSION } from "../../constants/companyNameContants"
import { getSubscriptionDateDetails } from "../../actions/subscriptionAction"
import { FaInfoCircle, FaCalendarAlt, FaCode } from "react-icons/fa"
// import "./aboutUs.css"

const AboutUs = () => {
  const dispatch = useDispatch()
  const [colorTheme, setColorTheme] = useState("theme-white")
  const { subscriptionDateDetail, subscriptionDateDetailLoading } = useSelector((state) => state.subscriptionDateDetail)

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color")
    if (currentThemeColor) {
      setColorTheme(currentThemeColor)
      document.body.style.backgroundColor = currentThemeColor
    }
  }, [])

  useEffect(() => {
    dispatch(getSubscriptionDateDetails())
  }, [dispatch])

  return (
    <div className={`settingSecondContainer ${colorTheme}`}>
      <div className="about-us-content">
        <h1 className="about-us-title">About Softwise Solutions</h1>

        <div className="about-us-info-grid">
          <div className="about-us-info-item">
            <FaCode className="about-us-icon" />
            <h3>Current Version</h3>
            <p>{VERSION}</p>
          </div>

          <div className="about-us-info-item">
            <FaCalendarAlt className="about-us-icon" />
            <h3>Last Updated</h3>
            <p>
              {LASTUPDATED}
            </p>
          </div>
        </div>

        <div className="about-us-description">
          <FaInfoCircle className="about-us-icon" />
          <p>
            Welcome to Softwise Solutions, where technology meets innovation. We are a leading provider of cutting-edge
            software solutions, dedicated to transforming your business challenges into opportunities for growth. Our
            team of expert developers and visionary strategists work tirelessly to deliver tailored solutions that drive
            efficiency, enhance productivity, and propel your business forward in the digital age.
          </p>
        </div>

        {/* <div className="about-us-mission">
          <h2>Our Mission</h2>
          <p>
            At Softwise Solutions, our mission is to empower businesses through innovative technology. We strive to
            create software that not only meets the current needs of our clients but anticipates future challenges,
            ensuring long-term success and sustainability in an ever-evolving digital landscape.
          </p>
        </div> */}
      </div>
    </div>
  )
}

export default AboutUs;