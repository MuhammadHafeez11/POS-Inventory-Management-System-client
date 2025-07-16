import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
// import { getProductDetails, updateProduct } from '../../../actions/productActions;
import { getProductDetails, updateProduct } from '../actions/productActions';
import { getProductLocationOnShopId } from '../actions/productLocationAction';
// Hook for fetching product detail
const useProductDetails = (id) => {
  return useQuery({
    queryKey: ['productDetails', id],
    queryFn: () => getProductDetails(id)
  });
};

const useProductOnShop = (shopIdForData) => {
  return useQuery({
    queryKey: ['productDetailsOnShop', shopIdForData],
    queryFn: () => getProductLocationOnShopId(shopIdForData)
  });
};

// Hook for updating product
const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  console.log('hfei')
  const navigate = useNavigate()
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productUpdate'] });
      swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Product updated successfully!',
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
        showConfirmButton: true,
      })
      .then(() => {
        navigate('/record'); // Adjust the route as needed
      });;
    },
    onError: () => {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error updating the product.',
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
        showConfirmButton: true,
      });
    },
  });
};

export { useProductDetails, useUpdateProduct, useProductOnShop };
