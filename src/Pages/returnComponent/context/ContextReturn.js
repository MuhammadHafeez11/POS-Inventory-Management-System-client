import { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import collect from "collect.js";
import { useDispatch } from "react-redux";
export const ReturnState = createContext();
export default function StateContext({ children }) {
    const [saleId, setSaleId] = useState()
    const [invoiceNumber, setInvoiceNumber] = useState()
    const [shopNo, setShopNo] = useState()
    const [isModelOpen, setIsModelOpen] = useState(false)
  const [customerName, setCustomerName] = useState();
  const [customerNumber, setCustomerNumber] = useState();
  const [address, setAddress] = useState();
  const [phoneNo, setPhoneNo] = useState()
  const [returnBy, setReturnBy] = useState()
  const [Code, setCode] = useState()
  const [color, setColor] = useState("");
  const [name, setName] = useState("");
  const [Company, setCompany] = useState("");
  const [returnQuantity, setReturnQuantity] = useState();
  const [purchasePrice, setPurchasePrice] = useState()
  const [amount, setAmount] = useState("");
  const [quantityidset, setQuantityidset] = useState("");
  const [locationsetid, setLocationsetid] = useState("");
  const [Discount, setDiscount] = useState();
  const [excludeTaxPrice, setExcludeTaxPrice] = useState("");
  const [totalAmounnt, setTotalAmounnt] = useState("");
  const [purchaseInvoicePrice, setPurchaseInvoicePrice] = useState()
  const [taxAmount, setTaxAmount] = useState("");
  const [minimumSalePrice, setMinimumSalePrice] = useState()
  const [salesmanSalePrice, setSalesmanSalePrice] = useState()
  const [productColor, setProductColor] = useState("")
  const [total, setTotal] = useState()
  const [invoiceNoDefault, setInvoiceNoDefault] = useState()
  const [totalQuantity, setTotalQuantity] = useState()
  const [grandPriceTotal, setGrandPriceTotal] = useState()
  const [totalSaleValue, setTotalSaleValue] = useState()
  const [totalTaxCharged, setTotalTaxCharged] = useState()
  const [totalDiscount, setTotalDiscount] = useState()
  const [taxPercentage, setTaxPercentage] = useState()
  const [saleInvoiceNo, setSaleInvoiceNo] = useState()
  const [singleProductDiscount, setSingleProductDiscount] = useState()
  const [taxPercentageValue, setTaxPercentageValue] = useState()
  const [convertedTax, setConvertedTax] = useState()
  const [fbrAmount, setFbrAmount] = useState()
  const [fbrTotalAmount, setFbrTotalAmount] = useState()
  const [fbrTotalReturnAmount, setFbrTotalReturnAmount] = useState()
  const [fbrTotalBillAmount, setFbrTotalBillAmount] = useState()
  const [singleQuantityTax, setSingleQuantityTax] = useState()
  const [listMaxQuantity, setListMaxQuantity] = useState()
  const [fbrInvoiceNumber, setFbrInvoiceNumber] = useState()
  const [listId, setListId] = useState()
  const [invoiceNo, setInvoiceNo] = useState("")
  const [id, setId] = useState();
  const [PCTCode, setPCTCode] = useState()
  const [products, setProducts] = useState([])
  const dispatch = useDispatch();

  

  /////////==========================================////
  ///========== Handle All list Data & saving Sale Temp Data=========/////////
  ///////========================================/////////
  const handleSubmit = async () => {
      /////******* set Data in list first time  ********//////
      const newItems = {
        id,
        Code,
        color,
        name,
        Company,
        productColor,
        returnQuantity,
        amount,
        quantityidset,
        locationsetid,
        Discount,
        excludeTaxPrice,
        productColor,
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
      setProducts([...products, newItems]);
      setId('')
    setCode('');
    setName('');
    setCompany('');
    setReturnQuantity('');
    setDiscount('');
    setAmount('');
    setColor('');
    setExcludeTaxPrice(''); 
    setPurchaseInvoicePrice('');
    setLocationsetid('')
    setMinimumSalePrice('')
    setSalesmanSalePrice('')
    setPurchasePrice('')
    setQuantityidset('')
    setTaxAmount('')
    setTotalAmounnt('')
    setTaxPercentage('')
    setPCTCode('')
  };


  useEffect(() => {
    console.log('fei')
    console.log(excludeTaxPrice, returnQuantity)
    setTotalAmounnt(parseInt(excludeTaxPrice) * parseInt(returnQuantity));
  
  }, [returnQuantity]);

  

  useEffect(()=>{
    console.log(singleProductDiscount, returnQuantity)
    setDiscount(parseInt(singleProductDiscount) * parseInt(returnQuantity))
  }, [singleProductDiscount, returnQuantity]);



  useEffect(() => {
    setTaxAmount(
      parseInt((singleQuantityTax * returnQuantity).toFixed(2))
    );
  }, [singleQuantityTax, returnQuantity]);

  useEffect(() => {
    console.log(parseInt(parseInt(excludeTaxPrice)/1.18) * parseInt(returnQuantity))
    setFbrAmount(parseInt(parseInt(excludeTaxPrice)/1.18) * parseInt(returnQuantity))
    setFbrTotalAmount(parseInt(parseInt(excludeTaxPrice) * parseInt(returnQuantity)))
  }, [returnQuantity, excludeTaxPrice]);


  useEffect(() => {
    const calculateAmount = (amount) => {
      const abc = totalAmounnt + taxAmount - Discount;
      console.log(totalAmounnt, taxAmount, Discount)
      console.log(abc);
      setAmount(
        parseInt(totalAmounnt)  - parseInt(Discount)
      );
    };

    calculateAmount(amount);
  }, [totalAmounnt, Discount]);


 useEffect(()=>{
  calculateTotal()
 },[products])

  const calculateTotal = () => {
    console.log(products)
    const allItems = products?.map((item) => item.amount);
    const allQuantities = products?.map((item) => item.returnQuantity);
    const allprice = products?.map((item) => item.excludeTaxPrice);
    const allTotalAmount = products?.map((item) => item.totalAmounnt);
    const allTaxAmount = products?.map((item) => item.taxAmount);
    const allgrandDiscount = products?.map((item) => item.Discount);
    const filterFBRReturnValue = products?.map((item) => item.fbrAmount);
    const filterFBRBillAmount = products?.map((item) => item.fbrTotalAmount);
    setTotal(collect(allItems).sum());
    setTotalQuantity(collect(allQuantities).sum());
    setGrandPriceTotal(collect(allprice).sum());
    setTotalSaleValue(collect(allTotalAmount).sum());
    setTotalTaxCharged(collect(allTaxAmount).sum());
    setTotalDiscount(collect(allgrandDiscount).sum());
    setFbrTotalReturnAmount(collect(filterFBRReturnValue).sum())
    setFbrTotalBillAmount(collect(filterFBRBillAmount).sum())
  };

  // useEffect(() => {
  //   // deleteCalled = "false";
  //   calculateTotal();
  // }, [products]);


  const context = {
    saleId, setSaleId,
    invoiceNumber,setInvoiceNumber,
    shopNo, setShopNo,
    customerName, setCustomerName,
    customerNumber, setCustomerNumber,
    address, setAddress,
    phoneNo,setPhoneNo,
    returnBy, setReturnBy,
    Code, setCode,
    color, setColor,
    name, setName, 
    Company, setCompany, 
    returnQuantity, setReturnQuantity,
    purchasePrice, setPurchasePrice,
    amount, setAmount,
    quantityidset, setQuantityidset,
    locationsetid, setLocationsetid,
    Discount, setDiscount,
    excludeTaxPrice, setExcludeTaxPrice,
    totalAmounnt, setTotalAmounnt,
    purchaseInvoicePrice, setPurchaseInvoicePrice,
    taxAmount,setTaxAmount,
    minimumSalePrice,setMinimumSalePrice,
    salesmanSalePrice,setSalesmanSalePrice,listId, setListId,
    total, setTotal,handleSubmit, products, setProducts,id, setId,invoiceNoDefault, setInvoiceNoDefault,
    totalQuantity, setTotalQuantity,invoiceNo, setInvoiceNo,PCTCode, setPCTCode,
    grandPriceTotal, setGrandPriceTotal,fbrInvoiceNumber, setFbrInvoiceNumber,
    totalSaleValue, setTotalSaleValue,isModelOpen, setIsModelOpen,setSingleProductDiscount,
    totalTaxCharged, setTotalTaxCharged, saleInvoiceNo, setSaleInvoiceNo,setSingleQuantityTax,setProductColor,
    totalDiscount, setTotalDiscount, taxPercentage, setTaxPercentage, calculateTotal,listMaxQuantity, setListMaxQuantity,
    fbrTotalAmount, setFbrTotalAmount,fbrTotalReturnAmount, setFbrTotalReturnAmount, fbrAmount, setFbrAmount,
    fbrTotalBillAmount, setFbrTotalBillAmount
  };

  return <ReturnState.Provider value={context}>{children}</ReturnState.Provider>;
}
