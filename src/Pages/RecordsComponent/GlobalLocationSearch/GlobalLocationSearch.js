import React, { useContext, useEffect, useState, useTransition } from "react";
import MetaData from "../../../MetaData";
import { refreshTokken } from "../../../actions/userAction";
import { useNavigate } from "react-router-dom";
import { tableState } from "../../../Components/tableComponent/tableContext";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { getPermissionForRoles } from "../../user/rolesAssigned/RolesPermissionValidation";
import { useDebounce } from "../../../actionHooks/Debounse";
import InventoryTable from "../../../Components/GlobalTablePageDesign/InventoryTable";
import { useGetProductsQuery, useGlobalGetProductsLocationQuery } from "../../../actionHooks/AvailableProductHook";
import { getProductt } from "../../../actions/productActions";
let isCalled = "false";
const GlobalLocationSearch = () => {
  const { t } = useTranslation();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const { rowCount, setRowCount } = useContext(tableState);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false)
  const [viewProductLocationPermission, setViewProductLocationPermission] =
    useState(false);
  
  const { products, productLoading } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate()
    const [code, setCode] = useState("");
    const debouncedCode = useDebounce(code, 500);

  const {
    data: locData,
    isLoading,
    isError,
    refetch,
  } = useGlobalGetProductsLocationQuery(
 debouncedCode, isSearchTriggered
  );  

  const [filters, setFilters] = useState({
    productCode: '',
    productType: '',
    company: '',
  });

  const [actionLinks, setActionLinks] = useState({
    actionUpdate: "Update",
    action1: "View Barcode",
    action2: "generate",
    action3: "Delete",
  })


  const filterFields = [
    { name: 'productCode', placeholder: 'Enter Product Code', type: 'productCode',   options: products },
  ];

  useEffect(() => {
    isCalled = "false";
    const currentThemeColor = localStorage.getItem("theme-color");
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
    }
  }, [colorTheme, rowCount]);

     useEffect(()=>{
        dispatch(getProductt());
      }, [])

  useEffect(() => {
    setViewProductLocationPermission(false);
    getPermission();
  }, []);

  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles(
        "View Product Location"
      );
      setViewProductLocationPermission(permissionForAdd);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    setIsSearchTriggered(false);
    getToken();
  }, [code]);

  useEffect(() => {
    console.log(locData)
  }, [locData, isLoading]);


  const handleFilterChange = (e) => {
    console.log(e.target.name)
    if(e.target.name === "productCode") {
      setCode(e.target.value);
    }
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    setIsSearchTriggered(true);
    refetch()
  }

  const handleClear = (e) => {
    setCode()
    setIsSearchTriggered(false);
    console.log(e.target.name)
    setFilters({
      ...filters,
      productCode: "",

    });
    // refetch()
  }

  const getToken = async () => {
    const token = await refreshTokken();
    if (token?.data === "Please login to acces this resource") {
      navigate("/login");
    }
    console.log(token);
  };

  const column = [
    { field: "product.productCode", label: t("productCode") },
    { field: "product.productName", label: t("productName") },
    { field: "product.productTypeName.productName", label: t("type") },
    { field: "product.productCompany.companyName", label: t("company") },
    { field: "colorId.colorName", label: t("productColor") },
    { field: "shopAvalibility.shopCode", label: t("branch") },
    { field: "godownAvalibility.storageCode", label: t("stockLocation") },
    { field: "productQuantity", label: "Qty" },
    {
      field: "updatedAt",
      label: t("Date & Time"),
      format: (value) =>
        `${new Date(value).toLocaleDateString()} ${new Date(
          value
        ).toLocaleTimeString()}`,
    },
  ];

  
  const [currentColumns, setCurrentColumns] = useState(column);
  return (
    <>
      <MetaData title="QE ~~ProductLocation" />
      <div className={`GlobalDesignPage ${colorTheme}`}>
        {
          <InventoryTable
            title="GLobal Product Location"
            recordCount={locData?.data?.productLocations.length}
            isLoading={isLoading}
            data={locData?.data?.productLocations}
            tableColumns={currentColumns}
            actionLinks={actionLinks}
            onFilterChange={handleFilterChange}
            filters={filters}
            filterFields={filterFields}
            handleSearch={handleSearch}
            handleClear={handleClear}
            clearButton={true}
            searchButton={true}
          />
        }
      </div>
    </>
  );
};

export default GlobalLocationSearch;
