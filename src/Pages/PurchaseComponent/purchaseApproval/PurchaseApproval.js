// PurchaseApproval.jsx
import { useEffect, useState, useCallback, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import swal from "sweetalert2"
import TableComponentId from "../../../Components/tableComponent/tableComponentId"
import PageLoader from "../../../Components/Loader/PageLoader"
import MetaData from "../../../MetaData"
import {
  getFilteredPurchaseApprovals, // New action for server-side filtering
  getPurchaseApprovalById,
  fetchPurchaseApprovalDirect,
  approvePurchase,
  rejectPurchase,
  deletePurchaseApproval,
} from "../../../actions/purchaseApprovalAction" 
import {
  APPROVE_PURCHASE_RESET,
  REJECT_PURCHASE_RESET,
  RESET_PURCHASE_APPROVALS,
  GET_PURCHASE_APPROVAL_RESET,
} from "../../../constants/purchaseApprovalConstant"
import { Button } from "semantic-ui-react"
import { getPermissionForRoles } from "../../user/rolesAssigned/RolesPermissionValidation"
import { addPurchase } from "../../../actions/purchaseAction"
import PurchaseApprovalDetailsModal from "./PurchaseApprovalDetailsModal"
import { SearchPurchaseApprovalData } from "../../../Components/searchComponent/approvalSearch/SearchPurchaseApprovalData"

const PurchaseApproval = () => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const searchTimeoutRef = useRef(null) // For debouncing search

  // State variables
  const [colorTheme, setColorTheme] = useState("theme-white")
  const [selectedApproval, setSelectedApproval] = useState(null)
  const [approvalData, setApprovalData] = useState(null) // Store approval data directly
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const [activeTab, setActiveTab] = useState("pending") // pending, approved, rejected, all
  const [searchTerm, setSearchTerm] = useState("")
  const [approveButtonLoading, setApproveButtonLoading] = useState(false)
  const [creatingPurchase, setCreatingPurchase] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0) // State to trigger table refresh
  const [isAdmin, setIsAdmin] = useState(false) // Track if user is admin or super admin
  const [isFetchingNewData, setIsFetchingNewData] = useState(false);
  const [tabDataLoading, setTabDataLoading] = useState(false)


  // Get data from Redux store - now using filteredPurchaseApprovals
  const { purchaseApprovals, loading } = useSelector((state) => state.filteredPurchaseApprovals)
  const { purchaseApproval, loading: approvalDetailsLoading } = useSelector((state) => state.purchaseApprovalDetails)
  const { success: approveSuccess, loading: approveLoading } = useSelector((state) => state.approvePurchase)
  const { success: rejectSuccess, loading: rejectLoading } = useSelector((state) => state.rejectPurchase)
  const { user } = useSelector((state) => state.user)

  // Check if user is admin or super admin
  useEffect(() => {
    const isSuperAdmin = localStorage.getItem("isSuperAdmin") === "true"
    const isAdministrator = localStorage.getItem("isAdministrator") === "true"
    setIsAdmin(isSuperAdmin || isAdministrator)
  }, [])

  // Load filtered data from the server
  const loadFilteredData = useCallback(async () => {
    const shopCode = user?.user?.shopNo?.shopCode || null
    
    // Format search parameters using the search component
    const searchParams = SearchPurchaseApprovalData({
      searchTerm: searchTerm,
      status: activeTab,
      shopCode: shopCode,
      isAdmin: isAdmin
    })
    
    // Dispatch the action to get filtered data from the server
    dispatch(getFilteredPurchaseApprovals(searchParams))
  }, [dispatch, searchTerm, activeTab, isAdmin, user])

  // Check permissions and load data on component mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const hasApprovalPermission = await getPermissionForRoles("Print Purchase Invoice")
        setHasPermission(hasApprovalPermission)

        if (!hasApprovalPermission) {
          swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "You don't have permission to access this page",
            customClass: {
              popup: "custom-swal-popup",
            },
          })
          navigate("/dashboard")
        } else {
          // Load filtered data instead of all approvals
          loadFilteredData()
        }
      } catch (error) {
        console.error("Error checking permissions:", error)
      }
    }

    checkPermission()
  }, [dispatch, navigate, loadFilteredData])

  // Refresh data when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      loadFilteredData()
    }
  }, [refreshTrigger, loadFilteredData])

  // Set theme color
  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color")
    if (currentThemeColor) {
      setColorTheme(currentThemeColor)
      document.body.className = currentThemeColor
    }
  }, [colorTheme])

  // Handle search with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    // Set a new timeout for debounce (300ms)
    searchTimeoutRef.current = setTimeout(() => {
      loadFilteredData()
    }, 300)
  }

  const handleTabChange = async (tab) => {
    // Don’t clear immediately
    setTabDataLoading(true) // show loader manually
  
    setActiveTab(tab)
  
    const shopCode = user?.user?.shopNo?.shopCode || null
    const searchParams = SearchPurchaseApprovalData({
      searchTerm,
      status: tab,
      shopCode,
      isAdmin
    })
  
    await dispatch(getFilteredPurchaseApprovals(searchParams)) // wait for latest tab data
  
    setTabDataLoading(false) // hide loader now
  }
  
 // Modified handleTabChange
