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
const [area, setArea] = useState(null);
const [group, setGroup] = useState(null);
const [goodCode, setGoodCode] = useState(null);
const [goods, setGoods] = useState(null);
const [unit, setUnit] = useState(null);
const [originalValue, setOriginalValue] = useState(null);
const [originalOutputValue, setOriginalOutputValue] = useState(null);
const [secondaryOutputValue, setSecondaryOutputValue] = useState(null);
const [price, setPrice] = useState(null);
const [originalPrice, setOriginalPrice] = useState(null);
const [discountPercentage, setDiscountPercentage] = useState(null);
const [amountSale, setAmountSale] = useState(null);
const [discount, setDiscount] = useState(null);
const [additionalSales, setAdditionalSales] = useState(null);
const [netSales, setNetSales] = useState(null);
const [discountPercentage2, setDiscountPercentage2] = useState(null);
const [realDiscountPercentage, setRealDiscountPercentage] = useState(null);
const [paymentCash, setPaymentCash] = useState(null);
const [paymentCheck, setPaymentCheck] = useState(null);
const [balance, setBalance] = useState(null);
const [saler, setSaler] = useState(null);
const [currency, setCurrency] = useState(null);
const [dollar, setDollar] = useState(null);
const [managerRating, setManagerRating] = useState(null);
const [seniorSaler, setSeniorSaler] = useState(null);
const [totMonthlySales, setTotMonthlySales] = useState(null);
const [receipment, setReceipment] = useState(null);
const [ct, setCt] = useState(null);
const [paymentType, setPaymentType] = useState(null);
const [costumerSize, setCostumerSize] = useState(null);
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
      const response = await fetch('http://127.0.0.1:8000/sales/',{
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
    fetch('http://127.0.0.1:8000/add_sales/', {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'Authorization': 'Bearer '+ String(access_token)
      }
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(data => {
          console.log(data.error)
          setIsLoading(false);
          errorUpload(data.error);
        });
      }
      else{
        return response.json().then(data => {
          setIsLoading(false);
          successUpload(data.message);
          fetch('http://127.0.0.1:8000/sales/',{
            headers: {
              'Authorization': 'Bearer '+ String(access_token)
            }
          })
          .then((response) => response.json())
          .then((data) =>{
             setDataTable(data)
             console.log(data.message)});
          clearTimeout(timeoutId); // Clear any existing timeout
          setTimeoutId(setTimeout(() => setShowUploadDiv(false), 500));
        });
      }
    })
    .catch((error) => {
      console.error(error.message); // the error message returned by the server
      setIsLoading(false);
      errorUpload();
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
        fetch(`http://127.0.0.1:8000/delete_sales/`, {
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
      setArea(row.area);
      setGroup(row.group);
      setGoodCode(row.good_code);
      setGoods(row.goods);
      setUnit(row.unit);
      setOriginalValue(row.original_value);
      setOriginalOutputValue(row.original_output_value);
      setSecondaryOutputValue(row.secondary_output_value);
      setPrice(row.price);
      setOriginalPrice(row.original_price);
      setDiscountPercentage(row.discount_percentage);
      setAmountSale(row.amount_sale);
      setDiscount(row.discount);
      setAdditionalSales(row.additional_sales);
      setNetSales(row.net_sales);
      setDiscountPercentage2(row.discount_percentage_2);
      setRealDiscountPercentage(row.real_discount_percentage);
      setPaymentCash(row.payment_cash);
      setPaymentCheck(row.payment_check);
      setBalance(row.balance);
      setSaler(row.saler);
      setCurrency(row.currency);
      setDollar(row.dollar);
      setManagerRating(row.manager_rating);
      setSeniorSaler(row.senior_saler);
      setTotMonthlySales(row.tot_monthly_sales);
      setReceipment(row.receipment);
      setCt(row.ct);
      setPaymentType(row.payment_type);
      setCostumerSize(row.costumer_size);
      setSalerFactor(row.saler_factor);
      setPrimPercentage(row.prim_percentage);
      setBonusFactor(row.bonus_factor);
      setBonus(row.bonus);
      setShowPopup(!showPopup);
      setIsUpdated(true)
      console.log(row)
    };

    const handleSubmit = async (e) => {
      console.log("e")
      console.log(oldData)
      const access_token =  await localforage.getItem('access_token');
      const updatedData = {
        new_no: no,
        new_bill_number: billNumber,
        new_date: date,
        new_psr: psr,
        new_customer_code: customerCode,
        new_name: name,
        new_area: area,
        new_group: group,
        new_good_code: goodCode,
        new_goods: goods,
        new_unit: unit,
        new_original_value: originalValue,
        new_original_output_value: originalOutputValue,
        new_secondary_output_value: secondaryOutputValue,
        new_price: price,
        new_original_price: originalPrice,
        new_discount_percentage: discountPercentage,
        new_amount_sale: amountSale,
        new_discount: discount,
        new_additional_sales: additionalSales,
        new_net_sales: netSales,
        new_discount_percentage_2: discountPercentage2,
        new_real_discount_percentage: realDiscountPercentage,
        new_payment_cash: paymentCash,
        new_payment_check: paymentCheck,
        new_balance: balance,
        new_saler: saler,
        new_currency: currency,
        new_dollar: dollar,
        new_manager_rating: managerRating,
        new_senior_saler: seniorSaler,
        new_tot_monthly_sales: totMonthlySales,
        new_receipment: receipment,
        new_ct: ct,
        new_payment_type: paymentType,
        new_costumer_size: costumerSize,
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
        old_area: oldData[6],
        old_group: oldData[7],
        old_good_code: oldData[8],
        old_goods: oldData[9],
        old_unit: oldData[10],
        old_original_value: oldData[11],
        old_original_output_value: oldData[12],
        old_secondary_output_value: oldData[13],
        old_price: oldData[14],
        old_original_price: oldData[15],
        old_discount_percentage: oldData[16],
        old_amount_sale: oldData[17],
        old_discount: oldData[18],
        old_additional_sales: oldData[19],
        old_net_sales: oldData[20],
        old_discount_percentage_2: oldData[21],
        old_real_discount_percentage: oldData[22],
        old_payment_cash: oldData[23],
        old_payment_check: oldData[24],
        old_balance: oldData[25],
        old_saler: oldData[26],
        old_currency: oldData[27],
        old_dollar: oldData[28],
        old_manager_rating: oldData[29],
        old_senior_saler: oldData[30],
        old_tot_monthly_sales: oldData[31],
        old_receipment: oldData[32],
        old_ct: oldData[33],
        old_payment_type: oldData[34],
        old_costumer_size: oldData[35],
        old_saler_factor: oldData[36],
        old_prim_percentage: oldData[37],
        old_bonus_factor: oldData[38],
        old_bonus: oldData[39],
      };
      
      fetch('http://127.0.0.1:8000/edit_sales/', {
      method: 'POST',
      body: JSON.stringify(updatedData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ String(access_token)
      },
      credentials: 'include'
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(data => {
          console.log("sdadas")
          setIsLoading(false);
          errorUpload(data.error);
        });
      }
      else{
        return response.json().then(data => {
          console.log("asdaasdas")
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
        setArea(editData[6]);
        setGroup(editData[7]);
        setGoodCode(editData[8]);
        setGoods(editData[9]);
        setUnit(editData[10]);
        setOriginalValue(editData[11]);
        setOriginalOutputValue(editData[12]);
        setSecondaryOutputValue(editData[13]);
        setPrice(editData[14]);
        setOriginalPrice(editData[15]);
        setDiscountPercentage(editData[16]);
        setAmountSale(editData[17]);
        setDiscount(editData[18]);
        setAdditionalSales(editData[19]);
        setNetSales(editData[20]);
        setDiscountPercentage2(editData[21]);
        setRealDiscountPercentage(editData[22]);
        setPaymentCash(editData[23]);
        setPaymentCheck(editData[24]);
        setBalance(editData[25]);
        setSaler(editData[26]);
        setCurrency(editData[27]);
        setDollar(editData[28]);
        setManagerRating(editData[29]);
        setSeniorSaler(editData[30]);
        setTotMonthlySales(editData[31]);
        setReceipment(editData[32]);
        setCt(editData[33]);
        setPaymentType(editData[34]);
        setCostumerSize(editData[35]);
        setSalerFactor(editData[36]);
        setPrimPercentage(editData[37]);
        setBonusFactor(editData[38]);
        setBonus(editData[39]);
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
        

        
          <label>Area</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </FormGroup>
          </div>
          <div className="form-group-col-sales">
          <label>Group</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={group}
              onChange={(e) => setGroup(e.target.value)}
            />
          </FormGroup>

          <label>Good Code</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={goodCode}
              onChange={(e) => setGoodCode(e.target.value)}
            />
          </FormGroup>

          <label>Goods</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </FormGroup>

          <label>Original Output Value</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={originalOutputValue}
              onChange={(e) => setOriginalOutputValue(e.target.value)}
            />
          </FormGroup>

          <label>Secondary Output Value</label>
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
          </div>

          <div className="form-group-col-sales">
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

          <label>Discount Percentage(2)</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={discountPercentage2}
              onChange={(e) => setDiscountPercentage2(e.target.value)}
            />
          </FormGroup>

          <label>Real Discount Percentage</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={realDiscountPercentage}
              onChange={(e) =>  setRealDiscountPercentage(e.target.value)}
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
          </div>

          <div className="form-group-col-sales">
          <label>Balance</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={balance}
              onChange={(e) =>   setBalance(e.target.value)}
            />
          </FormGroup>

          <label>Set Saler</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={saler}
              onChange={(e) =>   setSaler(e.target.value)}
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

          <label>Senior Saler</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={seniorSaler}
              onChange={(e) =>   setSeniorSaler(e.target.value)}
            />
          </FormGroup>
          
          <label>Total Monthly Sales</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={totMonthlySales}
              onChange={(e) =>   setTotMonthlySales(e.target.value)}
            />
          </FormGroup>
          </div>

          <div className="form-group-col-sales">
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
              defaultValue={costumerSize}
              onChange={(e) => setCostumerSize(e.target.value)}
            />
          </FormGroup>
          </div>

          <div className="form-group-col-sales">
          <label>Saler Factor</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={salerFactor}
              onChange={(e) =>setSalerFactor(e.target.value)}
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

          <label>Bonus Factor</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={bonusFactor}
              onChange={(e) =>setBonusFactor(e.target.value)}
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
            <Card >
              <CardHeader>
                <CardTitle tag='h4'>SALES</CardTitle>
              </CardHeader>
              <CardBody >

                <div className='top-right'>
                {!showUploadDiv && ( 
                   <Button  className="my-button-class" color="primary" onClick={handleAddFileClick}>Add File</Button>
                   )}
                   {showUploadDiv && (
                    <div>
                  <input type='file' className='custom-file-upload' onChange={handleFileInputChange} />
                  <Button color='primary' className='btn-upload' onClick={handleUploadClick} disabled={!file} active={!file}>
                    Upload
                  </Button>
                  
                     <div className="spinner-container">
                     {isLoading && <div className="loading-spinner"></div>}
                     </div>
                     </div>
                   )}
                </div>
                <ReactTable
                  data={dataTable.map((row,index) => ({
                    id: row.id,
                    no: row[0],
                    bill_number: row[1],
                    date: row[2],
                    psr: row[3],
                    customer_code: row[4],
                    name: row[5],
                    area: row[6],
                    group: row[7],
                    good_code: row[8],
                    goods: row[9],
                    unit: row[10],
                    original_value: row[11],
                    original_output_value: row[12],
                    secondary_output_value: row[13],
                    price: row[14],
                    original_price: row[15],
                    discount_percentage: row[16],
                    amount_sale: row[17],
                    discount: row[18],
                    additional_sales: row[19],
                    net_sales: row[20],
                    discount_percentage_2: row[21],
                    real_discount_percentage: row[22],
                    payment_cash: row[23],
                    payment_check: row[24],
                    balance: row[25],
                    saler: row[26],
                    currency: row[27],
                    dollar: row[28],
                    manager_rating: row[29],
                    senior_saler: row[30],
                    tot_monthly_sales: row[31],
                    receipment: row[32],
                    ct: row[33],
                    payment_type: row[34],
                    costumer_size: row[35],
                    saler_factor: row[35],
                    prim_percentage: row[36],
                    bonus_factor: row[37],
                    bonus: row[38],
                    

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
                                good_code: rowToDelete [8],
                                original_output_value: rowToDelete [12],
                              };
                              setDeleteData(data);
                              
                              /*
                              if (deleteConfirm) {
                                const updatedDataTable = dataTable.find((o) => o.id == row.id);
                                //console.log(updatedDataTable[0]);
                                const data = {
                                  no: updatedDataTable[0],
                                  good_code: updatedDataTable[10],
                                  original_output_value: updatedDataTable[14],
                                };
                                setDeleteData(data);
                                //console.log(data);
                                fetch(`http://127.0.0.1:8000/delete_sales/`, {
                                  method: "POST",
                                  body: new URLSearchParams(data),
                                }).then(() => {
                                  //  console.log("row id:", row.id);
                                  //console.log("dataTable:", dataTable);
                                  const filteredDataTable = dataTable.filter(
                                    (o) => Number(o.id) !== Number(row.id)
                                  );
                                  //  console.log(filteredDataTable);
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
                      accessor: 'no',


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
                      Header: 'Area',
                      accessor: 'area'
                    },
                    {
                      Header: 'Group',
                      accessor: 'group'
                    },
                    {
                      Header: 'Good Code',
                      accessor: 'good_code'
                    },
                    {
                      Header: 'Goods',
                      accessor: 'goods'
                    },
                    {
                      Header: 'Unit',
                      accessor: 'unit'
                    },
                    {
                      Header: 'Original Value',
                      accessor: 'original_value'
                    },
                    {
                      Header: 'Original Output Value',
                      accessor: 'original_output_value'
                    },
                    {
                      Header: 'Secondary Output Value',
                      accessor: 'secondary_output_value'
                    },
                    {
                      Header: 'Price',
                      accessor: 'price'
                    },
                    {
                      Header: 'Original Price',
                      accessor: 'original_price'
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
                      Header: 'Discount Percentage (2)',
                      accessor: 'discount_percentage_2'
                    },
                    {
                      Header: 'Real Discount Percentage',
                      accessor: 'real_discount_percentage'
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
                      Header: 'Costumer Size',
                      accessor: 'costumer_size'
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
