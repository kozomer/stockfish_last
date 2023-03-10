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
import React,{useState, useEffect} from "react";
import { withRouter } from 'react-router-dom';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Label,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
  Row
} from "reactstrap";

import localforage from 'localforage';



function Login({ history }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(username)
    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
      
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        headers: {
          'Content-Type': 'application/json'
        },
       
      });

      if (!response.ok) {
        
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      const { access, refresh } = data;

      if (response.ok) {
        // if login is successful, store the token in local storage
        console.log("sadasd"),
        
        setTimeout(() => {
          history.push('/admin/dashboard');
        }, 2000); // wait for 2 seconds before navigating to home page
        await localforage.setItem("access_token", access);
        await localforage.setItem("refresh_token", refresh);
      }
    } catch (error) {
      console.log(error.message);
      // show error message to the user
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row>
          <Col className="ml-auto mr-auto" lg="4" md="6">
            <Form action="" className="form" method="">
              <Card className="card-login">
                <CardHeader>
                  <CardHeader>
                    <h3 className="header text-center">Login</h3>
                  </CardHeader>
                </CardHeader>
                <CardBody>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="nc-icon nc-single-02" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Username"
                      type="suername"
                      value={username}
                      onChange={handleEmailChange}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="nc-icon nc-key-25" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="off"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </InputGroup>
                  <br />
                  <FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input defaultChecked defaultValue="" type="checkbox" />
                        <span className="form-check-sign" />
                        Subscribe to newsletter
                      </Label>
                    </FormGroup>
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  <Button onClick={handleSubmit} className="btn btn-primary">
                    Sign up
                  </Button>
                </CardFooter>
              </Card>
            </Form>
          </Col>
        </Row>
      </Container>
      <div
        className="full-page-background"
        style={{
          backgroundImage: `url(${require("assets/img/bg/fabio-mangione.jpg")})`
        }}
      />
    </div>
  );
}

export default withRouter(Login);
