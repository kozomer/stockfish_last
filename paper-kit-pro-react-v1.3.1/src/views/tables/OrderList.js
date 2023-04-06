import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col, Input,Form, FormGroup, Label,CardFooter} from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import localforage from 'localforage';
import ReactBSAlert from "react-bootstrap-sweetalert";
const DataTable = () => {
  const [dataTable, setDataTable] = useState([]);
  const [file, setFile] = useState(null);
  const [showUploadDiv, setShowUploadDiv] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [productCode, setProductCode] = useState(null);
  const [productTitle, setProductTitle] = useState(null);
  const [unit, setUnit] = useState(null);
  const [stock, setStock] = useState(null);
  const [alert, setAlert] = useState(null);
  const [renderEdit, setRenderEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [editData, setEditData] = useState(null);
  const [oldData, setOldData] = useState(null);

  const [leadTime, setLeadTime] = useState('');

  const [serviceLevel, setServiceLevel] = useState('');
  
  useEffect(() => {
    async function fetchData() {
      const access_token = await localforage.getItem('access_token'); 
      
      const response = await fetch('http://127.0.0.1:8000/order_list/',{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(access_token)
        }});
      const data = await response.json();
      setDataTable(data);
      console.log(data)
    }
    fetchData();
  }, [dataChanged,renderEdit]);

  /*
  useEffect(() => {
    console.log(dataTable);
  }, [dataTable]);
*/


const handleSave = async () => {
  // handle the save logic here
  

  const access_token = await localforage.getItem('access_token');
  
  const selectData = { lead_time: leadTime, service_level:serviceLevel};
  // post the selected option to Django
  fetch('http://127.0.0.1:8000/rop/', {
    method: 'POST',
  headers: { "Content-Type": "application/json", 
  'Authorization': 'Bearer '+ String(access_token)},
    
    body: JSON.stringify(selectData),
   
  })
    .then(response => response.json())
    .then(data => {
      
      setTableData(data.rop_list);
      setResult(data);
      setOrder(data.avrg_order);
      setOrderFlag(data.avrg_order_flag)

      setOrderHolt(data.holt_order);
      setOrderFlagHolt(data.holt_order_flag)

      setOrderExp(data.exp_order);
      setOrderFlagExp(data.exp_order_flag)
      
    }) 
};

useEffect(() => {
  if ( leadTime && serviceLevel ) {
    
    setSaveDisabled(false);
  } else {
    setSaveDisabled(true);
  }
}, [ leadTime, serviceLevel]);
  
  
  const handleClick = (row) => {
     
    setEditData(row);
    setOldData(row);

    setProductCode(row.product_code);
    setProductTitle(row.title);
    setUnit(row.unit);
    setStock(row.stock);
   
    setShowPopup(!showPopup);
    console.log(row)
  };
  const handleSubmit = async (e) => {
    const access_token = await localforage.getItem('access_token'); 
    console.log(oldData)
    const updatedData = {
      new_product_code:productCode,
      new_title:productTitle,
      new_unit:unit,
      new_stock:stock,
     
      

      old_product_code:oldData[0],
      old_title:oldData[1],
      old_unit:oldData[2],
      old_stock:oldData[3],
      
      
    };
    console.log(updatedData)
    fetch('http://127.0.0.1:8000/edit_warehouse/', {
    method: 'POST',
    body: JSON.stringify(updatedData),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ String(access_token)
    },
    credentials: 'include'
  })
  setEditData(updatedData);
  successEdit()

    // Call your Django API to send the updated values here
  };
  const successEdit = () => {
    console.log("edit success")
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


  const handleCancel = () => {
    setShowPopup(false);
    setEditData(null)
  };
  
  useEffect(() => {
    console.log("useEffect called")
    if(editData){
      
      setProductCode(editData[0]);
      setProductTitle(editData[1]);
      setUnit(editData[2]);
      setStock(editData[3]);
       
        setIsUpdated(true)
    }
  }, [editData])
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

  //delete
  


  const warningWithConfirmAndCancelMessage = () => {
    console.log("sadsads"),
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
        async function deleteFunc() {
        if (deleteConfirm) {
         console.log("delete")
         const access_token =  await localforage.getItem('access_token'); 
          fetch(`http://127.0.0.1:8000/delete_warehouse/`, {
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


 
  
  return (
    <>
      <div className='content'>
      {alert}
      {showPopup && isUpdated &&(
       <div className="popup">
      <Card>
            <CardHeader>
              <CardTitle tag="h4">Edit Customers</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
              <div>

        <div className="form-group-col">
          <label>Product Code</label>
          <FormGroup>
            <Input
              
              type="text"
              defaultValue={productCode}
              onChange={(e) => setProductCode(e.target.value)}
            />
          </FormGroup>

          <label>Product Title</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
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

          <label>Stock</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={stock}
              onChange={(e) => setStock(e.target.value)}
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
    <CardTitle tag='h4'>ORDER LIST</CardTitle>
  </CardHeader>
  <CardBody>
    <Row>
  <Col md="4">
            <Label for="leadTime">Lead Time:</Label>
            <Input
              type="number"
              name="leadTime"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
            />
          </Col>
          <Col md="4">
            <Label for="serviceLevel">Service Level(must 0.00 - 1.00):</Label>
            <Input
              type="number"
              name="serviceLevel"
              value={serviceLevel}
              min="0"
              max="1"
              step="0.01"
              onChange={(e) => setServiceLevel(e.target.value)}
            />
          </Col>
          <Col md="4" className="text-center">
            <Button color="primary" className="btn-upload" onClick={handleSave} disabled={saveDisabled}>
              SHOW RESULTS
            </Button>
          </Col>
          </Row>
  </CardBody>
</Card>
        <Row>
          <Col md='12'>
            <Card>
             
              <CardBody>
             
                <ReactTable
                  data={dataTable.map((row, key) => ({
                    id: key,
                    current_date: row[0],
                    product_code: row[1],
                    weight: row[2],
                    average_sale: row[3],
                    current_stock: row[4],
                    order_avrg: row[5],
                    order_exp: row[6],
                    order_holt: row[7],

                    decided_order: row[8],
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
                                product_code: rowToDelete[0],

                              };
                              setDeleteData(data);
                              console.log(deleteConfirm)
                             
                            
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
                    { Header: 'Order Date', accessor: 'current_date' },
                    { Header: 'Product Code', accessor: 'product_code' },
                    { Header: 'Weight', accessor: 'weight' },
                    { Header: 'Average Sale', accessor: 'average_sale' },
                    { Header: 'Current Stock', accessor: 'current_stock' },
                    { Header: 'Order by Avrg.', accessor: 'order_avrg' },
                    { Header: 'Order by Exp.', accessor: 'order_exp' },
                    { Header: 'Order by Holt', accessor: 'order_holt' },
                    
                   
                    { Header: 'Decided Order', accessor: 'decided_order' },
                    
                    { Header: 'Actions', accessor: 'actions' ,sortable: false,
                    filterable: false },
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
