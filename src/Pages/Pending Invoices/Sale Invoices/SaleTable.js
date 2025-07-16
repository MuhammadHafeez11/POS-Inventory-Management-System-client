import React from "react";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { getTempPurchase, getTemporaryPurchaseDetails } from "../../actions/tempPurchaseAction";
import { useTranslation,  } from "react-i18next";
import swal from "sweetalert2";
import TableComponentId from "../../../Components/tableComponent/tableComponentId";
import { useParams, useNavigate } from "react-router-dom";
import PageLoader from "../../../Components/Loader/PageLoader";
import {
  deleteTempSalePendingsFromTable,
  getTemporarySaleDetails,
  getTemporarySaleOnShop,
  getTemppSale,
} from "../../../actions/tempSaleAction";
let tempIsCalled = "false";
const SaleTable = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const pendings = "Pendings";
  const action4 = "Delete";
  const { tempSale, tempSaleLoading } = useSelector((state) => state.tempSale);
  const { tempSaleOnShopNo, tempSaleOnShopNoLoading } = useSelector(
    (state) => state.tempSaleOnShopNo
  );

  useEffect(() => {
  
      dispatch(getTemppSale());
      dispatch(
        getTemporarySaleOnShop(JSON.parse(localStorage.getItem("shopId")))
      );
    
  }, []);

  useEffect(() => {
    console.log(tempSale);
    console.log(tempSaleOnShopNo)
  }, [tempSaleLoading, tempSale, tempSaleOnShopNo]);

  const handlePendings = async (id) => {
    // swal
    //   .fire({
    //     icon: "warning",
    //     title: t("titlePendingMessage"),
    //     text: t("pendingText"),
    //     showCancelButton: true,
    //     confirmButtonText: t("yesButtonText"),
    //     cancelButtonText: t("noButtonText"),
    //     customClass: {
    //       popup: "custom-swal-popup",
    //     },
    //   })
    //   .then(async (result) => {
    //     console.log(id);
    //     if (result.isConfirmed) {
    //       dispatch(getTemporarySaleDetails(id));
    //       navigate("/saleproduct");
    //     }
    //   });
    dispatch(getTemporarySaleDetails(id));
    navigate("/saleproduct");
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
          popup: "custom-swal-popup",
        },
      })
      .then(async (result) => {
        console.log(result.isConfirmed);
        if (result.isConfirmed) {
          console.log(id);
          const res = await deleteTempSalePendingsFromTable(id);
          console.log(res);
          console.log(res.message);
          if (res.message === "tempSale deleted successfully") {
            swal.fire({
              icon: "success",
              title: t("titleDeleted"),
              text: t("textRecordDeleted"),
              showConfirmButton: false,
              customClass: {
                popup: "custom-swal-popup",
              },
            });
            dispatch(getTemppSale());
            dispatch(
              getTemporarySaleOnShop(JSON.parse(localStorage.getItem("shopId")))
            );
            // window.location.reload();
          }
        }
      });
  };

  const columns = [
    { field: "customerName", label: t("cusotmerName") },
    { field: "customerNumber", label: t("customerNumber"), format: t('phoneNumber') },
    { field: "shopNo", label: t("shopNo") },
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
      <div className="search-box"></div>

      <div className="table-container">
        {JSON.parse(localStorage.getItem("isAdministrator")) ? (
          <>
            {!tempSaleLoading ? (
                <TableComponentId
                  data={tempSale}
                  columns={columns}
                  actions={actions}
                  action4={action4}
                  pendings={pendings}
                />
            ) : (
              <PageLoader />
            )}
          </>
        ) : (
          <>
            {!tempSaleOnShopNoLoading ? (
                <TableComponentId
                  data={tempSaleOnShopNo}
                  columns={columns}
                  actions={actions}
                  pendings={pendings}
                  action4={action4}
                />
            ) : (
             <PageLoader />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SaleTable;
