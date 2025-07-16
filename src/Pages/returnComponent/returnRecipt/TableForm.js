import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
// import { Statee } from "./context/stateContext";
import { ReturnState } from "../context/ContextReturn";
import {
  Loader,
} from "semantic-ui-react";
import TableComponentId from "../../../Components/tableComponent/tableComponentId";
import { useTranslation } from "react-i18next";
export default function TableForm() {
  const [Deleteid, setDeleteid] = useState();
  const action2 = "delete";
  const action4 = "salePage";

  const { products, setProducts,total } = useContext(ReturnState);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const handleDelete = (id) => {
    swal
      .fire({
        icon: "warning",
        title: t("titleAreYouSure"),
        text: t("textDeleteItem"),
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      })
      .then((result) => {
        if (result.isConfirmed) {
          const updatedItems = [...products];
          updatedItems.splice(id, 1);
          setProducts(updatedItems);
        }
      });
  };

  useEffect(()=>{
    console.log(products)
  }, [products,total]);
  const columns = [
    { field: "Code", label: t("code") },
    { field: "name", label: t("name") },
    { field: "color", label: t("color") },
    { field: "Company", label: t("company") },
    { field: "excludeTaxPrice", label: t("mrp") },
    { field: "returnQuantity", label: t("quantity") },
    { field: "totalAmounnt", label: t("Total") },
    { field: "Discount", label: t("discount") },
    { field: "taxAmount", label: t("Tax") },
    { field: "amount", label: t("Due Amount") },
  ];
  const columns1 = [
    { field: "Code", label: t("code") },
    { field: "name", label: t("name") },
    { field: "color", label: t("color") },
    { field: "Company", label: t("company") },
    { field: "excludeTaxPrice", label: t("mrp") },
    { field: "returnQuantity", label: t("quantity") },
    { field: "totalAmounnt", label: t("Total") },
    { field: "Discount", label: t("discount") },
    { field: "amount", label: t("Due Amount") },
  ];
  const actions = [
    {
      label: "dlete",
      color: "green",
      handler: (itemId) => handleDelete(itemId),
      url: null,
    },
  ];
  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
        {products?.length > 0 ? (
          <>
           {JSON.parse(localStorage.getItem("SoftwareWithFBR")) ? (<TableComponentId
              data={products}
              columns={columns}
              actions={actions}
              action2={action2}
              action4={action4}
            />) :(<TableComponentId
              data={products}
              columns={columns}
              actions={actions}
              action2={action2}
              action4={action4}
            />)}
            
          </>
        ) : (<></>
        )}
     <div className="grandTotal">
        {
          products?.length > 0 && (<><h2> Due Amount. {total?.toLocaleString()}</h2></>)
        }</div>
      
    </>
  );
}
