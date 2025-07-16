import React, { useContext, useState, useEffect } from "react";
export const SearchCompanyData = async (pr, companyName) => {
  console.log(pr)
  console.log(companyName)

  let Filtered= []
    Filtered = pr !== "No Record Found" && pr?.filter((company) => {
      //Filter by Products

      if (
        companyName &&
        !company?.companyName?.toString()?.toLowerCase()
          .includes(companyName?.toString()?.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  
  console.log(Filtered)
  return Filtered;
};


export const SearchPCTCodeDescriptionData = async (pr, pctDescription) => {
  console.log(pr)
  console.log(pctDescription)

  let Filtered= []
    Filtered = pr !== "No Record Found" && pr?.filter((description) => {
      //Filter by Products

      if (
        pctDescription &&
        !description?.pctDescription?.toString()?.toLowerCase()
          .includes(pctDescription?.toString()?.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  
  console.log(Filtered)
  return Filtered;
};
