import logo from "./pos.png"
// import QRCodee from "./QRCode";

import PrintLaserTable from "../../Components/tableComponent/printLaserTable"
import QRCode from "react-qr-code"
// Define inline styles
const styles = {
  page: { paddingTop: 20, fontFamily: "Helvetica" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 20,
  },
  // header: {
  //     position: 'fixed', // Ensures it stays at the top of every page
  //     top: 0,
  //     left: 0,
  //     right: 0,
  //     backgroundColor: 'white', // Prevent overlap with content
  //     padding: '10px 15px',
  //     display: 'flex',
  //     justifyContent: 'space-between',
  //     alignItems: 'center',
  //     borderBottom: '1px solid #ccc',
  //     zIndex: 1000, // Ensures it's on top of other content
  // },
  logoSection: {
    display: "flex",
    flexDirection: "column",
    width: "60%",
  },
  logoAndCompany: {
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    backgroundColor: "#FFA500", // Orange bar
    width: 10,
    height: 80,
    marginRight: 10,
  },
  companyInfo: {
    marginLeft: 10,
  },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  companyDetails: {
    marginTop: -10,
    fontSize: 12,
    color: "#555",
  },
  billToSection: {
    marginLeft: 10,
    marginTop: 10,
  },
  billToLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  billingDetails: {
    marginBottom: 0,
    fontSize: 12,
    color: "#555",
  },
  invoiceTitleSection: {
    flexDirection: "column",
    marginTop: -20,
    width: "40%",
    display: "flex",
    alignItems: "flex-end",
  },
  invoiceBadge: {
    backgroundColor: "#FFA500", // Orange background
    borderRadius: 4,
    whiteSpace: "nowrap",
    padding: "5px 10px",
  },
  invoiceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  invoiceDetails: {
    marginTop: 10,
    marginRight: 10,
    fontSize: 12,
    color: "#555",
    textAlign: "right",
  },
  paragraph: {
    whiteSpace: "nowrap",
    marginBottom: 0,
    fontSize: 12,
    color: "#555",
  },
  table: {
    marginLeft: 15,
    marginRight: 15,
    // marginBottom: 10
  },
  tableHeader: {
    display: "flex",
    // borderBottom: '1px solid black',
    paddingBottom: 6,
  },
  tableRow: {
    display: "flex",
    paddingBottom: 6,
    // borderBottom: '1px solid #ddd',
  },
  description: {
    width: "50%",
    textAlign: "left",
    fontSize: 12,
    padding: 4,
  },
  column: {
    width: "15.66%",
    textAlign: "center",
    fontSize: 12,
    padding: 4,
    whiteSpace: "nowrap",
  },
  rowColumn: {
    width: "15.66%",
    textAlign: "center",
    fontSize: 12,
    padding: 4,
    whiteSpace: "nowrap",
  },
  totalsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 5,
    marginRight: 5,
    fontSize: 12,
    width: "40%",
    whiteSpace: "nowrap",
    textAlign: "left",
  },
  bold: {
    fontWeight: "bold",
  },
  totalFooter: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 10,
    marginRight: 20,
    width: "100%",
  },
  barcodeSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
  },

  totalSection: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginRight: 25,
    alignItems: "flex-end",
  },
  terms: {
    marginTop: 30,
    fontSize: 10,
    color: "#555",
  },
  footer: {
    position: "fixed", // Ensures it stays at the bottom of every page
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: 10,
    // top: 5,
    textAlign: "center",
    fontSize: 10,
    color: "#000",
    backgroundColor: "white", // Avoid content overlap
    padding: "5px 0",
    borderTop: "1px solid #ccc", // Optional: Visual separator
  },
}

