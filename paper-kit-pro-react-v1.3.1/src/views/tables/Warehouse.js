import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col } from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import localforage from 'localforage';
const DataTable = () => {
  const [dataTable, setDataTable] = useState([]);
  const [file, setFile] = useState(null);
  const [showUploadDiv, setShowUploadDiv] = useState(false);
  useEffect(() => {
    async function fetchData() {
      const access_token = await localforage.getItem('access_token'); 
      
      const response = await fetch('http://127.0.0.1:8000/warehouse/',{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(access_token)
        }});
      const data = await response.json();
      setDataTable(data);
    }
    fetchData();
  }, []);

  /*
  useEffect(() => {
    console.log(dataTable);
  }, [dataTable]);
*/


const handleAddFileClick = () => {
  setShowUploadDiv(true);
}

  const handleFileInputChange = (e) => {
    setFile(e.target.files[0]);
    console.log(file)
  };

  const handleUploadClick = async() => {
    const formData = new FormData();
    formData.append('file', file);
    const access_token = await localforage.getItem('access_token'); 
    fetch('http://127.0.0.1:8000/add_warehouse/', {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        
        'Authorization': 'Bearer '+ String(access_token)
      }
    })
      .then((response) => {

        console.log(response);
        alert('File uploaded successfully');
        fetch('http://127.0.0.1:8000/warehouse/')
          .then((response) => response.json())
          .then((data) => setDataTable(data));
          
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
                <CardTitle tag='h4'>WAREHOUSE</CardTitle>
              </CardHeader>
              <CardBody>
             
              <div>
                {!showUploadDiv && (
                   <Button  className="my-button-class" color="primary" onClick={handleAddFileClick}>Add File</Button>
                   )}
                   {showUploadDiv && (
                    <div>
                  <input type='file' className='custom-file-upload' onChange={handleFileInputChange} />
                  <Button color='primary' className='btn-upload' onClick={handleUploadClick} disabled={!file} >
                    Upload
                  </Button>
                  </div>
                   )}
                   
                </div>
                <ReactTable
                  data={dataTable.map((prop, key) => ({
                    id: key,
                    product_code: prop[0],
                    title: prop[1],
                    unit: prop[2],
                    stock: prop[3],
                    
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
                        <Button
                          onClick={() => {
                            let data = dataTable.filter((o) => o.id !== key);
                            setDataTable(data);
                          }}
                          color='danger'
                          size='sm'
                          className='btn-icon btn-link remove'
                        >
                          <i className='fa fa-times' />
                        </Button>{' '}
                      </div>
                    ),
                  }))}
                  columns={[
                    { Header: 'Product Code', accessor: 'product_code' },
                    { Header: 'Product Title', accessor: 'title' },
                    { Header: 'Unit', accessor: 'unit' },
                    { Header: 'Stock', accessor: 'stock' },
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
