import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col } from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import '../../assets/css/Table.css';

const DataTable = () => {
  const [dataTable, setDataTable] = useState([]);
  const [file, setFile] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);
  const [showUploadDiv, setShowUploadDiv] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      //console.log('useEffect called');
      const response = await fetch('http://127.0.0.1:8000/goods/');
      const data = await response.json();
     // console.log('fetched data:', data);
      setDataTable(data);
      setDataChanged(false);
    //  console.log(dataTable);
    }
    fetchData();
  }, [dataChanged]);

  const handleAddFileClick = () => {
     setTimeoutId(setTimeout(() => setShowUploadDiv(true), 500));
  }

  const handleFileInputChange = (e) => {
    setFile(e.target.files[0]);
    const file = e.target.files[0];
    const fileName = file.name;
    document.getElementById('file-name').textContent = fileName;
  };

  const handleUploadClick = () => {
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://127.0.0.1:8000/add_goods/', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
      .then((response) => {
        console.log(response);
        alert('File uploaded successfully');
        fetch('http://127.0.0.1:8000/goods/')
          .then((response) => response.json())
          .then((data) => setDataTable(data));
          setTimeoutId(setTimeout(() => setShowUploadDiv(false), 500));
          setFile(null)
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
                <CardTitle tag='h4'>GOODS</CardTitle>
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
                    product_code: row[0],
                    group: row[1],
                    product_title: row[2],
                    unit_title: row[3],
                    unit: row[4],
                    currency: row[5],
                    f: row[6],
                    actions: (
                      <div className='actions-left'>
                       
                        <Button
                          onClick={() => {
                            let obj = dataTable.find((o) => o.id === row.id);
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
                              const updatedDataTable = dataTable.find((o) => o.id == row.id);
                              console.log(updatedDataTable[0]);
                              const data = { product_code: updatedDataTable[0] };
                              fetch(`http://127.0.0.1:8000/delete_goods/`, {
                                method: 'POST',
                                body: new URLSearchParams(data),
                              }).then(() => {
                                console.log("row id:", row.id);
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
                  columns={[{ Header: 'Product Code', accessor: 'product_code' }, { Header: 'Group', accessor: 'group' }, { Header: 'Product Title', accessor: 'product_title' }, { Header: 'Unit Title', accessor: 'unit_title' }, { Header: 'Unit', accessor: 'unit' }, { Header: 'Currency', accessor: 'currency' }, { Header: 'F', accessor: 'f' }, { Header: 'Actions', accessor: 'actions', sortable: false, filterable: false },]}
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
