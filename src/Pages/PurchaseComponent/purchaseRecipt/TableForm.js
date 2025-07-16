import React, { useContext, useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Link, Navigate } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DeleteModal from "./DeleteModal";
import swal from "sweetalert2";
import { State } from "./context/stateContext";
import {
  Button,
  Form,
  Select,
  Modal,
  Message,
  Loader,
} from "semantic-ui-react";
import TableComponentId from "../../../Components/tableComponent/tableComponentId";
import { useTranslation } from "react-i18next";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useDispatch } from "react-redux";
import { deleteTempPurchaseItem } from "../../../actions/tempPurchaseAction";
export default function TableForm() {
  const [Deleteid, setDeleteid] = useState();
  const { t } = useTranslation();
  const {
    setListpurchase,
    listpurchase,
    total,
    isEditing,
    showModal,
    fetchingListData,
    setFetchingListData,
    abc,
    setAbc,
  } = useContext(State);
  
  const dispatch = useDispatch()
  const action2 = "delete";
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
        setListpurchase(listpurchase?.filter((row) => row.id !== id));
        const result = listpurchase.find((item) => item.id === id);
        dispatch(deleteTempPurchaseItem(id));
      }
    });
    // // console.warn("hiiii");
    // setDeleteid(id);

    // // console.log(id);
  };


  useEffect(() => {
    console.log(listpurchase);
  }, [abc]);

  const columns = [
    { field: "Code", label: t("code") },
    { field: "Color", label: t("color") },   
    { field: "invoicePrice", label: "Invoice Price" },
    { field: "expense", label: "Expenses" },
    { field: "discountValue", label: t("discount") },
    // { field: "purchaseTotalDiscount", label: t("discount") },
    { field: "purchasePrice", label: "Actual Purchase Price" },
    { field: "MRP", label: "MRP" },
    { field: "PurchaseQuantity", label: t("quantity") },
    // { field: "purchaseQuantityPrice", label: t("Total") },
    { field: "purchaseTotalTax", label: t("tax") },
    { field: "purchaseTotalAmount", label: t("Due Amount") },

    // {field: 'Amount', label: ''},
  ];
  const actions = [
    {
      label: "delete",
      color: "green",
      handler: (itemId) => handleDelete(itemId),
      url: null,
    },
  ];
  return (
    <>
      {/* <ToastContainer position="top-right" theme="colored" /> */}
  
      {/* <div className="productActivityTableSection"> */}
        {!fetchingListData ? (
          <>
            <TableComponentId
              data={listpurchase}
              columns={columns}
              actions={actions}
              action2={action2}
            />
            {/* {showModal && <DeleteModal id={Deleteid} />} */}
          </>
        ) : (
          <Loader active style={{ position: "relative", marginTop: "30px" }}>
            Loading
          </Loader>
        )}
      {/* </div> */}
      <div className="grandTotal">
        {
          listpurchase?.length > 0 && (<><h2>Due Amount. {total.toLocaleString()}</h2></>)
        }</div>
      
    </>
  );
}
