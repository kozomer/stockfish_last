import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col } from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import '../../assets/css/Table.css';
import ReactBSAlert from "react-bootstrap-sweetalert";

const DataTable = () => {
  const [dataTable, setDataTable] = useState([]);
  const [file, setFile] = useState(null);
  const [showUploadDiv, setShowUploadDiv] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

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
      const response = await fetch('http://127.0.0.1:8000/sales/');
      const data = await response.json();
      setDataTable(data);
      setDataChanged(false);
    }
    fetchData();
  }, [dataChanged]);

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
    const formData = new FormData();
    formData.append('file', file);
    console.log(file)
    fetch('http://127.0.0.1:8000/add_sales/', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
      .then((response) => {

        console.log(response);
        alert('File uploaded successfully');
        fetch('http://127.0.0.1:8000/sales/')
          .then((response) => response.json())
          .then((data) => setDataTable(data));
          clearTimeout(timeoutId); // Clear any existing timeout
          setTimeoutId(setTimeout(() => setShowUploadDiv(false), 500));
   
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
       
        
        fetch(`http://127.0.0.1:8000/delete_sales/`, {
          method: "POST",
          body: new URLSearchParams(deleteData),
        })
          setDataChanged(!dataChanged);
       
        setDeleteConfirm(false);
      }
    }, [deleteConfirm]);
  

  return (
    <>
      <div className='content'>
      {alert}

        <Row>
          <Col
          >
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
                          onClick={() => {
                            let obj = dataTable.find((o) => o.id === key);
                            alert(
                              `You've clicked EDIT button on \n{ \nName: ${obj.customer_code}, \nDescription: ${obj.description}, \nQuantity: ${obj.quantity}, \nArea Code: ${obj.area_code}, \nCode: ${obj.code}, \nCity: ${obj.city}, \nArea: ${obj.area} \n}.`
                            );
                          }}
                          color='warning'
                          size='sm'
                          className='btn-icon btn-link edit'
                        >
                          <i className='fa fa-edit' />
                        </Button>{' '}
                        
                        <>
    
    
                          <Button

                            onClick={() => {
                              
                               warningWithConfirmAndCancelMessage() 
                               const updatedDataTable = dataTable.find((o) => o.id == row.id);
                               const data = {
                                no: updatedDataTable[0],
                                good_code: updatedDataTable[10],
                                original_output_value: updatedDataTable[14],
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
