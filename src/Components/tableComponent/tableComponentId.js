import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import delete_FILL0_wght400_GRAD0_opsz24 from "../../images/delete_FILL0_wght400_GRAD0_opsz24.svg";
// import { Table, Button, Tab } from "semantic-ui-react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { State } from "./../../Pages/PurchaseComponent/purchaseRecipt/context/stateContext";
import { Statee } from "./../../Pages/SaleComponent/salesRecipt/context/stateContext";
import { Statte } from "./../../Pages/TransferComponent/Transfer Recipt/context/stateContext";
import { Select, Modal, Message, Checkbox } from "semantic-ui-react"; // Added Checkbox import
// import "../../stylee/tableComponent.css";
import { getPermissionForRoles } from "../../Pages/user/rolesAssigned/RolesPermissionValidation";
import { useTranslation, initReactI18next } from "react-i18next";
import { tableState } from "./tableContext";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { FaBarcode } from "react-icons/fa6";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import QrCodeIcon from "@mui/icons-material/QrCode";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import InventoryIcon from "@mui/icons-material/Inventory";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import ClosedCaptionDisabledIcon from "@mui/icons-material/ClosedCaptionDisabled";
import { ReturnState } from "../../Pages/returnComponent/context/ContextReturn";

let imageUrl = "";

