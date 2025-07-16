 import React, { useContext, useState, useEffect, useRef } from "react";
import AsyncSelect from "react-select/async"
import { Link, Navigate, useNavigate } from "react-router-dom";
import { State } from "./context/stateContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import {
  Button,
} from "semantic-ui-react";
import swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { refreshTokken } from "../../../actions/userAction";
import { QURESHI_ELECTRONICS } from "../../../constants/companyNameContants";
let quantities = [];
let isCalled = "false";
const DiscountModel = () => {
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [isColorOpen, setIsColorOpen] = useState(false)
  const [colorName, setColorName] = useState()
  const colorDropdownRef = useRef(null)
  const { t } = useTranslation();
  const {
    Code,
    Color,
    Namee,
    Company,
    purchaseQuantityPrice,
    purchaseTotalTax,
    purchaseTotalDiscount,
    purchaseProductTotalAmount,
    purchaseTotalAmount,
    locationsetid,
    Quantity,
    setQuantitye,
    PurchaseQuantity,
    setPurchaseQuantity,
    setQuantityidset,
    expense, setExpense,
    quantityidset,
    setPurchaseProductTax,
    Discount,
    setDiscount,
    showModalconfirm,
    setShowModalconfirm,discountValue, setDiscountValue,
    listpurchase,
    setColor,
    purchasePrice,
    setPurchasePrice,
    purchaseDiscount,
    setPurchaseDiscount,
    purchaseExpenses,
    setPurchaseExpenses,
    purchaseTaxPercentage,
    setPurchaseTaxPercentage,
    productColor,setPurchaseTotalDiscount,convertedTax, setConvertedTax,
    setProductColor,invoicePrice, setinvoicePrice,expensePrice, setExpensePrice,
    setFetchingListData,priceExcludingTax, setPriceExcludingTax, MRP, setMRP, salesmanSalePrice, setSalesmanSalePrice, minimumSalePrice, setMinimumSalePrice,
    handleSubmit,initialMinimumSalePrice, initialSalesmanSalePrice, setInitialSalesmanSalePrice, setInitialMinimumSalePrice
  } = useContext(State);


  const [purcExpDiscount, setPurcExpDiscount] = useState()
  const firstDropdownRef = useRef(null);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [colorRecordList, setColorRecordList] = useState()
  const [colorNames, setColorNames] = useState()
  const { color, loading } = useSelector((state) => state.color);
  // console.log(quantityidset);

  const navigate = useNavigate();

  useEffect(() => {
    isCalled = "false";
  }, [
    PurchaseQuantity,
    purchaseDiscount,
    productColor,
    purchasePrice,
    purchaseTaxPercentage,
  ]);

  useEffect(()=>{
    if(!loading && color?.length > 0)
    {
      setColorNames(color?.sort())
    }

  }, [color, loading])

  useEffect(() => {
    if (isCalled === "false") {
      isCalled = "true";
      getToken();
    }
  }, [isCalled]);

  const getToken = async () => {
    const token = await refreshTokken();
    if (token?.data === "Please login to acces this resource") {
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

  useEffect(() => {
    // setExpense("")
    // setMinimumSalePrice("")
    // setSalesmanSalePrice("")
    setPurchaseQuantity("");
    // setDiscount("");
    setColor("");
    // setDiscountValue("")
    setProductColor("");
    setInitialMinimumSalePrice("")
    setInitialSalesmanSalePrice("")
    // setPurchaseDiscount(0);
    setPurchaseExpenses(0);
    // setPurchaseTaxPercentage("");
    // setinvoicePrice('')
    // setExpensePrice(0)
    // setPurchasePrice('')
    // setMRP('')
    quantities = Quantity;
    const max = Quantity;
    // Update the maxQuantity state variable
    setMaxQuantity(max);
  }, []);


  useEffect(()=>{
    if(color?.length > 0 && !loading)
    {
      setColorRecordList(color?.map(colorData =>({
        value: colorData.colorName,
        label: colorData?.colorName,
        colorId: colorData?._id
      })))
    }
  }, [color, loading])


  const loadColorOptions = (search, callBack) => {
    setTimeout(()=>{
      const filterOptions = colorRecordList?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }



  const handleMRP =(e) =>{
    if(e.target.value < 0){
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("MRPShoudGreateThanzero"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }else if(e.target.value.startsWith(0))
    {
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("valueCannotStartWithZero"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }
    else{
      setMRP(e.target.value)
      // setPriceExcludingTax(e.target.value)
    }
  }
  const handleinvoicePrice =(e) =>{
    if(e.target.value < 0){
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("purchasePriceShoudGreateThanzero"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }else if(e.target.value.startsWith(0))
    {
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("valueCannotStartWithZero"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }
    else{
      setinvoicePrice(e.target.value)
      setPurchasePrice(e.target.value)
      setPurcExpDiscount(e.target.value)
      // setPriceExcludingTax(e.target.value)
    }
  }


  const handlePurchasePrice =(e) =>{
    if(e.target.value < 0){
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("purchasePriceShoudGreateThanzero"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }else if(e.target.value.startsWith(0))
    {
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("valueCannotStartWithZero"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }
    else{
      setPurchasePrice(e.target.value)
      // setPriceExcludingTax(e.target.value)
    }
  }

  useEffect(()=>{
    console.log(purchasePrice)
    console.log(expensePrice)
    console.log(expense)
    console.log(purchaseDiscount)
    setPurchasePrice((parseInt(invoicePrice) + parseInt(expensePrice)) - parseInt(purchaseDiscount) )
  }, [expensePrice, purchaseDiscount, invoicePrice])



  const handleQuantity =(e) =>{
    if(e.target.value < 0){
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("QuantityShoudGreateThanzero"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }else if(e.target.value.startsWith(0))
    {
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("valueCannotStartWithZero"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }
    else{
      setPurchaseQuantity(e.target.value)
    }
  }

  const handleExpensePrice =(e) =>{
    if(e.target.value < 0){
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("purchasePriceShoudGreateThanzero"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }
    else if(e.target.value){
      setExpensePrice(parseInt(e.target.value)) 
      setExpense(parseInt(e.target.value))
      console.log(e.target.value);
      
    }
    else{
      setExpensePrice(0)
      setExpense('')
    }
  }
  
  const handleDiscount =(e) =>{
    console.log(purchasePrice)
    console.log(e.target.value)
    if(parseInt(e.target.value) < 0 || parseInt(e.target.value) > parseInt(purchasePrice)){
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("discountShouldGreaterThanZeroAndLessThanPurchasePrice"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }
    else if(e.target.value){
      // const purchaseAmount = purchasePrice
      setPurchaseDiscount(parseInt(e.target.value))
      setPurchaseTotalDiscount(parseInt(e.target.value))
      setDiscountValue(parseInt(e.target.value))
      // setPurchasePrice(purcExpDiscount - e.target.value)
    }else {
      setPurchaseDiscount(0)
      setPurchaseTotalDiscount(parseInt(0))
      setDiscountValue('')
    }
  }

  const handleTaxValue =(e) =>{
    if(e.target.value < 0){
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("QuantityShoudGreateThanzero"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }
    else{
      setPurchaseTaxPercentage(parseInt(e.target.value))
      setPurchaseProductTax(parseInt(e.target.value))
  
    }
  }

  const handleColorSelectChange = ( value) => {
    // const selectedOption = color.find((clr) => clr._id === value);
    let itemAvailable = false
    console.log(listpurchase)
    listpurchase?.map((list)=>{
      if(list?.quantityidset === quantityidset && list?.productColor === value.colorId)
      {
        itemAvailable = true
      }
    })
    if(itemAvailable)
    {
      setColorName('')
      setColor('')
      setProductColor('')
      setIsColorOpen(!isColorOpen)
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("Product is Already added in list"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }else{
      setColorName(value.label)
      setColor(value.label)
      setProductColor(value.colorId)
      setIsColorOpen(!isColorOpen)
    }
    
  };

  const sellProduct = () => {

    if (
      !PurchaseQuantity ||
      discountValue === "" ||
      !productColor ||
      !purchasePrice ||
      !MRP ||
      !salesmanSalePrice|| 
      !minimumSalePrice 
    ) {
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("textAllFieldsAreRequired"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }
    else if (parseInt(purchaseTaxPercentage) > 0 && parseInt(QURESHI_ELECTRONICS) === "QURESHI_ELECTRONICS_WITHOUT_FBR") {
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("textTaxShouldEqualToZero"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }
     else if (parseInt(purchaseTaxPercentage) < 0) {
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("textTaxShouldbegreaterThanOrEqualToZero"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    } else if (parseInt(MRP) < parseInt(purchasePrice)) {
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("MRPShouldGreaterThanPurchasePrice"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    } else  if (parseInt(salesmanSalePrice) > parseInt(MRP) || parseInt(minimumSalePrice) > parseInt(MRP)) {
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("SSPAndMSPShouldLessThanMRP"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    } else   if (parseInt(PurchaseQuantity) < 1) {
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("textPurchaseQuantityShouldBeGreaterThanZero"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    } else {
      console.log(purchaseTotalDiscount)
      console.log(locationsetid)
      console.log(Code, Color, Namee, Company, productColor, PurchaseQuantity, purchaseQuantityPrice, purchasePrice, discountValue)
      const errors = [];
      const missingFields = [];
      if (!Code) missingFields.push('Code');//
      if (!Color) missingFields.push('Color');//
      if (!Namee) missingFields.push('Namee');//
      if (!Company) missingFields.push('Company');//
      if (!productColor) missingFields.push('productColor');
      if (PurchaseQuantity == null || PurchaseQuantity < 1) missingFields.push('PurchaseQuantity');
      if (purchaseQuantityPrice == null || purchaseQuantityPrice < 0) missingFields.push('purchaseQuantityPrice');
      if (purchasePrice == null || purchasePrice < 0) missingFields.push('purchasePrice');
      if (purchaseTotalTax == null || purchaseTotalTax < 0) missingFields.push('purchaseTotalTax');
      if (discountValue == null || discountValue < 0) missingFields.push('discountValue');
      if (purchaseProductTotalAmount == null || purchaseProductTotalAmount < 0) missingFields.push('purchaseProductTotalAmount');
      if (invoicePrice == null || invoicePrice < 0) missingFields.push('invoicePrice');
      if (purchaseTotalAmount == null || purchaseTotalAmount < 0) missingFields.push('purchaseTotalAmount');
      if (!quantityidset) missingFields.push('quantityidset');//
      if (!locationsetid) missingFields.push('locationsetid');//
      if (MRP == null || MRP < 0) missingFields.push('MRP');//

      if (missingFields.length > 0) {
        errors.push({
          fields: missingFields,
        });
      }
      
      if (errors.length > 0) {
        const errorMessages = errors
          .map((error) => `Missing fields - ${error.fields.join(', ')}`)
          .join('\n');
        
        swal.fire({
          icon: "error",
          title: "Validation Error",
          html: `<pre>${errorMessages}</pre>`, // Shows only the missing fields
          showConfirmButton: true,
          customClass: {
            popup: "custom-swal-popup",
          },
        });
      }
        else{
          handleSubmit();
          navigate("/PurchaseRecipt", {state: "/purchaseDiscount"});
        }
    }
  };

  const handleKeyDown = (event) => {
    console.log(event)
    console.log(event.target)
    console.log(event.target.input)
    console.log(firstDropdownRef.current)
    if (event.key === 'Tab') {
       if(event.target === "taxinput"){
          console.log('fhed')
          setIsColorOpen(!isColorOpen)
        
      }
    
    }
  };

  useEffect(()=>{
    const handleClickColorOutside = (event) => {
         if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target)) {
           setIsColorOpen(false);
         }
         console.log('clikced')
       };
       window.addEventListener('click', handleClickColorOutside);
       return () => {
         window.removeEventListener('click', handleClickColorOutside);
       };
     }, [])


  const colorToggleDropdown = () => {
    setIsColorOpen(!isColorOpen);
  };

  return (
    <>
      <div className={`Purchase ${colorTheme}`}>
        
        <div className="secondContainer">
        <div className="form">
          <div className="formRow">
          <div className="inputSection">
              <label>{t("productColor")}</label>
              {/* <div style={{width: "80%"}}> */}
                 <AsyncSelect className="custom-dropdown"
                  loadOptions={colorRecordList?.length > 0 && loadColorOptions}
                   defaultOptions={colorRecordList} onChange={handleColorSelectChange}
                  //  isDisabled={isListHaveItem}
                   />
                
            </div>
            <div className="inputSection">
              <label>{t("quantity")}</label>
              <input
                label={t("quantityPurchase")}
                type="Number"
                placeholder={t("enterQty")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                value={PurchaseQuantity}
                onChange={handleQuantity}
              />
            </div>
           
          </div>
          <div className="formRow">
          <div className="inputSection">
              <label>{t("invoicePrice")}</label>
              <input
                type="Number"
                placeholder={t("enterinvoicePrice")}
                name="purcahsePrice"
                autoComplete="off"
                maxLength="40"
                required
                value={invoicePrice}
                onChange={handleinvoicePrice}
              />
            </div>
            <div className="inputSection">
              <label>{t("Expense")}</label>
              <input
                label={t("expense")}
                type="Number"
                placeholder={t("enterExpense")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                value={expense}
                onChange={handleExpensePrice}
              />
            </div>
         
          </div>
          <div className="formRow">
          <div className="inputSection">
              <label>{t("discount")}</label>
              <input
                type="Number"
                placeholder={t("enterDiscount")}
                name="purcahsePrice"
                autoComplete="off"
                maxLength="40"
                required
                value={discountValue}
                onChange={handleDiscount}
              />
            </div>
          <div className="inputSection">
              <label>{t("purchasePrice")}</label>
              <input
                type="Number"
                placeholder={t("enterPurchasePrice")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                disabled
                value={purchasePrice}
                // onChange={handleDiscount}
              />
            </div>
         
          </div>
          <div className="formRow">
          <div className="inputSection">
              <label>{t("mrp")}</label>
              <input
                label={t("productCode")}
                type="Number"
                placeholder={t("enterMRP")}
                name="productCode"
                autoComplete="off"
                maxLength="40"
                required
                value={MRP}
                onChange={handleMRP}
              />
            </div>
          <div className="inputSection">
              <label>{t("taxPercentage")}</label>
              <input
               type="number"
                placeholder={t("enterTaxPercentage")}
                name="productCode"
                autoComplete="off"
                className="taxinput"
                maxLength="40"
                required
                value={purchaseTaxPercentage}
                onChange={handleTaxValue}
              />
            </div>
           
          </div>
          <div className="formRow">
          <div className="inputSection">
              <label>{t("salesmanSalePrice")}</label>
              <input
                type="Number"
                placeholder={t("enterSalesmanSalePrice")}
                name="salesmanSalePrice"
                autoComplete="off"
                maxLength="40"
                required
                // value={initialSalesmanSalePrice}
                // onChange={(e)=> setInitialSalesmanSalePrice(e.target.value)}
                value={salesmanSalePrice}
                onChange={(e)=> setSalesmanSalePrice(e.target.value)}
              />
            </div>
           
          <div className="inputSection">
              <label>{t("minimumSalePrice")}</label>
              <input
               type="number"
                placeholder={t("enterMinimumSalePrice")}
                name="minimumSalePrice"
                autoComplete="off"
                className="taxinput"
                maxLength="40"
                required
                // value={initialMinimumSalePrice}
                // onChange={(e)=> setInitialMinimumSalePrice(e.target.value)}
                value={minimumSalePrice}
                onChange={(e)=> setMinimumSalePrice(e.target.value)}
              />
            </div>
         
          </div>
          <div className="buttonRow">
            <Button
              color={"green"}
              onClick={() => {
                navigate("/purchaseProductPage");
              }}
              className="button button-back"
              type="button"
            >
              <ArrowBackIcon />
              &nbsp; &nbsp;&nbsp;{t("back")}
            </Button>
            <Button
              onClick={() => {
                sellProduct();
              }}
              type="button"
              className={`button button-add-product `}
            >
              {t("add-product")}&nbsp;&nbsp;
              <AddIcon />
            </Button>
            {/* {showModalconfirm && <Showconfrm />} */}
          </div>
        </div>    
        </div>
      </div>
    </>
  );
};

export default DiscountModel;
