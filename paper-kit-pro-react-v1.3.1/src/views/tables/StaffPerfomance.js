import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col, Input,Form, FormGroup, Label,CardFooter} from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import '../../assets/css/Table.css';
import ReactBSAlert from "react-bootstrap-sweetalert";
import localforage from 'localforage';

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
  const [salers, setSalers] = useState({ active_salers_list: [], passive_salers_list: [] });
  const [selectedSaler, setSelectedSaler] = useState("");



  async function fetchSalersData() {
    const access_token = await localforage.getItem('access_token');
    console.log(access_token);
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/collapsed_salers/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(access_token)
      },
    })
      .then(response => response.json())
      .then(data => {
        let activeSalerNames = data.active_salers_list.map(saler => saler[1]);
        let passiveSalerNames = data.passive_salers_list.map(saler => saler[1]);
        setSalers({
          active_salers_list: activeSalerNames,
          passive_salers_list: passiveSalerNames,
        });
      })
      .catch(error => console.log(error));
  }
  

  useEffect(() => {
    fetchSalersData();
  }, []);

  const salersList = [...salers.active_salers_list, ...salers.passive_salers_list];


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
      const access_token = await localforage.getItem('access_token');
      
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/saler_performance/`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(access_token)
        },
      });
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
  const warningWithConfirmAndCancelMessage = () => {
    
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

   

    async function handleExportClick(selectedSaler) {
      const access_token = await localforage.getItem('access_token');
      const sendData={
        saler_name:selectedSaler,
      }
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/export_staff/`, {
        method: 'POST',
        body:  JSON.stringify(sendData),
        headers: {
          
          'Authorization': 'Bearer '+ String(access_token)

        },
      });
    
      const data = await response.json();
      
      const filename = data.filename;
      const base64Content = data.content;
      
      const binaryContent = atob(base64Content);
      const byteNumbers = new Array(binaryContent.length);
      for (let i = 0; i < binaryContent.length; i++) {
        byteNumbers[i] = binaryContent.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    }
    
  return (
    <>
      <div className='content'>
      {alert}

   
<Card>
  <CardHeader>
    <CardTitle tag='h4'>STAFF PERFORMANCE</CardTitle>
  </CardHeader>
  <CardBody>
      <div className="d-flex justify-content-between align-items-center">
        <FormGroup>
          <Label>Select a Saler:</Label>
          <Input type="select" value={selectedSaler} onChange={e => setSelectedSaler(e.target.value)}>
            <option value="">--Select--</option>
            {salersList.map((saler, index) => (
              <option key={index} value={saler}>{saler}</option>
            ))}
          </Input>
        </FormGroup>
        <Button className="my-button-class" color="primary" onClick={() => handleExportClick(selectedSaler)} disabled={!selectedSaler}>
          <i className="fa fa-download mr-1"></i>
          Export Performances
        </Button>
      </div>
    </CardBody>
</Card>
        <Row>
          <Col
          >
            <Card >
              
              <CardBody >

            
                <ReactTable
                  data={dataTable.map((row,index) => ({
                    id: row.id,
                    name: row[0],
                    year: row[1],
                    month: row[2],
                    day: row[3],
                    sale: row[4],
                    bonus: row[5],
                    empty: row[6]

                    
                  }))}
                  columns={[
                    {
                      Header: 'Name',
                      accessor: 'name',


                    },
                    {
                      Header: 'Year',
                      accessor:  'year'
                    },
                    {
                      Header: 'Month',
                      accessor: 'month'
                    },
                  
                    {
                      Header: 'Day',
                      accessor: 'day'
                    },
                    {
                      Header: 'Sale',
                      accessor: 'sale'
                    },
                    {
                      Header: 'Bonus',
                      accessor: 'bonus'
                    },
                    {
                      Header: 'Actions',
                      accessor: 'empty'
                    },
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
