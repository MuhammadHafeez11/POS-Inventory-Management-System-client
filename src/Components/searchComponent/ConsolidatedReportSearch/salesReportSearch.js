// export const searchSalesConsolidatednvoiceData = async (
//   dataArray,
//   shopNoValue,
//   salesCodeValue,
//   salesCOmpanyValue,
//   salesStartingDate,
//   salesEndingDate
// ) => {
//   console.log(dataArray)
//   const modifiedDataArray = dataArray?.products?.map((item) => {
//     const { shopNo, createdAt, products } = item;
//     const productsWithShopAndDate = products?.map((product) => ({
//       ...product,
//       shopNo,
//       createdAt,
//     }));
//     return productsWithShopAndDate;
//   });

//   console.log(modifiedDataArray)
//   const combinedArray = modifiedDataArray?.reduce(
//     (acc, curr) => [...acc, ...curr],
//     []
//   );

//   let Filtered = combinedArray?.filter((product) => {
//     if (shopNoValue && !product?.shopNo?.includes(shopNoValue)) {
//       return false;
//     }

//     if (salesCodeValue && !product?.Code?.includes(salesCodeValue)) {
//       return false;
//     }

//     if (salesCOmpanyValue && !product?.Company?.includes(salesCOmpanyValue)) {
//       return false;
//     }

//     if (salesStartingDate) {
//       const transferDate = new Date(salesStartingDate);
//       const productDate = new Date(product.createdAt);

//       if (productDate < transferDate) {
//         return false;
//       }
//     }

//     if (salesEndingDate) {
//       const transferDate = new Date(salesEndingDate);
//       const productDate = new Date(product.createdAt);
//       if (productDate > transferDate) {
//         return false;
//       }
//     }

//     return true;
//   });

//   return Filtered;
// };

export const searchSalesConsolidatednvoiceData = async (
  Products,
  // productType,
  code,
  productCompany,
  salesStartingDate,
  salesEndingDate
) => {
  let Filtered = [];
  console.log(Products);
  console.log(code);
  console.log(Products?.products);
  console.log(productCompany);

  Filtered = Products?.filter((product) => {
    console.log(product)
    if (
      productCompany &&
      !product?.products?.Company
        .toString()
        .toLowerCase()
        .includes(productCompany.toString().toLowerCase())
    ) {
      return false;
    }
    if (
      code &&
      !product?.products?.Code.toString().toLowerCase().includes(code.toString().toLowerCase())
    ) {
      return false;
    }

    console.log("HIHFE");
    return true;
  });
  console.log(Filtered);
  return Filtered;
};
