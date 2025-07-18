import { createContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import collect from "collect.js";
import swal from "sweetalert2";

import { useSelector, useDispatch } from "react-redux";

import {
  deleteAllTempPurchase,
  deleteTempPurchaseItem,
  postTempPurchase,
  updateTempPurchaseProducts,
} from "../../../../actions/tempPurchaseAction";
import { useTranslation } from "react-i18next";

export const State = createContext();

export default function StateContext({ children }) {
  let productLocationQuantityUpdateId = null;
  let productID = null;
  let prodQuantity = null;
  let prooo = "false";
  const [name, setName] = useState("");
  const [discountValue, setDiscountValue] = useState()
  const [address, setAddress] = useState("");
  const [invoiceShopAddress, setInvoiceShopAddress] = useState();
  const [shopAddress, setShopAddress] = useState();
  const [shopPhoneNo, setShopPhoneNo] = useState();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [website, setWebsite] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [listpurchase, setListpurchase] = useState([]);
  const [total, setTotal] = useState(0);
  const [width] = useState(641);
  // const [invoices, setInvoices] = useState([]);
  const [MRP, setMRP] = useState()
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalconfirm, setShowModalconfirm] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [Code, setCode] = useState("");
  const [Namee, setNamee] = useState("");
  const [Company, setCompany] = useState("");
  const [postTempPurchaseMainId, setPostTempPurchaseMainId] = useState();
  const [productColor, setProductColor] = useState("");
  const [Color, setColor] = useState("");
  const [ActualPrice, setActualPrice] = useState();
  const [CurrentPrice, setCurrentPrice] = useState();
  const [Quantity, setQuantitye] = useState();
  const [PurchaseQuantity, setPurchaseQuantity] = useState();
  const [Discount, setDiscount] = useState();
  const [selectedSaleItem, setSelectedSaleItem] = useState([]);
  const [quantityidset, setQuantityidset] = useState("");
  const [locationsetid, setLocationsetid] = useState("");
  const [purchaseReceiptNumber, setPurchaseReceiptNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseCompany, setPurchaseCompany] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [priceExcludingTax, setPriceExcludingTax] = useState()
  const [purchaseQuantityPrice, setPurchaseQuantityPrice] = useState("");
  const [purchaseDiscount, setPurchaseDiscount] = useState(0);
  const [purchaseExpenses, setPurchaseExpenses] = useState("");
  const [purchaseTotalTax, setPurchaseTotalTax] = useState("");
  const [purchaseTax, setPurchaseTax] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [purchaseProductPrice, setPurchaseProductPrice] = useState("");
  const [purchaseTotalDiscount, setPurchaseTotalDiscount] = useState("");
  const [purchaseTaxAmount, setPurchaseTaxAmount] = useState("");
  const [purchaseTaxPercentage, setPurchaseTaxPercentage] = useState("");
  const [godownId, setGodownId] = useState("");
  const [shopId, setShopId] = useState("");
  const [companyDefaultValue, setComapnyDefaultValue] = useState()
  const [selectedShopDefaultValue, setSelectedShopDefaultValue] = useState()
  const [purchaseTaxPercentageAmount, setPurchaseTaxPercentageAmount] =
    useState("");
  const [expense, setExpense] = useState()
  const [expensePrice, setExpensePrice] = useState(0)
  const [invoicePrice, setinvoicePrice] = useState()
  const [purchaseProductPriceTax, setPurchaseProductPriceTax] = useState("");
  const [purchaseTotalAmount, setPurchaseTotalAmount] = useState("");
  const [purchaseProductDiscount, setPurchaseProductDiscount] = useState("");
  const [purchaseProductExpense, setPurchaseProductExpense] = useState("");
  const [purchaseProductTax, setPurchaseProductTax] = useState("");
  const [purchaseProductPriceExcludeTax, setPurchaseProductPriceExcludeTax] =
    useState("");
  const [purchaseProductTotalAmount, setPurchaseProductTotalAmount] =
    useState("");
  const [expeseTotal, setExpeseTotal] = useState("");
  const [storageAddress, setStorageAddress] = useState("");
  const [storagePhoneNo, setStoragePhoneNo] = useState("");
  const [getLocationIdForAdministrator, setGetLocationIdForAdministrator] =
    useState("");
  const [purchaseFor, setPurchaseFor] = useState("");
  const [purchasedBy, setPurchasedBy] = useState(
    JSON.parse(localStorage.getItem("username"))
  );
  const [fetchingListData, setFetchingListData] = useState(false);
  const [tempPurchaseId, setTempPurchaseId] = useState();
  const [abc, setAbc] = useState(false);
  const [itemsAdded, setItemsAdded] = useState(false);
  const [itemsAvailable, setItemsAvailable] = useState(true);
  const [getTempPurchaseee, setGetTempPurchaseee] = useState();
  const [tempDeleteId, setTempDeleteId] = useState();
  const [clearData, setClearData] = useState(false);
  const componentRef = useRef();
  const [salesmanSalePrice, setSalesmanSalePrice] = useState()
  const [initialSalesmanSalePrice, setInitialSalesmanSalePrice] = useState()
  const [initialMinimumSalePrice, setInitialMinimumSalePrice] = useState()
  const [minimumSalePrice, setMinimumSalePrice] = useState()
  const [convertedTax, setConvertedTax] = useState()
  const [selectedRadioOption, setSelectedRadioOption] = useState("");
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { storage } = useSelector((state) => state.storage);
  const { productLocation } = useSelector((state) => state.productLocation);

  useEffect(() => {
    if (storage === "Something went wrong") {
      console.log(storage);
    } else if (storage?.length > 0) {
      console.log(storage);
      let Filtered = storage?.filter((data) => {
        // console.log(data.storageCode);
        // console.log(JSON.parse(localStorage.getItem("shopId")));
        if (
          JSON.parse(localStorage.getItem("shopId")) &&
          !data.storageCode
            .toString()
            .toLowerCase()
            .includes(
              JSON.parse(localStorage.getItem("shopId"))
                .toString()
                .toLowerCase()
            )
        ) {
          return false;
        }

        return true;
      });
      console.log(Filtered);
      setStorageAddress(Filtered[0]?.storageAddress);
      setStoragePhoneNo(Filtered[0]?.storagePhoneNo);
    }
  }, [storage]);

  useEffect(() => {
    const calculatePurchaseAmount = () => {
      // setPurchaseAmount(parseInt(purchasePrice) * parseInt(PurchaseQuantity) + parseInt(purchaseExpenses) - parseInt(purchaseDiscount))
      setExpeseTotal(purchaseExpenses * PurchaseQuantity);
      setPurchaseProductPrice(
        parseInt(MRP) * 1 +
          parseInt(purchaseExpenses) -
          parseInt(purchaseDiscount)
      );
      setPurchaseQuantityPrice(
        parseInt(MRP) * parseInt(PurchaseQuantity)
      );
    };
    calculatePurchaseAmount();
  }, [
    MRP,
    PurchaseQuantity,
    purchaseExpenses,
    purchaseDiscount,
    expeseTotal,
    setExpeseTotal,
  ]);


  useEffect(() => {
    const calculatePurchaseTaxPercentage = () => {
      // console.log(purchaseTaxPercentage);
      
    };
    calculatePurchaseTaxPercentage();
  }, [purchaseTaxPercentage]);
  
  // Calculating the Percentage from 18 to o.18
  useEffect(() => {
    const calculatePurchaseTaxPercentage = () => {
      // console.log(purchaseTaxPercentage);
      setPurchaseTaxPercentageAmount(parseInt(purchaseTaxPercentage) / 100);
      setConvertedTax(parseInt(purchaseTaxPercentage+100)  / 100);
    };
    calculatePurchaseTaxPercentage();
  }, [purchaseTaxPercentage]);


  // Calculating the Tax Amount, Product Price With Tax, Total Tax with Quantity

  useEffect(() => {
    const calculatePurchaseTax = () => {
      // console.log(purchaseTaxPercentageAmount);
      setPurchaseTaxAmount(
        parseInt((MRP/convertedTax) * parseInt(purchaseTaxPercentageAmount))
      );
      setPurchaseProductPriceTax(
        parseInt((MRP/convertedTax) * parseInt(purchaseTaxPercentageAmount))
      );
      setPurchaseTotalTax(
        Math.floor(
          parseInt(MRP/convertedTax) *
            parseInt(PurchaseQuantity) *
            purchaseTaxPercentageAmount
        )
      );
    };
    console.log(MRP, convertedTax, purchaseTaxPercentageAmount)
    console.log((MRP/convertedTax) * parseInt(purchaseTaxPercentageAmount))
    calculatePurchaseTax();
  }, [
    purchaseAmount,
    purchaseProductPrice,
    MRP,
    purchaseTaxPercentageAmount,
    PurchaseQuantity,
  ]);

  useEffect(()=>{
    console.log(purchaseTotalTax)
  }, [purchaseTotalTax])

  useEffect(() => {
    console.log(purchasePrice)
    // const calculatePurchaseTotalAmount = () => {
        setPurchaseTotalAmount(
        parseInt(purchasePrice) * parseInt(PurchaseQuantity)
         
      );
      setPurchaseProductTotalAmount(
        parseInt(purchaseProductPrice) + parseInt(purchaseProductPriceTax)
      );
    // };
    // calculatePurchaseTotalAmount();
  }, [
    invoicePrice,
    purchasePrice,
    expensePrice,
    purchaseDiscount,
    purchaseProductPrice,
    purchaseProductPriceTax,
    purchaseQuantityPrice,
    purchaseTotalTax,
    purchaseExpenses,
    purchaseTaxAmount,
    purchaseTotalDiscount,
  ]);

  // useEffect(()=>{
  //   const SSPPercentage = initialSalesmanSalePrice/100;
  //   const SSPDiscountAmount = SSPPercentage * MRP
  //   console.log(SSPPercentage)
  //   console.log(SSPDiscountAmount)
  //   setSalesmanSalePrice(parseInt(MRP) - SSPDiscountAmount )
  // }, [initialSalesmanSalePrice])

  // useEffect(()=>{
  //   const MSPPercentage = initialMinimumSalePrice/100;
  //   const MSPDiscountAmount = MSPPercentage * MRP
  //   console.log(MSPPercentage)
  //   console.log(MSPDiscountAmount)
  //   setMinimumSalePrice(parseInt(MRP) - MSPDiscountAmount )
  // }, [initialMinimumSalePrice])

  // Submit form function
  const handleSubmit = async () => 
  {
    // console.log(purchaseTaxPercentage);
    // console.log(purchaseTaxPercentageAmount);
    let newItems;
    if(Code,
      Namee,
      Company,
      Color,
      productColor,
      purchasePrice,
      PurchaseQuantity,
      purchaseQuantityPrice,
      purchaseTotalTax, 
      expeseTotal,
      discountValue,
      purchaseTotalDiscount,
      purchaseProductTotalAmount,
      invoicePrice,
      purchaseTotalAmount,
      amount,
      quantityidset,
      locationsetid,
      purchasePrice,
      purchaseDiscount,
      purchaseExpenses,
      purchaseProductPriceExcludeTax,
      purchaseProductDiscount,
      purchaseTaxPercentage,
      expense,
      purchaseProductTax,
      purchaseProductPriceTax,
      salesmanSalePrice,
      minimumSalePrice,
      invoicePrice,
      discountValue,
      expense,
      MRP)
      {
         newItems = {
          id: uuidv4(),
          Code,
          Namee,
          Company,
          Color,
          productColor,
          purchasePrice,
          PurchaseQuantity,
          purchaseQuantityPrice,
          purchaseTotalTax, 
          expeseTotal,
          discountValue,
          purchaseTotalDiscount,
          purchaseProductTotalAmount,
          invoicePrice,
          purchaseTotalAmount,
          amount,
          quantityidset,
          locationsetid,
          purchasePrice,
          purchaseDiscount,
          purchaseExpenses,
          purchaseProductPriceExcludeTax,
          purchaseProductDiscount,
          purchaseTaxPercentage,
          expense,
          purchaseProductTax,
          purchaseProductPriceTax,
          godownId,
          shopId,
          salesmanSalePrice,
          minimumSalePrice,
          invoicePrice,
          discountValue,
          expense,
          MRP
        };
    
      
  
    // await updatequantity(newItems);
    setFetchingListData(false);
    let shopNo = JSON.parse(localStorage.getItem("shopId"));
    let listLength = getTempPurchaseee?.length;
    console.log(listLength);
    let added = "no";

    console.log(getTempPurchaseee);
    for (let i = 0; i < listLength; i++) {
      if (
        getTempPurchaseee &&
        getTempPurchaseee?.length > 0 &&
        getTempPurchaseee[i].shopNo === shopNo &&
        getTempPurchaseee[i].clientName === clientName &&
        getTempPurchaseee[i]._id === postTempPurchaseMainId
      ) {
        ////****** update list in temporary Sale Table ******///
        console.log("called");
        added = "yes";
        console.log(getTempPurchaseee[i]._id);
        dispatch(
          updateTempPurchaseProducts(
            getTempPurchaseee[i]._id,
            newItems.id,
            Code,
            Color,
            Namee,
            Company,
            productColor,
            PurchaseQuantity,
            purchasePrice,
            MRP,
            purchaseQuantityPrice,
            purchaseTotalTax,
            expeseTotal,
            discountValue,
            // purchaseTotalDiscount,
            purchaseProductTotalAmount,
            invoicePrice,
            // CurrentPrice,
            purchaseProductPriceExcludeTax,
            purchaseProductDiscount,
            expense,
            // purchaseProductExpense,
            purchaseProductTax,
            // purchaseTaxPercentage,
            purchaseTotalAmount,
            amount,
            quantityidset,
            locationsetid,
            salesmanSalePrice,
            minimumSalePrice
          )
        );
      }
    }
    if (added === "no") {
      console.log("called2");
      console.log(newItems);
      dispatch(
        postTempPurchase(
          clientName,
          purchaseReceiptNumber,
          purchaseCompany,
          purchaseDate,
          purchaseFor,
          selectedRadioOption,
          shopAddress,
          shopPhoneNo,
          shopId,
          godownId,
          purchasedBy,
          newItems
        )
      );
    }
    setListpurchase([...listpurchase, newItems]);
    setIsEditing(false);
  }else{
    swal
    .fire({
      icon: "error",
      title: t("Alert!"),
      text: t("something is missing in data"),
      customClass: {
        popup: "custom-swal-popup", // This is the custom class you're adding
      },
    })
    }
  };

  // Calculate items amount function
  useEffect(() => {
    const calculateAmount = (amount) => {
      setAmount(PurchaseQuantity * ActualPrice - Discount);
    };

    calculateAmount(amount);
  }, [
    amount,
    ActualPrice,
    Quantity,
    setAmount,
    CurrentPrice,
    PurchaseQuantity,
    Discount,
  ]);

  const calculateTotal = () => {
    const allItems = listpurchase?.map((item) => item.purchaseTotalAmount);

    setTotal(collect(allItems).sum());
  };

  useEffect(() => {
    calculateTotal();
  });

  // Delete function
  // const deleteRow = async (id) => {
  //   // console.log("called");
  //   console.log(id);
  //   setListpurchase(listpurchase?.filter((row) => row.id !== id));
  //   const result = listpurchase.find((item) => item.id === id);
  //   dispatch(deleteTempPurchaseItem(id));
  //   setShowModal(false);
  // };

  const context = {
    name,
    setName,
    address,
    setAddress,
    email,
    setEmail,
    phone,
    setPhone,
    bankName,
    setBankName,
    bankAccount,
    setBankAccount,
    website,
    setWebsite,
    clientName,
    setClientName,
    clientAddress,
    setClientAddress,
    invoiceNumber,
    setInvoiceNumber,
    invoiceDate,
    setInvoiceDate,
    dueDate,
    setDueDate,
    notes,
    setNotes,
    description,
    setDescription,
    quantity,
    setQuantity,
    price,
    setPrice,
    amount,
    setAmount,
    listpurchase,
    setListpurchase,
    total,
    setTotal,
    width,
    componentRef,
    // handlePrint,
    isEditing,
    setIsEditing,
    showModal,
    setShowModal,
    handleSubmit,
    // deleteRow,
    showLogoutModal,
    setShowLogoutModal,
    Code,
    setCode,
    Namee,
    setNamee,
    Company,
    setCompany,
    Color,
    setColor,
    ActualPrice,
    setActualPrice,
    CurrentPrice,
    setCurrentPrice,
    Quantity,
    setQuantitye,
    PurchaseQuantity,
    setPurchaseQuantity,
    Discount,
    setDiscount,
    showModalconfirm,
    setShowModalconfirm,
    selectedSaleItem,
    setSelectedSaleItem,
    quantityidset,
    setQuantityidset,
    locationsetid,
    setLocationsetid,
    purchaseReceiptNumber,
    setPurchaseReceiptNumber,
    purchaseDate,
    setPurchaseDate,
    purchaseCompany,
    setPurchaseCompany,
    purchasePrice,
    setPurchasePrice,
    purchaseDiscount,
    setPurchaseDiscount,
    purchaseExpenses,
    setPurchaseExpenses,
    purchaseTax,
    setPurchaseTax,
    purchaseTotalAmount,
    setPurchaseTotalAmount,
    purchaseAmount,
    setPurchaseAmount,
    purchaseProductPrice,
    setPurchaseProductPrice,
    purchaseProductPriceTax,
    setPurchaseProductPriceTax,
    purchaseProductTotalAmount,
    setPurchaseProductTotalAmount,
    purchaseQuantityPrice,
    setPurchaseQuantityPrice,
    purchaseTotalTax,
    setPurchaseTotalTax,
    purchasePrice,
    purchaseDiscount,
    purchaseExpenses,
    purchaseProductPriceTax,
    setPurchasePrice,
    setPurchaseDiscount,
    setPurchaseExpenses,
    setPurchaseProductPriceTax,
    purchaseProductDiscount,
    setPurchaseProductDiscount,
    purchaseProductExpense,
    setPurchaseProductExpense,
    purchaseProductTax,
    setPurchaseProductTax,
    purchaseProductPriceExcludeTax,
    setPurchaseProductPriceExcludeTax,
    purchaseTaxPercentage,
    setPurchaseTaxPercentage,
    storageAddress,
    storagePhoneNo,
    getLocationIdForAdministrator,
    setGetLocationIdForAdministrator,
    purchaseFor,
    setPurchaseFor,
    purchasedBy,
    fetchingListData,
    setFetchingListData,
    convertedTax, setConvertedTax,
    tempPurchaseId,
    setTempPurchaseId,
    abc,
    setAbc,
    itemsAdded,
    setItemsAdded,
    itemsAvailable,
    setItemsAvailable,
    getTempPurchaseee,
    setGetTempPurchaseee,
    tempDeleteId,
    setTempDeleteId,
    clearData,
    setClearData,
    selectedRadioOption,
    setSelectedRadioOption,
    shopId,
    setShopId,
    godownId,
    setGodownId,
    shopAddress,
    setShopAddress,
    shopPhoneNo,
    setShopPhoneNo,
    productColor,
    setProductColor,
    postTempPurchaseMainId,
    setPostTempPurchaseMainId,setPurchaseTotalDiscount,selectedShopDefaultValue, setSelectedShopDefaultValue,
    invoiceShopAddress,invoicePrice, setinvoicePrice, expensePrice, setExpensePrice, expense, setExpense,discountValue, setDiscountValue,
    setInvoiceShopAddress,minimumSalePrice, setMinimumSalePrice,salesmanSalePrice, setSalesmanSalePrice,MRP, setMRP,companyDefaultValue, setComapnyDefaultValue, 
    initialMinimumSalePrice, setInitialMinimumSalePrice, initialSalesmanSalePrice, setInitialSalesmanSalePrice,priceExcludingTax, setPriceExcludingTax
  };

  return <State.Provider value={context}>{children}</State.Provider>;
}
