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


  const [filterOption, setFilterOption] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

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
      const response = await fetch('http://127.0.0.1:8000/sales_report/');
      const data = await response.json();
      setDataTable(data);
      setDataChanged(false);
      setRenderEdit(false)
    }
    fetchData();
  }, [dataChanged,renderEdit]);

  


    const handleSubmit = async (e) => {
        e.preventDefault();
      

     
        // Send the data to the Django endpoint
        const response = await fetch("http://127.0.0.1:8000/sales_report/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            report_type: filterOption,
            start_date: startDate,
            end_date: endDate,
          }),
        });
        const data = await response.json();
        console.log(data)
        setDataTable(data);
        setDataChanged(false);
        setRenderEdit(false);
      };

    
    
    
  return (
    <>
      <div className='content'>
      {alert}

   
        <Row>
          <Col
          >
            <Card >
              <CardHeader>
                <CardTitle tag='h4'>SALES REPORT</CardTitle>
              </CardHeader>
              <CardBody >

                <div className='top-right'>
                <Form onSubmit={handleSubmit}>
  <FormGroup>
    <Label for="selectType">Select Type:</Label>
    <Input type="select" name="select" id="selectType" onChange={(e) => setFilterOption(e.target.value)}>
      <option value="">Select Type</option>
      <option value="monthly">Monthly</option>
      <option value="yearly">Yearly</option>
      <option value="daily">Daily</option>
    </Input>
  </FormGroup>

  <FormGroup>
    <Label for="startDate">Start Date:</Label>
    <Input type="text" name="startDate" id="startDate" placeholder="mm/dd/yyyy" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
  </FormGroup>

  <FormGroup>
    <Label for="endDate">End Date:</Label>
    <Input type="text" name="endDate" id="endDate" placeholder="mm/dd/yyyy" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
  </FormGroup>

  <Button color="primary" type="submit">Save</Button>
</Form>
                </div>
                <ReactTable
                  data={dataTable.map((row,index) => ({
                    id: row.id,
                    group:row[0],
                    total_sale: row[1],
                 

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
                      Header: 'Total Sale',
                      accessor:  'total_sale'
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
