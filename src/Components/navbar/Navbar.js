import "./styles.css";
import joe from "./joe.png";
import logo from "./logo.svg";
import { useState } from "react";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import { FaUserTie } from "react-icons/fa";
import { SiExpensify, SiChakraui } from "react-icons/si";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
export const Navbar = ({ setIsOpen }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <nav className="navbar">
      {/* <button
        onClick={() => setIsOpen(true)}
        className="burger material-symbols-outlined"
      >
        menu
      </button> */}
      <div className="logo">
        <CatchingPokemonIcon />
        <p>Qureshi Electronics</p>
        {/* <img src={logo} alt="Logo" /> */}
      </div>
      <div className="center">
        {/* <div className="search">
          <input
            type="text"
            className="search"
            id="search"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button className="material-symbols-outlined">search</button>
        </div>
        <button className="material-symbols-outlined">mic</button> */}
      </div>
      <nav className="secondNav">
    
        <button className="material-symbols-outlined"><LiaFileInvoiceDollarSolid /></button>
        <button className="material-symbols-outlined"><LiaFileInvoiceDollarSolid /></button>
        <p>WelCome</p>
        {/* <button className="material-symbols-outlined"><LiaFileInvoiceDollarSolid /></button> */}
        <button className="material-symbols-outlined">
          <span className="badge">9+</span>  <NotificationsNoneIcon />
        </button>
        <button className="material-symbols-outlined">
        <img src={joe} alt="Joe" />
        </button>
     
      </nav>
    </nav>
  );
};