const API_URL = process.env.REACT_APP_BASE_URL;
const TableComponentId = ({
  data,
  columns,
  actions,
  linkk,
  link2,
  actionUpdate,
  action1,
  action3,
  action4,
  deleteShop,
  pendings,
  onRowClick,
  // Add these new props for multi-barcode selection
  showMultiSelectUI = false,
  selectedProducts = [],
  handleProductSelect,
  handleSelectAll,
}) => {
  let lengthOfData = columns?.length;
  if (actions) {
    lengthOfData = lengthOfData;
  }
  const { showModal, setShowModal, locationsetid, listpurchase } =
    useContext(State);
  const { list } = useContext(Statee);
  const { products } = useContext(ReturnState);
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const { listTransfer, showModall, setShowModall } = useContext(Statte);
  const { t, i18n } = useTranslation();
  const { rowCount, setRowCount } = useContext(tableState);
  const [zoomedImage, setZoomedImage] = useState(null);

  // State variables for sorting
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [rowsPerPage, setRowsPerPage] = React.useState(
    user?.user?.tableRows?.noOfRows
  );
  const navigate = useNavigate();

  //pagination
  const [page, setPage] = React.useState(0);

  const [permissionForUpdateProduct, setPermissionForUpdateProduct] =
    useState(false);
  const [permissionForDelete, setPermissionForDelete] = useState(false);

  useEffect(() => {
    setRowsPerPage(user?.user?.tableRows?.noOfRows);
  }, [user, loading, isAuthenticated]);

  const handleChangePage = (event, newPage) => {
    console.log(newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Function to handle sorting
  const handleSort = (field) => {
    if (field === sortedColumn) {
      // If the clicked column is already sorted, toggle the direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If a different column is clicked, set it as the sorted column with ascending direction
      setSortedColumn(field);
      setSortDirection("asc");
    }
  };

  const { setShowModaal } = useContext(Statee);
  let currentIndex = 0;
  useEffect(() => {
    setPage(0);
    setRowCount(data?.length);
  }, [data]);

  useEffect(() => {
    setPermissionForUpdateProduct(false);
    setPermissionForDelete(false);
    getPermission();
  }, []);

  async function getPermission() {
    try {
      const permission = await getPermissionForRoles("Update Records");
      setPermissionForUpdateProduct(permission);
      const permissionDelete = await getPermissionForRoles("Delete Records");
      setPermissionForDelete(permissionDelete);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const renderCellValue = (item, field) => {
    const fieldKeys = field.split(".");

    return fieldKeys?.reduce((obj, key) => (obj ? obj[key] : ""), item);
  };
  // console.log(data);
  // Sorting logic
  const sortedData = data?.slice().sort((a, b) => {
    if (!sortedColumn) return 0;

    const sortOrder = sortDirection === "asc" ? 1 : -1;
    const aField = renderCellValue(a, sortedColumn);
    const bField = renderCellValue(b, sortedColumn);

    if (aField < bField) return -1 * sortOrder;
    if (aField > bField) return 1 * sortOrder;
    return 0;
  });

  const formatNumber = (num, format) => {
    if (format === "Phone No") {
      return num;
    } else {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  };

  // console.log(import.meta.env.VITE_SERVER)

  const getColumnValue = (user, field, format, render) => {
    if (format === "date" || format === "time" || format === "bool") {
      return renderDateValue(user, field, format);
    } else if (field === "product.avatar") {
      const nestedFields = field.split(".");
      let value = user;
      for (const nestedField of nestedFields) {
        if (value && value.hasOwnProperty(nestedField)) {
          value = value[nestedField];
        } else {
          value = ""; // Handle the case where a nested field is missing
          break;
        }
      }
      // console.log(API_URL);
      // console.log(import.meta.env.REACT_SERVER)
      return (
        <img
          src={`${API_URL}/${value}`}
          alt="Product"
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            cursor: "pointer",
            borderRadius: "4px",
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click event
            setZoomedImage(`${API_URL}/${value}`);
          }}
        />
      );
      return value;
    } else if (field.includes(".")) {
      // Handle nested fields
      const nestedFields = field.split(".");
      let value = user;
      for (const nestedField of nestedFields) {
        if (value && value.hasOwnProperty(nestedField)) {
          // console.log(value[nestedField]);
          value = value[nestedField];
        } else {
          value = ""; // Handle the case where a nested field is missing
          break;
        }
      }
      return value;
    } else {
      // return user[field];
      return typeof user[field] === "number"
        ? formatNumber(user[field], format)
        : user[field];
    }
  };

  // Function to render date values using moment.js
  const renderDateValue = (item, field, format) => {
    const value = renderCellValue(item, field);
    // console.log(value);

    //for converting bool value into string ..just for dispalying into table
    if (format === "bool") {
      return value && value.toLocaleString();
    }

    if (format === "time") {
      // console.log("time");
      return value ? new Date(value).toLocaleTimeString() : "";
    }
    if (format === "date") {
      // console.log("date");
      return value ? new Date(value).toLocaleDateString("en-GB") : "";
    }

    return value;
  };

  const noop = () => { };

  const handleRowClick = onRowClick || noop;
  // const classes = useStyles();

  return (
    <>
      {/* <div className="tableComponent"> */}
      <style>{avatarStyles}</style>
      <TableContainer
        component={Paper}
        className="heightSetting"
      // sx={{  zIndex: "1" }}
      >
        {sortedData && sortedData?.length > 0 ? (
          <Table
            sx={{ minWidth: 650, zIndex: "1" }}
            size="small"
            ariel-label="a dense table"
            // className={classes.cell}
            className={`customTable`}
            stickyHeader
          >
            <TableHead>
              <TableRow className="tableHead" align={"center"}>
                {/* Add selection column to table header */}
                {showMultiSelectUI && (
                      <TableCell
                        className="tableHead"
                        align={"center"}
                        // style={{ backgroundColor: "#ECECEC", zIndex: "1" }}
                        onClick={(e) => e.stopPropagation()} // Prevent header click event propagation
                      >
                        <Checkbox
                          checked={selectedProducts.length > 0 && selectedProducts.length === sortedData?.length}
                          indeterminate={selectedProducts.length > 0 && selectedProducts.length < sortedData?.length}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                    )}
                <TableCell
                  className="tableHead"
                  align={"center"}
                // style={{ backgroundColor: "#ECECEC", zIndex: "1" }}
                >
                  {t("sNo")}
                </TableCell>
                {columns?.map((column) => (
                  <TableCell
                    className="tableHead"
                    align={"center"}
                    // style={{ backgroundColor: "#ECECEC", zIndex: "1" }}
                    onClick={() => handleSort(column.field)}
                  >
                    {column.label}
                    {sortedColumn === column.field && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell
                    className="tableHead"
                    align={"center"}
                  // style={{ backgroundColor: "#ECECEC" }}
                  >
                    {t("actions")}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow
                    key={index}
                    className={` ${index % 2 === 0 ? "evenRow" : "oddRow"} `}
                    onClick={() => handleRowClick(item)}
                  >
                    {/* Add selection checkbox to each row */}
                    
                    {showMultiSelectUI && (
                      <TableCell
                        align={"center"}
                        className={index % 2 === 0 ? "evenRow" : "oddRow"}
                        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking checkbox
                      >
                        <Checkbox
                          checked={selectedProducts.includes(item._id)}
                          onChange={() => handleProductSelect(item._id)}
                        />
                      </TableCell>
                    )}
                    <TableCell
                      align={"center"}
                      // className="border-Right"
                      className={index % 2 === 0 ? "evenRow" : "oddRow"}
                    >
                      {++currentIndex}
                    </TableCell>
                    {columns?.map((column) => (
                      <TableCell
                        align="center"
                        className="border-Right"
                        key={column.field}
                      >
                        {
                          // console.log(`${item[column.]}`)
                          // console.log(`${item[column.field]}`)
                        }
                        {column.field === "avatar" ? (
                          <div style={{ display: "inline-block" }}>
                            {console.log(`${item[column.field]}`)}
                            <img
                              src={`https://swsqe10.softwisesol.com/${item[column.field]
                                }`}
                              alt="Product"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                cursor: "pointer",
                                borderRadius: "4px",
                              }}s
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click event
                                setZoomedImage(
                                  `https://swsqe10.softwisesol.com/${item[column.field]}`
                                );
                              }}
                            />
                          </div>
                        ) : // Render normal text/other values if it's not an image column
                          column.field === "product.avatar" ? (
                            <>
                              <div style={{ display: "inline-block" }}>
                                {getColumnValue(
                                  item,
                                  column.field,
                                  column.format,
                                  column.render
                                )}
                              </div>
                            </>
                          ) : column.render ? (
                            column.render(item)
                          ) : (
                            getColumnValue(
                              item,
                              column.field,
                              column.format,
                              column.render
                            )
                          )}
                        {/* {column.render
                          ? column.render(item)
                          : getColumnValue(
                              item,
                              column.field,
                              column.format,
                              column.render
                            )} */}
                        {/* {columnn.render ? columnn.render(item) : item[columnn.field]} */}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell
                        align={"center"}
                        className={` column-borde`}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {actions?.map((action) => {
                          if (action.label === action3 && permissionForDelete) {
                            return (
                              <Tooltip title="Delete Record" arrow>
                                <Button
                                  key={action.label}
                                  // variant="contained"
                                  style={{
                                    backgroundColor: "#transparent",
                                    marginRight: "5px",
                                  }}
                                  // color={action.color}

                                  onClick={() => actions[0].handler(item._id)}
                                // className="Hello3"
                                >
                                  {/* <DeleteSweepIcon /> */}
                                  {/* {t("delete")}&nbsp; */}
                                  <DeleteIcon />
                                </Button>
                              </Tooltip>
                            );
                          }
                          if (
                            action.label === deleteShop &&
                            permissionForDelete
                          ) {
                            return (
                              <Tooltip title="Delete Record" arrow>
                                <Button
                                  key={action.label}
                                  style={{
                                    backgroundColor: "#transparent",
                                    marginRight: "5px",
                                  }}
                                  // onClick={console.log(actions, item._id)}
                                  onClick={() => actions[0].handler(item._id)}
                                >
                                  <DeleteIcon />
                                </Button>
                              </Tooltip>
                            );
                          }
                          if (action.label === action4) {
                            return (
                              <Tooltip title="Delete Record" arrow>
                                <Button
                                  key={action.label}
                                  // variant="contained"
                                  style={{
                                    backgroundColor: "#transparent",
                                    marginRight: "5px",
                                  }}
                                  // color={action.color}
                                  onClick={() => actions[0].handler(item._id)}
                                // className="Hello3"
                                >
                                  {/* <ArrowForwardIcon /> */}
                                  {/* {t("delete")}&nbsp; */}
                                  <DeleteIcon />
                                </Button>
                              </Tooltip>
                            );
                          }
                          if (action.label === pendings) {
                            return (
                              <Tooltip title="Continue" arrow>
                                <Button
                                  key={action.label}
                                  // color={action.color}
                                  onClick={() => actions[1].handler(item._id)}
                                // className="Hello3"
                                >
                                  <ArrowForwardIcon />
                                  {/* {t("pendings")}&nbsp; */}
                                </Button>
                              </Tooltip>
                            );
                          }
                          if (action.label === "Preview") {
                            return (
                              <Button
                                key={action.label}
                                // variant="contained"
                                style={{ zIndex: "0" }}
                                // color={action.color}
                                onClick={() => actions[0].handler(item.id)}
                              // className="Hello3"
                              >
                                {/* {action.label}&nbsp; */}
                                <PreviewIcon />
                              </Button>
                            );
                          }
                          if (action.label === "InvoicePreview") {
                            return (
                              <Button
                                key={action.label}
                                // variant="contained"
                                style={{ zIndex: "0" }}
                                // color={action.color}
                                onClick={() =>
                                  actions[0].handler(item.invoiceNumber)
                                }
                              // className="Hello3"
                              >
                                {/* {action.label}&nbsp; */}
                                <PreviewIcon />
                              </Button>
                            );
                          }
                          if (action.label === "delete") {
                            return (
                              <Button
                                key={action.label}
                                onClick={() => {
                                  setShowModal(true);
                                  actions[0].handler(item.id);
                                }}
                              >
                                <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                              </Button>
                            );
                          }
                          if (action.label === "deleteee") {
                            return (
                              <Button
                                key={action.label}
                                onClick={() => {
                                  setShowModal(true);
                                  actions[0].handler(index);
                                }}
                              >
                                <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                              </Button>
                            );
                          }
                          if (action.label === "dlete") {
                            return (
                              <Button
                                key={action.label}
                                onClick={() => {
                                  setShowModaal(true);
                                  actions[0].handler(item.id);
                                }}
                              >
                                <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                              </Button>
                            );
                          }
                          if (action.label === "dlette") {
                            return (
                              <Button
                                key={action.label}
                                onClick={() => {
                                  setShowModall(true);
                                  actions[0].handler(item.id);
                                }}
                              >
                                <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                              </Button>
                            );
                          }
                          if (action.label === "Purchase") {
                            return (
                              <Button
                                key={action.label}
                                onClick={() => actions[0].handler(item._id)}
                                disabled={false}
                              >
                                <InventoryIcon />
                              </Button>
                            );
                          }
                          if (action.label === "Sale") {
                            let itemQuantityAvailable = true;
                            if (item.productQuantity < 1) {
                              itemQuantityAvailable = false;
                            }
                            let isItemInList = false;
                            list?.map((list) => {
                              if (
                                list?.quantityidset === item?.product?._id &&
                                list?.productColor === item?.colorId?._id
                              ) {
                                isItemInList = true;
                              }
                            });

                            if (!itemQuantityAvailable) {
                              return (
                                <Button
                                  key={action.labeladded}
                                  onClick={() => actions[0].handler(item._id)}
                                  disabled={true}
                                >
                                  <ClosedCaptionDisabledIcon />
                                </Button>
                              );
                            } else if (isItemInList) {
                              return (
                                <Button
                                  key={action.labeladded}
                                  onClick={() => actions[0].handler(item._id)}
                                  disabled={true}
                                >
                                  {"Added"}
                                  <ClosedCaptionDisabledIcon />
                                </Button>
                              );
                            } else {
                              return (
                                <Button
                                  key={action.label}
                                  onClick={() => actions[0].handler(item._id)}
                                  disabled={false}
                                >
                                  <LoyaltyIcon />
                                </Button>
                              );
                            }
                          }
                          if (action.label === "Return") {
                            let isItemInList = false;
                            products?.map((list) => {
                              if (list?.id === item?.id) {
                                isItemInList = true;
                              }
                            });
                            if (isItemInList) {
                              return (
                                <Button
                                  key={action.labeladded}
                                  onClick={() => actions[0].handler(item)}
                                  disabled={true}
                                >
                                  {"Added"}
                                  <ClosedCaptionDisabledIcon />
                                </Button>
                              );
                            } else {
                              return (
                                <Button
                                  key={action.label}
                                  onClick={() => actions[0].handler(item)}
                                  disabled={false}
                                >
                                  <LoyaltyIcon />
                                </Button>
                              );
                            }
                          }
                          if (action.label === "transfer") {
                            console.log(listTransfer);
                            console.log(item);
                            let itemQuantityAvailable = true;
                            if (item.productQuantity < 1) {
                              itemQuantityAvailable = false;
                            }
                            let isItemInList = false;
                            listTransfer?.map((list) => {
                              if (
                                list?.quantityidset === item?.product?._id &&
                                list?.productColor === item?.colorId?._id
                              ) {
                                isItemInList = true;
                              }
                            });

                            if (!itemQuantityAvailable) {
                              return (
                                <Button
                                  key={action.labeladded}
                                  onClick={() => actions[0].handler(item._id)}
                                  disabled={true}
                                >
                                  <ClosedCaptionDisabledIcon />
                                </Button>
                              );
                            } else if (isItemInList) {
                              return (
                                <Button
                                  key={action.labeladded}
                                  onClick={() => actions[0].handler(item._id)}
                                  disabled={true}
                                >
                                  {"Added"}
                                  <ClosedCaptionDisabledIcon />
                                </Button>
                              );
                            } else {
                              return (
                                <Button
                                  key={action.label}
                                  onClick={() => actions[0].handler(item._id)}
                                  disabled={false}
                                >
                                  <LoyaltyIcon />
                                </Button>
                              );
                            }
                          }
                          if (action.label === action1) {
                            return (
                              <Tooltip title="View Barcode" arrow>
                                <Button
                                  key={action.label}
                                  style={{
                                    backgroundColor: "#transparent",
                                    marginLeft: "5px",
                                  }}
                                  onClick={() => {
                                    navigate(`/${link2}/${item._id}`);
                                  }}
                                >
                                  <FaBarcode />
                                </Button>
                              </Tooltip>
                            );
                          }
                          //Just For Change Permission for Super Admin
                          if (action.label === "change Permission") {
                            return (
                              <Tooltip title="Change Permission" arrow>
                                <Button
                                  key={action.label}
                                  // variant="contained"
                                  style={{
                                    // backgroundColor: "#07B235",
                                    marginLeft: "5px",
                                  }}
                                  //  color={"success"}
                                  onClick={() => {
                                    localStorage.setItem(
                                      "userpermission",
                                      JSON.stringify(item._id)
                                    );
                                    localStorage.setItem(
                                      "roleNameForPermissions",
                                      JSON.stringify(item.roleName)
                                    );
                                    navigate("/rolesAssign");
                                  }}
                                // className="Hello3"
                                >
                                  {/* {t("changePermissions")}&nbsp; */}
                                  <LockOpenIcon />
                                </Button>
                              </Tooltip>
                            );
                          }
                          if (
                            action.label === actionUpdate &&
                            permissionForUpdateProduct
                          ) {
                            return (
                              <Tooltip title="Update Record" arrow>
                                <Button
                                  key={action.label}
                                  // variant="contained"
                                  style={{
                                    backgroundColor: "#transparent",
                                    zIndex: 0,
                                  }}
                                  // color={"warning"}
                                  onClick={() => {
                                    navigate(`/${linkk}/${item._id}`);
                                  }}
                                // className="Hello3"
                                >
                                  {/* {t("update")}&nbsp;&nbsp; */}
                                  <UpdateIcon />
                                </Button>
                              </Tooltip>
                            );
                          }
                          if (action.label === "PreviewPaidInvoice") {
                            return (
                              <Button
                                key={action.label}
                                // variant="contained"
                                // style={{ backgroundColor: "#E5B000" }}
                                // color={"warning"}
                                onClick={() => {
                                  navigate(`/${linkk}/${item._id}`);
                                }}
                              // className="Hello3"
                              >
                                {/* {t("Prewiew")}&nbsp;&nbsp; */}
                                <UpdateIcon />
                              </Button>
                            );
                          }
                        })}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          <div>No record found.</div>
        )}
      </TableContainer>
      <TablePagination
        component="div"
        count={sortedData?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        className="custom-table-pagination"
      />
      {/* </div> */}
      {zoomedImage && (
        <>
          <div className="zoom-backdrop" onClick={() => setZoomedImage(null)} />
          <div className="avatar-zoom">
            <div style={{ textAlign: "right", marginBottom: "8px" }}>
              <button
                onClick={() => setZoomedImage(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>
            </div>
            <img
              src={zoomedImage || "/placeholder.svg"}
              alt="Product Zoomed"
              style={{
                maxWidth: "400px",
                maxHeight: "400px",
                objectFit: "contain",
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

// Add this CSS after the imports
const avatarStyles = `
  .avatar-zoom {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    background-color: rgba(255, 255, 255, 0.95);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
  .zoom-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
  
  /* Selection column styles */
  .selection-column {
    width: 40px;
    text-align: center;
  }
  
  /* Multi-select controls */
  .multi-select-controls {
    margin-bottom: 15px;
    display: flex;
    gap: 10px;
  }
  
  .buttonProductLocation {
    margin-left: 5px !important;
  }
`;

export default TableComponentId;

// import React, { useContext, useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import LockOpenIcon from "@mui/icons-material/LockOpen";
// import { useParams, useNavigate } from "react-router-dom";
// import moment from "moment";
// import delete_FILL0_wght400_GRAD0_opsz24 from "../../images/delete_FILL0_wght400_GRAD0_opsz24.svg";
// // import { Table, Button, Tab } from "semantic-ui-react";
// import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
// import { State } from "./../../Pages/PurchaseComponent/purchaseRecipt/context/stateContext";
// import { Statee } from "./../../Pages/SaleComponent/salesRecipt/context/stateContext";
// import { Statte } from "./../../Pages/TransferComponent/Transfer Recipt/context/stateContext";
// import { Select, Modal, Message } from "semantic-ui-react";
// // import "../../stylee/tableComponent.css";
// import { getPermissionForRoles } from "../../Pages/user/rolesAssigned/RolesPermissionValidation";
// import { useTranslation, initReactI18next } from "react-i18next";
// import { tableState } from "./tableContext";
// import { makeStyles } from "@material-ui/core/styles";
// import { useSelector } from "react-redux";
// import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
// import { FaBarcode } from "react-icons/fa6";
// import Tooltip from "@material-ui/core/Tooltip";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import {
//   TableContainer,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Paper,
//   Button,
// } from "@mui/material";
// import TablePagination from "@mui/material/TablePagination";
// import QrCodeIcon from "@mui/icons-material/QrCode";
// import UpdateIcon from "@mui/icons-material/Update";
// import DeleteIcon from "@mui/icons-material/Delete";
// import PreviewIcon from "@mui/icons-material/Preview";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import LoyaltyIcon from "@mui/icons-material/Loyalty";
// import ClosedCaptionDisabledIcon from "@mui/icons-material/ClosedCaptionDisabled";
// import { ReturnState } from "../../Pages/returnComponent/context/ContextReturn";

// let imageUrl = "";

// const API_URL = process.env.REACT_APP_BASE_URL;
// const TableComponentId = ({
//   data,
//   columns,
//   actions,
//   linkk,
//   link2,
//   actionUpdate,
//   action1,
//   action3,
//   action4,
//   deleteShop,
//   pendings,
//   onRowClick,
//   // Add these new props for multi-barcode selection
//   showMultiSelectUI = false,
//   selectedProducts = [],
//   handleProductSelect,
// }) => {
//   let lengthOfData = columns?.length;
//   if (actions) {
//     lengthOfData = lengthOfData;
//   }
//   const { showModal, setShowModal, locationsetid, listpurchase } =
//     useContext(State);
//   const { list } = useContext(Statee);
//   const { products } = useContext(ReturnState);
//   const { user, loading, isAuthenticated } = useSelector((state) => state.user);
//   const { listTransfer, showModall, setShowModall } = useContext(Statte);
//   const { t, i18n } = useTranslation();
//   const { rowCount, setRowCount } = useContext(tableState);
//   const [zoomedImage, setZoomedImage] = useState(null);

//   // State variables for sorting
//   const [sortedColumn, setSortedColumn] = useState(null);
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [rowsPerPage, setRowsPerPage] = React.useState(
//     user?.user?.tableRows?.noOfRows
//   );
//   const navigate = useNavigate();

//   //pagination
//   const [page, setPage] = React.useState(0);

//   const [permissionForUpdateProduct, setPermissionForUpdateProduct] =
//     useState(false);
//   const [permissionForDelete, setPermissionForDelete] = useState(false);

//   useEffect(() => {
//     setRowsPerPage(user?.user?.tableRows?.noOfRows);
//   }, [user, loading, isAuthenticated]);

//   const handleChangePage = (event, newPage) => {
//     console.log(newPage);
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   // Function to handle sorting
//   const handleSort = (field) => {
//     if (field === sortedColumn) {
//       // If the clicked column is already sorted, toggle the direction
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       // If a different column is clicked, set it as the sorted column with ascending direction
//       setSortedColumn(field);
//       setSortDirection("asc");
//     }
//   };

//   const { setShowModaal } = useContext(Statee);
//   let currentIndex = 0;
//   useEffect(() => {
//     setPage(0);
//     setRowCount(data?.length);
//   }, [data]);

//   useEffect(() => {
//     setPermissionForUpdateProduct(false);
//     setPermissionForDelete(false);
//     getPermission();
//   }, []);

//   async function getPermission() {
//     try {
//       const permission = await getPermissionForRoles("Update Records");
//       setPermissionForUpdateProduct(permission);
//       const permissionDelete = await getPermissionForRoles("Delete Records");
//       setPermissionForDelete(permissionDelete);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   }

//   const renderCellValue = (item, field) => {
//     const fieldKeys = field.split(".");

//     return fieldKeys?.reduce((obj, key) => (obj ? obj[key] : ""), item);
//   };
//   // console.log(data);
//   // Sorting logic
//   const sortedData = data?.slice().sort((a, b) => {
//     if (!sortedColumn) return 0;

//     const sortOrder = sortDirection === "asc" ? 1 : -1;
//     const aField = renderCellValue(a, sortedColumn);
//     const bField = renderCellValue(b, sortedColumn);

//     if (aField < bField) return -1 * sortOrder;
//     if (aField > bField) return 1 * sortOrder;
//     return 0;
//   });

//   const formatNumber = (num, format) => {
//     if (format === "Phone No") {
//       return num;
//     } else {
//       return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     }
//   };

//   // console.log(import.meta.env.VITE_SERVER)

//   const getColumnValue = (user, field, format, render) => {
//     if (format === "date" || format === "time" || format === "bool") {
//       return renderDateValue(user, field, format);
//     } else if (field === "product.avatar") {
//       const nestedFields = field.split(".");
//       let value = user;
//       for (const nestedField of nestedFields) {
//         if (value && value.hasOwnProperty(nestedField)) {
//           value = value[nestedField];
//         } else {
//           value = ""; // Handle the case where a nested field is missing
//           break;
//         }
//       }
//       // console.log(API_URL);
//       // console.log(import.meta.env.REACT_SERVER)
//       return (
//         <img
//           src={`${API_URL}/${value}`}
//           alt="Product"
//           style={{
//             width: "50px",
//             height: "50px",
//             objectFit: "cover",
//             cursor: "pointer",
//             borderRadius: "4px",
//           }}
//           onClick={(e) => {
//             e.stopPropagation(); // Prevent row click event
//             setZoomedImage(`${API_URL}/${value}`);
//           }}
//         />
//       );
//       return value;
//     } else if (field.includes(".")) {
//       // Handle nested fields
//       const nestedFields = field.split(".");
//       let value = user;
//       for (const nestedField of nestedFields) {
//         if (value && value.hasOwnProperty(nestedField)) {
//           // console.log(value[nestedField]);
//           value = value[nestedField];
//         } else {
//           value = ""; // Handle the case where a nested field is missing
//           break;
//         }
//       }
//       return value;
//     } else {
//       // return user[field];
//       return typeof user[field] === "number"
//         ? formatNumber(user[field], format)
//         : user[field];
//     }
//   };

//   // Function to render date values using moment.js
//   const renderDateValue = (item, field, format) => {
//     const value = renderCellValue(item, field);
//     // console.log(value);

//     //for converting bool value into string ..just for dispalying into table
//     if (format === "bool") {
//       return value && value.toLocaleString();
//     }

//     if (format === "time") {
//       // console.log("time");
//       return value ? new Date(value).toLocaleTimeString() : "";
//     }
//     if (format === "date") {
//       // console.log("date");
//       return value ? new Date(value).toLocaleDateString("en-GB") : "";
//     }

//     return value;
//   };

//   const noop = () => {};

//   const handleRowClick = onRowClick || noop;
//   // const classes = useStyles();

//   return (
//     <>
//       {/* <div className="tableComponent"> */}
//       <style>{avatarStyles}</style>
//       <TableContainer
//         component={Paper}
//         className="heightSetting"
//         // sx={{  zIndex: "1" }}
//       >
//         {sortedData && sortedData?.length > 0 ? (
//           <Table
//             sx={{ minWidth: 650, zIndex: "1" }}
//             size="small"
//             ariel-label="a dense table"
//             // className={classes.cell}
//             className={`customTable`}
//             stickyHeader
//           >
//             <TableHead>
//               <TableRow className="tableHead" align={"center"}>
//                 <TableCell
//                   className="tableHead"
//                   align={"center"}
//                   // style={{ backgroundColor: "#ECECEC", zIndex: "1" }}
//                 >
//                   {t("sNo")}
//                 </TableCell>
//                 {columns?.map((column) => (
//                   <TableCell
//                     className="tableHead"
//                     align={"center"}
//                     // style={{ backgroundColor: "#ECECEC", zIndex: "1" }}
//                     onClick={() => handleSort(column.field)}
//                   >
//                     {column.label}
//                     {sortedColumn === column.field && (
//                       <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
//                     )}
//                   </TableCell>
//                 ))}
//                 {actions && (
//                   <TableCell
//                     className="tableHead"
//                     align={"center"}
//                     // style={{ backgroundColor: "#ECECEC" }}
//                   >
//                     {t("actions")}
//                   </TableCell>
//                 )}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {sortedData
//                 ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((item, index) => (
//                   <TableRow
//                     key={index}
//                     className={` ${index % 2 === 0 ? "evenRow" : "oddRow"} `}
//                     onClick={() => handleRowClick(item)}
//                   >
//                     {showMultiSelectUI && (
//   <TableCell
//     align={"center"}
//     className={index % 2 === 0 ? "evenRow" : "oddRow"}
//     onClick={(e) => e.stopPropagation()} // Prevent row click when clicking checkbox
//   >
//     <Checkbox
//       checked={selectedProducts.includes(item._id)}
//       onChange={() => handleProductSelect(item._id)}
//     />
//   </TableCell>
// )}
//                     <TableCell
//                       align={"center"}
//                       // className="border-Right"
//                       className={index % 2 === 0 ? "evenRow" : "oddRow"}
//                     >
//                       {++currentIndex}
//                     </TableCell>
//                     {columns?.map((column) => (
//                       <TableCell
//                         align="center"
//                         className="border-Right"
//                         key={column.field}
//                       >
//                         {
//                           // console.log(`${item[column.]}`)
//                           // console.log(`${item[column.field]}`)
//                         }
//                         {column.field === "avatar" ? (
//                           <div style={{ display: "inline-block" }}>
//                             {console.log(`${item[column.field]}`)}
//                             <img
//                               src={`http://localhost:4500/${
//                                 item[column.field]
//                               }`}
//                               alt="Product"
//                               style={{
//                                 width: "50px",
//                                 height: "50px",
//                                 objectFit: "cover",
//                                 cursor: "pointer",
//                                 borderRadius: "4px",
//                               }}
//                               onClick={(e) => {
//                                 e.stopPropagation(); // Prevent row click event
//                                 setZoomedImage(
//                                   `http://localhost:4500/${item[column.field]}`
//                                 );
//                               }}
//                             />
//                           </div>
//                         ) : // Render normal text/other values if it's not an image column
//                         column.field === "product.avatar" ? (
//                           <>
//                             <div style={{ display: "inline-block" }}>
//                               {getColumnValue(
//                                 item,
//                                 column.field,
//                                 column.format,
//                                 column.render
//                               )}
//                             </div>
//                           </>
//                         ) : column.render ? (
//                           column.render(item)
//                         ) : (
//                           getColumnValue(
//                             item,
//                             column.field,
//                             column.format,
//                             column.render
//                           )
//                         )}
//                         {/* {column.render
//                           ? column.render(item)
//                           : getColumnValue(
//                               item,
//                               column.field,
//                               column.format,
//                               column.render
//                             )} */}
//                         {/* {columnn.render ? columnn.render(item) : item[columnn.field]} */}
//                       </TableCell>
//                     ))}
//                     {actions && (
//                       <TableCell
//                         align={"center"}
//                         className={` column-borde`}
//                         style={{ whiteSpace: "nowrap" }}
//                       >
//                         {actions?.map((action) => {
//                           if (action.label === action3 && permissionForDelete) {
//                             return (
//                               <Tooltip title="Delete Record" arrow>
//                                 <Button
//                                   key={action.label}
//                                   // variant="contained"
//                                   style={{
//                                     backgroundColor: "#transparent",
//                                     marginRight: "5px",
//                                   }}
//                                   // color={action.color}

//                                   onClick={() => actions[0].handler(item._id)}
//                                   // className="Hello3"
//                                 >
//                                   {/* <DeleteSweepIcon /> */}
//                                   {/* {t("delete")}&nbsp; */}
//                                   <DeleteIcon />
//                                 </Button>
//                               </Tooltip>
//                             );
//                           }
//                           if (
//                             action.label === deleteShop &&
//                             permissionForDelete
//                           ) {
//                             return (
//                               <Tooltip title="Delete Record" arrow>
//                                 <Button
//                                   key={action.label}
//                                   style={{
//                                     backgroundColor: "#transparent",
//                                     marginRight: "5px",
//                                   }}
//                                   // onClick={console.log(actions, item._id)}
//                                   onClick={() => actions[0].handler(item._id)}
//                                 >
//                                   <DeleteIcon />
//                                 </Button>
//                               </Tooltip>
//                             );
//                           }
//                           if (action.label === action4) {
//                             return (
//                               <Tooltip title="Delete Record" arrow>
//                                 <Button
//                                   key={action.label}
//                                   // variant="contained"
//                                   style={{
//                                     backgroundColor: "#transparent",
//                                     marginRight: "5px",
//                                   }}
//                                   // color={action.color}
//                                   onClick={() => actions[0].handler(item._id)}
//                                   // className="Hello3"
//                                 >
//                                   {/* <ArrowForwardIcon /> */}
//                                   {/* {t("delete")}&nbsp; */}
//                                   <DeleteIcon />
//                                 </Button>
//                               </Tooltip>
//                             );
//                           }
//                           if (action.label === pendings) {
//                             return (
//                               <Tooltip title="Continue" arrow>
//                                 <Button
//                                   key={action.label}
//                                   // color={action.color}
//                                   onClick={() => actions[1].handler(item._id)}
//                                   // className="Hello3"
//                                 >
//                                   <ArrowForwardIcon />
//                                   {/* {t("pendings")}&nbsp; */}
//                                 </Button>
//                               </Tooltip>
//                             );
//                           }
//                           if (action.label === "Preview") {
//                             return (
//                               <Button
//                                 key={action.label}
//                                 // variant="contained"
//                                 style={{ zIndex: "0" }}
//                                 // color={action.color}
//                                 onClick={() => actions[0].handler(item.id)}
//                                 // className="Hello3"
//                               >
//                                 {/* {action.label}&nbsp; */}
//                                 <PreviewIcon />
//                               </Button>
//                             );
//                           }
//                           if (action.label === "InvoicePreview") {
//                             return (
//                               <Button
//                                 key={action.label}
//                                 // variant="contained"
//                                 style={{ zIndex: "0" }}
//                                 // color={action.color}
//                                 onClick={() =>
//                                   actions[0].handler(item.invoiceNumber)
//                                 }
//                                 // className="Hello3"
//                               >
//                                 {/* {action.label}&nbsp; */}
//                                 <PreviewIcon />
//                               </Button>
//                             );
//                           }
//                           if (action.label === "delete") {
//                             return (
//                               <Button
//                                 key={action.label}
//                                 onClick={() => {
//                                   setShowModal(true);
//                                   actions[0].handler(item.id);
//                                 }}
//                               >
//                                 <AiOutlineDelete className="text-red-500 font-bold text-xl" />
//                               </Button>
//                             );
//                           }
//                           if (action.label === "deleteee") {
//                             return (
//                               <Button
//                                 key={action.label}
//                                 onClick={() => {
//                                   setShowModal(true);
//                                   actions[0].handler(index);
//                                 }}
//                               >
//                                 <AiOutlineDelete className="text-red-500 font-bold text-xl" />
//                               </Button>
//                             );
//                           }
//                           if (action.label === "dlete") {
//                             return (
//                               <Button
//                                 key={action.label}
//                                 onClick={() => {
//                                   setShowModaal(true);
//                                   actions[0].handler(item.id);
//                                 }}
//                               >
//                                 <AiOutlineDelete className="text-red-500 font-bold text-xl" />
//                               </Button>
//                             );
//                           }
//                           if (action.label === "dlette") {
//                             return (
//                               <Button
//                                 key={action.label}
//                                 onClick={() => {
//                                   setShowModall(true);
//                                   actions[0].handler(item.id);
//                                 }}
//                               >
//                                 <AiOutlineDelete className="text-red-500 font-bold text-xl" />
//                               </Button>
//                             );
//                           }
//                           if (action.label === "Purchase") {
//                             return (
//                               <Button
//                                 key={action.label}
//                                 onClick={() => actions[0].handler(item._id)}
//                                 disabled={false}
//                               >
//                                 <InventoryIcon />
//                               </Button>
//                             );
//                           }
//                           if (action.label === "Sale") {
//                             let itemQuantityAvailable = true;
//                             if (item.productQuantity < 1) {
//                               itemQuantityAvailable = false;
//                             }
//                             let isItemInList = false;
//                             list?.map((list) => {
//                               if (
//                                 list?.quantityidset === item?.product?._id &&
//                                 list?.productColor === item?.colorId?._id
//                               ) {
//                                 isItemInList = true;
//                               }
//                             });

//                             if (!itemQuantityAvailable) {
//                               return (
//                                 <Button
//                                   key={action.labeladded}
//                                   onClick={() => actions[0].handler(item._id)}
//                                   disabled={true}
//                                 >
//                                   <ClosedCaptionDisabledIcon />
//                                 </Button>
//                               );
//                             } else if (isItemInList) {
//                               return (
//                                 <Button
//                                   key={action.labeladded}
//                                   onClick={() => actions[0].handler(item._id)}
//                                   disabled={true}
//                                 >
//                                   {"Added"}
//                                   <ClosedCaptionDisabledIcon />
//                                 </Button>
//                               );
//                             } else {
//                               return (
//                                 <Button
//                                   key={action.label}
//                                   onClick={() => actions[0].handler(item._id)}
//                                   disabled={false}
//                                 >
//                                   <LoyaltyIcon />
//                                 </Button>
//                               );
//                             }
//                           }
//                           if (action.label === "Return") {
//                             let isItemInList = false;
//                             products?.map((list) => {
//                               if (list?.id === item?.id) {
//                                 isItemInList = true;
//                               }
//                             });
//                             if (isItemInList) {
//                               return (
//                                 <Button
//                                   key={action.labeladded}
//                                   onClick={() => actions[0].handler(item)}
//                                   disabled={true}
//                                 >
//                                   {"Added"}
//                                   <ClosedCaptionDisabledIcon />
//                                 </Button>
//                               );
//                             } else {
//                               return (
//                                 <Button
//                                   key={action.label}
//                                   onClick={() => actions[0].handler(item)}
//                                   disabled={false}
//                                 >
//                                   <LoyaltyIcon />
//                                 </Button>
//                               );
//                             }
//                           }
//                           if (action.label === "transfer") {
//                             console.log(listTransfer);
//                             console.log(item);
//                             let itemQuantityAvailable = true;
//                             if (item.productQuantity < 1) {
//                               itemQuantityAvailable = false;
//                             }
//                             let isItemInList = false;
//                             listTransfer?.map((list) => {
//                               if (
//                                 list?.quantityidset === item?.product?._id &&
//                                 list?.productColor === item?.colorId?._id
//                               ) {
//                                 isItemInList = true;
//                               }
//                             });

//                             if (!itemQuantityAvailable) {
//                               return (
//                                 <Button
//                                   key={action.labeladded}
//                                   onClick={() => actions[0].handler(item._id)}
//                                   disabled={true}
//                                 >
//                                   <ClosedCaptionDisabledIcon />
//                                 </Button>
//                               );
//                             } else if (isItemInList) {
//                               return (
//                                 <Button
//                                   key={action.labeladded}
//                                   onClick={() => actions[0].handler(item._id)}
//                                   disabled={true}
//                                 >
//                                   {"Added"}
//                                   <ClosedCaptionDisabledIcon />
//                                 </Button>
//                               );
//                             } else {
//                               return (
//                                 <Button
//                                   key={action.label}
//                                   onClick={() => actions[0].handler(item._id)}
//                                   disabled={false}
//                                 >
//                                   <LoyaltyIcon />
//                                 </Button>
//                               );
//                             }
//                           }
//                           if (action.label === action1) {
//                             return (
//                               <Tooltip title="View Barcode" arrow>
//                                 <Button
//                                   key={action.label}
//                                   style={{
//                                     backgroundColor: "#transparent",
//                                     marginLeft: "5px",
//                                   }}
//                                   onClick={() => {
//                                     navigate(`/${link2}/${item._id}`);
//                                   }}
//                                 >
//                                   <FaBarcode />
//                                 </Button>
//                               </Tooltip>
//                             );
//                           }
//                           //Just For Change Permission for Super Admin
//                           if (action.label === "change Permission") {
//                             return (
//                               <Tooltip title="Change Permission" arrow>
//                                 <Button
//                                   key={action.label}
//                                   // variant="contained"
//                                   style={{
//                                     // backgroundColor: "#07B235",
//                                     marginLeft: "5px",
//                                   }}
//                                   //  color={"success"}
//                                   onClick={() => {
//                                     localStorage.setItem(
//                                       "userpermission",
//                                       JSON.stringify(item._id)
//                                     );
//                                     localStorage.setItem(
//                                       "roleNameForPermissions",
//                                       JSON.stringify(item.roleName)
//                                     );
//                                     navigate("/rolesAssign");
//                                   }}
//                                   // className="Hello3"
//                                 >
//                                   {/* {t("changePermissions")}&nbsp; */}
//                                   <LockOpenIcon />
//                                 </Button>
//                               </Tooltip>
//                             );
//                           }
//                           if (
//                             action.label === actionUpdate &&
//                             permissionForUpdateProduct
//                           ) {
//                             return (
//                               <Tooltip title="Update Record" arrow>
//                                 <Button
//                                   key={action.label}
//                                   // variant="contained"
//                                   style={{
//                                     backgroundColor: "#transparent",
//                                     zIndex: 0,
//                                   }}
//                                   // color={"warning"}
//                                   onClick={() => {
//                                     navigate(`/${linkk}/${item._id}`);
//                                   }}
//                                   // className="Hello3"
//                                 >
//                                   {/* {t("update")}&nbsp;&nbsp; */}
//                                   <UpdateIcon />
//                                 </Button>
//                               </Tooltip>
//                             );
//                           }
//                           if (action.label === "PreviewPaidInvoice") {
//                             return (
//                               <Button
//                                 key={action.label}
//                                 // variant="contained"
//                                 // style={{ backgroundColor: "#E5B000" }}
//                                 // color={"warning"}
//                                 onClick={() => {
//                                   navigate(`/${linkk}/${item._id}`);
//                                 }}
//                                 // className="Hello3"
//                               >
//                                 {/* {t("Prewiew")}&nbsp;&nbsp; */}
//                                 <UpdateIcon />
//                               </Button>
//                             );
//                           }
//                         })}
//                       </TableCell>
//                     )}
//                   </TableRow>
//                 ))}
//             </TableBody>
//           </Table>
//         ) : (
//           <div>No record found.</div>
//         )}
//       </TableContainer>
//       <TablePagination
//         component="div"
//         count={sortedData?.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         className="custom-table-pagination"
//       />
//       {/* </div> */}
//       {zoomedImage && (
//         <>
//           <div className="zoom-backdrop" onClick={() => setZoomedImage(null)} />
//           <div className="avatar-zoom">
//             <div style={{ textAlign: "right", marginBottom: "8px" }}>
//               <button
//                 onClick={() => setZoomedImage(null)}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                 }}
//               >
//                 ✕
//               </button>
//             </div>
//             <img
//               src={zoomedImage || "/placeholder.svg"}
//               alt="Product Zoomed"
//               style={{
//                 maxWidth: "400px",
//                 maxHeight: "400px",
//                 objectFit: "contain",
//               }}
//             />
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// // Add this CSS after the imports
// const avatarStyles = `
//   .avatar-zoom {
//     position: fixed;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     z-index: 1000;
//     background-color: rgba(255, 255, 255, 0.95);
//     padding: 20px;
//     border-radius: 8px;
//     box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
//   }
//   .zoom-backdrop {
//     position: fixed;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-color: rgba(0, 0, 0, 0.5);
//     z-index: 999;
//   }
// `;

// export default TableComponentId;
