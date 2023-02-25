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
import React, {useState} from "react";

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

function UserProfile() {
    const [selectedMember, setSelectedMember] = useState(null);

    const handleSelectMember = (member) => {
      if (member === selectedMember) {
        setSelectedMember(null);
      } else {
        setSelectedMember(member);
      }
    };
  
    const teamMembers = [
      {
        id: 1,
        name: "DJ Khaled",
        status: "Offline",
        image: require("assets/img/faces/ayo-ogunseinde-2.jpg").default,
      },
      {
        id: 2,
        name: "Creative Tim",
        status: "Available",
        image: require("assets/img/faces/joe-gardner-2.jpg").default,
      },
      {
        id: 3,
        name: "Flume",
        status: "Busy",
        image: require("assets/img/faces/clem-onojeghuo-2.jpg").default,
      },
    ];
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
          {teamMembers.map((member) => (
            <li key={member.id}>
              <Row>
                <Col md="2" xs="2">
                  <div className="avatar">
                    <img
                      alt="..."
                      className="img-circle img-no-padding img-responsive"
                      src={member.image}
                    />
                  </div>
                </Col>
                <Col md="7" xs="7">
                  {member.name} <br />
                  <span className="text-muted">
                    <small>{member.status}</small>
                  </span>
                </Col>
                <Col className="text-right" md="3" xs="3">
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={selectedMember === member.id}
                        onChange={() => handleSelectMember(member.id)}
                      />
                      <span className="form-check-sign" />
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  </Col>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Edit Profile</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-1" md="5">
                      <FormGroup>
                        <label>Company (disabled)</label>
                        <Input
                          defaultValue="Creative Code Inc."
                          disabled
                          placeholder="Company"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="px-1" md="3">
                      <FormGroup>
                        <label>Username</label>
                        <Input
                          defaultValue="michael23"
                          placeholder="Username"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="4">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">
                          Email address
                        </label>
                        <Input placeholder="Email" type="email" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>First Name</label>
                        <Input
                          defaultValue="Chet"
                          placeholder="Company"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Last Name</label>
                        <Input
                          defaultValue="Faker"
                          placeholder="Last Name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Address</label>
                        <Input
                          defaultValue="Melbourne, Australia"
                          placeholder="Home Address"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <FormGroup>
                        <label>City</label>
                        <Input
                          defaultValue="Melbourne"
                          placeholder="City"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="px-1" md="4">
                      <FormGroup>
                        <label>Country</label>
                        <Input
                          defaultValue="Australia"
                          placeholder="Country"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="4">
                      <FormGroup>
                        <label>Postal Code</label>
                        <Input placeholder="ZIP Code" type="number" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>About Me</label>
                        <Input
                          className="textarea"
                          type="textarea"
                          cols="80"
                          rows="4"
                          defaultValue="Oh so, your weak rhyme You doubt I'll bother,
                          reading into it"
                        />
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
