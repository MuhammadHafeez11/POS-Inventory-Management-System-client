import { useContext } from "react";
import { Statee } from "./context/stateContext";
import { useSelector } from "react-redux";
export default function Header() {
  const {
    shopAddress,
    shopPhoneNo,
  } = useContext(Statee);
  const { user } = useSelector((state) => state.user);
  return (
    <>
      {user?.user?.printerId?.printerType === "thermal" ? (
        <div className="header">
        <h1>Qureshi Electronics</h1>
        <p>Chirah Road, Karachi</p>
        <p>Phone No +92 51 457 3774</p>
      </div>
      ) : (
        <div className="headerHeading">
          <h1 className="invoiceTitle">Qureshi Electronics</h1>
          <p className="invoiceAddress">{shopAddress}</p>
          <p className="invoicePhoneNo">
            <h4>Phone No: &nbsp;{shopPhoneNo}</h4>
          </p>
        </div>
     
      )}
    </>
  );
}
