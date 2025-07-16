import React, { useContext, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Link, Navigate } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import swal from "sweetalert2";
import DeleteModal from "./DeleteModal";
import MoveUpIcon from "@mui/icons-material/MoveUp";

// import { State } from "./context/stateContext";
import { Statte } from "./context/stateContext";
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
import { deleteTempTransferProducts } from "../../../actions/tempTransferAction";
import { useDispatch } from "react-redux";
export default function TableForm() {
  const navigate = useNavigate();
  const [Deleteid, setDeleteid] = useState();
  const dispatch = useDispatch()
  const {
    listTransfer,
    showModall,
    fetchingListData,setListTransfer
  } = useContext(Statte);
  const { t } = useTranslation();
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
        const updatedItems = [...listTransfer];
        console.log(id)
        console.log(updatedItems);
        setListTransfer(listTransfer?.filter((row) => row.id !== id));
          const result = listTransfer.find((item) => item.id === id);
          dispatch(deleteTempTransferProducts(id, result.locationsetid));
        // updatedItems.splice(id, 1);
        // setListTransfer(updatedItems);
        // const result = listTransfer.find((item) => item.id === id);
        // dispatch(deleteTempTransferProducts(id, result.locationsetid));
        // dispatch(getTemppSale());

      }
    });
    // console.log(id);
    // setDeleteid(id);
    // console.warn("hadfaid");
    // console.log(id);
  };

  const columns = [
    { field: "Code", label: t("code") },
    { field: "Namee", label: t("name") },
    { field: "Company", label: t("company") },
    { field: "Color", label: t("color") },
    { field: "PurchaseQuantity", label: t("quantity") },
  ];
  const actions = [
    {
      label: "dlette",
      color: "green",
      handler: (itemId) => handleDelete(itemId),
      url: null,
    },
  ];
  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
  
      <div className="productActivityTableSection">
        {!fetchingListData ? (
          <>
            <TableComponentId data={listTransfer} columns={columns} actions={actions} />
            {/* {showModall && <DeleteModal id={Deleteid} />} */}
          </>
        ) : (
          <Loader active style={{ position: "relative", marginTop: "30px" }}>
            Loading
          </Loader>
        )}
      </div>
    </>
  );
}
