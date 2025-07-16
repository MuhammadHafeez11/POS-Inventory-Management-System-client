import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Define styles
// Define styles
const styles = StyleSheet.create({
    page: { paddingTop: 20,  fontFamily: 'Helvetica' },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoSection: {
        flexDirection: 'column',
        width: '60%',
    },
    logoAndCompany: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        backgroundColor: '#FFA500', // Orange bar
        width: 10,
        height: 40, // Adjust height to your preference
        marginRight: 10,
    },
    companyInfo: {
        marginLeft: 10,
    },
    companyName: {
        fontSize: 18, 
        fontWeight: 'bold',
        color: '#000',
    },
    companyDetails: {
        fontSize: 10,
        color: '#555',
    },
    
    // Billing Section
    billToSection: {
       marginLeft:10, marginTop: 10,
    },
    billToLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    billingDetails: {
        fontSize: 10,
        color: '#555',
    },
    
    // Invoice Title Section
    invoiceTitleSection: {
        display: "flex",
        // flexDirection: 'column',
        width: '40%',
        alignItems: 'flex-end',
    },
    invoiceBadge: {
        backgroundColor: '#FFA500', // Orange background
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    invoiceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    invoiceDetails: {
        marginTop: 10,
        marginRight: 10,
        fontSize: 10,
        color: '#555',
        textAlign: 'right',
    },
    label: { fontSize: 12, color: '#555', marginBottom: 4 },
    text: { fontSize: 12, color: '#000', marginBottom: 2 },
    table: { marginLeft:10, marginRight: 10},
    tableHeader: { 
      flexDirection: 'row', 
      borderBottomWidth: 1, 
      borderBottomColor: 'black', 
      borderBottomStyle: 'solid', 
      paddingBottom: 6 
    },
    tableRow: { 
      flexDirection: 'row', 
      paddingBottom: 6, 
      borderBottomWidth: 1, 
      borderBottomColor: '#ddd', 
      borderBottomStyle: 'solid' 
    },
    description: { width: '50%', textAlign: 'left', fontSize: 12, padding: 4 },
    column: { width: '15.66%', textAlign: 'center', fontSize: 8, padding: 4, whiteSpace: 'nowrap' },
    rowColumn: { width: '15.66%', textAlign: 'center', fontSize: 8, padding: 4, whiteSpace: 'nowrap' },
    totalsRow: { marginLeft:10, marginRight: 10, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, fontSize: 12, width: '50%', textAlign: 'left'},
    bold: { fontWeight: 'bold' },
    totalSection:{ width: '100%', alignItems:'flex-end'},
    terms: { marginTop: 30, fontSize: 10, color: '#555' },
    footer: { marginTop: 50, flexDirection: 'row', justifyContent: 'center', fontSize: 10, color: '#000' },
  });
  

const Invoice = ({ invoiceData, list }) => 
    {
        console.log(invoiceData)
        return(<>
  <Document>
    <Page size="A4" style={styles.page}>
      
       {/* Header Section */}
       <View style={styles.header}>
                        <View style={styles.logoSection}>
                            <View style={styles.logoAndCompany}>
                                <View style={styles.logo} />
                                <View style={styles.companyInfo}>
                                    <Text style={styles.companyName}>{invoiceData?.companyTitle}</Text>
                                    <Text style={styles.companyDetails}>{invoiceData?.address}</Text>
                                    <Text style={styles.companyDetails}>{invoiceData?.contact}</Text>
                                </View>
                            </View>

                            {/* Bill To Section */}
                            <View style={styles.billToSection}>
                                <Text style={styles.billToLabel}>BILL TO:</Text>
                                <Text style={styles.billingDetails}>{`${invoiceData?.customerTitle}: ${invoiceData?.customerTitleValue}`}</Text>
                                <Text style={styles.billingDetails}>{`${invoiceData?.customerPhoneTitle}: ${invoiceData?.customerPhoneValue}`}</Text>
                                <Text style={styles.billingDetails}>Genereated By: {`${invoiceData?.generatedBy}`}</Text>
                            </View>
                        </View>

                        {/* Invoice Title Section */}
                        <View style={styles.invoiceTitleSection} c>
                            <View style={styles.invoiceBadge}>
                                <Text style={styles.invoiceText}>{invoiceData?.invoiceTitle}</Text>
                            </View>
                            <View style={styles.invoiceDetails}>
                                <Text>Invoice Number: {invoiceData?.invoiceNumber}</Text>
                                <Text>Date: {invoiceData?.invoiceDate}</Text>
                                <Text>Due Date: {invoiceData?.dueDate}</Text>
                            </View>
                        </View>
                    </View>
  
      <View style={styles.table}>
        <View style={styles.tableHeader}>
        {invoiceData?.columns.map((item, idx) => (
            <Text style={styles.column}>{item?.label}</Text>
        ))}
        </View>
     
          <View  style={styles.tableRow}>
          {invoiceData?.listData?.map((list, rowIdx) => (
        <View key={rowIdx} style={styles.tableRow}>
            {invoiceData?.columns.map((col, colIdx) => (
                <Text key={colIdx} style={styles.rowColumn}>
                    {list[col.field]}
                </Text>
            ))}
        </View>
        ))}
        </View>
       
      </View>
      {/* Totals */}
      <View style={styles.totalSection}>
      <View style={styles.totalsRow}>
        <Text>SUB TOTAL</Text>
        <Text>${invoiceData?.totalAmount}</Text>
      </View>
      <View style={styles.totalsRow}>
        <Text>TAX</Text>
        <Text>{invoiceData?.totalTaxCharged}%</Text>
      </View>
      <View style={[styles.totalsRow, styles.bold]}>
        <Text>TOTAL</Text>
        <Text>${invoiceData?.totalAmount}</Text>
      </View>
      </View>
      <Text style={styles.terms}>Terms & Conditions: {invoiceData.terms}</Text>

      <View style={styles.footer}>
        <Text>@socialmedia | email@company.com</Text>
      </View>

    </Page>
  </Document>
  </>)
    }
export default Invoice

