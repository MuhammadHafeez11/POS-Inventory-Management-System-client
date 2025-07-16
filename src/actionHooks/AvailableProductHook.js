import { useQuery } from "@tanstack/react-query";
import { getSearchAvailableProducts, getProductLoc, getGlobalProductLoc } from "../actions/productLocationAction";

const useAvailableProductsQuery = (queryParams) => {
    return useQuery({
      queryKey: ['availableProducts', queryParams],
      queryFn: () => getSearchAvailableProducts(queryParams),
      // enabled: !!shopOption || !!godownOption || !!shopId || !!godownId || !!productCode || !!productType || !!productCompany,
    });
  };


  const useGetProductsQuery = (shopType, godownType, shopId, godownId, code, type, company) => {
    const queryParams = { shopType, godownType, shopId, godownId, code, type, company };
    
    return useQuery({
      queryKey: ['getAvailableProducts', queryParams],
      queryFn: () => getProductLoc(shopType, godownType, shopId, godownId, code, type, company),
      enabled: !!shopType || !!godownType || !!shopId || !!godownId || !!code || !!type || !!company,
      // keepPreviousData: true,  // Preserves previous data while fetching new
    });
  };


  const useGlobalGetProductsLocationQuery = ( code, isSearchTriggered) => {
    const queryParams = { code };
    console.log(!!code, !!isSearchTriggered)
    return useQuery({
      queryKey: ['getGlobalAvailableProducts', queryParams],
      queryFn: () => getGlobalProductLoc( code ),
      enabled: isSearchTriggered && !!code,
      keepPreviousData: true,  // Preserves previous data while fetching new
    });
  };
  
export { useAvailableProductsQuery, useGetProductsQuery, useGlobalGetProductsLocationQuery};