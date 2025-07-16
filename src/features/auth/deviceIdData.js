import { v4 as uuidv4 } from 'uuid'; // Use uuid library to generate unique IDs
// import { useNavigate } from 'react-router-dom';
import { QURESHI_ELECTRONICS, QURESHI_ELECTRONICSWithFBR, QURESHI_ELECTRONICSWithOUTFBR } from '../../constants/companyNameContants';

// Generate or fetch deviceId from localStorage
export const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = uuidv4(); // Generate new if not present
    localStorage.setItem('deviceId', deviceId); // Store it
  }
  return deviceId;
};


export const loginData =(data) =>{
  // const navigate = useNavigate()
  let isAdministrator = data?.user?.roles.roleName === "Administrator";
  let isSuperAdmin = data?.user?.roles?.roleName === "superAdmin";
  let isAdmin = data?.user?.roles?.roleName === "Admin";
  let isSalesman = data?.user?.roles?.roleName === "Salesman";
  let isStockManager = data?.user?.roles?.roleName === "Stock Manager";
  let username = data?.user?.username;
  let name = data?.user?.name;
  let status = data?.user?.active;
  let address = data?.user?.shopNo?.storageAddress;
  let shopNo = data?.user?.shopNo?.shopCode;
  let godownNo = data?.godowns;
  let posId = data?.user?.posId;
  let phoneNo = data?.user?.shopNo?.storagePhoneNo;
  let isLoggedIn = true;
  localStorage.setItem("SoftwareWithFBR",JSON.stringify(QURESHI_ELECTRONICS) === JSON.stringify(QURESHI_ELECTRONICSWithFBR))
  localStorage.setItem("SoftwareWithoutFBR",JSON.stringify(QURESHI_ELECTRONICS) ===  JSON.stringify(QURESHI_ELECTRONICSWithOUTFBR))
  localStorage.setItem(
    "roles",
    JSON.stringify(data?.user?.roles.roleName)
  );
  localStorage.setItem(
    "userRoleId",
    JSON.stringify(data?.user?.roles._id)
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
  localStorage.setItem("token", JSON.stringify(data?.token) )
   
  console.log('calledi')
  if (JSON.parse(localStorage.getItem("loggedIn"))) {
    // loadingAlert.close();
    // navigate("/dashboard");
    const navigate = true
    return navigate
  }
}