/*!

=========================================================
* Paper Dashboard PRO React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useEffect } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Label,


} from "reactstrap";
import Switch from "react-bootstrap-switch";
import '../../assets/css/Table.css';
import ReactBSAlert from "react-bootstrap-sweetalert";
import localforage from 'localforage';

function UserProfile() {

  const [salers, setSalers] = useState([]);
  const [salersWholeData, setSalersWholeData] = useState([]);
  const [selectedSaler, setSelectedSaler] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSalerName, setNewSalerName] = useState("");
  const [newSalerStatus, setNewSalerStatus] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});

  const [alert, setAlert] = useState(null);

  const [isActive, setIsActive] = useState("");
  const [activity, setActivity] = useState(false);
  const handleSelectMember = async (member) => {

    setSelectedSaler(member);
    const saler_id = {
      id: member
    };
    console.log(saler_id)

    const access_token = await localforage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/salers/', {
      method: 'POST',
      body: JSON.stringify(saler_id),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(access_token)
      },
    })
      .then(response => response.json())

      .then((data) => {

        console.log(data);

        setSalersWholeData(data)
        console.log(salersWholeData["is_active"])
      })


  };

  const handleAddSaler = async () => {
    const access_token = await localforage.getItem('access_token');
    const newSaler = {
      name: newSalerName,
      job_start_date: newSalerStatus,

    };
    console.log(newSaler)
    fetch("http://127.0.0.1:8000/api/add_salers/", {
      method: "POST",
      body: JSON.stringify(newSaler),

      headers: {
        'Authorization': 'Bearer ' + String(access_token)
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(data => {
            console.log(data.error)
            errorUpload(data.error);
            throw new Error(data.error);
          });
        } else {
          return response.json().then(data => {
            handleSalesDataChange();
            successAdd();
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };



  async function fetchSalersData() {

    const access_token = await localforage.getItem('access_token');
    console.log(access_token)
    fetch('http://127.0.0.1:8000/api/collapsed_salers/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(access_token)
      },
    })
      .then(response => response.json())
      .then(data => {
        setSalers(data);
        console.log(data[3])
      })
      .catch(error => console.log(error));
  }

  useEffect(() => {
    fetchSalersData();
  }, []);

  // Whenever sales data is updated, call the fetchSalersData function
  function handleSalesDataChange() {
    // update sales data
    fetchSalersData();
  }


  const handleInputChange = (event) => {


    const { name, value } = event.target;
    console.log(name, value);
    const newValue = parseFloat(value);


    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));

  };


  const handleSave = () => {
    // Create an object with the new data
    console.log(isActive)
    if (isActive === "") {
      console.log("asdadasdas")
      setIsActive(salersWholeData["is_active"]);
      console.log(salersWholeData["is_active"])
    }
    // Do something with the new data, e.g. send it to the server
    // ...
    const newData = { ...formData, is_active: isActive };
    editSalers()
    async function editSalers() {

      const all_data = {
        new_data: newData,
        old_data: salersWholeData
      }
      const access_token = await localforage.getItem('access_token');
      fetch('http://127.0.0.1:8000/api/edit_salers/', {
        method: "POST",
        body: JSON.stringify(all_data),

        headers: {
          'Authorization': 'Bearer ' + String(access_token)
        },
      })
        .then((response) => {
          if (response.ok) {
            setSalersWholeData(newData);
          }
        })

        .catch(error => console.log(error));
    }
    console.log('New data:', newData);
    console.log('Old data:', salersWholeData);

  };

  //delete
  const warningWithConfirmAndCancelMessage = (id) => {

    setAlert(

      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => {
          handleDeleteSaler(id)
          successDelete()
        }}
        onCancel={() => {

          hideAlert()
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
  const handleDeleteSaler = async (id) => {
    // Delete the saler with the given id
    console.log(id)
    const delete_id = {
      id: id
    }
    const access_token = await localforage.getItem('access_token');
    fetch("http://127.0.0.1:8000/api/delete_saler/", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(access_token)
      },
      body: JSON.stringify(delete_id),


    })
      .then((response) => {
        response.json()

        successDelete();
        fetchSalersData();
      })





  };

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


  useEffect(() => {
    // Create a copy of the original data to use as default values
    setOriginalData(salersWholeData);
    setActivity(salersWholeData["is_active"])
    console.log(activity)
    setFormData(salersWholeData);
  }, [salersWholeData]);

  const successAdd = () => {
    console.log("success")

    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Saved!"
        onConfirm={() => {

          hideAlert()
          setShowAddForm(false)
        }}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        Your saler has been successfully saved!
      </ReactBSAlert>
    );
  }


  const successDelete = () => {
    console.log("success")

    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Deleted!"
        onConfirm={() =>
          hideAlert()
        }
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        Your saler has been successfully deleted!
      </ReactBSAlert>
    );
  }

  const hideAlert = () => {
    setAlert(null);
  };

  const handleSwitchChange = (checked) => {
    setIsSwitchOn(checked);
  };

  return (
    <>
      <div className="content">
        {alert}
        <Row>
          <Col md="4">

            <Card>
              <CardHeader>
                <CardTitle tag="h4">Salers</CardTitle>
              </CardHeader>
              <CardBody>
                <ul className="list-unstyled team-members">
                  {salers.map((saler) => (
                    <li key={saler[0]}>
                      <div className="mb-3">
                        <Row className="align-items-center" style={{ marginBottom: "10px" }}>
                          <Col md="1" xs="1" className="d-flex justify-content-center">
                            <div
                              style={{
                                backgroundColor: saler[2] ? "light-green" : "red",
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                              }}
                            />
                          </Col>
                          <Col md="7" xs="7" className="d-flex align-items-center" style={{ marginRight: "10px" }}>
                            <span style={{ fontWeight: "bold" }}>{saler[1].toUpperCase()}</span>{" "}
                            <br />
                            <span className="text-muted">
                              {saler[2] ? (
                                <small style={{ marginLeft: "15px" }}>active</small>
                              ) : (
                                <small style={{ marginLeft: "15px" }}>inactive</small>
                              )}
                            </span>
                          </Col>
                          <Col
                            className="text-left d-flex justify-content-center"
                            md="3"
                            xs="3"
                            style={{ marginBottom: "3px", marginTop: "3px", paddingBottom: "5px" }}
                          >
                            <FormGroup check>
                              <Label check>
                                <Input
                                  type="checkbox"
                                  checked={selectedSaler === saler[0]}
                                  onChange={() => handleSelectMember(saler[0])}
                                />
                                <span className="form-check-sign" />
                              </Label>
                            </FormGroup>
                            <Button
                              className="btn-round btn-icon"
                              color="danger"
                              size="sm"
                              style={{ top: "2.5px" }}
                              onClick={() => warningWithConfirmAndCancelMessage(saler[0])}
                              outline
                            >
                              <i className="nc-icon nc-simple-remove" />
                            </Button>
                          </Col>
                        </Row>


                      </div>

                    </li>
                  ))}
                  <li>
                    <Row className="text-left align-items-center" >
                      <Col md="2" xs="2">

                        <Button
                          className="btn-round"
                          color="success"
                          onClick={() => setShowAddForm(true)}
                          outline
                        >
                          <i className="nc-icon nc-simple-add" />
                        </Button>

                      </Col>
                      <Col md="7" xs="7">
                        Add New Saler
                      </Col>
                    </Row>

                  </li>
                  {showAddForm && (
                    <li>
                      <Row>
                        <Col md="7" xs="7">
                          <FormGroup>
                            <Label for="newSalerName">Name</Label>
                            <Input
                              type="text"
                              id="newSalerName"
                              value={newSalerName}
                              onChange={(e) => setNewSalerName(e.target.value)}
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="newSalerStatus">Job Start Date (YYYY-MM-DD)</Label>
                            <Input

                              type="text"
                              id="newSalerStatus"
                              value={newSalerStatus}
                              onChange={(e) => setNewSalerStatus(e.target.value)}
                            />
                          </FormGroup>
                          <Button className="btn-round" color="success" type="submit" onClick={handleAddSaler} disabled={!newSalerName || !newSalerStatus}>
                            Save
                          </Button>{" "}
                          <Button className="btn-round" color="danger" type="submit" onClick={() => setShowAddForm(false)}>
                            Cancel
                          </Button>
                        </Col>
                      </Row>
                    </li>
                  )}
                </ul>
              </CardBody>
            </Card>
          </Col>


          <Col md="8">
            <Card>
              <CardHeader >
                <h5 className="title" style={{ textTransform: "uppercase" }}>
                  {salersWholeData["name"]}
                </h5>

              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col>
                      <FormGroup>
                        <label>Job Start Date</label>
                        <Input
                          defaultValue={salersWholeData["job_start_date"]}
                          name="job_start_date"
                          onChange={handleInputChange}
                          placeholder="Date"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <label>Activity</label>
                        <br></br>
                        <Input
                          name="activity"
                          type="select"
                          value={salersWholeData["is_active"] ? "Active" : "Inactive"}
                          onChange={(e) => {
                            const value = e.target.value === "Active";
                            setIsActive(value);
                          }}
                        >

                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </Input>




                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Experience Rating</label>
                        <Input
                          
                          defaultValue={salersWholeData["experience_rating"]}
                          onChange={handleInputChange}
                          placeholder="Exp. Rating"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <label>Monthly Total Sales Rating</label>
                        <Input
                          
                          defaultValue={salersWholeData["monthly_total_sales_rating"]}
                          onChange={handleInputChange}
                          placeholder="Mont. Tot. Sales Rating"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Receipment Rating</label>
                        <Input
                          
                          defaultValue={salersWholeData["receipment_rating"]}
                          onChange={handleInputChange}
                          placeholder="Receipment Rating"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>M. Performance Rating</label>
                        <Input
                          name="manager_performance_rating"
                          defaultValue={salersWholeData["manager_performance_rating"]}
                          onChange={handleInputChange}
                          placeholder="M.P.R"
                          type="number"
                          step="0.01"
                        />

                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button className="btn-round" color="success" type="submit" onClick={handleSave}>Save</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default UserProfile;
