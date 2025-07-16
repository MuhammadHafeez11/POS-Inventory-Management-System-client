import React, { useEffect, useState } from "react";
import MetaData from "../../../../MetaData";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Dropdown, Form, Select, Modal } from "semantic-ui-react";
import { useCustomState } from "../../../../Variables/stateVariables";
import swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import { useProductDetails, useUpdateProduct } from "../../../../actionHooks/ProductUpdateHook";
import { refreshTokken } from "../../../../actions/userAction";
let isCalled = "false";
const data = [
  { key: "shop", text: "Shop", value: "shop" },
  { key: "store", text: "Store", value: "store" },
];

const API_URL = process.env.REACT_APP_BASE_URL;
const UpdateData = () => {
  const {
    productTypeeName,
    setProductTypeName,
    productCode,
    setProductCode,
    productName,
    setProductName,
    producttCompany,
    setProducttCompany,
    producttColor,
    setProducttColor,
  } = useCustomState();
  const [initialMinimumSalePercentage, setInitialMinimumSalePercentage] = useState()
  const [minimumSalePrice,setMinimumSalePrice] = useState()
  const [salesmanSalePrice, setSalesmanSalePrice] = useState()
  const [invoicePrice, setInvoicePrice] = useState()
  const [purchasePrice, setPurchasePrice] = useState()
  const [productExpenses, setProductExpenses] = useState()
  const [productDiscount, setProductDiscount] = useState()
  const [photoPrev, setPhotoPrev] = useState("")
  const [photo, setPhoto] = useState("")  
  const [initialSalesmanSalePercentage,setInitialSalesmanSalePercentage] = useState()
  const [MRP, setMRP] = useState()
  const [productTaxPrice, setProductTaxPrice] = useState()
  const [colorTheme, setColorTheme] = useState("theme-white");
  const { color } = useSelector((state) => state.color);
  const { company } = useSelector((state) => state.company);
  const { productType } = useSelector((state) => state.productType);
  let bool = "true";
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const params = useParams();
  const { data: productDetails, isLoading, error } = useProductDetails(params.id);
  const updateMutation = useUpdateProduct();

  const navigate = useNavigate();

  const handleTypeSelectChange = (event, { value }) => {
    setProductTypeName(value);
  };


  const handleProductCodeChange = (e) => {
    const validInput = e.toUpperCase().replace(/[^a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g, '');
    setProductCode(validInput);
  };


  const handleCompanySelectChange = (event, { value }) => {
    setProducttCompany(value);
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
    isCalled = "false";
  }, [productCode, productName]);

  useEffect(() => {
    if (isCalled === "false") {
      isCalled = "true";
      getToken();
    }
  }, [isCalled]);
  const getToken = async () => {
    const token = await refreshTokken();
    if (token.data === "Please login to acces this resource") {
      navigate("/login");
    }
    console.log(token);
  };

  const backPage = () => {
    navigate("/Record");
  };

  useEffect(() => {
    console.log(productDetails)
    if (productDetails) {

      setProductTypeName(productDetails.productTypeName.productName);
      setProductCode(productDetails.productCode);
      setProductName(productDetails.productName);
      setProducttCompany(productDetails.productCompany.companyName);
      setMRP(productDetails.productpriceExcludingTax);
      setPurchasePrice(productDetails.purchasePrice);
      setPhotoPrev(`${API_URL}/${productDetails.avatar}`)
      setPhoto(productDetails.avatar)
      setProductDiscount(productDetails.productDiscount);
      setProductExpenses(productDetails.productExpenses);
      console.log(productDetails.invoicePrice)
      setInvoicePrice(productDetails.invoicePrice);
      setSalesmanSalePrice(productDetails.salesmanSalePrice);
      setMinimumSalePrice(productDetails.minimumSalePrice);
      setProductTaxPrice(productDetails.productTaxPrice);
    }
  }, [productDetails]);

  useEffect(() => {
    console.log(params.id);
  }, []);

  

  useEffect(()=>{
    console.log(typeof MRP)
    console.log(typeof salesmanSalePrice)
    console.log(typeof minimumSalePrice)
  },[MRP, salesmanSalePrice, minimumSalePrice])

  const Updateproduct = async () => {
    if (!productName || !productCode || !productTypeeName || !producttCompany) {
      return swal.fire({
        icon: "error",
        title: t("titleError"),
        text: t("textAllFieldsAreRequired"),
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }else if (MRP < purchasePrice) {
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
      console.log(typeof salesmanSalePrice)
      console.log(typeof minimumSalePrice)
      console.log(typeof MRP)
      console.log("jfei")
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("SSPAndMSPShouldLessThanMRP"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    } else  {
      let colorId;
      let companyId;
      let productTypeId;

      company?.map((comp) => {
        if (comp.companyName === producttCompany) {
          console.log(comp._id);
          companyId = comp._id;
        }
      });

      productType?.map((type) => {
        if (type.productName === productTypeeName) {
          console.log(type._id);
          productTypeId = type._id;
        }
      });
      console.log(typeof salesmanSalePrice)
      console.log(typeof minimumSalePrice)
      console.log(typeof MRP)
      updateMutation.mutate({
        id: params.id,
        productTypeName: productTypeId,
        productCode,
        productName,
        productpriceExcludingTax: MRP,
        productCompany: companyId,
        minimumSalePrice,
        salesmanSalePrice,
        purchasePrice,
        productDiscount,
        productExpenses,
        invoicePrice,
        photo
      });
    }
  };

  
  const changeImageHandler =(e) =>{
    const file =e.target.files?.[0];
    const reader = new FileReader()
    if(file)
    {

      const maxSize = 400 * 1024; // 400KB in bytes
      console.log(file.size)
      console.log(maxSize)
      if (file.size > maxSize) {
        alert("Please select an image smaller than 400KB.");
        return;
      }

        reader.readAsDataURL(file);
        reader.onloadend =()=>{
            if(typeof reader.result === "string") 
            {
                setPhotoPrev(reader.result)
                setPhoto(file) 
            }
                
        }
    }
}

  useEffect(()=>{
    setPurchasePrice((parseInt(invoicePrice) + parseInt(productExpenses)) - parseInt(productDiscount) )
  }, [productExpenses, productDiscount, invoicePrice])

  return (
    <>
      <MetaData title="QE ~~UpdateProducts" />
      <div className={`Product ${colorTheme}`}>
        <div className="secondContainer">
          <div className="contentt-box">
            <div className="heading-container">
              <h3>{t("updateProduct")}</h3>
            </div>
          </div>
          <div className="imageUploadContainer">
            <label htmlFor="imageUpload" className="imageInputLabel">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={changeImageHandler}
                style={{ display: 'none' }}
              />
              {photoPrev ? (
                <img src={photoPrev} alt="Selected" className="imagePreview" />
              ) : (
                <div className="imagePlaceholder">Select Image</div>
              )}
            </label>
          </div>
          <div className="productForm">
            <div className="formRow">
              <div className="inputSection">
              <label>{t("productName")}</label>
              <input
                label={t("productName")}
                type="text"
                placeholder={t("enterProdName")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              </div>
            <div className="inputSection">
            <label>{t("productCode")}</label>
              <input
                label={t("productCode")}
                type="text"
                placeholder={t("enterProdCode")}
                name="productCode"
                autoComplete="off"
                maxLength="40"
                required
                value={productCode}
                onChange={(e)=>handleProductCodeChange(e.target.value)}
              />
              </div>
              <div className="inputSection">
              <label>{t("productPercentage")}</label>
              <input
                label={t("productPercentage")}
                type="number"
                placeholder={t("productTaxPercentage")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                disabled
                value={productTaxPrice}
                onChange={(e) => setProductTaxPrice(e.target.value)}
              />
              </div>
            </div>
            <div className="formRow">
              <div className="inputSection">
              <label>{t("invoicePrice")}</label>
              <input
               type="number"
                placeholder={t("enterinvoicePrice")}
                // name="purchasePrice"
                autoComplete="off"
                className="taxinput"
                maxLength="40"
                required
                value={invoicePrice}
                onChange={(e)=> {
                  setInvoicePrice(e.target.value)
                }
                }
              />
              </div>
            <div className="inputSection">
            <label>{t("expenses")}</label>
              <input
                type="Number"
                placeholder={t("enterExpenses")}
                name="salesmanSalePrice"
                autoComplete="off"
                maxLength="40"
                required
                value={productExpenses}
                onChange={(e)=> {
                  setProductExpenses(e.target.value)
                }}
              />
              </div>
              <div className="inputSection">
              <label>{t("discount")}</label>
              <input
                type="Number"
                placeholder={t("enterDiscount")}
                name="salesmanSalePrice"
                autoComplete="off"
                maxLength="40"
                required
                value={productDiscount}
                onChange={(e)=> {
                  setProductDiscount(e.target.value)
                }}
              />
              </div>
            </div>
            <div className="formRow">
              <div className="inputSection">
              <label>{t("purchasePrice")}</label>
              <input
               type="number"
                placeholder={t("enterPurchasePrice")}
                name="purchasePrice"
                autoComplete="off"
                className="taxinput"
                maxLength="40"
                required
                disabled
                value={purchasePrice}
                onChange={(e)=> {
                  setPurchasePrice(e.target.value)
                }
                }
              />
              </div>
            <div className="inputSection">
            <label>{t("MRP")}</label>
              <input
                label={t("MRP")}
                type="number"
                placeholder={t("MRP")}
                // name="productType"
                autoComplete="off"
                // maxLength="40"
                required
                value={MRP}
                onChange={(e) => {
                  console.log(typeof e.target.value)
                  setMRP(e.target.value)}}
              />
              </div>
              <div className="inputSection">
              <label>{t("salesmanSalePrice")}</label>
              <input
                type="number"
                placeholder={t("enterSalesmanSalePrice")}
                name="salesmanSalePrice"
                autoComplete="off"
                // maxLength="40"
                required
                value={salesmanSalePrice}
                onChange={(e)=> {
                  console.log(typeof e.target.value)
                  setSalesmanSalePrice(e.target.value)
                }}
              />
              </div>
            </div>
            <div className="formRow">
              <div className="inputSection">
              <label>{t("minimumSalePrice")}</label>
              <input
               type="number"
                placeholder={t("enterMinimumSalePrice")}
                name="minimumSalePrice"
                autoComplete="off"
                className="taxinput"
                // maxLength="40"
                required
                value={minimumSalePrice}
                onChange={(e)=> {
                  setMinimumSalePrice(e.target.value)
                }
                }
              />
              </div>
            <div className="inputSection">
            <label>{t("productCompany")}</label>
              <Dropdown
                className="dropdown"
                options={company?.map((comp) => ({
                  key: comp.companyName,
                  text: comp.companyName,
                  value: comp.companyName,
                }))}
                placeholder={t("enterProdCompany")}
                selection
                search
                required
                autoComplete="off"
                value={producttCompany}
                onChange={handleCompanySelectChange}
              />
              </div>
              <div className="inputSection">
              <label>{t("productType")}</label>
              <Dropdown
                className="dropdown"
                options={productType?.map((element) => ({
                  key: element.productName,
                  text: element.productName,
                  value: element.productName,
                }))}
                placeholder={t("enterProdType")}
                selection
                search
                required
                value={productTypeeName}
                onChange={handleTypeSelectChange}
              />
              </div>
            </div>
            <div className="buttonRow">
            <Button
              onClick={backPage}
              className="button button-back"
              type="button"
            >
              <ArrowBackIcon />
              &nbsp; &nbsp;&nbsp;{t("back")}
            </Button>
            <Button
              onClick={Updateproduct}
              type="button"
              className={`button button-add-product `}
            >
              {t("updateProduct")}&nbsp;&nbsp;
              <AddIcon />
            </Button>
            </div>
            {/* {!loading ? (
              <div className="table-container">
            <TableComponentId
              data={data}
              columns={columns}
            />
                </div>
          ) : (<>
          <div className="Product-table-container-loader">
          <PageLoader />
          </div>
         
          </>
           
          )} */}
          </div>
        </div>
      </div>
      {/* <div className={`Products ${colorTheme}`}>
        <div className="formInput">
          
          <div className="formUpdate">
          <div className="FormHeading-box">
              <div className="heading-container">
                <h3>{t("updateProduct")}</h3>
              
              </div>
              </div>
          <div className="row">
            <div className="form1">
              <label>{t("productName")}</label>
              <input
                label={t("productName")}
                type="text"
                placeholder={t("enterProdName")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="form1">
              <label>{t("productCode")}</label>
              <input
                label={t("productCode")}
                type="text"
                placeholder={t("enterProdCode")}
                name="productCode"
                autoComplete="off"
                maxLength="40"
                required
                value={productCode}
                onChange={(e)=>handleProductCodeChange(e.target.value)}
              />
            </div>
            <div className="form1">
              <label>{t("productPercentage")}</label>
              <input
                label={t("productPercentage")}
                type="number"
                placeholder={t("productTaxPercentage")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                disabled
                value={productTaxPrice}
                onChange={(e) => setProductTaxPrice(e.target.value)}
              />
            </div>
           
          </div>
          <div className="row">
         
          <div className="form1">
            <label>{t("invoicePrice")}</label>
              <input
               type="number"
                placeholder={t("enterinvoicePrice")}
                name="purchasePrice"
                autoComplete="off"
                className="taxinput"
                maxLength="40"
                required
                value={invoicePrice}
                onChange={(e)=> {
                  setInvoicePrice(e.target.value)
                }
                }
              />
            </div>
           
            <div className="form1">
            <label>{t("expenses")}</label>
              <input
                type="Number"
                placeholder={t("enterExpenses")}
                name="salesmanSalePrice"
                autoComplete="off"
                maxLength="40"
                required
                value={productExpenses}
                onChange={(e)=> {
                  setProductExpenses(e.target.value)
                }}
              />
            </div>
            <div className="form1">
            <label>{t("discount")}</label>
              <input
                type="Number"
                placeholder={t("enterDiscount")}
                name="salesmanSalePrice"
                autoComplete="off"
                maxLength="40"
                required
                value={productDiscount}
                onChange={(e)=> {
                  setProductDiscount(e.target.value)
                }}
              />
            </div>
            
          </div>
          <div className="row">
          <div className="form1">
            <label>{t("purchasePrice")}</label>
              <input
               type="number"
                placeholder={t("enterPurchasePrice")}
                name="purchasePrice"
                autoComplete="off"
                className="taxinput"
                maxLength="40"
                required
                disabled
                value={purchasePrice}
                onChange={(e)=> {
                  setPurchasePrice(e.target.value)
                }
                }
              />
            </div>
            <div className="form1">
              <label>{t("MRP")}</label>
              <input
                label={t("MRP")}
                type="number"
                placeholder={t("MRP")}
                // name="productType"
                autoComplete="off"
                // maxLength="40"
                required
                value={MRP}
                onChange={(e) => {
                  console.log(typeof e.target.value)
                  setMRP(e.target.value)}}
              />
            </div>
            <div className="form1">
            <label>{t("salesmanSalePrice")}</label>
              <input
                type="number"
                placeholder={t("enterSalesmanSalePrice")}
                name="salesmanSalePrice"
                autoComplete="off"
                // maxLength="40"
                required
                value={salesmanSalePrice}
                onChange={(e)=> {
                  console.log(typeof e.target.value)
                  setSalesmanSalePrice(e.target.value)
                }}
              />
            </div>
         
           
          
          </div>
          <div className="row">
          <div className="form1">
            <label>{t("minimumSalePrice")}</label>
              <input
               type="number"
                placeholder={t("enterMinimumSalePrice")}
                name="minimumSalePrice"
                autoComplete="off"
                className="taxinput"
                // maxLength="40"
                required
                value={minimumSalePrice}
                onChange={(e)=> {
                  setMinimumSalePrice(e.target.value)
                }
                }
              />
            </div>
          <div className="form1">
              <label>{t("productCompany")}</label>
              <Dropdown
                className="dropdown"
                options={company?.map((comp) => ({
                  key: comp.companyName,
                  text: comp.companyName,
                  value: comp.companyName,
                }))}
                placeholder={t("enterProdCompany")}
                selection
                search
                required
                autoComplete="off"
                value={producttCompany}
                onChange={handleCompanySelectChange}
              />
            </div>
          <div className="form1">
              <label>{t("productType")}</label>
              <Dropdown
                className="dropdown"
                options={productType?.map((element) => ({
                  key: element.productName,
                  text: element.productName,
                  value: element.productName,
                }))}
                placeholder={t("enterProdType")}
                selection
                search
                required
                value={productTypeeName}
                onChange={handleTypeSelectChange}
              />
            </div>
          </div>
          
          </div>
          <div className="productButtons">
            <Button
              onClick={backPage}
              className="button button-back"
              type="button"
            >
              <ArrowBackIcon />
              &nbsp; &nbsp;&nbsp;{t("back")}
            </Button>
            <Button
              onClick={Updateproduct}
              type="button"
              className={`button button-add-product `}
            >
              {t("updateProduct")}&nbsp;&nbsp;
              <AddIcon />
            </Button>
          </div>
        </div>
       
      </div> */}
    </>
    // <Modal open dimmer="inverted" size="tiny" closeIcon="close">
    //    <Stack  backgroundColor="#ECECEC">
    //    <Stack spacing={2} direction="row" marginLeft={2} alignItems="center" marginTop={1}>
    //       <Typography variant="h5" gutterBottom style={{ color: "#000000"}}>{t("updateProduct")}</Typography>
    //     </Stack>

    //     <Stack padding={3}>
    //   <Modal.Content>
    //     <Form className={"product"}>
    //       <Form.Group widths="equal">
    //         <Form.Input
    //           label={t("productName")}
    //           type="text"
    //           placeholder={t("enterProdName")}
    //           name="productCode"
    //           maxLength="40"
    //           required
    //           value={productName}
    //           onChange={(e) => setProductName(e.target.value)}
    //         />

    //         <Form.Input
    //           label={t("productCode")}
    //           type="text"
    //           placeholder={t("enterProdCode")}
    //           name="productCode"
    //           maxLength="40"
    //           required
    //           value={productCode}
    //           onChange={(e) => setProductCode(e.target.value)}
    //         />
    //       </Form.Group>
    //       <Form.Group widths="equal">
    //         <Form.Input
    //           control={Select}
    //           label={t("productType")}
    //           options={productType?.map((element) => ({
    //             key: element.productName,
    //             text: element.productName,
    //             value: element.productName,
    //           }))}
    //           placeholder={t("enterProdType")}
    //           selection
    //           value={productTypeeName}
    //           onChange={handleTypeSelectChange}
    //         />

    //         <Form.Input
    //           control={Select}
    //           label={t("productCompany")}
    //           options={company?.map((comp) => ({
    //             key: comp.companyName,
    //             text: comp.companyName,
    //             value: comp.companyName,
    //           }))}
    //           placeholder={t("enterProdCompany")}
    //           selection
    //           value={producttCompany}
    //           onChange={handleCompanySelectChange}
    //         />
    //       </Form.Group>
    //       <Form.Group widths="equal">
    //         <Form.Input
    //           control={Select}
    //           label={t("productColor")}
    //           options={color?.map((clr) => ({
    //             key: clr.colorName,
    //             text: clr.colorName,
    //             value: clr.colorName,
    //           }))}
    //           placeholder={t("enterProdColor")}
    //           selection
    //           value={producttColor}
    //           onChange={handleColorSelectChange}
    //         />
    //       </Form.Group>

    //       <Button
    //         color={"green"}
    //         onClick={Updateproduct}
    //         style={{fontSize: "17px", paddingLeft: "10px", paddingRight: "5px", paddingTop: "5px", paddingBottom: "5px" }}
    //         type="button"
    //         className="button"
    //         floated="right"
    //       >
    //         {t("updateProduct")}&nbsp;&nbsp;<UpdateIcon />
    //       </Button>
    //       <Button
    //         color={"green"}
    //         onClick={backPage}
    //         style={{fontSize: "17px", paddingLeft: "5px", paddingRight: "10px", paddingTop: "5px", paddingBottom: "5px" }}
    //         type="button"
    //         className="button"
    //         floated="left"
    //       >
    //          <ArrowBackIcon />&nbsp;{t("back")}
    //       </Button>
    //       <br />
    //       <br />
    //     </Form>
    //   </Modal.Content>
    //   </Stack>
    //   </Stack>
    // </Modal>
  );
};

export default UpdateData;
