import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col, Input,Form, FormGroup, Label,CardFooter} from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import ReactBSAlert from "react-bootstrap-sweetalert";
import '../../assets/css/Table.css';

const DataTable = () => {
  const [dataTable, setDataTable] = useState([]);
  const [file, setFile] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);
  const [showUploadDiv, setShowUploadDiv] = useState(false);
  const [alert, setAlert] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [renderEdit, setRenderEdit] = useState(false);

  /* Variables */
  const [customerCode, setCustomerCode] = useState(null);
  const [description, setDescription] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [areaCode, setAreaCode] = useState(null);
  const [code, setCode] = useState(null);
  const [city, setCity] = useState(null);
  const [area, setArea] = useState(null);
  const [unit, setUnit] = useState(null);
  
  

  const [oldData, setOldData] = useState(null);
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
      const response = await fetch('http://127.0.0.1:8000/customers/');
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
    setShowUploadDiv(true);
  }
  const handleUploadClick = () => {
    const formData = new FormData();
    formData.append('file', file);
    console.log(file)
    fetch('http://127.0.0.1:8000/add_customers/', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
      .then((response) => {

        console.log(response);
        alert('File uploaded successfully');
        fetch('http://127.0.0.1:8000/customers/')
          .then((response) => response.json())
          .then((data) => setDataTable(data));
          setShowUploadDiv(false);
      })
      .catch((error) => {
        console.error(error);
        alert('Error uploading file');
       
      });
    
  };
  
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
    console.log(deleteConfirm)
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

  
    
    useEffect(() => {
      if (deleteConfirm) {
       console.log("delete")
        
        fetch(`http://127.0.0.1:8000/delete_customers/`, {
          method: "POST",
          body: new URLSearchParams(deleteData),
        })
          setDataChanged(!dataChanged);
       
        setDeleteConfirm(false);
      }
    }, [deleteConfirm]);


    const handleClick = (row) => {
     
      setEditData(row);
      setOldData(row);

      setCustomerCode(row.customer_code);
      setDescription(row.description);
      setQuantity(row.quantity);
      setAreaCode(row.area_code);
      setCode(row.code);
      setCity(row.city);
      setArea(row.area);

      setShowPopup(!showPopup);
      console.log(row)
    };


    const handleSubmit = (e) => {
      console.log("e")
      console.log(oldData)
      const updatedData = {
        new_customer_code:customerCode,
        new_description:description,
        new_quantity:quantity,
        new_area_code:areaCode,
        new_code:code,
        new_city:city,
        new_area:area,
        

        old_customer_code:oldData[0],
        old_description:oldData[1],
        old_quantity:oldData[2],
        old_area_code:oldData[3],
        old_code:oldData[4],
        old_city:oldData[5],
        old_area:oldData[6],
        
      };
      console.log(updatedData)
      fetch('http://127.0.0.1:8000/edit_customers/', {
      method: 'POST',
      body: JSON.stringify(updatedData),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    setEditData(updatedData);
    successEdit()

      // Call your Django API to send the updated values here
    };

    const handleCancel = () => {
      setShowPopup(false);
      setEditData(null)
    };

    useEffect(() => {
      console.log("useEffect called")
      if(editData){
        
        setCustomerCode(editData[0]);
        setDescription(editData[1]);
          setQuantity(editData[2]);
          setAreaCode(editData[3]);
          setCode(editData[4]);
          setCity(editData[5]);
          setArea(editData[6]);
          
          setIsUpdated(true)
      }
    }, [editData])
  
  return (
    <>
      <div className='content'>
      {alert}
      {/* Pop Up */}
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
          <label>Customer Code</label>
          <FormGroup>
            <Input
              
              type="text"
              defaultValue={customerCode}
              onChange={(e) => setCustomerCode(e.target.value)}
            />
          </FormGroup>

          <label>Description</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormGroup>

          <label>Quantity</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </FormGroup>

          <label>Area Code</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={areaCode}
              onChange={(e) => setAreaCode(e.target.value)}
            />
          </FormGroup>

          <label>Code</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={code}
              onChange={(e) => setCode(e.target.value)}
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
        

       
          <label>Area</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={area}
              onChange={(e) => setArea(e.target.value)}
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
                <CardTitle tag='h4'>CUSTOMERS</CardTitle>
              </CardHeader>
              <CardBody>
              <div>
                {!showUploadDiv && (
                   <Button  className="my-button-class" color="primary" onClick={handleAddFileClick}>Add File</Button>
                   )}
                   {showUploadDiv && (
                    <div>
                  <input type='file' className='custom-file-upload' onChange={handleFileInputChange} />
                  <Button color='primary' className='btn-upload' onClick={handleUploadClick} disabled={!file} active={!file}>
                    Upload
                  </Button>
                  </div>
                   )}
                   
                </div>
                <ReactTable
                  data={dataTable.map((row, index) => ({
                    id: row.id,
                    customer_code: row[0],
                    description: row[1],
                    quantity: row[2],
                    area_code: row[3],
                    code: row[4],
                    city: row[5],
                    area: row[6],
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
                                customer_code: rowToDelete[0],

                              };
                              setDeleteData(data);
                              console.log(deleteConfirm)
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
                    { Header: 'Customer Code', accessor: 'customer_code' },
                    { Header: 'Description', accessor: 'description' },
                    { Header: 'Quantity', accessor: 'quantity' },
                    { Header: 'Area Code', accessor: 'area_code' },
                    { Header: 'Code', accessor: 'code' },
                    { Header: 'City', accessor: 'city' },
                    { Header: 'Area', accessor: 'area' },
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
