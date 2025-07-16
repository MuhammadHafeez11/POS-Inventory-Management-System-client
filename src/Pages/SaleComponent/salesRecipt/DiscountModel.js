import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Statee } from "./context/stateContext";
import { useTranslation } from "react-i18next";
import AsyncSelect from "react-select/async"
import {
  Button,
  Dropdown,
} from "semantic-ui-react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import swal from "sweetalert2";
import { QURESHI_ELECTRONICS, QURESHI_ELECTRONICSWithFBR, QURESHI_ELECTRONICSWithOUTFBR } from "../../../constants/companyNameContants";
import { getPCTCodeCompany, getPCTCodeOnCompanyAndTypeDetails } from "../../../actions/pctCodeAction";
import { useDispatch, useSelector } from "react-redux";

let quantities = [];
const SellProductPage = () => {
  const dispatch = useDispatch()
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const {
    price,
    list,
    Quantity,
    PurchaseQuantity,
    handleSubmit,
    setPurchaseQuantity,
    Discount,
    MRP, setMRP,
    setDiscount,
    showModalconfirm,
    setShowModalconfirm,
    productColor,setExcludeTaxPrice,
    excludeTaxPrice,
    quantityidset, PCTCode, setPCTCode,
    barBack,minimumSalePriceExceeded, setMinimumSalePriceExceeded,minimumSalePrice,
    minimumSaleValue
  } = useContext(Statee);

  const [producttType, setProducttType] = useState()
  const [companyRecordList, setCompanyRecordList] = useState()
  const [productCompany, setProductCompany] = useState()
  const [pctRecordList, setPCTRecordList] = useState()
  const [isListHaveItems, setIsListHaveItems] = useState()
  const [pctCodeDefaultValue, setPCTCodeDefaultValue] = useState()
  const [ companyDefaultValue, setCompanyDefaultValue] = useState()
  const [productTypeRecordList, setProductTypeRecordList] = useState()
  
  const { pctCodeCompanyLoading, pctCodeCompany } = useSelector((state) => state.pctCodeCompany) 
  // const [pctCode, setpctCode] = useState()
  const { distictCompanies, distictCompaniesLoading } = useSelector((state) => state.distictCompanies);
  const { productType } = useSelector((state) => state.productType);
  const [ pctCodeData, setpctCodeData ] = useState() 
  const { pctCodeOnCompanyAndType, pctCodeOnCompanyAndTypeLoading } = useSelector((state) => state.pctCodeOnCompanyType)
  const { t } = useTranslation();
  // console.log(quantityidset);

  const navigate = useNavigate();

  const backPage = () => {
    console.log(barBack);
    if (barBack === "true") {
       navigate("/saleproduct", {state: '/discountmodel'});
    } else {
      if (barBack === "false") {
        navigate("/saleproductpage", {state: '/discountmodel'});
      }
    }
  };

  // const handleTypeSelectChange = (value) => {
  //   setProducttType(value?.value)
  //   console.log("hellloooo")
  //   if(productCompany)
  //   {
  //     dispatch(getPCTCodeOnCompanyAndTypeDetails(value?.value, productCompany))
  //   }
  // };
  
  const handleCompanySelectChange = ( value ) => {
    console.log(value)
      setProductCompany(value.value);
      setCompanyDefaultValue(value);
      dispatch(getPCTCodeOnCompanyAndTypeDetails(value.value))
  };

  const handlePCTCodeSelectChange = ( value ) => {
   setPCTCode(value.value)
   setPCTCodeDefaultValue(value)
  };


  const loadPCTCodeOptions = (search, callBack) => {
    setTimeout(()=>{
      const filterOptions = pctRecordList?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }

  // const loadTypeOptions = (search, callBack) => {
  //   console.log(companyRecordList)
  //   setTimeout(()=>{
  //     const filterOptions = productTypeRecordList?.filter(option=> option?.label.toLowerCase().includes(search.toLowerCase()))
  //     callBack(filterOptions)
  //   }, 3000)
  // }

  const loadCompanyOptions = (search, callBack) => {
    console.log(companyRecordList)
    setTimeout(()=>{
      const filterOptions = companyRecordList?.filter(option=> option?.label.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }


  useEffect(()=>{
    if(productType?.length > 0)
    {
      setProductTypeRecordList(productType?.map(Data =>({
        value: Data._id,
        label: Data?.productName 
      })))
    }
  }, [productType])

  useEffect(()=>{
    dispatch(getPCTCodeCompany());
  }, [])

  useEffect(()=>{
    console.log(pctCodeCompany)
    if(pctCodeCompany?.length > 0 && !pctCodeCompanyLoading && pctCodeCompany!== "No Record Found")
    {
      setCompanyRecordList(pctCodeCompany?.map(companyData =>({
        value: companyData._id,
        label: companyData?.companyName 
      })))
    }
  }, [pctCodeCompanyLoading, pctCodeCompany])

  useEffect(()=>{
    if(!pctCodeOnCompanyAndTypeLoading && pctCodeOnCompanyAndType?.success)
    {
      console.log(pctCodeOnCompanyAndType)
      pctCodeOnCompanyAndType?.result?.map(Data =>{
          console.log(Data)
        })
      setPCTRecordList(pctCodeOnCompanyAndType?.result?.map(Data =>({
        value: Data.pctCode,
        label: Data?.pctCodeDescription?.pctDescription 
      })))
    }
  }, [pctCodeOnCompanyAndType, pctCodeOnCompanyAndTypeLoading])


  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    console.log(localStorage.getItem("theme-color"));
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
      document.body.className = currentThemeColor;
    }
  }, [colorTheme]);

  useEffect(() => {
    setPurchaseQuantity("");
    setDiscount("");
    if(QURESHI_ELECTRONICS === QURESHI_ELECTRONICSWithOUTFBR)
    {
      setPCTCode("00000000")
    }else{
      setPCTCode("")
    }
    quantities = Quantity;


    const max = Quantity;

    // Update the maxQuantity state variable
    setMaxQuantity(max);
  }, []);

  const sellProduct = () => {
    // if (quantity > PurchaseQuantity){

    let quantityAmount;
    list?.map((temp) => {
      if (
        temp?.quantityidset === quantityidset &&
        temp?.productColor === productColor
      ) {
        console.log(temp?.quantityidset);
        console.log(quantityidset);
        quantityAmount = temp?.PurchaseQuantity + PurchaseQuantity;
      }
    });
    if (Discount === "") {
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("Discount field should Not null"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }else
      if(PCTCode === "")
      {
        return swal.fire({
          icon: "error",
          title: t("titleOops"),
          text: t("textSelectPCTCode"),
          showConfirmButton: true,
          customClass: {
            popup: "custom-swal-popup", // This is the custom class you're adding
          },
        });
      }
    else
    if (Discount < 0) {
      if (PurchaseQuantity) {
        return swal.fire({
          icon: "error",
          title: t("titleOops"),
          text: t("textDiscountGreaterThan0"),
          showConfirmButton: true,
          customClass: {
            popup: "custom-swal-popup", // This is the custom class you're adding
          },
        });
      } else {
        return swal.fire({
          icon: "error",
          title: t("titleOops"),
          text: t("textSelectQuantity"),
          showConfirmButton: true,
          customClass: {
            popup: "custom-swal-popup", // This is the custom class you're adding
          },
        });
      }
    } else if (Discount >= excludeTaxPrice) {
      if (PurchaseQuantity) {
        return swal.fire({
          icon: "error",
          title: t("titleOops"),
          text: `${t("textLessThanPrice")} ${price}`,
          showConfirmButton: true,
        });
      } else {
        return swal.fire({
          icon: "error",
          title: t("titleOops"),
          text: t("textSelectQuantity"),
          showConfirmButton: true,
          customClass: {
            popup: "custom-swal-popup", // This is the custom class you're adding
          },
        });
      }
    } else {
      if (PurchaseQuantity < 1 || PurchaseQuantity > maxQuantity) {
        return swal.fire({
          icon: "error",
          title: t("titleOops"),
          text: `Quantity should be greater than zero && equal to ${maxQuantity}`,
          showConfirmButton: true,
          customClass: {
            popup: "custom-swal-popup", // This is the custom class you're adding
          },
        });
      } else if (!PurchaseQuantity) {
        return swal.fire({
          icon: "error",
          title: t("titleOops"),
          text: t("textSelectQuantity"),
          showConfirmButton: true,
          customClass: {
            popup: "custom-swal-popup", // This is the custom class you're adding
          },
        });
      } else if (quantityAmount > Quantity) {
        return swal.fire({
          icon: "error",
          title: t("titleOops"),
          html: `${t("textFewItemsAvalibleInList")} <br>${t(
            "textOnly"
          )} ${Quantity} ${t("textAvalibleItems")}`,
          showConfirmButton: true,
          customClass: {
            popup: "custom-swal-popup", // This is the custom class you're adding
          },
        });
      } else 
        if(minimumSalePriceExceeded)
          {
            return swal.fire({
              icon: "error",
              title: t("titleOops"),
              html: `${t("MinimumSalePrcieExceeded")} <br>${t("minimumSalePriceIs")} ${minimumSaleValue} `,
              showConfirmButton: true,
              customClass: {
                popup: "custom-swal-popup", // This is the custom class you're adding
              },
            });
          }else{
        handleSubmit();
        navigate("/saleproduct", {state: '/discountmodel'});
        // setShowModalconfirm(true);
      }
    }

    // navigate("/showconfirmdialogursubmitbox");
  };

  const Sellproductpage = () => {
    navigate("/saleproductpage");
  };
  const checkchange = (data) => {
    // console.log(data);
    setPurchaseQuantity(data);
    // console.log(PurchaseQuantity);
    // console.log(Quantity);
  };

  return (
    <>
      <div className={`Sale ${colorTheme}`}>
        <div className="secondContainer">
        <div className="form">
        <div className="formRow">
            <div className="inputSection">
              <label>
                {" "}
                {t("MRP")}{" "}
                {/* <span style={{ color: "red", margin: 0 }}>*</span>  */}
              </label>
              <input
                type="number"
                placeholder={t("saleQuantity")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                value={MRP}
                disabled
                // onChange={(e) => setExcludeTaxPrice(parseInt(e.target.value))}
              />
            </div>
            <div className="inputSection">
              <label>{t("salePrice")} <span style={{ color: "red", margin: 0 }}>*</span></label>
              <input
                type="number"
                placeholder={t("enterSaleDiscount")}
                name="Discount"
                autoComplete="off"
                maxLength="40"
                required
                value={excludeTaxPrice}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  setExcludeTaxPrice(newValue);
                }}
                // onChange={(e) => setExcludeTaxPrice(parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="formRow">
            <div className="inputSection">
              <label>
                {" "}
                {t("quantity")}{" "}
                <span style={{ color: "red", margin: 0 }}>*</span> (Available
                Item(s)={maxQuantity})
              </label>
              <input
                type="number"
                placeholder={t("saleQuantity")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                value={PurchaseQuantity}
                onChange={(e) => setPurchaseQuantity(parseInt(e.target.value))}
              />
            </div>
            <div className="inputSection">
              <label>{t("discount")} <span style={{ color: "red", margin: 0 }}>*</span></label>
              <input
                type="number"
                placeholder={t("enterSaleDiscount")}
                name="Discount"
                autoComplete="off"
                maxLength="40"
                required
                value={Discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
          </div>
          {
            QURESHI_ELECTRONICS === QURESHI_ELECTRONICSWithFBR && 
            (<>
          <div className="formRow">
              <div className="inputSection">
              <label>{t("productCompany")}</label>
              <AsyncSelect 
                  loadOptions={companyRecordList?.length > 0 && loadCompanyOptions}
                   defaultOptions={companyRecordList} onChange={handleCompanySelectChange}
                   defaultValue={companyDefaultValue}
                   />
              </div>
            <div className="inputSection">
            <label> {t("selectPCTCode")}</label>
               <AsyncSelect 
                  loadOptions={pctRecordList?.length > 0 && loadPCTCodeOptions}
                   defaultOptions={pctRecordList} onChange={handlePCTCodeSelectChange}
                   isDisabled={isListHaveItems} defaultValue={pctCodeDefaultValue}
                   />
             
              </div>
            </div>
         
         
          
            </>)
          }
         
          <div className="buttonRow">
            <Button
              color={"green"}
              onClick={backPage}
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
          </div>
        </div>
      </div>   </div>
    </>
  );
};

export default SellProductPage;
