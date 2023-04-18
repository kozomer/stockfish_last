import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col, Input,Form, FormGroup, Label,CardFooter} from 'reactstrap';
import  {Link} from 'react-router-dom';
import ReactTable from 'components/ReactTable/ReactTable.js';
import localforage from 'localforage';
import ReactBSAlert from "react-bootstrap-sweetalert";
const DataTable = () => {
  const [dataTable, setDataTable] = useState([]);
  const [edit, setEdit] = useState({ row: -1, column: '' });
  const [showUploadDiv, setShowUploadDiv] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [date, setDate] = useState(null);
  const [productCode, setProductCode] = useState(null);
  const [productTitle, setProductTitle] = useState(null);
  const [weight, setWeight] = useState(null);
  const [avrgSale, setAvrgSale] = useState(null);
  const [stock, setStock] = useState(null);
  const [orderAvrg, setOrderAvrg] = useState(null);
  const [orderExp, setOrderExp] = useState(null);
  const [orderHolt, setOrderHolt] = useState(null);
  const [decidedOrder, setDecidedOrder] = useState(null);
  const [id, setID] = useState(null);

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
  const [showForm, setShowForm] = useState(false);
  const [newTruck, setNewTruck] = useState({
    truck_name: '',
    estimated_order_date: '',
    estimated_arrival_date: '',
  });

  const [serviceLevel, setServiceLevel] = useState('');
  
  useEffect(() => {
    async function fetchData() {
      const access_token = await localforage.getItem('access_token'); 
      
      const response = await fetch('http://127.0.0.1:8000/api/goods_on_road/',{
        method: 'GET',
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


  const handleEdit = (key, column) => {
    setEdit({ row: key, column: column });
  };

  const handleChange = (e, row) => {
    // Update your dataTable state
  };

  const handleBlur = () => {
    setEdit({ row: -1, column: '' });
  };

  const handleNewTruckInputChange = (e) => {
    setNewTruck({ ...newTruck, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleNewTruckSubmit = async () => {
      const access_token = await localforage.getItem('access_token'); 
      const response = await fetch('http://127.0.0.1:8000/api/add_truck/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(access_token)
          // Add the appropriate headers for your API (e.g., Authorization)
        },
        body: JSON.stringify(newTruck),
      })


      .then((response) => {
        if (!response.ok) {
          return response.json().then(data => {
            console.log(data.error)
            
            errorUpload(data.error);
          });
        }
       
        else{
          return response.json().then(data => {
            
            successEdit(data.message);
            handleShowForm()
          })
      
          }
        })
  }

  // Y
  const handleShowForm = () => {
    setShowForm((prevState) => !prevState);
    
  };

  // Function to hide the form
  const handleCancelForm = () => {
    setShowForm(false);
  };
useEffect(() => {
  if ( leadTime && serviceLevel ) {
    
    setSaveDisabled(false);
  } else {
    setSaveDisabled(true);
  }
}, [ leadTime, serviceLevel]);
  
  
  const handleClick = (row,key) => {
     
    setEditData(row);
    setID(key)
    setDate(row.current_date)

    setProductCode(row.product_code);
    setWeight(row.weight);
    setAvrgSale(row.average_sale);
    setStock(row.current_stock);
    setOrderAvrg(row.order_avrg);
    setOrderExp(row.order_exp);
    setOrderHolt(row.orderHolt);
    setDecidedOrder(row.decided_order);
    setShowPopup(!showPopup);
    console.log(row)
  };
  const handleSubmit = async (e) => {
    const access_token = await localforage.getItem('access_token'); 
    console.log(id)
    const updatedData = {
      id:id,
      current_date:date,
      product_code:productCode,
      weight:weight,
      average_sale:avrgSale,
      current_stock: stock,
      order_avrg: orderAvrg,
      order_exp: orderExp,
      order_holt: orderHolt,
      decided_order: decidedOrder
     
      

      
      
      
    };
    console.log(updatedData)
    fetch('http://vividstockfish.com/api/edit_order_list/', {
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
  const successEdit = (s) => {
    
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
       {s}
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
      
      setDate(editData[0]);
      setProductCode(editData[1]);
      setWeight(editData[2]);
      setAvrgSale(editData[3]);
      setStock(editData[4]);
      setOrderAvrg(editData[5]);
      setOrderExp(editData[6]);
      setOrderHolt(editData[7]);
      setDecidedOrder(editData[8])
       
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
      <Card>
        <CardHeader>
        <CardTitle tag="h4">
            Add Truck
            
              <Button onClick={handleShowForm} color="success" size="sm" className="btn-icon btn-link">
                <i className="fa fa-plus" />
              </Button>
            
          </CardTitle>
        </CardHeader>
        <CardBody>
        {showForm && (
          <Form>
            <FormGroup>
              <Label for="truck_name">Truck Name</Label>
              <Input
                type="text"
                name="truck_name"
                id="truck_name"
                value={newTruck.truck_name}
                onChange={handleNewTruckInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="estimated_order_date">Estimated Order Date(YYYY-MM-DD)</Label>
              <Input
                type="text"
                name="estimated_order_date"
                id="estimated_order_date"
                value={newTruck.estimated_order_date}
                onChange={handleNewTruckInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="estimated_arrival_date">Estimated Arrival Date(YYYY-MM-DD)</Label>
              <Input
                type="text"
                name="estimated_arrival_date"
                id="estimated_arrival_date"
                value={newTruck.estimated_arrival_date}
                onChange={handleNewTruckInputChange}
              />
            </FormGroup>
            <Button onClick={handleNewTruckSubmit} color="primary">
              Submit
            </Button>
            <Button onClick={handleCancelForm} color="secondary">
                Cancel
              </Button>
          </Form>
          )}
        </CardBody>
      </Card>
      {showPopup && (
       <div className="popup">
      <Card>
            <CardHeader>
              <CardTitle tag="h4">Edit/Decide Order</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
              <div>

        <div className="form-group-col">
          <label>Date</label>
          <FormGroup>
            <Input
              
              type="text"
              defaultValue={date}
              onChange={(e) => setDate(e.target.value)}
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

          <label>Weight</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </FormGroup>

          <label>Average Sale</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={avrgSale}
              onChange={(e) => setAvrgSale(e.target.value)}
            />
          </FormGroup>

          <label>Current Stock</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </FormGroup>

          <label>Order by Avrg.</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={orderAvrg}
              onChange={(e) => setOrderAvrg(e.target.value)}
            />
          </FormGroup>

          <label>Order by Exp.</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={orderExp}
              onChange={(e) => setOrderExp(e.target.value)}
            />
          </FormGroup>

          <label>Order by Holt</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={orderHolt}
              onChange={(e) => setOrderHolt(e.target.value)}
            />
          </FormGroup>

          <label>Decided Order</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={decidedOrder}
              onChange={(e) => setDecidedOrder(e.target.value)}
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


        <Row>
          <Col md='12'>
            <Card>
             <CardHeader>
             <CardTitle tag="h4">Products to Order</CardTitle>
             </CardHeader>
              <CardBody>
             
                <ReactTable
                  data={dataTable.map((row, key) => ({
                    id: key,
                    product_code: row[0],
                    product_name_tr: row[1],
                    product_name_ir: row[2],
                    decided_order: (
                        <div>
                          {edit.row === key && edit.column === 'decided_order' ? (
                            <input
                              type="text"
                              value={row[3]}
                              onChange={(e) => handleChange(e, row)}
                              onBlur={handleBlur}
                            />
                          ) : (
                            <span onClick={() => handleEdit(key, 'decided_order')}>{row[3]}</span>
                          )}
                        </div>
                      ),
                    weight: row[4],
                    truck_id: (
                        <div>
                          {edit.row === key && edit.column === 'truck_id' ? (
                            <input
                              type="text"
                              value={row[5]}
                              onChange={(e) => handleChange(e, row)}
                              onBlur={handleBlur}
                            />
                          ) : (
                            <span onClick={() => handleEdit(key, 'truck_id')}>{row[5]}</span>
                          )}
                        </div>
                      ),
                    
                    actions: (
                      <div className='actions-left'>
                         <Button
                          disabled={showPopup}
                          onClick={() => {
                            // Enable edit mode
                            
                           {handleClick(row,key)}
                           
                          
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
                    
                    { Header: 'Product Code', accessor: 'product_code' },
                    { Header: 'Product Name-TR', accessor: 'product_name_tr' },
                    { Header: 'Product Name-IR', accessor: 'product_name_ir' },
                    { Header: 'Decided Order', accessor: 'decided_order' },
                    { Header: 'Weight', accessor: 'weight' },
                    { Header: 'Truck', accessor: 'truck_id' },
                    
                   
                    
                    
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
