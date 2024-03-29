import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col, Input,Form, FormGroup, Label,CardFooter} from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import localforage from 'localforage';
import ReactBSAlert from "react-bootstrap-sweetalert";
const DataTable = () => {
  const [dataTable, setDataTable] = useState([]);
  const [totalWeight, setTotalWeight] = useState(null);
  const [file, setFile] = useState(null);
  const [showUploadDiv, setShowUploadDiv] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [productCode, setProductCode] = useState(null);
  const [productCodeTR, setProductCodeTR] = useState(null);
  const [productTitle, setProductTitle] = useState(null);
  const [unit, setUnit] = useState(null);
  const [stock, setStock] = useState(null);
  const [kg, setKg] = useState(null);
  const [alert, setAlert] = useState(null);
  const [renderEdit, setRenderEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);

  const [editData, setEditData] = useState(null);
  const [oldData, setOldData] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      const access_token = await localforage.getItem('access_token'); 
      
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/warehouse/`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(access_token)
        }});
      const data = await response.json();
      
      setDataTable(data.warehouse_list);
      setTotalWeight(data.total_weight);
      setDataChanged(false);
      setRenderEdit(false)
    }
    fetchData();
  }, [dataChanged,renderEdit]);

  /*
  useEffect(() => {
    //console.log(dataTable);
  }, [dataTable]);
*/


const handleAddFileClick = () => {
  setShowUploadDiv(true);
}

  const handleFileInputChange = (e) => {
    setFile(e.target.files[0]);
    //console.log(file)
  };

  const handleUploadClick = async() => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const access_token = await localforage.getItem('access_token'); 
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/add_warehouse/`, {
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
          fetch(`${process.env.REACT_APP_PUBLIC_URL}/warehouse/`,{
            headers: {
              'Authorization': 'Bearer '+ String(access_token)
            }
          })
          .then((response) => response.json())
          .then((data) =>{
             setDataTable(data.warehouse_list)
             });
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
  
  const handleClick = (row) => {
     //console.log(row[2])
    setEditData(row);
    setOldData(row);

    setProductCode(row[0]);
    setProductCodeTR(row[1])
    setProductTitle(row[2]);
    setUnit(row[3]);
    setStock(row[4]);
    setKg(row[5]);

    setShowPopup(!showPopup);
    
  };
  const handleSubmit = async (e) => {
    const access_token = await localforage.getItem('access_token'); 
    
    const updatedData = {
      new_product_code:productCode,
      new_product_code_tr:productCodeTR,
      new_title:productTitle,
      new_unit:unit,
      new_stock:stock,
      new_kg:kg,
      

      old_product_code:oldData[0],
      old_product_code_tr:oldData[1],
      old_title:oldData[2],
      old_unit:oldData[3],
      old_stock:oldData[4],
      old_kg: oldData[5]
      
      
    };
    //console.log(updatedData)
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/edit_warehouse/`, {
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
        //console.log(data.error)
        
        errorUpload(data.error);
      });
    }
   
    else{
      return response.json().then(data => {
        setEditData(updatedData);
        successEdit(data.message);
      })
  
      }
    })
 

    // Call your Django API to send the updated values here
  };
  const successEdit = (s) => {
    //console.log("edit success")
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
    //console.log("useEffect called")
    if(editData){
      
      setProductCode(editData[0]);
      setProductCodeTR(editData[1])
      setProductTitle(editData[2]);
      setUnit(editData[3]);
      setStock(editData[4]);
      setKg(editData[5]);
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
    //console.log("sadsads"),
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
         
         const access_token =  await localforage.getItem('access_token'); 
          fetch(`${process.env.REACT_APP_PUBLIC_URL}/delete_warehouse/`, {
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


  async function handleExportClick() {
    // Retrieve the access token from localForage
    const access_token = await localforage.getItem('access_token');
  
    // Make an AJAX request to the backend to download the CSV file
    const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/export_warehouse/`, {
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
          <label>Product Code TR</label>
          <FormGroup>
            <Input
              
              type="text"
              defaultValue={productCodeTR}
              onChange={(e) => setProductCodeTR(e.target.value)}
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

          <label>KG</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={kg}
              onChange={(e) => setKg(e.target.value)}
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
    <CardTitle tag='h4'><b>WAREHOUSE</b> (Total Weight: {totalWeight} kg)</CardTitle>
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
            Export
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
              Export
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
        <Row>
          <Col md='12'>
            <Card>
             
              <CardBody>
             
                <ReactTable
                  data={dataTable.map((row, key) => ({
                    id: key,
                    product_code: row[0],
                    product_code_tr: row[1],
                    title: row[2],
                    unit: row[3],
                    stock: row[4],
                    kg : row[5],
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
                              //console.log(deleteConfirm)
                             
                            
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
                    { Header: 'Product CodeTR', accessor: 'product_code_tr' },
                    { Header: 'Product Title', accessor: 'title' },
                    { Header: 'Unit', accessor: 'unit' },
                    { Header: 'Stock', accessor: 'stock' },
                    { Header: 'KG', accessor: 'kg' },
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
