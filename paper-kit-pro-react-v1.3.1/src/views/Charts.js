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
import React, {useEffect,useState, useRef} from "react";
// react plugin used to create charts
import { Line, Bar, Pie } from "react-chartjs-2";


// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col
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


function Charts() {
  const [dataTable, setDataTable] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [result, setResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      console.log('useEffect called');
      const response = await fetch('http://127.0.0.1:8000/charts/', {
        method: 'POST',
         // replace with your data
      });
      const responseData = await response.json();
      console.log('fetched data:', responseData["output_value_list"]);
      setDataTable(responseData)
      
      
    }
  
    fetchData();
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/item_list/')
      .then(response => response.json())
      .then(data => {
        setItems(data);
        console.log('item list:', data);
      })
      
      
      
      
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setSearchTerm('');
    }
  }
  const handleSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedItem(selectedValue);

    // post the selected value to Django
    fetch('/my-django-endpoint/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ selectedValue })
    })
    .then(response => response.json())
    .then(data => setResult(data))
  
  }
  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
  }
  
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const charts = {
    data: {
      labels:  dataTable["date_list"],
      
      datasets: [
        {
          label: "Active Users",
          borderColor: "#6bd098",
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          borderWidth: 3,
          barPercentage: 1.6,
          tension: 0.4,
          data: dataTable["output_value_list"]
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
  console.log(charts)
  return (
    <>
      <div ref={dropdownRef}>
      <div style={{position:"absolute",top:"100px"}}>
      <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Search..." />
      <select value={selectedItem} onChange={handleSelect} >
        <option value="">Select an item</option>
        {items.map((item, index) => (
          <option key={index} value={item}>{item}</option>
        ))}
      </select>
      </div>
      </div>
      <div className="content">
        <p>
          Simple yet flexible React charting for designers &amp; developers.
          Made by our friends from{" "}
          <a
            target="_blank"
            href="https://jerairrest.github.io/react-chartjs-2/"
            rel="noopener noreferrer"
          >
            react-chartjs-2
          </a>
          , a react based wrapper over{" "}
          <a
            target="_blank"
            href="https://www.chartjs.org"
            rel="noopener noreferrer"
          >
            Chart.js
          </a>
          . Please check{" "}
          <a
            target="_blank"
            href="https://github.com/jerairrest/react-chartjs-2"
            rel="noopener noreferrer"
          >
            react-chartjs-2 documentation
          </a>{" "}
          and{" "}
          <a
            target="_blank"
            href="https://www.chartjs.org/docs/latest/"
            rel="noopener noreferrer"
          >
            Chart.js documentation
          </a>{" "}
          .
        </p>
        <Row>
          <Col md="6">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle>24 Hours Performance</CardTitle>
                <p className="card-category">Line Chart</p>
              </CardHeader>
              <CardBody>
                
                <Line
                  data={charts.data}
                  options={charts.options}
                />
              </CardBody>
            </Card>
          </Col>
          <Col md="6">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle>NASDAQ: AAPL</CardTitle>
                <p className="card-category">Line Chart with Points</p>
              </CardHeader>
              <CardBody>
                <Line
                  data={chartExample9.data}
                  options={chartExample9.options}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle>Views</CardTitle>
                <p className="card-category">Bar Chart</p>
              </CardHeader>
              <CardBody>
                <Bar
                  data={chartExample10.data}
                  options={chartExample10.options}
                />
              </CardBody>
            </Card>
          </Col>
          <Col md="6">
            <Card className="car-chart">
              <CardHeader>
                <CardTitle>Activity</CardTitle>
                <p className="card-category">Multiple Bars Chart</p>
              </CardHeader>
              <CardBody>
                <Bar
                  data={chartExample4.data}
                  options={chartExample4.options}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="4">
            <Card>
              <CardHeader>
                <CardTitle>Email Statistics</CardTitle>
                <p className="card-category">Last Campaign Performance</p>
              </CardHeader>
              <CardBody style={{ height: "342px" }}>
                <Pie
                  data={chartExample11.data}
                  options={chartExample11.options}
                  width={456}
                  height={300}
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
          <Col md="8">
            <Card>
              <CardHeader>
                <CardTitle>Users Behavior</CardTitle>
                <p className="card-category">24 Hours performance</p>
              </CardHeader>
              <CardBody>
                <Line
                  data={chartExample12.data}
                  options={chartExample12.options}
                  width={400}
                  height={100}
                />
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" />
                  Updated 3 minutes ago
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Charts;