const Invoice = ({ invoiceData, list }) => {
  console.log(invoiceData)
  return (
    <div style={styles.page}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.logoSection}>
          <div style={styles.logoAndCompany}>
            <div style={styles.logo} />
            <div style={styles.companyInfo}>
              <p style={styles.companyName}>{invoiceData?.companyTitle}</p>
              <p style={styles.companyDetails}>{invoiceData?.address}</p>
              <p style={styles.companyDetails}>{invoiceData?.contact}</p>
            </div>
          </div>

          {/* Bill To Section */}
          <div style={styles.billToSection}>
            <strong style={styles.billToLabel}>BILL TO:</strong>
            <p style={styles.billingDetails}>{`${invoiceData?.customerTitle}: ${invoiceData?.customerTitleValue}`}</p>
            <p
              style={styles.billingDetails}
            >{`${invoiceData?.customerPhoneTitle}: ${invoiceData?.customerPhoneValue}`}</p>
            <p style={styles.billingDetails}>Generated By: {`${invoiceData?.generatedBy}`}</p>
          </div>
        </div>

        {/* Invoice Title Section */}
        <div style={styles.invoiceTitleSection}>
          <div style={styles.invoiceBadge}>
            <span style={styles.invoiceText}>{invoiceData?.invoiceTitle}</span>
          </div>
          <div style={styles.invoiceDetails}>
            <p style={styles.paragraph}>
              {invoiceData?.billingDetailsFirstTitle}: {invoiceData?.billingDetailsFirstValue}
            </p>
            <p style={styles.paragraph}>
              {invoiceData?.billingDetailsSecondTitle}: {invoiceData?.billingDetailsSecondValue}
            </p>
            <p style={styles.paragraph}>
              {invoiceData?.billingDetailsThirdTitle}: {invoiceData?.billingDetailsThirdValue}
            </p>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div style={styles.table}>
        <PrintLaserTable data={invoiceData?.listData} columns={invoiceData?.columns} />
      </div>

      <div style={styles.totalFooter}>
        <div style={styles.barcodeSection}>
          {JSON.parse(localStorage.getItem("SoftwareWithFBR")) && (
            <>
              {invoiceData?.FBRInvoiceNumber && (
                <>
                  <img src={logo || "/placeholder.svg"} alt="Logo" style={{ height: "50px" }} />
                  <QRCode
                    style={{ height: "50px", width: "50px", marginLeft: "10px" }}
                    value={invoiceData?.FBRInvoiceNumber}
                  />
                </>
              )}
            </>
          )}
        </div>
        <div style={styles.totalSection}>
          <div style={styles.totalsRow}>
            <span>{invoiceData?.totalFirstTitle}</span>
            <span>{invoiceData?.totalFirstValue}</span>
          </div>
          <div style={styles.totalsRow}>
            <span>{invoiceData?.totalSecondTitle}</span>
            <span>{invoiceData?.totalSecondValue}</span>
          </div>
          <div style={styles.totalsRow}>
            <span>{invoiceData?.totalThirdTitle}</span>
            <span>{invoiceData?.totalThirdValue}</span>
          </div>
          <div style={{ ...styles.totalsRow }}>
            <span>{invoiceData?.totalFourthTitle}</span>
            <span>{invoiceData?.totalFourthValue}</span>
          </div>

          {invoiceData?.paymentStatus !== "Paid" && (
            <>
              <div style={{ ...styles.totalsRow }}>
                <span>{invoiceData?.totalFifthTitle}</span>
                <span>{invoiceData?.totalFifthValue}</span>
              </div>

              <div style={{ ...styles.totalsRow }}>
                <span>{invoiceData?.totalSixthTitle}</span>
                <span>{invoiceData?.totalSixthValue}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Totals */}

      {/* Terms & Conditions */}
      {/* <p style={styles.terms}>Terms & Conditions: {invoiceData?.terms}</p> */}

      {/* Footer */}
      <div style={styles.footer}>
        <span>Powered by Soft Wise Solutions +92 334 096 0444</span>
      </div>
    </div>
  )
}

export default Invoice
