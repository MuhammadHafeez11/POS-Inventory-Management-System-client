import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";
import { useCustomState } from "../../../../Variables/stateVariables";
import TableComponentId from "../../../../Components/tableComponent/tableComponentId";
import { useTranslation } from "react-i18next";
import { deleteColor, getColor } from "../../../../actions/colorAction";
import { useSelector, useDispatch } from "react-redux";
import Stack from "@mui/material/Stack";
import { Loader } from "semantic-ui-react";
import PageLoader from "../../../../Components/Loader/PageLoader"
import { refreshTokken } from "../../../../actions/userAction";
import { deletePCTCode, getPCTCodes } from "../../../../actions/pctCodeAction";
let isCalled = "false";
const PCTCodesTable = () => {
  //for Scrolling
  const tableContainerRef = useRef(null);
  // const translationFunctions = useTranslationForFunctions();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pctCodeLoading, pctCode } = useSelector((state) => state.pctCode);
  ///////////////////////////////////////////
  const { colorName, setColorName, setLoading, data, setData } =
    useCustomState();
  const linkk = "updatePCT";
  const actionUpdate = "Update";
  const action3 = "Delete";
  const { t, i18n } = useTranslation();
  useEffect(() => {
    call();
  }, []);

  useEffect(() => {
    isCalled = "false";
  }, [isCalled, pctCode]);

  useEffect(() => {
    if (isCalled === "false") {
      isCalled = "true";
      getToken();
    }
  }, [isCalled, pctCode]);
  const getToken = async () => {
    const token = await refreshTokken();
    if (token.data === "Please login to acces this resource") {
      navigate("/login");
    }
    console.log(token);
  };

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    console.log(localStorage.getItem("theme-color"));
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
      document.body.className = currentThemeColor;
    }
  }, [colorTheme]);

  async function call() {
    try {
      dispatch(getPCTCodes());
      setLoading(true);
    } catch (err) {}
  }

  const deleteProduct = async (id) => {
    console.log(id)
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
        if (result.value) {
          console.log("called");
          const response = await deletePCTCode(id);
          console.log(response);

          if (
            response?.data?.error ===
            "Cannot delete the color as it is referenced by other records"
          ) {
            swal.fire({
              icon: "error",
              title: t("titleError"),
              text: t("textReferenceDeletion"),
              showConfirmButton: true,
              customClass: {
                popup: "custom-swal-popup", // This is the custom class you're adding
              },
            });
          } else {
            console.log(response);
            if (response.message === "PCTCode deleted successfully") {
              swal.fire({
                icon: "success",
                title: t("titleDeleted"),
                text: t("textRecordDeleted"),
                showConfirmButton: false,
                timer: 2000,
                customClass: {
                  popup: "custom-swal-popup", // This is the custom class you're adding
                },
              });
              dispatch(getPCTCodes());
              // window.location.reload();
            }
          }
        }
      });

    // deleteColor(id,translationFunctions);
  };

  const columns = [
    { field: "companyId.companyName", label: t("Company") },
    { field: "pctCodeDescription.pctDescription", label: t("pctCodeDescription") },
    { field: "pctCode", label: t("pctCode") },
  ];

  const actions = [
    {
      label: "Delete",
      color: "yellow",
      handler: (itemId) => deleteProduct(itemId),
    },
    {
      label: "Update",
      color: "green",
      url: (itemId) => `/updatePCT/${itemId}`,
    },
  ];

  return (
    <>
      {/* <div className={`color ${colorTheme}`}> */}
        <div className="search-box"></div>

        <div className="table-container">
          {!pctCodeLoading && pctCode !== "No Record Found" ? (
            <TableComponentId
              data={pctCode}
              columns={columns}
              actions={actions}
              linkk={linkk}
              actionUpdate={actionUpdate}
              action3={action3}
            />
          ) : (
            <div >
           <PageLoader/>  </div>
          )}
        </div>
      {/* </div> */}
    </>
  );
};

export default PCTCodesTable;
