import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
// import { getProductDetails, updateProduct } from '../../../actions/productActions;
import { getProductDetails, updateProduct } from '../../../actions/productActions';
// Hook for fetching product details
const useProductDetails = (id) => {
  return useQuery({
    queryKey: ['productDetails', id],
    queryFn: () => getProductDetails(id)
  });
};

export { useProductDetails, useUpdateProduct };
