import React, { useEffect, useState } from "react";
import { Container, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
// import { getPermissionForRoles } from "../Pages/user/rolesAssigned/RolesPermissionValidation";
import { getPermissionForRoles } from "../../user/rolesAssigned/RolesPermissionValidation";

import SalesData from "./Data";

const Salerecord = () => {
  const [viewTransferInvoicesPermission, setViewTransferInvoicesPermission] =
    useState(false);

  useEffect(() => {
    setViewTransferInvoicesPermission(false);
    getPermission();
  }, []);
  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles(
        "View Transfer Invoice"
      );
      setViewTransferInvoicesPermission(permissionForAdd);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  return (
  <>
      {viewTransferInvoicesPermission && (
        <>
          <SalesData />
          <br />
        </>
      )}
</>
  );
};

export default Salerecord;
