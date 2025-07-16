import React, { useContext, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { Statee } from "./context/stateContext";
import {
  Loader,
} from "semantic-ui-react";
import TableComponentId from "../../../Components/tableComponent/tableComponentId";
import { useTranslation } from "react-i18next";
import swal from "sweetalert2";
import { deleteTempSaleItemList, getTemppSale } from "../../../actions/tempSaleAction";
import { useDispatch } from "react-redux";
export default function TableForm() {
  const [Deleteid, setDeleteid] = useState();
  const action2 = "delete";
  const action4 = "salePage";
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { list, setList, total, showModaal, barLoader, fetchingListData } =
  useContext(Statee);
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
        setList(list?.filter((row) => row.id !== id));
        const result = list.find((item) => item.id === id);
        dispatch(deleteTempSaleItemList(id));
        dispatch(getTemppSale());

      }
    });
    // setDeleteid(id);
    // console.warn(showModaal);
    // console.log(id);
  };

  const columns = [
    { field: "Code", label: t("code") },
    { field: "Namee", label: t("name") },
    { field: "color", label: t("color") },
    { field: "Company", label: t("company") },
    // { field: "purchaseInvoicePrice", label: t("Purchase Invoice Price") },
    { field: "excludeTaxPrice", label: t("mrp") },
    { field: "PurchaseQuantity", label: t("quantity") },
    { field: "totalAmounnt", label: t("Total") },
    { field: "Discount", label: t("discount") },
    { field: "taxAmount", label: t("Tax") },
    { field: "amount", label: t("Due Amount") },
  ];
  const columns1 = [
    { field: "Code", label: t("code") },
    { field: "Namee", label: t("name") },
    { field: "color", label: t("color") },
    { field: "Company", label: t("company") },
    // { field: "purchaseInvoicePrice", label: t("Purchase Invoice Price") },
    { field: "excludeTaxPrice", label: t("mrp") },
    { field: "PurchaseQuantity", label: t("quantity") },
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
        {!fetchingListData ? (
          <>
           {JSON.parse(localStorage.getItem("SoftwareWithFBR")) ? (<TableComponentId
              data={list}
              columns={columns}
              actions={actions}
              action2={action2}
              action4={action4}
            />) :(<TableComponentId
              data={list}
              columns={columns1}
              actions={actions}
              action2={action2}
              action4={action4}
            />)}
            
            {/* {showModaal && <DeleteModal id={Deleteid} />} */}
          </>
        ) : (
          <Loader active style={{ position: "relative", marginTop: "30px" }}>
            Loading
          </Loader>
        )}
     <div className="grandTotal">
        {
          list?.length > 0 && (<><h2> Due Amount. {total.toLocaleString()}</h2></>)
        }</div>
      
    </>
  );
}
