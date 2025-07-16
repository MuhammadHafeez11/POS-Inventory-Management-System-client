import { Sidebar } from "./sidebar/Sidebar";
import { Navbar } from "./navbar/Navbar";
import { useEffect, useState, useRef  } from "react";
import { getOnlyAssignedTaskByRole } from "../../actions/assignTaskAction";
import { useSelector, useDispatch } from "react-redux";
const Concept = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [permissions, setPermissions] = useState("");
  const userName = JSON.parse(localStorage.getItem("username"));
  const [loggedIn, setLoggedIn] = useState(false)
  const { isAuthenticated, loading, user, error } = useSelector((state) => state.user)
  const sidebarRef = useRef(null);
  useEffect(() => {
    console.log("Hello");
    getRole();
    console.log("Hello2");
  }, [isAuthenticated, JSON.parse(localStorage.getItem("userRoleId"))]);

  const getRole = async () => {
    if(user?.user)
    {
      const permission = await getOnlyAssignedTaskByRole(
        user?.user?.roles?._id
        // JSON.parse(localStorage.getItem("userRoleId"))
      );
      console.log(permission)
      console.log(permission?.data?.taskNamesArray);
      setPermissions(permission?.data?.taskNamesArray);
    }
    
  };
  const closeSidebar = (e) => {
    if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', closeSidebar); // Listen for mousemove events
    return () => document.removeEventListener('mousemove', closeSidebar);
  }, [isOpen]); // Only listen when the sidebar is open

  return (
    <>
    {

      !loading && isAuthenticated  ? ( <>
      <div
      // ref={overlayRef}
      onClick={() => setIsOpen(!isOpen)}
        // onFocusCapture={()=> setIsOpen(false)}
        className={`overlay ${isOpen ? "open" : ""}`}
      />
      <Navbar setIsOpen={setIsOpen} />
      <Sidebar setIsOpen={setIsOpen} isOpen={isOpen} props={{
        userName: userName,
        permissions: permissions,
      }}/></>) : (<> 
       </>)
    }
     
    </>
  );
};

export default Concept;