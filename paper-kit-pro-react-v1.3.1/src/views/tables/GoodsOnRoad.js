import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col, Input,Form, FormGroup, Label,CardFooter} from 'reactstrap';
import  {Link} from 'react-router-dom';
import ReactTable from 'components/ReactTable/ReactTable.js';
import localforage from 'localforage';
import ReactBSAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
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
  const [goodsOnRoadData, setGoodsOnRoadData] = useState([]);

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

  const [waitingTrucksData, setWaitingTrucksData] = useState([]);
  
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
    const fetchWaitingTrucksData = async () => {
        const access_token = await localforage.getItem('access_token'); 
        const response = await fetch('http://127.0.0.1:8000/api/waiting_trucks/', {
          method: 'GET',
          headers: {
            
            'Authorization': 'Bearer '+ String(access_token)
          },
        });

        const responseData = await response.json();
        
        console.log(responseData)
       
        const formattedData = Object.keys(responseData).map((key) => ({
            truck_name: key,
            data: responseData[key],
          }));
          setWaitingTrucksData(formattedData);
       
    }

    fetchWaitingTrucksData();
  }, []);

  
  const handleMoveToGoodsOnRoad = async (truckData) => {
    try {
      const access_token = await localforage.getItem('access_token');
      const response = await fetch("http://127.0.0.1:8000/api/approve_waiting/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + String(access_token)
        },
        body: JSON.stringify({ truck_name: truckData.truck_name }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Approved waiting truck:", responseData);
  
        // Remove the truck from the waitingTrucksData state
        setWaitingTrucksData((prevData) => {
          return prevData.filter((data) => data.truck_name !== truckData.truck_name);
        });
  
        // Add the approved truck to the goodsOnRoadData state
        setGoodsOnRoadData((prevData) => {
          const newTruckData = {
            truck_name: truckData.truck_name,
            data: truckData.data,
          };
          return [...prevData, newTruckData];
        });
  
        fetchGoodsOnRoadData();
      } else {
        console.error("Failed to approve waiting truck");
      }
    } catch (error) {
      console.error("Error approving waiting truck:", error);
    }
  };
  
  
  useEffect(() => {
    const fetchGoodsOnRoadData = async () => {
      const access_token = await localforage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/trucks_on_road/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(access_token),
        },
      });
  
      const responseData = await response.json();
  
      const formattedData = Object.keys(responseData).map((key) => ({
        truck_name: key,
        data: responseData[key],
      }));
      setGoodsOnRoadData(formattedData);
    };
  
    fetchGoodsOnRoadData();
  }, []);
  
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
  


  const approve = (truck) => {
   
    setAlert(
      
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() =>{ 
        handleMoveToGoodsOnRoad(truck)
        }}
        onCancel={() => {
         hideAlert()
        }}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes!"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
       Are you sure to approve this truck?
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



                  <Card>
  <CardHeader>
    <CardTitle tag="h4">Waiting Trucks</CardTitle>
  </CardHeader>
  <CardBody>
    {waitingTrucksData.map((truckData, index) => (
      <div
        className="truck-table-container"
        key={index}
        style={{
          marginBottom: index < waitingTrucksData.length - 1 ? '2rem' : 0,
          borderBottom:
            index < waitingTrucksData.length - 1
              ? '1px solid #dee2e6'
              : 'none',
          paddingBottom: index < waitingTrucksData.length - 1 ? '2rem' : 0,
        }}
      >
       <div className="d-flex justify-content-between align-items-center">
          <h5>{truckData.truck_name}</h5>
          <FontAwesomeIcon
            icon={faCheck}
            className="text-success cursor-pointer"
            onClick={() => approve(truckData)}
          />
        </div>
        <ReactTable
          data={truckData.data.map((row, key) => {
            const newRow = {};
            Object.keys(row).forEach((column) => {
              if (
                ![
                  'is_ordered',
                  'is_terminated',
                  'is_on_truck',
                  'is_on_road',
                  'is_arrived',
                ].includes(column)
              ) {
                const formattedKey = column
                  .split('_')
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1),
                  )
                  .join(' ');
                newRow[formattedKey] = row[column];
              }
            });
            return newRow;
          })}
          columns={Object.keys(truckData.data[0] || {})
            .filter(
              (key) =>
                ![
                  'is_ordered',
                  'is_terminated',
                  'is_on_truck',
                  'is_on_road',
                  'is_arrived',
                ].includes(key),
            )
            .map((key) => {
              const formattedKey = key
                .split('_')
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1),
                )
                .join(' ');
              return { Header: formattedKey, accessor: formattedKey };
            })}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    ))}
  </CardBody>
</Card>

                  </div>
                  <Row>
  <Col md="12">
                  <Card>
  <CardHeader>
    <CardTitle tag="h4">Goods on the Road</CardTitle>
  </CardHeader>
  <CardBody>
    {goodsOnRoadData &&
      goodsOnRoadData.map((goodsOnRoadTruck, index) => (
        <div
          className="truck-table-container"
          key={index}
          style={{
            marginBottom: index < goodsOnRoadData.length - 1 ? "2rem" : 0,
            borderBottom:
              index < goodsOnRoadData.length - 1
                ? "1px solid #dee2e6"
                : "none",
            paddingBottom: index < goodsOnRoadData.length - 1 ? "2rem" : 0,
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5>{goodsOnRoadTruck.truck_name}</h5>
            <FontAwesomeIcon
              icon={faEdit}
              className="text-warning cursor-pointer"
              onClick={() => handleEditGoodsOnRoad(goodsOnRoadTruck)}
            />
          </div>
          <ReactTable
            data={goodsOnRoadTruck.data.map((row, key) => {
              const newRow = {};
              Object.keys(row).forEach((column) => {
                if (
                  ![
                    "is_ordered",
                    "is_terminated",
                    "is_on_truck",
                    "is_on_road",
                    "is_arrived",
                  ].includes(column)
                ) {
                  const formattedKey = column
                    .split("_")
                    .map(
                      (word) => word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(" ");
                  newRow[formattedKey] = row[column];
                }
              });
              return newRow;
            })}
            columns={Object.keys(goodsOnRoadTruck.data[0] || {})
              .filter(
                (key) =>
                  ![
                    "is_ordered",
                    "is_terminated",
                    "is_on_truck",
                    "is_on_road",
                    "is_arrived",
                  ].includes(key)
              )
              .map((key) => {
                const formattedKey = key
                  .split("_")
                  .map(
                    (word) => word.charAt(0).toUpperCase() + word.slice(1)
                  )
                  .join(" ");
                return { Header: formattedKey, accessor: formattedKey };
              })}
            defaultPageSize={10}
            className="-striped -highlight"
            // Make sure to add the necessary properties to make the rows editable
          />
        </div>
      ))}
  </CardBody>
</Card>
</Col>
</Row>

                  </>
                  );
                  };
                  
                  export default DataTable;
