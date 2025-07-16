import React from "react";
import Cards from "../Cards/Cards";
// import Table from "../Table/Table";
// import "./MainDash.css";
import TransferCard from "../TransferChart/TransferChart";
import PageLoader from "../../Loader/PageLoader";
const MainDash = () => {
  return (
    <div className="MainDash">
      <Cards />
      <TransferCard />
      {/* <PageLoader /> */}
    </div>
  );
};

export default MainDash;
