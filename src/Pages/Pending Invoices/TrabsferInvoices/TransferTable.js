import React from "react";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import swal from "sweetalert2";
import TableComponentId from "../../../Components/tableComponent/tableComponentId";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../../Components/Loader/PageLoader";
import {
  getTemporaryTransferDetails,
  getTemporaryTransferOnShop,
} from "../../../actions/tempTransferAction";
import { deleteTempTransferPendingsFromTable } from "../../../actions/transferAction";
let tempIsCalled = "false";
let selectedShop = [];
let seletedGodown = [];
const TransferTable = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const navigate = useNavigate();
  const pendings = "Pendings";
  const action4 = "Delete";
  const { tempTransferOnShop, tempTransferOnShopLoading } = useSelector(
    (state) => state.tempTransferOnShop
  );
  const { tempPurchaseDetails } = useSelector(
    (state) => state.tempPurchaseDetails
  );
  const { tempTransfer, loadingTempTransfer } = useSelector(
    (state) => state.tempTransfer
  );
  const shopAsArray = [selectedShop];
  const shopCodes = shopAsArray?.map((shop) => shop);
  const godownCodes = seletedGodown.map((godown) => godown);
  const combinedOptions = [...shopCodes, ...godownCodes];

  useEffect(() => {
    selectedShop = JSON.parse(localStorage.getItem("shopId"));
    seletedGodown = JSON.parse(localStorage.getItem("godownId"));
    console.log(selectedShop);
    console.log(seletedGodown);
  },[]);

  useEffect(() => {
    // if (tempIsCalled === "false") {
    //   tempIsCalled = "true";
      dispatch(getTemporaryTransferOnShop(JSON.parse(localStorage.getItem("shopId"))))
    
  }, []);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    console.log(localStorage.getItem("theme-color"));
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
      document.body.className = currentThemeColor;
    }
  }, [colorTheme]);

  useEffect(() => {
    console.log(tempTransfer);
  }, [loadingTempTransfer, tempTransfer]);

  const handlePendings = async (id) => {
    dispatch(getTemporaryTransferDetails(id));
    navigate("/TransferRecordd",{state: '/tempTransferPendings'});
  };

  const handleDeletePendings = async (id) => {
    swal
      .fire({
        icon: "warning",
        title: t("titleMessage"),
        text: t("textRevertWarning"),
        showCancelButton: true,
        confirmButtonText: t("confirmButtonText"),
        cancelButtonText: t("cancelButtonText"),
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      })
      .then(async (result) => {
        console.log(result.isConfirmed);
        if (result.isConfirmed) {
          console.log(id);
          const res = await deleteTempTransferPendingsFromTable(id);
          console.log(res);
          console.log(res.message);
          if (res.message === "tempTransfer deleted successfully") {
            swal.fire({
              icon: "success",
              title: t("titleDeleted"),
              text: t("textRecordDeleted"),
              showConfirmButton: false,
              customClass: {
                popup: "custom-swal-popup", // This is the custom class you're adding
              },
            });
            // window.location.reload();
            
      dispatch(getTemporaryTransferOnShop(JSON.parse(localStorage.getItem("shopId"))))
          }
        }
      });
  };
  const columns = [
    { field: "transferFrom", label: t("transferFrom") },
    { field: "transferTo", label: t("transferTo") },
    { field: "transferBy", label: t("transferBy") },
  ];

  const actions = [
    {
      label: "Delete",
      color: "yellow",
      handler: (itemId) => handleDeletePendings(itemId),
    },
    {
      label: "Pendings",
      color: "yellow",
      handler: (itemId) => handlePendings(itemId),
    },
  ];

  return (
    <>
      {/* <div className={`purchase ${colorTheme}`}> */}
        <div className="search-box"></div>

        <div className="table-container">
          {!tempTransferOnShopLoading > 0 ? (<TableComponentId
            data={tempTransferOnShop}
            columns={columns}
            actions={actions}
            pendings={pendings}
            action4={action4}
          />):(
            <PageLoader />
          )}
        
        </div>
      {/* </div> */}
    </>
  );
};

export default TransferTable;
