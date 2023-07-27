import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col,Form, FormGroup, Label,CardFooter, Input} from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import '../../assets/css/Table.css';
import ReactBSAlert from "react-bootstrap-sweetalert";
import localforage from 'localforage';
const DataTable = () => {
  const [dataTable, setDataTable] = useState([]);
  const [file, setFile] = useState(null);
  const [showUploadDiv, setShowUploadDiv] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [renderEdit, setRenderEdit] = useState(false);
  const [oldData, setOldData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
//Variable Set
const [no, setNo] = useState(null);
const [billNumber, setBillNumber] = useState(null);
const [date, setDate] = useState(null);
const [psr, setPsr] = useState(null);
const [customerCode, setCustomerCode] = useState(null);
const [name, setName] = useState(null);
const [city, setCity] = useState(null);
const [area, setArea] = useState(null);
const [colorMake, setColorMake] = useState(null);

const [productCode, setProductCode] = useState(null);
const [productName, setProductName] = useState(null);
const [unit, setUnit] = useState(null);
const [unit2, setUnit2] = useState(null);
const [kg, setKg] = useState(null);
const [originalValue, setOriginalValue] = useState(null);

const [secondaryOutputValue, setSecondaryOutputValue] = useState(null);
const [price, setPrice] = useState(null);
const [originalPrice, setOriginalPrice] = useState(null);
const [discountPercentage, setDiscountPercentage] = useState(null);
const [amountSale, setAmountSale] = useState(null);
const [discount, setDiscount] = useState(null);
const [additionalSales, setAdditionalSales] = useState(null);
const [netSales, setNetSales] = useState(null);
const [paymentCash, setPaymentCash] = useState(null);
const [paymentCheck, setPaymentCheck] = useState(null);
const [balance, setBalance] = useState(null);
const [saler, setSaler] = useState(null);
const [currSepidar, setCurrSepidar] = useState(null);
const [dollarSepidar, setDollarSepidar] = useState(null);
const [currency, setCurrency] = useState(null);
const [dollar, setDollar] = useState(null);
const [managerRating, setManagerRating] = useState(null);
const [seniorSaler, setSeniorSaler] = useState(null);
const [totMonthlySales, setTotMonthlySales] = useState(null);
const [receipment, setReceipment] = useState(null);
const [ct, setCt] = useState(null);
const [paymentType, setPaymentType] = useState(null);
const [customerSize, setCustomerSize] = useState(null);
const [salerFactor, setSalerFactor] = useState(null);
const [primPercentage, setPrimPercentage] = useState(null);
const [bonusFactor, setBonusFactor] = useState(null);
const [bonus, setBonus] = useState(null);


  React.useEffect(() => {
    return function cleanup() {
      var id = window.setTimeout(null, 0);
      while (id--) {
        window.clearTimeout(id);
      }
    };
  }, []);
  useEffect(() => {
   
    async function fetchData() {
      const access_token = await localforage.getItem('access_token'); 
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/sales/`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(access_token)
        }
      });
      const data = await response.json();
      setDataTable(data);
      
      setDataChanged(false);
      setRenderEdit(false)
    }
    fetchData();
  }, [dataChanged,renderEdit]);

  /*
  useEffect(() => {
    console.log(dataTable);
  }, [dataTable]);
*/

  const handleFileInputChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleAddFileClick = () => {
    clearTimeout(timeoutId); // Clear any existing timeout
    setTimeoutId(setTimeout(() => setShowUploadDiv(true), 500));
   
    
  }
  const handleUploadClick = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const access_token = await localforage.getItem('access_token'); 
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/add_sales/`, {
      method: 'POST',
      body: formData,
      
      headers: {
        'Authorization': 'Bearer '+ String(access_token)
      }
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(data => {
          //console.log(data.error)
          setIsLoading(false);
          errorUpload(data.error);
        });
      }
      else{
        return response.json().then(data => {
          setIsLoading(false);
          successUpload(data.message);
          fetch(`${process.env.REACT_APP_PUBLIC_URL}/sales/`,{
            headers: {
              'Authorization': 'Bearer '+ String(access_token)
            }
          })
          .then((response) => response.json())
          .then((data) =>{
             setDataTable(data)
             });
          clearTimeout(timeoutId); // Clear any existing timeout
          setTimeoutId(setTimeout(() => setShowUploadDiv(false), 500));
        });
      }
    })
    .catch((error) => {
      console.error(error.message); // the error message returned by the server
      setIsLoading(false);
      errorUpload(e);
    })
    .finally(() => {
      setShowUploadDiv(false);
      
    });
  };
  

  const warningWithConfirmAndCancelMessage = () => {
    
    setAlert(
      
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() =>{ 
        setDeleteConfirm(true);
        successDelete()}}
        onCancel={() => {
          setDeleteConfirm(false);
          cancelDelete()
        }}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
       Are you sure to delete this row?
      </ReactBSAlert>
    );
    
  };
  useEffect(() => {
    
  },[deleteConfirm]);

  const successDelete = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Deleted!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        Your row has been deleted.
      </ReactBSAlert>
    );
  };
  const cancelDelete = () => {
    setAlert(
      <ReactBSAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title="Cancelled"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        Your row is safe :)
      </ReactBSAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };

  const successUpload = (s) => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Uploaded!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
       {s}
      </ReactBSAlert>
    );
  };

  const errorUpload = (e) => {
    setAlert(
      <ReactBSAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title="Error"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        {e}
      </ReactBSAlert>
    );
  };
    
  
    
    useEffect(() => {
      async function deleteFunc() {
      if (deleteConfirm) {
       
        const access_token =  await localforage.getItem('access_token');
        fetch(`${process.env.REACT_APP_PUBLIC_URL}/delete_sales/`, {
          method: "POST",
          body: new URLSearchParams(deleteData),
          headers: {
           
            'Authorization': 'Bearer '+ String(access_token)
          }
        })
          setDataChanged(!dataChanged);
       
        setDeleteConfirm(false);
      }
    }
    deleteFunc()
    }, [deleteConfirm]);
  

    const handleClick = (row) => {
     
      setEditData(row);
      setOldData(row);

      setNo(row.no);
      setBillNumber(row.bill_number);
      setDate(row.date);
      setPsr(row.psr);
      setCustomerCode(row.customer_code);
      setName(row.name);
      setCity(row.city)
      setArea(row.area);
      setColorMake(row.color_making_saler)
      setProductCode(row.product_code);
      setProductName(row.product_name);
      setUnit(row.unit);
      setUnit2(row.unit2);
      setKg(row.kg)
      setOriginalValue(row.original_value);
      setSecondaryOutputValue(row.secondary_output_value);
      setPrice(row.price_dollar);
      setOriginalPrice(row.original_price_dollar);
      setDiscountPercentage(row.discount_percentage);
      setAmountSale(row.amount_sale);
      setDiscount(row.discount);
      setAdditionalSales(row.additional_sales);
      setNetSales(row.net_sales);
      setPaymentCash(row.payment_cash);
      setPaymentCheck(row.payment_check);
      setBalance(row.balance);
      setSaler(row.saler);
      setCurrSepidar(row.currency_sepidar);
      setDollarSepidar(row.dollar_sepidar);
      setCurrency(row.currency);
      setDollar(row.dollar);
      setManagerRating(row.manager_rating);
      setSeniorSaler(row.senior_saler);
      setTotMonthlySales(row.tot_monthly_sales);
      setReceipment(row.receipment);
      setCt(row.ct);
      setPaymentType(row.payment_type);
      setCustomerSize(row.customer_size);
      setSalerFactor(row.saler_factor);
      setPrimPercentage(row.prim_percentage);
      setBonusFactor(row.bonus_factor);
      setBonus(row.bonus);
      setShowPopup(!showPopup);
      setIsUpdated(true)
      //console.log(row)
    };

    const handleSubmit = async (e) => {
      //console.log("e")
      //console.log(oldData)
      const access_token =  await localforage.getItem('access_token');
      const updatedData = {
        new_no: no,
        new_bill_number: billNumber,
        new_date: date,
        new_psr: psr,
        new_customer_code: customerCode,
        new_name: name,
        new_city: city,
        new_area: area,
        new_color_making_saler: colorMake,      
        new_product_code: productCode,
        new_product_name: productName,
        new_unit: unit,
        new_unit2: unit2,
        new_kg: kg,
        new_original_value: originalValue,
        new_secondary_output_value: secondaryOutputValue,
        new_price_dollar: price,
        new_original_price_dollar: originalPrice,
        new_discount_percentage: discountPercentage,
        new_amount_sale: amountSale,
        new_discount: discount,
        new_additional_sales: additionalSales,
        new_net_sales: netSales,
        new_payment_cash: paymentCash,
        new_payment_check: paymentCheck,
        new_balance: balance,
        new_saler: saler,
        new_currency_sepidar:currSepidar,
        new_dollar_sepidar: dollarSepidar,
        new_currency: currency,
        new_dollar: dollar,
        new_manager_rating: managerRating,
        new_senior_saler: seniorSaler,
        new_tot_monthly_sales: totMonthlySales,
        new_receipment: receipment,
        new_ct: ct,
        new_payment_type: paymentType,
        new_customer_size: customerSize,
        new_saler_factor: salerFactor,
        new_prim_percentage: primPercentage,
        new_bonus_factor: bonusFactor,
        new_bonus: bonus,

        old_no: oldData[0],
        old_bill_number: oldData[1],
        old_date: oldData[2],
        old_psr: oldData[3],
        old_customer_code: oldData[4],
        old_name: oldData[5],
        old_city: oldData[6],
        old_area: oldData[7],
        old_color_making_saler: oldData[8],
        old_product_code: oldData[9],
        old_product_name: oldData[10],
        old_unit: oldData[11],
        old_unit2: oldData[12],
        old_kg: oldData[13],
        old_original_value: oldData[14],
        old_secondary_output_value: oldData[15],
        old_price: oldData[16],
        old_original_price: oldData[17],
        old_discount_percentage: oldData[18],
        old_amount_sale: oldData[19],
        old_discount: oldData[20],
        old_additional_sales: oldData[21],
        old_net_sales: oldData[22],
        old_payment_cash: oldData[23],
        old_payment_check: oldData[24],
        old_balance: oldData[25],
        old_saler: oldData[26],
        old_currency_sepidar: oldData[27],
        old_dollar_sepidar: oldData[28],
        old_currency: oldData[29],
        old_dollar: oldData[30],
        old_manager_rating: oldData[31],
        old_senior_saler: oldData[32],
        old_tot_monthly_sales: oldData[33],
        old_receipment: oldData[34],
        old_ct: oldData[35],
        old_payment_type: oldData[36],
        old_customer_size: oldData[37],
        old_saler_factor: oldData[38],
        old_prim_percentage: oldData[39],
        old_bonus_factor: oldData[40],
        old_bonus: oldData[41]
      };
      
      fetch(`${process.env.REACT_APP_PUBLIC_URL}/edit_sales/`, {
      method: 'POST',
      body: JSON.stringify(updatedData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ String(access_token)
      },
      
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(data => {
          //console.log("sdadas")
          setIsLoading(false);
          errorUpload(data.error);
        });
      }
      else{
        return response.json().then(data => {
          //console.log("asdaasdas")
         setEditData(updatedData);
          successEdit()
        });
      }

      // Call your Django API to send the updated values here
    });
  };

    const handleCancel = () => {
      setShowPopup(false);
      setEditData(null)
    };

    useEffect(() => {
      
      if(editData){
        
        setNo(editData[0]);
        setBillNumber(editData[1]);
        setDate(editData[2]);
        setPsr(editData[3]);
        setCustomerCode(editData[4]);
        setName(editData[5]);
        setCity(editData[6]);
        setArea(editData[7]);
        setColorMake(editData[8]);
        setProductCode(editData[9]);
        setProductName(editData[10]);
        setUnit(editData[11]);
        setUnit2(editData[12]);
        setKg(editData[13]);
        setOriginalValue(editData[14]);
        setSecondaryOutputValue(editData[15]);
        setPrice(editData[16]);
        setOriginalPrice(editData[17]);
        setDiscountPercentage(editData[18]);
        setAmountSale(editData[19]);
        setDiscount(editData[20]);
        setAdditionalSales(editData[21]);
        setNetSales(editData[22]);
        setPaymentCash(editData[23]);
        setPaymentCheck(editData[24]);
        setBalance(editData[25]);
        setSaler(editData[26]);
        setCurrSepidar(editData[27]);
        setDollarSepidar(editData[28]);
        setCurrency(editData[29]);
        setDollar(editData[30]);
        setManagerRating(editData[31]);
        setSeniorSaler(editData[32]);
        setTotMonthlySales(editData[33]);
        setReceipment(editData[34]);
        setCt(editData[35]);
        setPaymentType(editData[36]);
        setCustomerSize(editData[37]);
        setSalerFactor(editData[38]);
        setPrimPercentage(editData[39]);
        setBonusFactor(editData[40]);
        setBonus(editData[41]);
          setIsUpdated(true)
      }
    }, [editData])
    

    const successEdit = () => {
      setAlert(
        <ReactBSAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Saved!"
          onConfirm={() => {
            hideAlert()
            setShowPopup(false)}
          }
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="info"
          btnSize=""
        >
          Your edit has been successfully saved.
        </ReactBSAlert>
      );
      setRenderEdit(true)
    };


    async function handleExportClick() {
      // Retrieve the access token from localForage
      const access_token = await localforage.getItem('access_token');
    
      // Make an AJAX request to the backend to download the CSV file
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/export_sales/`, {
        headers: {
          'Authorization': 'Bearer '+ String(access_token)
        },
      });
    
      // Parse the JSON response
      const data = await response.json();
    
      // Extract the filename and content from the JSON response
      const filename = data.filename;
      const base64Content = data.content;
    
      // Convert the base64 content to a Blob
      const binaryContent = atob(base64Content);
      const byteNumbers = new Array(binaryContent.length);
      for (let i = 0; i < binaryContent.length; i++) {
        byteNumbers[i] = binaryContent.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
      // Create a link to download the file and simulate a click to download it
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    }

    async function handleBIExportClick() {
      // Retrieve the access token from localForage
      const access_token = await localforage.getItem('access_token');
    
      // Make an AJAX request to the backend to download the CSV file
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/export_sales_power_bi/`, {
        headers: {
          'Authorization': 'Bearer '+ String(access_token)
        },
      });
    
      // Parse the JSON response
      const data = await response.json();
    
      // Extract the filename and content from the JSON response
      const filename = data.filename;
      const base64Content = data.content;
    
      // Convert the base64 content to a Blob
      const binaryContent = atob(base64Content);
      const byteNumbers = new Array(binaryContent.length);
      for (let i = 0; i < binaryContent.length; i++) {
        byteNumbers[i] = binaryContent.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
      // Create a link to download the file and simulate a click to download it
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    }
  return (
    <>
      <div className='content'>
      {alert}

        <Row>
          <Col
          >
            {/* Pop Up */}
      {showPopup && isUpdated &&(
       <div className="popup-sales">
      <Card>
            <CardHeader>
              <CardTitle tag="h4">Edit Sales</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
              <div>
        <div className="form-group-col-sales">

          <label>No</label>
          <FormGroup>
            <Input
              name="no"
              type="text"
              defaultValue={no}
              onChange={(e) => setNo(e.target.value)}
            />
          </FormGroup>

          <label>Bill Number</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
            />
          </FormGroup>

          <label>Date</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormGroup>

          <label>PSR</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={psr}
              onChange={(e) => setPsr(e.target.value)}
            />
          </FormGroup>

          <label>Customer Code</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={customerCode}
              onChange={(e) => setCustomerCode(e.target.value)}
            />
          </FormGroup>

          <label>Name</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
        
          <label>City</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </FormGroup>
          </div>
        
          <div className="form-group-col-sales">
          <label>Area</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </FormGroup>
          <label>Color Making Saler</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={colorMake}
              onChange={(e) => setColorMake(e.target.value)}
            />
          </FormGroup>
          
          
          

          <label>Product Code</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={productCode}
              onChange={(e) => setProductCode(e.target.value)}
            />
          </FormGroup>

          <label>Prodcut Name</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </FormGroup>

          <label>Unit</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </FormGroup>
          
          <label>Unit2</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={unit2}
              onChange={(e) => setUnit2(e.target.value)}
            />
          </FormGroup>

          <label>Bonus Factor</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={bonusFactor}
              onChange={(e) =>setBonusFactor(e.target.value)}
            />
          </FormGroup>
          </div>

          <div className="form-group-col-sales">

          <label>KG</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={kg}
              onChange={(e) => setKg(e.target.value)}
            />
          </FormGroup>
          
  

          <label>Second. Output Val.</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={secondaryOutputValue}
              onChange={(e) => setSecondaryOutputValue(e.target.value)}
            />
          </FormGroup>

          <label>Price</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </FormGroup>


          <label>Original Price</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
            />
          </FormGroup>
         

          
          <label>Amount Sale</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={amountSale}
              onChange={(e) => setAmountSale(e.target.value)}
            />
          </FormGroup>

          <label>Discount</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={discount}
              onChange={(e) =>  setDiscount(e.target.value)}
            />
          </FormGroup>
             <label>Bonus</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={bonus}
              onChange={(e) =>setBonus(e.target.value)}
            />
          </FormGroup>
          </div>


          <div className="form-group-col-sales">
          <label>Additional Sales</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={additionalSales}
              onChange={(e) =>  setAdditionalSales(e.target.value)}
            />
          </FormGroup>

          <label>Net Sales</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={netSales}
              onChange={(e) =>   setNetSales(e.target.value)}
            />
          </FormGroup>

          

          <label>Payment Cash</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={paymentCash}
              onChange={(e) =>  setPaymentCash(e.target.value)}
            />
          </FormGroup>
          
          <label>Payment Check</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={paymentCheck}
              onChange={(e) =>   setPaymentCheck(e.target.value)}
            />
          </FormGroup>
         

          
          <label>Balance</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={balance}
              onChange={(e) =>   setBalance(e.target.value)}
            />
          </FormGroup>

          <label>Senior Saler</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={seniorSaler}
              onChange={(e) =>   setSeniorSaler(e.target.value)}
            />
          </FormGroup>

          <label>Prim Percentage</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={primPercentage}
              onChange={(e) =>setPrimPercentage(e.target.value)}
            />
          </FormGroup>
          

          </div>

          <div className="form-group-col-sales">
          <label>Saler</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={saler}
              onChange={(e) =>   setSaler(e.target.value)}
            />
          </FormGroup>

          <label>Curreny-Sepidar</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={currSepidar}
              onChange={(e) => setCurrSepidar(e.target.value)}
            />
          </FormGroup>

          <label>Dollar-Sepidar</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={dollarSepidar}
              onChange={(e) => setDollarSepidar(e.target.value)}
            />
          </FormGroup>

          <label>Currency</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={currency}
              onChange={(e) =>   setCurrency(e.target.value)}
            />
          </FormGroup>,

          <label>Dollar</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={dollar}
              onChange={(e) =>   setDollar(e.target.value)}
            />
          </FormGroup>

          <label>Manager Rating</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={managerRating}
              onChange={(e) =>   setManagerRating(e.target.value)}
            />
          </FormGroup>

        
          </div>

          <div className="form-group-col-sales">
          
          <label>Total Monthly Sales</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={totMonthlySales}
              onChange={(e) =>   setTotMonthlySales(e.target.value)}
            />
          </FormGroup>
          

          
          <label>Receipment</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={receipment}
              onChange={(e) =>   setReceipment(e.target.value)}
            />
          </FormGroup>

          <label>CT</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={ct}
              onChange={(e) =>   setCt(e.target.value)}
            />
          </FormGroup>

          <label>Payment Type</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={paymentType}
              onChange={(e) =>   setPaymentType(e.target.value)}
            />
          </FormGroup>

          <label>Customer Size</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={customerSize}
              onChange={(e) => setCustomerSize(e.target.value)}
            />
          </FormGroup>
          
          <label>Saler Factor</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={salerFactor}
              onChange={(e) =>setSalerFactor(e.target.value)}
            />
          </FormGroup>

         

          
         
          </div>
        </div>
        
              </Form>
            </CardBody>
              <CardFooter>
                <Button className="btn-round" color="success" type="submit" onClick={handleSubmit}>
                  Submit
                </Button>
                <Button className="btn-round" color="danger" type="submit"  onClick={handleCancel}>
                  Cancel
                </Button>
              </CardFooter>
            </Card>
            </div>
)}
<Card>
  <CardHeader>
    <CardTitle tag='h4'>SALES</CardTitle>
  </CardHeader>
  <CardBody>
    <div className="upload-container">
      {!showUploadDiv && (
        <div className="d-flex justify-content-between align-items-center">
          <Button className="my-button-class" color="primary" onClick={handleAddFileClick}>
            <i className="fa fa-plus-circle mr-1"></i>
            Add File
          </Button>
          <Button className="my-button-class" color="primary" onClick={handleExportClick}>
            <i className="fa fa-download mr-1"></i>
             Excel Export
          </Button>
          <Button className="my-button-class" color="primary" onClick={handleBIExportClick}>
            <i className="fa fa-download mr-1"></i>
             BI Export
          </Button>
        </div>
      )}
      {showUploadDiv && (
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <Button className="my-button-class" color="primary" onClick={handleAddFileClick}>
              <i className="fa fa-plus-circle mr-1"></i>
              Add File
            </Button>
            <Button className="my-button-class" color="primary" onClick={handleExportClick}>
              <i className="fa fa-download mr-1"></i>
              Excel Export
            </Button>
            <Button className="my-button-class" color="primary" onClick={handleBIExportClick}>
            <i className="fa fa-download mr-1"></i>
              BI Export
          </Button>
          </div>
          <div className="mt-3">
            <input type="file" className="custom-file-upload" onChange={handleFileInputChange} />
            <Button color="primary" className="btn-upload" onClick={handleUploadClick} disabled={!file} active={!file}>
              Upload
            </Button>
            <div className="spinner-container">
              {isLoading && <div className="loading-spinner"></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  </CardBody>
</Card>
            <Card >
             
              <CardBody >

                <ReactTable
                  data={dataTable.map((row,index) => ({
                    id: row.id,
                    no: row[0],
                    bill_number: row[1],
                    date: row[2],
                    psr: row[3],
                    customer_code: row[4],
                    name: row[5],
                    city: row[6],
                    area: row[7],
                    color_making_saler: row[8],
                    product_code: row[9],
                    product_name: row[10],
                    unit: row[11],
                    unit2: row[12],
                    kg: row[13],
                    original_value: row[14],
                    secondary_output_value: row[15],
                    price_dollar: row[16],
                    original_price_dollar: row[17],
                    discount_percentage: row[18],
                    amount_sale: row[19],
                    discount: row[20],
                    additional_sales: row[21],
                    net_sales: row[22],
                    payment_cash: row[23],
                    payment_check: row[24],
                    balance: row[25],
                    saler: row[26],
                    currency_sepidar: row[27],
                    dollar_sepidar: row[28],
                    currency: row[29],
                    dollar: row[30],
                    manager_rating: row[31],
                    senior_saler: row[32],
                    tot_monthly_sales: row[33],
                    receipment: row[34],
                    ct: row[35],
                    payment_type: row[36],
                    customer_size: row[37],
                    saler_factor: row[38],
                    prim_percentage: row[39],
                    bonus_factor: row[40],
                    bonus: row[41],


                    actions: (
                      <div className='actions-left'>
                       
                       <Button
                          disabled={showPopup}
                          onClick={() => {
                            // Enable edit mode
                            
                           {handleClick(row)}
                           
                          
                          }}
                          
                          color='warning'
                          size='sm'
                          className='btn-icon btn-link edit'
                        >
                          <i className='fa fa-edit' />
                        </Button>{' '}
                        
                        <>
    
    
                          <Button
                              disabled={showPopup}
                            onClick={() => {
                              
                               warningWithConfirmAndCancelMessage() 
                               const rowToDelete = {...row};
                               const data = {
                                no: rowToDelete [0],
                                product_code: rowToDelete [10],
                                original_output_value: rowToDelete [16]
                              };
                              
                              setDeleteData(data);
                              
                              /*
                              if (deleteConfirm) {
                                const updatedDataTable = dataTable.find((o) => o.id == row.id);
                                ////console.log(updatedDataTable[0]);
                                const data = {
                                  no: updatedDataTable[0],
                                  good_code: updatedDataTable[10],
                                  original_output_value: updatedDataTable[14],
                                };
                                setDeleteData(data);
                                ////console.log(data);
                                fetch(`${process.env.REACT_APP_PUBLIC_URL}/delete_sales/`, {
                                  method: "POST",
                                  body: new URLSearchParams(data),
                                }).then(() => {
                                  //  //console.log("row id:", row.id);
                                  ////console.log("dataTable:", dataTable);
                                  const filteredDataTable = dataTable.filter(
                                    (o) => Number(o.id) !== Number(row.id)
                                  );
                                  //  //console.log(filteredDataTable);
                                  setDataTable(filteredDataTable);
                                  setDataChanged(!dataChanged);
                                });

                              }
                              */

                            }
                            }
                            color="danger"
                            size="sm"
                            className="btn-icon btn-link remove"
                          >
                            <i className="fa fa-times" />
                          </Button>
    
  </>


                      </div>
                    ),
                  }))}
                  columns={[
                    {
                      Header: 'No',
                      accessor: 'no'
                    },
                    {
                      Header: 'Bill Number',
                      accessor: 'bill_number'
                    },
                    {
                      Header: 'Date',
                      accessor: 'date'
                    },
                    {
                      Header: 'PSR',
                      accessor: 'psr'
                    },
                    {
                      Header: 'Customer Code',
                      accessor: 'customer_code'
                    },
                    {
                      Header: 'Name',
                      accessor: 'name'
                    },
                    {
                      Header: 'City',
                      accessor: 'city'
                    },
                    {
                      Header: 'Area',
                      accessor: 'area'
                    },
                    {
                      Header: 'Color Making Saler',
                      accessor: 'color_making_saler'
                    },
                    {
                      Header: 'Product Code',
                      accessor: 'product_code'
                    },
                    {
                      Header: 'Product Name',
                      accessor: 'product_name'
                    },
                    {
                      Header: 'Unit',
                      accessor: 'unit'
                    },
                    {
                      Header: 'Unit2',
                      accessor: 'unit2'
                    },
                    {
                      Header: 'KG',
                      accessor: 'kg'
                    },
                    {
                      Header: 'Original Value',
                      accessor: 'original_value'
                    },
                    {
                      Header: 'Secondary Output Value',
                      accessor: 'secondary_output_value'
                    },
                    {
                      Header: 'Price($)',
                      accessor: 'price_dollar'
                    },
                    {
                      Header: 'Original Price($)',
                      accessor: 'original_price_dollar'
                    },
                    {
                      Header: 'Discount Percentage',
                      accessor: 'discount_percentage'
                    },
                    {
                      Header: 'Amount Sale',
                      accessor: 'amount_sale'
                    },
                    {
                      Header: 'Discount',
                      accessor: 'discount'
                    },
                    {
                      Header: 'Additional Sales',
                      accessor: 'additional_sales'
                    },
                    {
                      Header: 'Net Sales',
                      accessor: 'net_sales'
                    },
                    {
                      Header: 'Payment Cash',
                      accessor: 'payment_cash'
                    },
                    {
                      Header: 'Payment Check',
                      accessor: 'payment_check'
                    },
                    {
                      Header: 'Balance',
                      accessor: 'balance'
                    },
                    {
                      Header: 'Saler',
                      accessor: 'saler'
                    },
                    {
                      Header: 'Currency-Sepidar',
                      accessor: 'currency_sepidar'
                    },
                    {
                      Header: 'Dollar-Sepidar',
                      accessor: 'dollar_sepidar'
                    },
                    {
                      Header: 'Currency',
                      accessor: 'currency'
                    },
                    {
                      Header: 'Dollar',
                      accessor: 'dollar'
                    },
                    {
                      Header: 'Manager Rating',
                      accessor: 'manager_rating'
                    },
                    {
                      Header: 'Senior Saler',
                      accessor: 'senior_saler'
                    },
                    {
                      Header: 'Tot Monthly Sales',
                      accessor: 'tot_monthly_sales'
                    },
                    {
                      Header: 'Receipment',
                      accessor: 'receipment'
                    },
                    {
                      Header: 'CT',
                      accessor: 'ct'
                    },
                    {
                      Header: 'Payment Type',
                      accessor: 'payment_type'
                    },
                    {
                      Header: 'Customer Size',
                      accessor: 'customer_size'
                    },
                    {
                      Header: 'Saler Factor',
                      accessor: 'saler_factor'
                    },
                    {
                      Header: 'Prim Percentage',
                      accessor: 'prim_percentage'
                    },
                    {
                      Header: 'Bonus Factor',
                      accessor: 'bonus_factor'
                    },
                    {
                      Header: 'Bonus',
                      accessor: 'bonus'
                    },
                    
                    {
                      Header: 'Actions',
                      accessor: 'actions',
                      sortable: false,
                      filterable: false,
                     
                      
                    }
                  ]}
                  defaultPageSize={10}
                  className='-striped -highlight'
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
    
  );
};

export default DataTable;
