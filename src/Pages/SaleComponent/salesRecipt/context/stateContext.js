import { createContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import collect from "collect.js";

import { useSelector, useDispatch } from "react-redux";
// import { getStorage } from "./../../../actions/storageAction";

import { getStorage } from "../../../../actions/storageAction";
import {
  deleteTempSaleItemList,
  getTemppSale,
  postTempSale,
  updateTempSaleProducts,
  updateTempSaleQuantityInListProducts,
} from "../../../../actions/tempSaleAction";
import { getShop } from "../../../../actions/shopAction";
export const Statee = createContext();
let isCalled = "false";
export default function StateContext({ children }) {
  /////////==========================================////
  ///========== All useContext Variables =========/////////
  ///////========================================/////////
  let productLocationQuantityUpdateId = null;
  const [userId, setUserId] = useState();
  const [name, setName] = useState("");
  const [latestQuantities, setLatestQuantities] = useState({});
  const [purchaseInvoicePrice, setPurchaseInvoicePrice] = useState();
  const [address, setAddress] = useState("");
  const [shopAddress, setShopAddress] = useState();
  const [shopPhoneNo, setShopPhoneNo] = useState();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [website, setWebsite] = useState("");
  const [clientName, setClientName] = useState("");
  const [serialNumber, setSerialNumber] = useState();
  const [clientAddress, setClientAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [productColor, setProductColor] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [width] = useState(641);
  const [purchasePrice, setPurchasePrice] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [showModaal, setShowModaal] = useState(false);
  const [showModalconfirm, setShowModalconfirm] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isdeletingrow, setIsdeletingrow] = useState(false);
  const [Code, setCode] = useState("");
  const [Namee, setNamee] = useState("");
  const [tempSaleMainId, setTempSaleMainId] = useState("");
  const [Company, setCompany] = useState("");
  const [color, setColor] = useState("");
  const [ActualPrice, setActualPrice] = useState();
  const [CurrentPrice, setCurrentPrice] = useState();
  const [Quantity, setQuantitye] = useState();
  const [PurchaseQuantity, setPurchaseQuantity] = useState();
  const [Discount, setDiscount] = useState();
  const [selectedSaleItem, setSelectedSaleItem] = useState([]);
  const [quantityidset, setQuantityidset] = useState("");
  const [locationsetid, setLocationsetid] = useState("");
  const [excludeTaxPrice, setExcludeTaxPrice] = useState("");
  const [MRP, setMRP] = useState();
  const [totalAmounnt, setTotalAmounnt] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [TotalIncludedAll, setTotalIncludedAll] = useState("");
  const [GrandQuantityTotal, setGrandQuantityTotal] = useState("");
  const [GrandPriceTotal, setGrandPriceTotal] = useState("");
  const [GrandTotalExludeTex, setGrandTotalExludeTex] = useState("");
  const [GrandTotalTax, setGrandTotalTax] = useState("");
  const [GrandDiscount, setGrandDiscount] = useState("");
  const [taxPercentage, setTaxPercentage] = useState("");
  const [taxPercentageAmount, setTaxPercentageAmount] = useState("");
  const [taxPercentageAmountt, setTaxPercentageAmountt] = useState("");
  const [fbrInvoiceNumber, setFbrInvoiceNumber] = useState("");
  const [sellExpenses, setSellExpenses] = useState("");
  const [totalExpense, setTotalExpense] = useState("");
  const [barcodeDisplay, setBarcodeDisplay] = useState("");
  const [storageAddress, setStorageAddress] = useState("");
  const [storagePhoneNo, setStoragePhoneNo] = useState("");
  const [barcode, setBarcode] = useState("");
  const [barBack, setBarBack] = useState("false");
  const [barLoader, setBarLoader] = useState(false);
  const [barButtonDisable, setBarButtonDisable] = useState(false);
  const [fetchingListData, setFetchingListData] = useState(false);
  const [shopIdForData, setShopIdForData] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [fbrAmount, setFbrAmount] = useState()
  const [fbrTotalAmount, setFbrTotalAmount] = useState()
  const [fbrTotalSaleAmount, setFbrTotalSaleAmount] = useState()
  const [fbrTotalBillAmount, setFbrTotalBillAmount] = useState()
  const [PCTCode, setPCTCode] = useState();
  const defaultCompanyOption = { label: "Dawlance", value: "dawlance" };
  const [selectedCompany, setSelectedCompany] = useState();
  const [convertedTax, setConvertedTax] = useState();
  /////*******temp sale */////
  const [getTempSale, setGetTempSale] = useState([]);
  const [itemsAdded, setItemsAdded] = useState(false);
  const [itemsAvailable, setItemsAvailable] = useState(true);
  const [listEmpty, setListEmpty] = useState(false);
  const [minimumSalePrice, setMinimumSalePrice] = useState();
  const [salesmanSalePrice, setSalesmanSalePrice] = useState();
  const [minimumSaleValue, setMinimumSaleValue] = useState();
  const [initialPayment, setInitialPayment] = useState();
  const [remainingAmount, setRemainingAmount] = useState();
  const [payments, setPayments] = useState({
    downPayment: "",
    paymentPayed: "",
    remaining: "",
  });
  const [remainingDuesDate, setRemainingDuesDate] = useState();
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  // const [purchaseInvoicePrice, setPurchaseInvoicePrice] = useState()
  const [minimumSalePriceExceeded, setMinimumSalePriceExceeded] =
    useState(false);
  const [saleBy, setSaleBy] = useState(
    JSON.parse(localStorage.getItem("username"))
  );
  let deleteCalled = "false";
  const dispatch = useDispatch();
  const componentRef = useRef();
  const { user } = useSelector((state) => state.user);
  const { storage } = useSelector((state) => state.storage);
  const { tempSale } = useSelector((state) => state.tempSale);
  const { tempSalePost } = useSelector((state) => state.tempSalePost);
  /////////==========================================////
  ///========== Handle DAta on the basis of login user =========/////////
  ///////========================================/////////

  useEffect(() => {
    call();
  }, []);

  useEffect(() => {
    if (storage === "No Godown found") {
    }
    if (storage?.length > 0) {
      console.log(storage);
      if (storage) {
        let Filtered = storage?.filter((data) => {
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
        setStorageAddress(Filtered[0]?.storageAddress);
        setStoragePhoneNo(Filtered[0]?.storagePhoneNo);
      } else {
        console.log("called");
      }
    }
  }, [storage]);

  async function call() {
    dispatch(getStorage());
  }

  useEffect(() => {
    if (window.innerWidth < width) {
      alert("Place your phone in landscape mode for the best experience");
    }
  }, [width]);

  /////////==========================================////
  ///========== Function to update the latest quantity for an item =========/////////
  ///////========================================/////////
  //
  const updateLatestQuantity = (itemId, quantity) => {
    setLatestQuantities((prevState) => ({
      ...prevState,
      [itemId]: quantity,
    }));
  };

  /////////==========================================////
  ///========== Handle All list Data & saving Sale Temp Data=========/////////
  ///////========================================/////////
  const handleSubmit = async () => {
    console.log(list);
    console.log(productColor);
    ///****** handle already present data in list *******////////
    const existingItem = list.find(
      (item) =>
        item.Code === Code &&
        item.Namee.trim() === Namee.trim() &&
        item.Company.trim() === Company.trim() &&
        item.productColor.trim() === productColor.trim()
    );
    console.log(existingItem);
    ////******* update list data if already present in list  ******//////
    if (existingItem) {
      const newItemsNotupdated = {
        Code,
        color,
        Namee,
        Company,
        PurchaseQuantity,
        productColor,
        amount,
        barcode,
        quantityidset,
        locationsetid,
        Discount,
        excludeTaxPrice,
        taxPercentage,
        totalAmounnt,
        taxAmount,
        shopIdForData,
        salesmanSalePrice,
        minimumSalePrice,
      };
      console.log(newItemsNotupdated);
      const updatedList = list?.map((item) => {
        if (item.Code === Code && item.productColor === productColor) {
          const updatedPurchaseQuantity =
            item.PurchaseQuantity + PurchaseQuantity;
          const updatedAmount = item.amount + amount;
          const quantityidsett = quantityidset;
          const locationsetidd = locationsetid;
          const shopIdForDataa = shopIdForData;
          const updatedDiscount = item.Discount + Discount;
          const updatedExcludeTaxPrice = item.excludeTaxPrice;
          const updatedTotalAmount = item.totalAmounnt + totalAmounnt;
          const updatedTaxAmount = item.taxAmount + taxAmount;

          updateLatestQuantity(item.id, updatedPurchaseQuantity); // Update the latest quantity separately for the item

          return {
            ...item,
            PurchaseQuantity: updatedPurchaseQuantity,
            amount: updatedAmount,
            quantityidset: quantityidsett,
            locationsetid: locationsetidd,
            shopIdForData: shopIdForDataa,
            Discount: updatedDiscount,
            excludeTaxPrice: updatedExcludeTaxPrice,
            totalAmounnt: updatedTotalAmount,
            taxAmount: updatedTaxAmount,
          };
        }
        return item;
      });
      //////***** set Updated list *******///////////
      setList(updatedList);
      // await updatequantity(newItemsNotupdated); // Call the updatequantity function for the existing item

      ////********** update list in the temporary Sale table ********////////////
      const length = updatedList?.length;
      for (let i = 0; i < length; i++) {
        const item = updatedList[i];
        console.log(item);
        dispatch(
          updateTempSaleQuantityInListProducts(
            tempSalePost?._id,
            item.PurchaseQuantity,
            item.purchasePrice,
            item.amount,
            item.Discount,
            item.excludeTaxPrice,
            item.totalAmounnt,
            item.taxAmount,
            item.quantityidset,
            item.locationsetid,
            item.shopIdForData
          )
        );
      }
    } else {
      /////******* set Data in list first time  ********//////
      const newItems = {
        id: uuidv4(),
        Code,
        color,
        Namee,
        Company,
        productColor,
        PurchaseQuantity,
        amount,
        barcode,
        quantityidset,
        locationsetid,
        shopIdForData,
        Discount,
        excludeTaxPrice,
        taxPercentage,
        totalAmounnt,
        taxAmount,
        salesmanSalePrice,
        minimumSalePrice,
        purchasePrice,
        purchaseInvoicePrice,
        PCTCode,
        fbrAmount, 
        fbrTotalAmount,
      };
      updateLatestQuantity(newItems.id, newItems.PurchaseQuantity); // Update the latest quantity separately for the new item
      // await updatequantity(newItems);
      setList([...list, newItems]);

      let shopNo = JSON.parse(localStorage.getItem("shopId"));
      let listLength = getTempSale?.length;
      console.log(getTempSale);
      console.log(listLength);
      console.log(shopNo);
      console.log(clientAddress);
      let added = "no";
      for (let i = 0; i < listLength; i++) {
        console.log(i);
        console.log(getTempSale[i]?.shopNo);
        console.log(getTempSale[i]?.customerNumber);
        if (
          getTempSale &&
          getTempSale?.length > 0 &&
          getTempSale[i]?.shopNo === shopNo &&
          getTempSale[i]._id === tempSaleMainId
        ) {
          ////****** update list in temporary Sale Table ******///
          console.log("update");

          added = "yes";
          console.log(added);
          dispatch(
            updateTempSaleProducts(
              getTempSale[i]._id,
              newItems.id,
              Code,
              color,
              Namee,
              Company,
              PurchaseQuantity,
              amount,
              barcode,
              quantityidset,
              locationsetid,
              productColor,
              shopIdForData,
              Discount,
              excludeTaxPrice,
              taxPercentage,
              totalAmounnt,
              taxAmount,
              salesmanSalePrice,
              minimumSalePrice,
              purchasePrice,
              purchaseInvoicePrice,
              PCTCode
            )
          );
        }
      }
      console.log(added);
      if (added == "no") {
        {
          console.log("called");
          ////******** adding data to the temporary Sale Table *****////
          console.log(clientName);
          console.log(serialNumber);
          console.log(clientAddress);
          dispatch(
            postTempSale(
              clientName,
              clientAddress,
              serialNumber,
              shopIdForData,
              shopAddress,
              shopPhoneNo,
              newItems
            )
          );
          // await AddTempSales(
          //   clientName,
          //   clientAddress,
          //   newItems
          //   )
        }
      }
    }
    setIsEditing(false);
    setFetchingListData(false);
  };

  /////////==========================================////
  ///========== All Calculation of the list Data=========/////////
  ///////========================================/////////
  useEffect(() => {
    setUserId(user?.user?._id);
  }, [user]);
  
  useEffect(() => {
    console.log("fei");
    setTotalAmounnt(
      parseInt(parseInt(excludeTaxPrice)) * parseInt(PurchaseQuantity)
    );
    setFbrAmount(parseInt(parseInt(excludeTaxPrice)/1.18) * parseInt(PurchaseQuantity))
    setFbrTotalAmount(parseInt(parseInt(excludeTaxPrice) * parseInt(PurchaseQuantity)))
  }, [PurchaseQuantity, excludeTaxPrice]);

  useEffect(() => {
    setTotalExpense(parseInt(sellExpenses) * parseInt(PurchaseQuantity));
  }, [sellExpenses, PurchaseQuantity, excludeTaxPrice]);

  useEffect(() => {
    console.log(taxPercentage);
    setTaxPercentageAmount(parseInt(taxPercentage) / 100);
    setConvertedTax(parseInt(taxPercentage + 100) / 100);
  }, [excludeTaxPrice, taxPercentage, totalAmounnt]);

  useEffect(() => {
    console.log(excludeTaxPrice);
    console.log(taxPercentageAmount);
    setTaxPercentageAmountt(
      parseInt(excludeTaxPrice / convertedTax) * taxPercentageAmount
    );
  }, [excludeTaxPrice, taxPercentageAmount, excludeTaxPrice]);

  useEffect(() => {
    console.log(taxPercentageAmountt);
    console.log(PurchaseQuantity);
    setTaxAmount(
      parseInt((taxPercentageAmountt * PurchaseQuantity).toFixed(2))
    );
  }, [taxPercentageAmountt, PurchaseQuantity]);

  // Calculate items amount function
  useEffect(() => {
    const calculateAmount = (amount) => {
      setAmount(parseInt(totalAmounnt) - parseInt(Discount));
    };

    calculateAmount(amount);
  }, [
    amount,
    ActualPrice,
    Quantity,
    CurrentPrice,
    PurchaseQuantity,
    Discount,
    taxAmount,
    totalAmounnt,
  ]);

  useEffect(() => {
    dispatch(getShop());
  }, []);

  useEffect(() => {
    console.log(totalAmounnt - Discount);
    console.log(minimumSalePrice * parseInt(PurchaseQuantity));
    if (
      totalAmounnt - Discount <
        salesmanSalePrice * parseInt(PurchaseQuantity) &&
      user?.user?.roles?.roleName === "Salesman"
    ) {
      console.log("salesman");
      setMinimumSaleValue(salesmanSalePrice);
      setMinimumSalePriceExceeded(true);
    } else if (
      totalAmounnt - Discount <
      minimumSalePrice * parseInt(PurchaseQuantity)
    ) {
      console.log("admin");
      setMinimumSaleValue(minimumSalePrice);
      setMinimumSalePriceExceeded(true);
    } else {
      setMinimumSalePriceExceeded(false);
    }
  }, [totalAmounnt, Discount, minimumSalePrice, salesmanSalePrice, PurchaseQuantity, user]);
 
  useEffect(() => {
    calculateTotal();
  },[list]);

  const calculateTotal = () => {
    const allItems = list?.map((item) => item.amount);
    const allQuantities = list?.map((item) => item.PurchaseQuantity);
    const allprice = list?.map((item) => item.excludeTaxPrice);
    const allTaxAmount = list?.map((item) => item.taxAmount);
    const allgrandDiscount = list?.map((item) => item.Discount);
    const filterFBRSaleValue = list?.map((item) => item.fbrAmount);
    const filterFBRBillAmount = list?.map((item) => item.fbrTotalAmount);
    const allTotalAmount = list?.map((item) => item.totalAmounnt);
 
    setGrandTotalExludeTex(collect(allTotalAmount).sum());
    setTotal(collect(allItems).sum());
    setGrandQuantityTotal(collect(allQuantities).sum());
    setGrandPriceTotal(collect(allprice).sum());
    setGrandTotalTax(collect(allTaxAmount).sum());
    setGrandDiscount(collect(allgrandDiscount).sum());
    setFbrTotalSaleAmount(collect(filterFBRSaleValue).sum())
    setFbrTotalBillAmount(collect(filterFBRBillAmount).sum())
  };



  // Edit function
  const editRow = (id) => {
    const editingRow = list.find((row) => row.id === id);
    setList(list?.filter((row) => row.id !== id));
    setIsEditing(true);
    setDescription(editingRow.description);
    setQuantity(editingRow.quantity);
    setPrice(editingRow.price);
  };

  useEffect(() => {
    if (tempSale?.length > 0 && listEmpty === true && deleteCalled === "true") {
      setList([]);
      setClientAddress("");
      setClientName("");
      setSerialNumber("");
    }
  }, [tempSale]);
  /////////==========================================////
  ///========== Delete Data from the list && Temporary sale Table=========/////////
  ///////========================================/////////
  // Delete function
  const deleteRow = async (id) => {
    deleteCalled = "true";
    console.log("calit ehie");
    setIsdeletingrow(true);
    setList(list?.filter((row) => row.id !== id));
    const result = list.find((item) => item.id === id);
    dispatch(deleteTempSaleItemList(id));
    dispatch(getTemppSale());
    setShowModaal(false);
    setIsdeletingrow(false);
  };

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
    serialNumber,
    setSerialNumber,
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
    list,
    setList,
    total,
    setTotal,
    width,
    componentRef,
    // handlePrint,
    isEditing,
    setIsEditing,
    showModaal,
    setShowModaal,
    handleSubmit,
    editRow,
    deleteRow,
    showLogoutModal,
    setShowLogoutModal,
    Code,
    setCode,
    Namee,
    setNamee,
    Company,
    setCompany,
    color,
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
    excludeTaxPrice,
    setExcludeTaxPrice,
    MRP,
    setMRP,
    totalAmounnt,
    setTotalAmounnt,
    taxAmount,
    setTaxAmount,
    TotalIncludedAll,
    setTotalIncludedAll,
    GrandQuantityTotal,
    setGrandQuantityTotal,
    GrandPriceTotal,
    setGrandPriceTotal,
    GrandTotalExludeTex,
    setGrandTotalExludeTex,
    GrandTotalTax,
    setGrandTotalTax,
    GrandDiscount,
    setGrandDiscount,
    fbrInvoiceNumber,
    setFbrInvoiceNumber,
    isdeletingrow,
    setIsdeletingrow,
    taxPercentage,
    setTaxPercentage,
    sellExpenses,
    setSellExpenses,
    storageAddress,
    storagePhoneNo,
    storageAddress,
    storagePhoneNo,
    saleBy,
    barcodeDisplay,
    setBarcodeDisplay,
    barcode,
    setBarcode,
    barBack,
    setBarBack,
    barLoader,
    setBarLoader,
    barButtonDisable,
    setBarButtonDisable,
    fetchingListData,
    setFetchingListData,
    productColor,
    setProductColor,
    getTempSale,
    setGetTempSale,
    tempSaleMainId,
    setTempSaleMainId,
    itemsAdded,
    setItemsAdded,
    itemsAvailable,
    setItemsAvailable,
    listEmpty,
    setListEmpty,
    shopIdForData,
    PCTCode,
    setPCTCode,
    setShopIdForData,
    userId,
    setUserId,
    shopAddress,
    convertedTax,
    setConvertedTax,
    setShopAddress,
    selectedCompany,
    setSelectedCompany,
    shopPhoneNo,
    purchasePrice,
    setPurchasePrice,
    payments,
    setPayments,
    setShopPhoneNo,
    isFirstTime,
    setIsFirstTime,
    minimumSalePriceExceeded,
    setMinimumSalePriceExceeded,
    purchaseInvoicePrice,
    setPurchaseInvoicePrice,
    minimumSalePrice,
    setMinimumSalePrice,
    salesmanSalePrice,
    setSalesmanSalePrice,
    setMinimumSaleValue,
    minimumSaleValue,
    initialPayment,
    setInitialPayment,
    remainingDuesDate,
    setRemainingDuesDate,
    remainingAmount,
    setRemainingAmount,
    paymentStatus,
    setPaymentStatus,fbrAmount, setFbrAmount,fbrTotalAmount, setFbrTotalAmount, fbrTotalSaleAmount, setFbrTotalSaleAmount, fbrTotalBillAmount, setFbrTotalBillAmount
  };

  return <Statee.Provider value={context}>{children}</Statee.Provider>;
}
