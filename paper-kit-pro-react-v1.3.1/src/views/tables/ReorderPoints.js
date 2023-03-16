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
import { data } from "jquery";
import React, { useEffect, useState } from "react";
// react plugin used to create charts
import { Line, Bar, Pie } from "react-chartjs-2";
import Select from "react-select";
import '../../assets/css/Table.css';

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  Table,
  Label,
  Container

} from "reactstrap";

// core components
import {
  chartExample1,
  chartExample4,
  chartExample9,
  chartExample10,
  chartExample11,
  chartExample12
} from "variables/charts.js";

import localforage from 'localforage';

function Charts() {
  const [dataTable, setDataTable] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [result, setResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchData() {
      const access_token = await localforage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/charts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(access_token)
        }
      });
      const responseData = await response.json();

      setDataTable(responseData)


    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchItems() {
      const access_token = await localforage.getItem('access_token');
      fetch('http://127.0.0.1:8000/item_list/', {
        headers: {

          'Authorization': 'Bearer ' + String(access_token)
        }
      })
        .then(response => response.json())
        .then(data => {
          setItems(data);

        })


    }
    fetchItems()
  }, []);


  const handleSelect = async (selectedOption) => {
    setSelectedItem(selectedOption);
    const access_token = localforage.getItem('access_token');
    const selectData = { product_code: selectedOption.value };
    // post the selected option to Django
    fetch('http://127.0.0.1:8000/item_list_filter/', {
      method: 'POST',

      body: JSON.stringify(selectData),
      headers: {

        'Authorization': 'Bearer ' + String(access_token)
      }
    })
      .then(response => response.json())
      .then(data => {
        setResult(data);
      })

  }

  const options = items.map((item) => ({
    value: item,
    label: item
  }));

  let charts = {};
  if (result && result.date_list && result.output_value_list && result.product_name) {
    charts = {
      data: {
        labels: result.date_list,
        datasets: [
          {
            label: result.product_name,
            borderColor: "#6bd098",
            pointRadius: 0,
            pointHoverRadius: 0,
            fill: false,
            borderWidth: 3,
            barPercentage: 1.6,
            tension: 0.4,
            data: result.output_value_list
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false
          },
          tooltips: {
            enabled: false
          }
        },
        scales: {
          y: {
            ticks: {
              color: "#9f9f9f",
              beginAtZero: false,
              maxTicksLimit: 5
              //padding: 20
            },
            grid: {
              drawBorder: false,
              display: false
            }
          },
          x: {
            grid: {
              drawBorder: false,
              display: false
            },
            ticks: {
              padding: 20,
              color: "#9f9f9f"
            }
          }
        }
      }
    };
  }

  return (
    <>


      <div className="content">
        <Card>
          <CardHeader>
            <CardTitle tag='h4'>REORDER POINTS</CardTitle>
          </CardHeader>
          <Row style={{ marginTop: "10px" }} >
            <CardBody>
              <Col md="4">
              <Label for="singleSelect">Select Product:</Label>
                <Select


                  name="singleSelect"
                  onChange={(value) => {
                    setSelectedItem(value);
                    handleSelect(value);
                  }}
                  options={options}
                  placeholder="Search for an item..."
                  isSearchable

                />
              </Col>
            </CardBody>
          </Row>

        </Card>
        <Container fluid>
          <Row style={{ marginTop: "100px" }}>
            <Col md="6">
              <Card>
              <Table  className="scrollable-table">

  <tbody>
    <tr>
      <th>Group</th>
      <td>ssda</td>
    </tr>
    <tr>
      <th>Subgroup</th>
      <td>dasdas</td>
    </tr>
    <tr>
      <th>Feature</th>
      <td>123</td>
    </tr>
    <tr>
      <th>New or Old Product</th>
      <td></td>
    </tr>
    <tr>
      <th>Related</th>
      <td></td>
    </tr>
    <tr>
      <th>Origin</th>
      <td></td>
    </tr>
    <tr>
      <th>Product Code IR</th>
      <td></td>
    </tr>
    <tr>
      <th>Product Code TR</th>
      <td></td>
    </tr>
    <tr>
      <th>Dont Order Again</th>
      <td></td>
    </tr>
    <tr>
      <th>Description TR</th>
      <td></td>
    </tr>
    <tr>
      <th>Description IR</th>
      <td></td>
    </tr>
    <tr>
      <th>Unit</th>
      <td></td>
    </tr>
    <tr>
      <th>Weight</th>
      <td></td>
    </tr>
    <tr>
      <th>Unit Secondary</th>
      <td></td>
    </tr>
    <tr>
      <th>Price</th>
      <td></td>
    </tr>
    <tr>
      <th>Avarage Previous Year</th>
      <td></td>
    </tr>
    <tr>
      <th>Month 1</th>
      <td></td>
    </tr>
    <tr>
      <th>Month 2</th>
      <td></td>
    </tr>
    <tr>
      <th>Month 3</th>
      <td></td>
    </tr>
    <tr>
      <th>Month 4</th>
      <td></td>
    </tr>
    <tr>
      <th>Month 5</th>
      <td></td>
    </tr>
    <tr>
      <th>Month 6</th>
      <td></td>
    </tr>
    <tr>
      <th>Month 7</th>
      <td></td>
    </tr>
    <tr>
      <th>Month 8</th>
      <td></td>
    </tr>
    <tr>
      <th>Month 9</th>
      <td></td>
    </tr>
    <tr>
      <th>Month 10</th>
      <td></td>
    </tr>
    <tr>
      <th>Month 11</th>
      <td></td>
    </tr>
    <tr>
      <th>Month 12</th>
      <td></td>
    </tr>
    <tr>
      <th>Total Sale</th>
      <td></td>
      </tr>
    <tr>
      <th>Warehouse</th>
      <td></td>
    </tr>
    <tr>
      <th>Goods on the Road</th>
      <td></td>
    </tr>
    <tr>
      <th>Total Stock All</th>
      <td></td>
    </tr>
    <tr>
      <th>Total Month Stock</th>
      <td></td>
    </tr>
    <tr>
      <th>Standart Deviation</th>
      <td></td>
    </tr>
    <tr>
      <th>Lead Time</th>
      <td></td>
    </tr>
    <tr>
      <th>Product Coverage Percentage</th>
      <td></td>
    </tr>
    <tr>
      <th>Demand Status</th>
      <td></td>
    </tr>
    <tr>
      <th>Safety Stock</th>
      <td></td>
    </tr>
    <tr>
      <th>Rop</th>
      <td></td>
    </tr>
    <tr>
      <th>Monthly Mean</th>
      <td></td>
    </tr>
    <tr>
      <th>New Party</th>
      <td></td>
    </tr>
    <tr>
      <th>Cycle Service Level</th>
      <td></td>
    </tr>
    <tr>
      <th>Total Stock</th>
      <td></td>
    </tr>
    <tr>
      <th>Need Products</th>
      <td></td>
    </tr>
    <tr>
      <th>Over Stock</th>
      <td></td>
    </tr>
    <tr>
      <th>Calculated Need</th>
      <td></td>
    </tr>
    <tr>
      <th>Calculated Max Stock</th>
      <td></td>
    </tr>
    <tr>
      <th>Calculated Min Stock</th>
      <td></td>
    </tr>
  </tbody>
</Table>


              </Card>
            </Col>
            <Col md="6">
              <Row>
                <Col md="12">
                  <div className="d-flex justify-content-center" style={{ width: "100%" }}>
                    <Card className="card-chart" style={{ width: "100%" }}>
                      <CardHeader>
                        <CardTitle>SALES</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Line data={charts.data} options={charts.options} />
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <div className="d-flex justify-content-center" style={{ width: "100%" }}>
                    <Card className="card-chart" style={{ width: "100%" }}>
                      <CardHeader>
                        <CardTitle>NASDAQ: AAPL</CardTitle>
                        <p className="card-category">Line Chart with Points</p>
                      </CardHeader>
                      <CardBody>
                        <Line data={chartExample9.data} options={chartExample9.options} />
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <div className="d-flex justify-content-center" style={{ width: "100%" }}>
                    <Card className="card-chart" style={{ width: "100%" }}>
                      <CardHeader>
                        <CardTitle>Views</CardTitle>
                        <p className="card-category">Bar Chart</p>
                      </CardHeader>
                      <CardBody>
                        <Bar data={chartExample10.data} options={chartExample10.options} />
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>





      </div>
    </>
  );
}

export default Charts;
