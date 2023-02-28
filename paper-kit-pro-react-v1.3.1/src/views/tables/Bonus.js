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

import '../../assets/css/Table.css';

function UserProfile() {

  const [salers, setSalers] = useState([]);
  const [salersWholeData, setSalersWholeData] = useState([]);
  const [selectedSaler, setSelectedSaler] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSalerName, setNewSalerName] = useState("");
  const [newSalerStatus, setNewSalerStatus] = useState("");

  const handleSelectMember = (member) => {

    setSelectedSaler(member);
    const saler_id = {
      id: selectedSaler
    };
    console.log(saler_id)
    fetch('http://127.0.0.1:8000/salers/', {
      method: 'POST',
      body: JSON.stringify(saler_id),
      credentials: 'include'
    })
      .then(response => response.json())

      .then((data) => {

        console.log(data);

        setSalersWholeData(data)
        console.log(salersWholeData["id"])
      })


  };

  const handleAddSaler = () => {
    const newSaler = {
      name: newSalerName,
      status: newSalerStatus,
    };
    fetch("http://127.0.0.1:8000/add_salers/", {
      method: "POST",
      body: JSON.stringify(newSaler),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setSalers(data);
        setShowAddForm(false);
      });
  };


  useEffect(() => {
    fetch('http://127.0.0.1:8000/collapsed_salers/')
      .then(response => response.json())
      .then(data => {
        setSalers(data);
        console.log(salers)
      })
      .catch(error => console.log(error));


  }, []);



  /*
  const saler_id = {
    id:1
  };
  fetch('http://127.0.0.1:8000/salers/', {
    method: 'POST',
    body:JSON.stringify(saler_id),
    credentials: 'include'
  })
    .then((response) => {

      console.log(response);
      
       
 
    })
    */
  return (
    <>
      <div className="content">
        <Row>
          <Col md="4">

            <Card>
              <CardHeader>
                <CardTitle tag="h4">Team Members</CardTitle>
              </CardHeader>
              <CardBody>
                <ul className="list-unstyled team-members">
                  {salers.map((saler) => (
                    <li key={saler[0]}>
                      <div className="mb-3">
                        <Row className="align-items-center" style={{ marginBottom: "10px" }}>
                          <Col md="7" xs="7" className="text-right d-flex justify-content-center" style={{ marginRight: "10px" }}>
                            {saler[1]} <br />
                            <span className="text-muted">
                              <small>{saler.status}</small>
                            </span>
                          </Col>
                          <Col className="text-left d-flex justify-content-center" md="3" xs="3" style={{ marginBottom: "20px" }}>
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
                          </Col>
                        </Row>

                      </div>

                    </li>
                  ))}
                  <li>
                    <Row className="text-left d-flex justify-content-center" style={{ marginTop: "20px", paddingTop: "10px" }}>
                      <Col md="2" xs="2">
                        <div className="avatar">
                          <Button
                            className="my-button-class"
                            color="primary"
                            onClick={() => setShowAddForm(true)}
                            style={{ display: "flex", alignItems: "center", paddingTop: "30px" }} // added style here
                          >
                            <i className="nc-icon nc-simple-add" />
                          </Button>
                        </div>
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
                            <Label for="newSalerStatus">Job Start Date</Label>
                            <Input
                              type="text"
                              id="newSalerStatus"
                              value={newSalerStatus}
                              onChange={(e) => setNewSalerStatus(e.target.value)}
                            />
                          </FormGroup>
                          <Button color="success" onClick={handleAddSaler}>
                            Save
                          </Button>{" "}
                          <Button color="secondary" onClick={() => setShowAddForm(false)}>
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
                <h5 className="title">{salersWholeData["name"]}</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>

                    <Col >
                      <FormGroup>
                        <label>Job Start Date</label>
                        <Input
                          defaultValue={salersWholeData["job_start_date"]}
                          placeholder="Date"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <label>Activity</label>
                        <Input
                          defaultValue={salersWholeData["is_active"]}
                          placeholder="Activity"
                          type="text"
                        />
                      </FormGroup>

                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Experience Rating</label>
                        <Input
                          defaultValue={salersWholeData["experience_rating"]}
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
                          placeholder="Receipment Rating"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>
                          M. Performance Rating
                        </label>
                        <Input placeholder="M.P.R" type="text" defaultValue={salersWholeData["manager_performance_rating"]} />
                      </FormGroup>
                    </Col>

                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default UserProfile;
