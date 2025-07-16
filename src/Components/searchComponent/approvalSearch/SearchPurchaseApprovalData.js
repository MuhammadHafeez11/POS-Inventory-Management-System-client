// Create this utility file to handle search parameters

export const SearchPurchaseApprovalData = (params) => {
  const searchParams = {}

  // Add search term if provided
  if (params.searchTerm) {
    searchParams.searchTerm = params.searchTerm
  }

  // Add status filter if provided
  if (params.status && params.status !== "all") {
    searchParams.status = params.status
  }

  // Add shop filter for non-admin users
  if (params.shopCode && !params.isAdmin) {
    searchParams.shopCode = params.shopCode
  }

  return searchParams
}
