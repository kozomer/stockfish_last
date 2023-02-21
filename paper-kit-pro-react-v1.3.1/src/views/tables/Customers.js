import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col } from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';

const DataTable = () => {
  const [dataTable, setDataTable] = useState([]);
  const [file, setFile] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);
  const [showUploadDiv, setShowUploadDiv] = useState(false);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://127.0.0.1:8000/customers/');
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
  
  
  return (
    <>
      <div className='content'>
      
      
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
                          onClick={() => {
                            let obj = dataTable.find((o) => o.id === row.id);
                            console.log(obj.customer_code)
                            alert(
                              `You've clicked LIKE button on \n{ \nName: ${obj.customer_code}, \nDescription: ${obj.description}, \nQuantity: ${obj.quantity}, \nArea Code: ${obj.area_code}, \nCode: ${obj.code}, \nCity: ${obj.city}, \nArea: ${obj.area} \n}.`
                            );
                          }}
                          color='info'
                          size='sm'
                          className='btn-icon btn-link like'
                        >
                          <i className='fa fa-heart' />
                        </Button>{' '}
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
                        <Button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this row?')) {
                              const updatedDataTable = dataTable.find((o) => o.id === row.id);
                              console.log(updatedDataTable);
                              const data = { customer_code: updatedDataTable[0] };
                              fetch(`http://127.0.0.1:8000/delete_customers/`, {
                                method: 'POST',
                                body: new URLSearchParams(data),
                              }).then(() => {
                                
                                console.log("dataTable:", dataTable);
                                const filteredDataTable = dataTable.filter((o) => Number(o.id) !== Number(row.id));

                                console.log(filteredDataTable);
                                setDataTable(filteredDataTable);
                                setDataChanged(!dataChanged);
                               
                              });
                            }
                          }}
                          color='danger'
                          size='sm'
                          className='btn-icon btn-link remove'
                        >
                          <i className='fa fa-times' />
                        </Button>
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
