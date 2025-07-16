import React, { useState, useEffect, useContext } from "react";
import { Button, Dropdown, Table } from "semantic-ui-react";
import {  useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TableComponentId from "../../../Components/tableComponent/tableComponentId";
import { useSelector } from "react-redux";
import { ReturnState } from "../context/ContextReturn";
import PageLoader from "../../../Components/Loader/PageLoader";
import ReturnQuantityModel from "./ReturnQuantityModel";
const ReturnProductPage = () => {
  const [loc, setLoc] = useState("Hello");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const { t } = useTranslation();
  const {
    invoiceNumber,setInvoiceNumber,
    shopNo, setShopNo,
    customerName, setCustomerName,
    customerNumber, setCustomerNumber,
    address, setAddress,
    phoneNo,setPhoneNo,
    returnBy, setReturnBy,
    Code, setCode,
    color, setColor,
    name, setName, saleInvoiceDiscount, setSaleInvoiceDiscount,
    Company, setCompany, 
    returnQuantity, setReturnQuantity,setProductColor,
    purchasePrice, setPurchasePrice,
    amount, setAmount,
    quantityidset, setQuantityidset,
    PCTCode, setPCTCode,
    locationsetid, setLocationsetid,
    Discount, setDiscount,
    excludeTaxPrice, setExcludeTaxPrice,
    totalAmounnt, setTotalAmounnt,listId, setListId,
    purchaseInvoicePrice, setPurchaseInvoicePrice,
    taxAmount,setTaxAmount,  setSingleProductDiscount,
    minimumSalePrice,setMinimumSalePrice,listMaxQuantity, setListMaxQuantity,setSingleQuantityTax,
    salesmanSalePrice,setSalesmanSalePrice, isModelOpen, setIsModelOpen, saleInvoiceNo, setSaleInvoiceNo,
    total, setTotal,handleSubmit, products, setProducts, id, setId,taxPercentage, setTaxPercentage, calculateTotal
  } = useContext(ReturnState)
  
  const [colorTheme, setColorTheme] = useState("theme-white");
  const { saleRecordOnInvoiceNo, saleRecordOnInvoiceNoLoading, saleRecordOnInvoiceNoError } = useSelector((state)=> state.saleRecordOnInvoiceNo);
  const navigate = useNavigate();


  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
    }
  }, [colorTheme]);

  useEffect(()=>{
    // if(saleRecordOnInvoiceNo?.length > 0)
    // {
      console.log(saleRecordOnInvoiceNo)
      setCustomerName(saleRecordOnInvoiceNo?.sale[0]?.customerName)
      setCustomerNumber(saleRecordOnInvoiceNo?.sale[0]?.customerNumber)
      setAddress(saleRecordOnInvoiceNo?.sale[0]?.address)
      setPhoneNo(saleRecordOnInvoiceNo?.sale[0]?.phoneNo)
      setTotal(saleRecordOnInvoiceNo?.sale[0]?.total)
      setSaleInvoiceNo(saleRecordOnInvoiceNo?.sale[0]?.id)
    // }
   
  }, [saleRecordOnInvoiceNo, saleRecordOnInvoiceNoLoading])
 

  const returnProduct = async (items) => {
    setId(items.id)
    setCode(items.Code);
    setName(items.Namee);
    setCompany(items.Company);
    setListMaxQuantity(items.PurchaseQuantity);
    setSingleProductDiscount(parseInt(items.Discount) / parseInt(items.PurchaseQuantity));
    setSingleQuantityTax(parseInt(items.taxAmount) / parseInt(items.PurchaseQuantity));
    setProductColor(items.productColor)
    setColor(items.color);
    setExcludeTaxPrice(items.excludeTaxPrice); 
    setPurchaseInvoicePrice(items.purchaseInvoicePrice);
    setLocationsetid(items.locationsetid)
    setMinimumSalePrice(items.minimumSalePrice)
    setSalesmanSalePrice(items.salesmanSalePrice)
    setPurchasePrice(items.purchasePrice)
    setQuantityidset(items.quantityidset)
    setTaxPercentage(items.taxPercentage)
    setPCTCode(items.PCTCode) 
    setIsModelOpen(true)
  };

  const columns = [
    { field: "Code", label: "Code" },
    { field: "Namee", label: "Name" },
    { field: "color", label: "Color" },
    { field: "Company", label: "Company" },
    { field: "PurchaseQuantity", label: "Quantity" },
    { field: "excludeTaxPrice", label: "MRP" },
    { field: "totalAmounnt", label: "Total" },
    { field: "Discount", label: "Discount" },
    { field: "taxAmount", label: "Tax" },
    { field: "amount", label: "Due Amount" },
  ];
  const actions = [
    {
      label: "Return",
      labeladded: "Sold",
      color: "green",
      handler: (itemId) => returnProduct(itemId),
      url: null,
    },
  ];
  return (
    <>
      <div className={`Sale ${colorTheme}`}>
      <div className="secondContainer">
          <>
            <div className="purchaseProduct-box">
              <Button
                onClick={() => {
                  navigate("/returnProducts", {state: '/returnProductpage'});
                }}
              >
                Back
              </Button>
            </div>
            <div className="search-box">
            
            </div>

            <div className="table-container">
              {!saleRecordOnInvoiceNoLoading && saleRecordOnInvoiceNo?.sale?.length > 0 ? (
                <TableComponentId
                  data={saleRecordOnInvoiceNo?.sale[0]?.products}
                  columns={columns}
                  actions={actions}
                />
              ) : (
                <PageLoader />
              )}
            </div>

            {
              isModelOpen && <ReturnQuantityModel />
            }
          </>
      </div> </div>
    </>
  );
};

export default ReturnProductPage;
