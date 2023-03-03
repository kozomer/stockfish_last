import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col, Input,Form, FormGroup, Label,CardFooter} from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import '../../assets/css/Table.css';
import ReactBSAlert from "react-bootstrap-sweetalert";
import Popup from 'components/ReactTable/Popup.js';

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
  const [isLoading, setIsLoading] = useState(false);
  //Edit Variables
  const [group, setGroup] = useState(null);
  const [subgroup, setSubgroup] = useState(null);
  const [feature, setFeature] = useState(null);
  const [productIR, setProductIR] = useState(null);
  const [productTR, setProductTR] = useState(null);
  const [descriptionTR, setDescriptionTR] = useState(null);
  const [descriptionIR, setDescriptionIR] = useState(null);
  const [unit, setUnit] = useState(null);
  const [secondaryUnit, setSecondaryUnit] = useState(null);
  const [weight, setWeight] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [price, setPrice] = useState(null);

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
      const response = await fetch('http://127.0.0.1:8000/products/');
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
  const handleUploadClick = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    console.log(file)
    fetch('http://127.0.0.1:8000/add_products/', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
      .then((response) => {

        setIsLoading(false);
        successUpload();
        alert('File uploaded successfully');
        fetch('http://127.0.0.1:8000/products/')
          .then((response) => response.json())
          .then((data) => {setDataTable(data)
          console.log(data)});
          clearTimeout(timeoutId); // Clear any existing timeout
          setTimeoutId(setTimeout(() => setShowUploadDiv(false), 500));
   
      })
      .catch((error) => {
        console.error(error);
        alert('Error uploading file');
        setIsLoading(false);
        errorUpload()
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

  const successUpload = () => {
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
        Your file has been successfully uploaded!
      </ReactBSAlert>
    );
  };

  const errorUpload = () => {
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
        Error uploading file, try again. Make sure selecting correct file.
      </ReactBSAlert>
    );
  };
    
    useEffect(() => {
      if (deleteConfirm) {
       
        
        fetch(`http://127.0.0.1:8000/delete_products/`, {
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
      
      setGroup(row.group);
  setSubgroup(row.subgroup);
  setFeature(row.feature);
  setProductIR(row.product_code_ir);
  setProductTR(row.product_code_tr);
  setDescriptionTR(row.description_tr);
  setDescriptionIR(row.description_ir);
  setUnit(row.unit);
  setSecondaryUnit(row.unit_secondary);
  setWeight(row.weight);
  setCurrency(row.currency);
  setPrice(row.price);
      setShowPopup(!showPopup);
      console.log(row)
    };


    const handleSubmit = (e) => {
      console.log("e")
      console.log(oldData)
      const updatedData = {
        new_group:group,
        new_subgroup:subgroup,
        new_feature:feature,
        new_product_code_ir:productIR,
        new_product_code_tr:productTR,
        new_description_tr:descriptionTR,
        new_description_ir:descriptionIR,
        new_unit:unit,
        new_unit_secondary:secondaryUnit,
        new_weight:weight,
        new_currency:currency,
        new_price:price,

        old_group:oldData[0],
        old_subgroup:oldData[1],
        old_feature:oldData[2],
        old_product_code_ir:oldData[3],
        old_product_code_tr:oldData[4],
        old_description_tr:oldData[5],
        old_description_ir:oldData[6],
        old_unit:oldData[7],
        old_unit_secondary:oldData[8],
        old_weight:oldData[9],
        old_currency:oldData[10],
        old_price:oldData[11],
      };
      console.log(updatedData)
      fetch('http://127.0.0.1:8000/edit_products/', {
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
        
          setGroup(editData[0]);
          setSubgroup(editData[1]);
          setFeature(editData[2]);
          setProductIR(editData[3]);
          setProductTR(editData[4]);
          setDescriptionTR(editData[5]);
          setDescriptionIR(editData[6]);
          setUnit(editData[7]);
          setSecondaryUnit(editData[8]);
          setWeight(editData[9]);
          setCurrency(editData[10]);
          setPrice(editData[11]);
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
              <CardTitle tag="h4">Edit Product</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
              <div>
        <div className="form-group-col">
          <label>Group</label>
          <FormGroup>
            <Input
              name="group"
              type="text"
              defaultValue={group}
              onChange={(e) => setGroup(e.target.value)}
            />
          </FormGroup>

          <label>Subgroup</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={subgroup}
              onChange={(e) => setSubgroup(e.target.value)}
            />
          </FormGroup>

          <label>Feature</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={feature}
              onChange={(e) => setFeature(e.target.value)}
            />
          </FormGroup>

          <label>Product Number(IR)</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={productIR}
              onChange={(e) => setProductIR(e.target.value)}
            />
          </FormGroup>

          <label>Product Number(TR)</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={productTR}
              onChange={(e) => setProductTR(e.target.value)}
            />
          </FormGroup>

          <label>Currency</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </FormGroup>
        </div>

        <div className="form-group-col">
          <label>Description(TR)</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={descriptionTR}
              onChange={(e) => setDescriptionTR(e.target.value)}
            />
          </FormGroup>

          <label>Description(IR)</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={descriptionIR}
              onChange={(e) => setDescriptionIR(e.target.value)}
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

          <label>Secondary Unit</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={secondaryUnit}
              onChange={(e) => setSecondaryUnit(e.target.value)}
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

          <label>Price</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={price}
              onChange={(e) => setPrice(e.target.value)}
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
          <Col
          >
            <Card >
              <CardHeader>
                <CardTitle tag='h4'>PRODUCTS</CardTitle>
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
                    group: row[0],
                    subgroup: row[1],
                    feature: row[2],
                    product_code_ir: row[3],
                    product_code_tr: row[4],
                    description_tr: row[5],
                    description_ir: row[6],
                    unit: row[7],
                    unit_secondary: row[8],
                    weight: row[9],
                    currency: row[10],
                    price:row[11],

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
                                product_code_ir: rowToDelete[3],

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
                    {
                      Header: 'Group',
                      accessor: 'group',


                    },
                    {
                      Header: 'Subgroup',
                      accessor:  'subgroup'
                    },
                    {
                      Header: 'Feature',
                      accessor: 'feature'
                    },
                  
                    {
                      Header: 'Product Number(IR)',
                      accessor: 'product_code_ir'
                    },
                    {
                      Header: 'Product Number(TR)',
                      accessor: 'product_code_tr'
                    },
                    {
                      Header: 'Description(TR)',
                      accessor: 'description_tr'
                    },
                    {
                      Header: 'Description(IR)',
                      accessor: 'description_ir'
                    },
                    {
                      Header: 'Unit',
                      accessor: 'unit'
                    },
                    {
                      Header: 'Secondary Unit',
                      accessor: 'unit_secondary'
                    },
                    {
                      Header: 'Weight',
                      accessor: 'weight'
                    },
                    
                    {
                      Header: 'Currency',
                      accessor: 'currency'
                    },
                    {
                      Header: 'Price',
                      accessor: 'price'
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