//  const handleTabChange = async (tab) => {
//   setTabDataLoading(true)
//   setApprovalData(null); // 🧹 Clear leftover modal state
//   // Clear the Redux data immediately
//   dispatch({ type: RESET_PURCHASE_APPROVALS });
//   // Set the fetching flag so loader is displayed
//   setIsFetchingNewData(true);
//   // Update active tab (you may choose to update active tab after load if desired)
//   setActiveTab(tab);
  
//   // Wait for new data to load
//   await loadFilteredData();
  
//   // Once data is loaded, reset the flag
//   setIsFetchingNewData(false);
//   };
  
  // // Handle tab change
  // const handleTabChange = (tab) => {
  //   setActiveTab(tab)
  //   dispatch({ type: RESET_PURCHASE_APPROVALS });
  //   // Give a small delay so the state updates before fetching
  //   setTimeout(() => {
  //     loadFilteredData()
  //   }, 1000)
  // }

  // Reset states when approval actions complete
  useEffect(() => {
    if (approveSuccess) {
      if (!creatingPurchase) {
        dispatch({ type: APPROVE_PURCHASE_RESET })
        setApproveButtonLoading(false)
        // Trigger a refresh of the table data
        setRefreshTrigger((prev) => prev + 1)
      }
    }

    if (rejectSuccess) {
      swal
        .fire({
          icon: "success",
          title: t("Success"),
          text: t("Purchase rejected successfully"),
          customClass: {
            popup: "custom-swal-popup",
          },
        })
        .then(() => {
          dispatch({ type: REJECT_PURCHASE_RESET })
          // Trigger a refresh of the table data
          setRefreshTrigger((prev) => prev + 1)
        })
    }
  }, [approveSuccess, rejectSuccess, dispatch, t, creatingPurchase])

  // Handle view details action
  const handleViewDetails = async (id) => {
    try {
      // First clear any existing approval data
      dispatch({ type: GET_PURCHASE_APPROVAL_RESET })

      // Then fetch new data
      dispatch(getPurchaseApprovalById(id))
      setIsDetailModalOpen(true)
      setApproveButtonLoading(false);
    } catch (error) {
      console.error("Error viewing details:", error)
      swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to get purchase approval details",
        customClass: {
          popup: "custom-swal-popup",
        },
      })
    }
  }

  // Update the handleApproveWithInvoice function to properly return the invoice number
  const handleApproveWithInvoice = async (id) => {
    setSelectedApproval(id)
    setApproveButtonLoading(true)
    setCreatingPurchase(true)

    try {
      // Get the purchase approval details directly from API
      const approvalResponse = await fetchPurchaseApprovalDirect(id)

      if (!approvalResponse || !approvalResponse.success || !approvalResponse.purchaseApproval) {
        throw new Error("Failed to get purchase approval details")
      }

      // Store the approval data locally
      const purchaseApproval = approvalResponse.purchaseApproval
      setApprovalData(purchaseApproval)

      // Get the current user's name
      const approvedBy = user?.user?.name || JSON.parse(localStorage.getItem("username"))

      // Now approve the purchase in the approval system
      await dispatch(approvePurchase(id, approvedBy))

      // Create location quantity entries and update product prices
      const locQuantityList = purchaseApproval.products.map((product) => ({
        productQuantity: Number.parseInt(product.PurchaseQuantity),
        productId: product.quantityidset,
        colorId: product.productColor,
        locationId: product.locationsetid,
        godownId: purchaseApproval.godownId || null,
        shopId: purchaseApproval.shopId || null,
      }))

      const locProductItemlist = purchaseApproval.products.map((product) => ({
        productId: product.quantityidset,
        purchaseProductTotalAmount: Number(product.purchaseProductTotalAmount || 0),
        productExpenses: Number(product.expense || 0),
        invoicePrice: Number(product.invoicePrice || 0),
        MRP: Number(product.MRP || 0),
        purchasePrice: Number(product.purchasePrice || 0),
        productDiscount: Number(product.productDiscount || 0),
        purchaseExpenses: Number(product.purchaseExpenses || 0),
        // productTaxPercentage: Number(product.purchaseTaxPercentage || 0),
        // productTaxPercentage: Number(product.productTaxPercentage || 0),
        productTaxPercentage: Number(product.purchaseProductTax || 0),
        // purchaseTotalTax: Number(product.purchaseTotalTax || 0),
        salesmanSalePrice: Number(product.salesmanSalePrice || 0),
        minimumSalePrice: Number(product.minimumSalePrice || 0),
        purchaseTotalDiscount: Number(product.purchaseTotalDiscount || product.discountValue || 0),
      }))

      // Call the purchase creation API with properly formatted products
      const formattedProducts = purchaseApproval.products.map((product) => ({
        ...product,
        purchaseTotalDiscount: Number(product.purchaseTotalDiscount || product.discountValue || 0),
      }))

      console.log("fomattedProduct: ", formattedProducts);
      

      const response = await addPurchase(
        purchaseApproval.clientName,
        purchaseApproval.purchaseReceiptNumber,
        purchaseApproval.purchaseCompany,
        purchaseApproval.purchaseDate,
        purchaseApproval.address,
        purchaseApproval.phoneNo,
        purchaseApproval.shopNo,
        purchaseApproval.storeIn,
        purchaseApproval.purchasedBy,
        formattedProducts, // Use the formatted products here
        purchaseApproval.total,
        locQuantityList,
        locProductItemlist,
        null, // No temp purchase ID
      )

      
      console.log("responseDataafterAproval: ", response?.data?.success);
      if (response?.data?.success) {
        const invoiceNumber = response?.data?.newPurchaseProduct?.id

        // Store the invoice number for printing
        setInvoiceNumber(invoiceNumber)

        // Update the approval data with the invoice number for printing
        setApprovalData({
          ...purchaseApproval,
          invoiceNumber: invoiceNumber,
        })

        // Reset loading states immediately
  setApproveButtonLoading(false)
  setCreatingPurchase(false)

        // Return the invoice number so it can be used by the caller
        return invoiceNumber
      } else {
        throw new Error(response?.data?.message || "Failed to create purchase")
      }
    } catch (error) {
      console.error("Error approving purchase:", error)
      swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to approve purchase",
        customClass: {
          popup: "custom-swal-popup",
        },
      })

      // Reset loading states on error
      dispatch({ type: APPROVE_PURCHASE_RESET })
      setApproveButtonLoading(false)
      setCreatingPurchase(false)
      return null
    }
  }

  // Handle approve action
  const handleApprove = async (id) => {
    setSelectedApproval(id)

    try {
      const result = await swal.fire({
        title: "Are you sure?",
        text: "This will approve the purchase and create inventory entries",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, approve it!",
        customClass: {
          popup: "custom-swal-popup",
        },
      })

      if (result.isConfirmed) {
        try {
          // Set loading states
          setApproveButtonLoading(true)
          setCreatingPurchase(true)

          // IMPORTANT: Get the purchase approval details directly from API
          // This bypasses Redux and ensures we have the most up-to-date data
          const approvalResponse = await fetchPurchaseApprovalDirect(id)

          if (!approvalResponse || !approvalResponse.success || !approvalResponse.purchaseApproval) {
            throw new Error("Failed to get purchase approval details")
          }

          // Store the approval data locally
          const purchaseApproval = approvalResponse.purchaseApproval
          setApprovalData(purchaseApproval)

          // Get the current user's name
          const approvedBy = user?.user?.name || JSON.parse(localStorage.getItem("username"))

          // Now approve the purchase in the approval system
          await dispatch(approvePurchase(id, approvedBy))

          // Create location quantity entries and update product prices
          const locQuantityList = purchaseApproval.products.map((product) => ({
            productQuantity: Number.parseInt(product.PurchaseQuantity),
            productId: product.quantityidset,
            colorId: product.productColor,
            locationId: product.locationsetid,
            godownId: purchaseApproval.godownId || null,
            shopId: purchaseApproval.shopId || null,
          }))

          const locProductItemlist = purchaseApproval.products.map((product) => ({
            productId: product.quantityidset,
            purchaseProductTotalAmount: Number(product.purchaseProductTotalAmount || 0),
            productExpenses: Number(product.expense || 0),
            invoicePrice: Number(product.invoicePrice || 0),
            MRP: Number(product.MRP || 0),
            purchasePrice: Number(product.purchasePrice || 0),
            productDiscount: Number(product.productDiscount || 0),
            purchaseExpenses: Number(product.purchaseExpenses || 0),
            productTaxPercentage: Number(product.productTaxPercentage || 0),
            salesmanSalePrice: Number(product.salesmanSalePrice || 0),
            minimumSalePrice: Number(product.minimumSalePrice || 0),
            // This is the critical field that was causing the validation error
            purchaseTotalDiscount: Number(product.purchaseTotalDiscount || product.discountValue || 0),
          }))

          // Call the purchase creation API with properly formatted products
          const formattedProducts = purchaseApproval.products.map((product) => ({
            ...product,
            purchaseTotalDiscount: Number(product.purchaseTotalDiscount || product.discountValue || 0),
          }))

          const response = await addPurchase(
            purchaseApproval.clientName,
            purchaseApproval.purchaseReceiptNumber,
            purchaseApproval.purchaseCompany,
            purchaseApproval.purchaseDate,
            purchaseApproval.address,
            purchaseApproval.phoneNo,
            purchaseApproval.shopNo,
            purchaseApproval.storeIn,
            purchaseApproval.purchasedBy,
            formattedProducts, // Use the formatted products here
            purchaseApproval.total,
            locQuantityList,
            locProductItemlist,
            null, // No temp purchase ID
          )

          if (response?.data?.success) {
            // Show success message
            await swal.fire({
              icon: "success",
              title: "Approved!",
              text: "Purchase has been approved and inventory updated.",
              customClass: {
                popup: "custom-swal-popup",
              },
            })

            // Reset all states properly
            setCreatingPurchase(false)
            setApproveButtonLoading(false)
            setIsDetailModalOpen(false)
            dispatch({ type: APPROVE_PURCHASE_RESET })

            // Refresh the data
            setRefreshTrigger((prev) => prev + 1)
          } else {
            throw new Error(response?.data?.message || "Failed to create purchase")
          }
        } catch (error) {
          console.error("Error approving purchase:", error)
          swal.fire({
            icon: "error",
            title: "Error",
            text: error.message || "Failed to approve purchase",
            customClass: {
              popup: "custom-swal-popup",
            },
          })

          // Reset loading states on error
          setApproveButtonLoading(false)
          setCreatingPurchase(false)
          dispatch({ type: APPROVE_PURCHASE_RESET })
        }
      }
    } catch (error) {
      console.error("Error in approval process:", error)
      setApproveButtonLoading(false)
      setCreatingPurchase(false)
    }
  }

  // Handle continue to purchase action
  const handleContinueToPurchase = (id) => {
    // Navigate to purchase page with the approval data
    navigate("/PurchaseRecipt", { state: { fromApproval: true, approvalId: id } })
  }

  // Handle reject action
  const handleReject = (id) => {
    swal
      .fire({
        title: t("Reject Purchase"),
        text: t("Provide a reason for rejection (optional):"),
        input: "textarea",
        inputPlaceholder: t("Enter rejection reason..."),
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: t("Reject"),
        cancelButtonText: t("Cancel"),
        customClass: {
          popup: "custom-swal-popup",
        },
        preConfirm: (reason) => {
          // Return the reason (can be empty string)
          return reason || ""
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          const rejectedBy = user?.user?.name || JSON.parse(localStorage.getItem("username"))
          const rejectionReason = result.value

          // Show loading state
          swal.fire({
            title: t("Processing"),
            text: t("Rejecting purchase..."),
            allowOutsideClick: false,
            didOpen: () => {
              swal.showLoading()
            },
            customClass: {
              popup: "custom-swal-popup",
            },
          })

          // Dispatch the reject action
          dispatch(rejectPurchase(id, rejectedBy, rejectionReason))
        }
      })
  }

  // Handle delete action
  const handleDelete = (id) => {
    swal
      .fire({
        title: "Are you sure?",
        text: "This will permanently delete this purchase approval",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        customClass: {
          popup: "custom-swal-popup",
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(deletePurchaseApproval(id))
          setTimeout(() => {
            setRefreshTrigger((prev) => prev + 1)
          }, 500)
        }
      })
  }

  // Define table columns
  const columns = [
    { field: "purchaseReceiptNumber", label: t("Receipt #") },
    { field: "clientName", label: t("Supplier") },
    { field: "purchaseCompany", label: t("Company") },
    {
      field: "purchaseDate",
      label: t("Purchase Date"),
      format: "date",
    },
    { field: "purchasedBy", label: t("Requested By") },
    {
      field: "approvalStatus",
      label: t("Status"),
    },
    // Add shop code column for admins to see which shop the approval belongs to
    ...(isAdmin ? [{ field: "storeIn", label: t("Shop Code") }] : []),
  ]

  const operationNotAllowed = () => {
    swal.fire({
      icon: "info",
      title: "Action Not Allowed",
      text: "Only pending approvals can be deleted",
      customClass: {
        popup: "custom-swal-popup",
      },
    })
  }

  // Define actions for the table - using the specific format required by TableComponentId
  const actions = [
    {
      label: "Delete",
      color: "red",
      handler: (itemId) => {
        // Only allow deletion of pending approvals
        const approval = purchaseApprovals?.find((a) => a._id === itemId)
        if (approval && approval.approvalStatus === "pending") {
          handleDelete(itemId)
        } else {
          operationNotAllowed();
        }
      },
    },
    {
      label: "View",
      color: "blue",
      handler: (itemId) => handleViewDetails(itemId),
    },
    {
      label: "Approve",
      color: "green",
      handler: (itemId) => {
        // Only allow approval of pending approvals
        const approval = purchaseApprovals?.find((a) => a._id === itemId)
        if (approval && approval.approvalStatus === "pending") {
          handleApprove(itemId)
        } else {
          operationNotAllowed();
        }
      },
    },
    {
      label: "Reject",
      color: "red",
      handler: (itemId) => {
        // Only allow rejection of pending approvals
        const approval = purchaseApprovals?.find((a) => a._id === itemId)
        if (approval && approval.approvalStatus === "pending") {
          handleReject(itemId)
        } else {
          operationNotAllowed();
        }
      },
    },
    {
      label: "Continue",
      color: "yellow",
      handler: (itemId) => {
        // Only allow continue for pending approvals
        const approval = purchaseApprovals?.find((a) => a._id === itemId)
        if (approval && approval.approvalStatus === "pending") {
          handleContinueToPurchase(itemId)
        } else {
          operationNotAllowed();
        }
      },
    },
  ]

  // Handle modal close
  const handleModalClose = () => {
    setIsDetailModalOpen(false)
    setApproveButtonLoading(false);
  setApprovalData(null); // 🧹 Clear leftover modal state
    setCreatingPurchase(false);
    // Refresh the table data when modal is closed
    setRefreshTrigger((prev) => prev + 1)
  }

  // Add this useEffect to reset loading states when approval is successful
  useEffect(() => {
    // When approval is successful and the invoice number has been received
    if (approveSuccess && creatingPurchase && invoiceNumber) {
      // Reset the loading states
      setCreatingPurchase(false)
      setApproveButtonLoading(false)

      // Refresh the table data
      setRefreshTrigger((prev) => prev + 1)
    }
  }, [approveSuccess, creatingPurchase, invoiceNumber])

  useEffect(() => {
    // When approval is successful and we're done creating the purchase
    if (approveSuccess && creatingPurchase) {
      // Reset the loading states
      setCreatingPurchase(false)
      setApproveButtonLoading(false)

      // Refresh the approvals list
      setRefreshTrigger((prev) => prev + 1)

      // Reset the approval state
      dispatch({ type: APPROVE_PURCHASE_RESET })
    }
  }, [approveSuccess, creatingPurchase, dispatch])

  // Get the appropriate message based on the active tab
  const getNoDataMessage = () => {
    switch (activeTab) {
      case "pending":
        return t("No pending purchase approvals found")
      case "approved":
        return t("No approved purchase approvals found")
      case "rejected":
        return t("No rejected purchase approvals found")
      case "all":
        return t("No purchase approvals found")
      default:
        return t("No purchase approvals found")
    }
  }

  return (
    <>
      <MetaData title="QE - Purchase Approvals" />
      <div className={`Purchase ${colorTheme}`}>
        <div className="secondContainer">
          <div className="content-box">
            <div className="heading-container">
              <h3>{t("Purchase Approvals")}</h3>
              <div className="shop-info-container">
                {isAdmin && (
                  <div className="admin-badge">
                    <span>{t("Admin View - All Shops")}</span>
                  </div>
                )}
                {!isAdmin && user?.user?.shopNo?.shopCode && (
                  <div className="shop-badge">
                    <span>
                      {t("Shop")}: {user.user.shopNo.shopCode}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="search-box">
            <input
              type="text"
              placeholder={t("Search...")}
              value={searchTerm}
              onChange={handleSearchChange}
            />

            {/* Tab Navigation */}
            <div className="tab-buttons" style={{ display: "flex", gap: "10px", marginLeft: "20px" }}>
              <Button 
                className={activeTab === "pending" ? "active" : ""} 
                onClick={() => handleTabChange("pending")}
              >
                {t("Pending")}
                {activeTab === "pending" && purchaseApprovals?.length > 0 && (
                  <span className="approval-badge" style={{ marginLeft: "5px" }}>
                    {purchaseApprovals.length}
                  </span>
                )}
              </Button>
              <Button 
                className={activeTab === "approved" ? "active" : ""} 
                onClick={() => handleTabChange("approved")}
              >
                {t("Approved")}
              </Button>
              <Button 
                className={activeTab === "rejected" ? "active" : ""} 
                onClick={() => handleTabChange("rejected")}
              >
                {t("Rejected")}
              </Button>
              <Button 
                className={activeTab === "all" ? "active" : ""} 
                onClick={() => handleTabChange("all")}
              >
                {t("All")}
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            {tabDataLoading  ? (
              <PageLoader />
            ) : purchaseApprovals && purchaseApprovals.length > 0 ? (
              <TableComponentId
                data={purchaseApprovals}
                columns={columns}
                actions={actions}
                action4="Delete"
                pendings="Continue"
              />
            ) : (
              <div className="no-data-message">
                <p className="no-data-primary">{getNoDataMessage()}</p>
                {!isAdmin && user?.user?.shopNo?.shopCode && (
                  <div className="shop-filter-details">
                    <p className="shop-filter-info">
                      {t("Showing approvals for shop")}: {user?.user?.shopNo?.shopCode}
                    </p>
                  </div>
                )}
                {isAdmin && (
                  <p className="shop-filter-info admin-filter-info">
                    {t("Admin view - No approvals found for any shop")}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Purchase Approval Details Modal - Now using the extracted component */}
          <PurchaseApprovalDetailsModal
            isOpen={isDetailModalOpen}
            onClose={handleModalClose}
            purchaseApproval={approvalData || purchaseApproval}
            loading={approvalDetailsLoading}
            onApprove={handleApprove}
            onReject={(id) => {
              handleModalClose()
              handleReject(id)
            }}
            onContinueToPurchase={(id) => {
              handleModalClose()
              handleContinueToPurchase(id)
            }}
            onApproveWithInvoice={handleApproveWithInvoice}
            approveButtonLoading={approveButtonLoading}
            rejectLoading={rejectLoading}
            user={user}
            activeTab= {activeTab}
          />

          {/* Custom loading indicator for approval process */}
          {creatingPurchase && approveLoading && (
            <div className="custom-loader-container">
              <div className="custom-loader">
                <div className="loader-content">
                  <div className="loader-spinner"></div>
                  <p>{t("Processing approval and generating purchase...")}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default PurchaseApproval