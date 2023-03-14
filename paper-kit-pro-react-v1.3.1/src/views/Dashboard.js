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
// react plugin used to create charts
import { Line, Bar, Doughnut } from "react-chartjs-2";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
  chartExample5,
  chartExample6,
  chartExample7,
  chartExample8
} from "variables/charts.js";

var mapData = {
  AU: 760,
  BR: 550,
  CA: 120,
  DE: 1300,
  FR: 540,
  GB: 690,
  GE: 200,
  IN: 200,
  RO: 600,
  RU: 300,
  US: 2920
};
import NotificationAlert from "react-notification-alert";
import localforage from 'localforage';
export const notifications = [];



function Dashboard() {
  const notificationAlert = React.useRef();
  const [filterOption, setFilterOption] = useState("monthly");
  const [filterOptionCust, setFilterOptionCust] = useState("monthly");
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  //Notification
  const notify = (place) => {
    var color = Math.floor(Math.random() * 5 + 1);
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            Welcome to <b>Now UI Dashboard React</b> - a beautiful premium admin
            for every web developer.
          </div>
        </div>
      ),
      type: type,
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 7,
      read: false
    };
    notifications.push(options);
    localforage.setItem('notifications', JSON.stringify([...notifications]));
    notificationAlert.current.notificationAlert(options);
    console.log(notifications)
  };

  useEffect(() => {
    const fetchData = async () => {
      const access_token = await localforage.getItem('access_token');
      console.log(filterOption)
      const response = await fetch("http://127.0.0.1:8000/top_products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + String(access_token)
        },
        body: JSON.stringify({ report_type: filterOption }),
      });
      const data = await response.json();
      console.log(data)
      setTopProducts(data);
    };

  
    fetchData();
    
  }, [filterOption]);


  useEffect(() =>{
    const fetchDataCustomers = async () => {
      const access_token = await localforage.getItem('access_token');
      console.log(filterOption)
      const response = await fetch("http://127.0.0.1:8000/top_customers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + String(access_token)
        },
        body: JSON.stringify({ report_type: filterOptionCust }),
      });
      const data = await response.json();
      console.log(data)
      setTopCustomers(data);
    };
    fetchDataCustomers();
}, [filterOptionCust])
  
  return (
    <>
      <NotificationAlert ref={notificationAlert} />
      <div className="content">
        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-globe text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Currency</p>
                      <CardTitle tag="p">150GB</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-refresh" />
                  Update Now
                </div>
              </CardFooter>
            </Card>
          </Col>


          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-calendar-60" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Current Date(Gregorian)</p>
                      <CardTitle tag="p">{new Date().toLocaleDateString()}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col md="12" xs="7">
                    <div className="numbers">
                      <p className="card-category">Current Date(Jalali)</p>
                      <CardTitle tag="p">{new Date().toLocaleDateString()}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>

            </Card>
          </Col>

          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Errors</p>
                      <CardTitle tag="p">23</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-clock-o" />
                  In the last hour
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Followers</p>
                      <CardTitle tag="p">+45K</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-refresh" />
                  Update now
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="4" sm="6">
            <Card>
              <CardHeader>
                <Row>
                  <Col sm="7">
                    <div className="numbers pull-left">$34,657</div>
                  </Col>
                  <Col sm="5">
                    <div className="pull-right">
                      <Badge color="success" pill>
                        +18%
                      </Badge>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <h6 className="big-title">
                  total earnings in last ten quarters
                </h6>
                <Line
                  data={chartExample1.data}
                  options={chartExample1.options}
                  height={380}
                  width={826}
                />
              </CardBody>
              <CardFooter>
                <hr />
                <Row>
                  <Col sm="7">
                    <div className="footer-title">Financial Statistics</div>
                  </Col>
                  <Col sm="5">
                    <div className="pull-right">
                      <Button
                        className="btn-round btn-icon"
                        color="success"
                        size="sm"
                      >
                        <i className="nc-icon nc-simple-add" />
                      </Button>
                    </div>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="4" sm="6">
            <Card>
              <CardHeader>
                <Row>
                  <Col sm="7">
                    <div className="numbers pull-left">169</div>
                  </Col>
                  <Col sm="5">
                    <div className="pull-right">
                      <Badge color="danger" pill>
                        -14%
                      </Badge>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <h6 className="big-title">
                  total subscriptions in last 7 days
                </h6>
                <Line
                  data={chartExample2.data}
                  options={chartExample2.options}
                  height={380}
                  width={828}
                />
              </CardBody>
              <CardFooter>
                <hr />
                <Row>
                  <Col sm="7">
                    <div className="footer-title">View all members</div>
                  </Col>
                  <Col sm="5">
                    <div className="pull-right">
                      <Button
                        className="btn-round btn-icon"
                        color="danger"
                        size="sm"
                      >
                        <i className="nc-icon nc-button-play" />
                      </Button>
                    </div>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>

          <Col lg="4" sm="6">
            <Card>
              <CardHeader>
                <Row>
                  <Col sm="7">
                    <div className="numbers pull-left">8,960</div>
                  </Col>
                  <Col sm="5">
                    <div className="pull-right">
                      <Badge color="warning" pill>
                        ~51%
                      </Badge>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <h6 className="big-title">total downloads in last 6 years</h6>
                <Line
                  data={chartExample3.data}
                  options={chartExample3.options}
                  height={380}
                  width={826}
                />
              </CardBody>
              <CardFooter>
                <hr />
                <Row>
                  <Col sm="7">
                    <div className="footer-title">View more details</div>
                  </Col>
                  <Col sm="5">
                    <div className="pull-right">
                      <Button
                        className="btn-round btn-icon"
                        color="warning"
                        size="sm"
                      >
                        <i className="nc-icon nc-alert-circle-i" />
                      </Button>
                    </div>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md="6">
            <Card>
              <Row>
                <Col xs="5">
                  <CardHeader>
                    <CardTitle tag="h4">Top Five Products</CardTitle>

                  </CardHeader>
                </Col>
                <Col xs="3"></Col>
                <Col xs="3">
                  <Label for="selectType">Select Type:</Label>
                  <Input type="select" name="select" id="selectType" onChange={(e) => setFilterOption(e.target.value)}>
                    <option value="">Select Type</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>

                  </Input>
                </Col>
              </Row>
              <CardBody>
                <Row>

                  <Col md="12">

                    <Table responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Product Name</th>
                          <th className="text-right">Total Sales</th>

                        </tr>
                      </thead>
                      <tbody>
                        {topProducts.map((product, index) => (
                          <tr key={product[0]}>
                            <td>{index + 1}</td>
                            <td>{product[0]}</td>
                            <td className="text-right">{product[1]}</td>

                          </tr>
                        ))}
                      </tbody>
                    </Table>

                  </Col>



                </Row>

              </CardBody>
            </Card>
          </Col>

          <Col md="6">
            <Card>
              <Row>
                <Col xs="5">
                  <CardHeader>
                    <CardTitle tag="h4">Top Five Customers</CardTitle>

                  </CardHeader>
                </Col>
                <Col xs="3"></Col>
                <Col xs="3">
                  <Label for="selectType">Select Type:</Label>
                  <Input type="select" name="select" id="selectType" onChange={(e) => setFilterOptionCust(e.target.value)}>
                    <option value="">Select Type</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>

                  </Input>
                </Col>
              </Row>
              <CardBody>
                <Row>

                  <Col md="12">
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Customer Name</th>
                          <th className="text-right">Total Sales</th>

                        </tr>
                      </thead>
                      <tbody>
                        {topCustomers.map((customer, index) => (
                          <tr key={customer[0]}>
                            <td>{index + 1}</td>
                            <td>{pustomer[0]}</td>
                            <td className="text-right">{customer[1]}</td>

                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>



                </Row>

              </CardBody>


            </Card>
          </Col>
        </Row>

        <Row>
          <Col md="6">
            <Card className="card-tasks">
              <CardHeader>
                <CardTitle tag="h4">Goods On The Road</CardTitle>
                <h5 className="card-category">Backend development</h5>
              </CardHeader>
              <CardBody>
                <div className="table-full-width table-responsive">
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultChecked type="checkbox" />
                              <span className="form-check-sign" />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="img-row">
                          <div className="img-wrapper">
                            <img
                              alt="..."
                              className="img-raised"
                              src={require("assets/img/faces/ayo-ogunseinde-2.jpg")}
                            />
                          </div>
                        </td>
                        <td className="text-left">
                          Sign contract for "What are conference organizers
                          afraid of?"
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="info"
                            id="tooltip42906017"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-ruler-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip42906017"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="danger"
                            id="tooltip570363224"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-simple-remove" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip570363224"
                          >
                            Remove
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox" />
                              <span className="form-check-sign" />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="img-row">
                          <div className="img-wrapper">
                            <img
                              alt="..."
                              className="img-raised"
                              src={require("assets/img/faces/erik-lucatero-2.jpg")}
                            />
                          </div>
                        </td>
                        <td className="text-left">
                          Lines From Great Russian Literature? Or E-mails From
                          My Boss?
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="info"
                            id="tooltip584875601"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-ruler-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip584875601"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="danger"
                            id="tooltip517629613"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-simple-remove" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip517629613"
                          >
                            Remove
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultChecked type="checkbox" />
                              <span className="form-check-sign" />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="img-row">
                          <div className="img-wrapper">
                            <img
                              alt="..."
                              className="img-raised"
                              src={require("assets/img/faces/kaci-baum-2.jpg")}
                            />
                          </div>
                        </td>
                        <td className="text-left">
                          Using dummy content or fake information in the Web
                          design process can result in products with unrealistic
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="info"
                            id="tooltip792337830"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-ruler-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip792337830"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="danger"
                            id="tooltip731952378"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-simple-remove" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip731952378"
                          >
                            Remove
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox" />
                              <span className="form-check-sign" />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="img-row">
                          <div className="img-wrapper">
                            <img
                              alt="..."
                              className="img-raised"
                              src={require("assets/img/faces/joe-gardner-2.jpg")}
                            />
                          </div>
                        </td>
                        <td className="text-left">
                          But I must explain to you how all this mistaken idea
                          of denouncing pleasure
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="info"
                            id="tooltip825783733"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-ruler-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip825783733"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="danger"
                            id="tooltip285089652"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-simple-remove" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip285089652"
                          >
                            Remove
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-refresh spin" />
                  Updated 3 minutes ago
                </div>
              </CardFooter>
            </Card>
          </Col>

          <Col md="6">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Order Notificatons</CardTitle>
                <p className="card-category">All products including Taxes</p>
              </CardHeader>
              <CardBody>
                <Bar
                  data={chartExample4.data}
                  options={chartExample4.options}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-info" />
                  Tesla Model S <i className="fa fa-circle text-danger" />
                  BMW 5 Series
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-check" />
                  Data information certified
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="3">
            <Card>
              <CardHeader>
                <CardTitle></CardTitle>
                <p className="card-category">Last Campaign Performance</p>
              </CardHeader>
              <CardBody style={{ height: "253px" }}>
                <Doughnut
                  data={chartExample5.data}
                  options={chartExample5.options}
                  className="ct-chart ct-perfect-fourth"
                  height={300}
                  width={456}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-info" />
                  Open
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-calendar" />
                  Number of emails sent
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col md="3">
            <Card>
              <CardHeader>
                <CardTitle>New Visitators</CardTitle>
                <p className="card-category">Out Of Total Number</p>
              </CardHeader>
              <CardBody style={{ height: "253px" }}>
                <Doughnut
                  data={chartExample6.data}
                  options={chartExample6.options}
                  className="ct-chart ct-perfect-fourth"
                  height={300}
                  width={456}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-warning" />
                  Visited
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-check" />
                  Campaign sent 2 days ago
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col md="3">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <p className="card-category">Total number</p>
              </CardHeader>
              <CardBody style={{ height: "253px" }}>
                <Doughnut
                  data={chartExample7.data}
                  options={chartExample7.options}
                  className="ct-chart ct-perfect-fourth"
                  height={300}
                  width={456}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-danger" />
                  Completed
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-clock-o" />
                  Updated 3 minutes ago
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col md="3">
            <Card>
              <CardHeader>
                <CardTitle>Subscriptions</CardTitle>
                <p className="card-category">Our Users</p>
              </CardHeader>
              <CardBody style={{ height: "253px" }}>
                <Doughnut
                  data={chartExample8.data}
                  options={chartExample8.options}
                  className="ct-chart ct-perfect-fourth"
                  height={300}
                  width={456}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-secondary" />
                  Ended
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" />
                  Total users
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="4">
            <Button
              block
              className="btn-round"
              color="default"
              onClick={() => notify("tr")}
              outline
            >
              Top Right
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
