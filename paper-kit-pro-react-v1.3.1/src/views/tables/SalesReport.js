import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col, Input, Form, FormGroup, Label, CardFooter } from 'reactstrap';
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
  const [startYear, setStartYear] = useState("")
  const [startMonth, setStartMonth] = useState("");
  const [startDay, setStartDay] = useState("");;
  const [endYear, setEndYear] = useState("")
  const [endMonth, setEndMonth] = useState("");
  const [endDay, setEndDay] = useState("");;

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
  }, [dataChanged, renderEdit]);




  const handleSubmit = async (e) => {
    e.preventDefault();
    let formattedStartDate = "";
    let formattedEndDate = "";

    if (filterOption === "yearly") {
      formattedStartDate = `${startYear}`;
      formattedEndDate = `${endYear}`;
    } else if (filterOption === "monthly") {
      formattedStartDate = `${startYear}-${startMonth.padStart(2, "0")}`;
      formattedEndDate = `${endYear}-${endMonth.padStart(2, "0")}`;
    } else if (filterOption === "daily") {
      formattedStartDate = `${startYear}-${startMonth.padStart(2, "0")}-${startDay.padStart(2, "0")}`;
      formattedEndDate = `${endYear}-${endMonth.padStart(2, "0")}-${endDay.padStart(2, "0")}`;
    }


    // Send the data to the Django endpoint
    const response = await fetch("http://127.0.0.1:8000/sales_report/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        report_type: filterOption,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
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
                  <CardBody style={{ marginBottom: "100px" }}>
                    <Form onSubmit={handleSubmit}>
                      <FormGroup row>
                        <Col sm={3}>
                          <Label for="selectType">Select Type:</Label>
                          <Input type="select" name="select" id="selectType" onChange={(e) => setFilterOption(e.target.value)}>
                            <option value="">Select Type</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="daily">Daily</option>
                          </Input>
                        </Col>
                        <Col sm={3}>
                          <Label for="startDate">Start Date:</Label>
                          <div style={{ display: "flex", flexDirection: "row" }}>
                            <Input type="text" name="startYear" id="startYear" placeholder="yyyy" value={startYear} onChange={(e) => setStartYear(e.target.value)} disabled={filterOption !== "yearly" && filterOption !== "monthly" && filterOption !== "daily"} style={{ width: "80px", marginRight: "10px" }} />
                            <Input type="text" name="startMonth" id="startMonth" placeholder="mm" value={startMonth} onChange={(e) => setStartMonth(e.target.value)} disabled={filterOption !== "monthly" && filterOption !== "daily"} style={{ width: "50px", marginRight: "10px" }} />
                            <Input type="text" name="startDay" id="startDay" placeholder="dd" value={startDay} onChange={(e) => setStartDay(e.target.value)} disabled={filterOption !== "daily"} style={{ width: "50px" }} />
                          </div>
                        </Col>
                        <Col sm={3}>
                          <Label for="endDate">End Date:</Label>
                          <div style={{ display: "flex", flexDirection: "row" }}>
                            <Input type="text" name="endYear" id="endYear" placeholder="yyyy" value={endYear} onChange={(e) => setEndYear(e.target.value)} disabled={filterOption !== "yearly" && filterOption !== "monthly" && filterOption !== "daily"} style={{ width: "80px", marginRight: "10px" }} />
                            <Input type="text" name="endMonth" id="endMonth" placeholder="mm" value={endMonth} onChange={(e) => setEndMonth(e.target.value)} disabled={filterOption !== "monthly" && filterOption !== "daily"} style={{ width: "50px", marginRight: "10px" }} />
                            <Input type="text" name="endDay" id="endDay" placeholder="dd" value={endDay} onChange={(e) => setEndDay(e.target.value)} disabled={filterOption !== "daily"} style={{ width: "50px" }} />
                          </div>
                        </Col>
                        <Col sm={3}>
                          <Button color="primary" type="submit" style={{ marginTop: "28px" }}>Save</Button>
                        </Col>
                      </FormGroup>
                    </Form>
                  </CardBody>



                </div>
                <ReactTable
                  data={dataTable.map((row, index) => ({
                    id: row.id,
                    group: row[0],
                    total_sale: row[1],


                    actions: (
                      <div className='actions-left'>

                        <Button
                          disabled={showPopup}
                          onClick={() => {
                            // Enable edit mode

                            { handleClick(row) }


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
                              const rowToDelete = { ...row };
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
                      Header: 'Date',
                      accessor: 'group',


                    },
                    {
                      Header: 'Total Sale',
                      accessor: 'total_sale'
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
