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
import React, { useEffect, useState,useMemo} from "react";
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
import { useLocation } from 'react-router-dom';
function Charts() {
  const [dataTable, setDataTable] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [result, setResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState({
    group: "",
    subgroup: "",
    feature: "",
    new_or_old_product: "",
    related: "",
    origin: "",
    product_code_ir: "",
    product_code_tr: "",
    dont_order_again: "",
    description_tr: "",
    description_ir: "",
    unit: "",
    weight: "",
    unit_secondary: "",
    price: "",
    avarage_previous_year: "",
    month_1: "",
    month_2: "",
    month_3: "",
    month_4: "",
    month_5: "",
    month_6: "",
    month_7: "",
    month_8: "",
    month_9: "",
    month_10: "",
    month_11: "",
    month_12: "",
    total_sale: "",
    warehouse: "",
    goods_on_the_road: "",
    total_stock_all: "",
    total_month_stock: "",
    standart_deviation: "",
    lead_time: "",
    product_coverage_percentage: "",
    demand_status: "",
    safety_stock: "",
    rop: "",
    monthly_mean: "",
    new_party: "",
    cycle_service_level: "",
    total_stock: "",
    need_prodcuts: "",
    over_stock: "",
    calculated_need: "",
    calculated_max_stock: "",
    calculated_min_stock: "",
  });
  const tableHeaders = [
    'Group',
    'Subgroup',
    'Feature',
    'New or Old Product',
    'Related',
    'Origin',
    'Product Code IR',
    'Product Code TR',
    "Dont Order Again",
    "Description TR",
    "Description IR",
    "Unit",
    "Weight",
    "Unit Secondary",
    "Price",
    "Avarage Previous Year",
    "Month 1",
    "Month 2",
    "Month 3",
    "Month 4",
    "Month 5",
    "Month 6",
    "Month 7",
    "Month 8",
    "Month 9",
    "Month 10",
    "Month 11",
    "Month 12",
    "Total Sale",
    "Warehouse",
    "Goods on the Road",
    "Total Stock All",
    "Total Month Stock",
    "Standart Deviation",
    "Lead Time",
    "Product Coverage Percentage",
    "Demand Status",
    "Safety Stock",
    "Rop",
    "Monthly Mean",
    "New Party",
    "Cycle Service Level",
    "Total Stock",
    "Need Products",
    "Over Stock",
    "Calculated Need",
    "Calculated Max Stock",
    "Calculated Min Stock",
  ];

  const parsedTableData = useMemo(() => {
    if (Array.isArray(tableData) && tableData.length > 0) {
      return tableData;
    }
    return [];
  }, [tableData]);


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productCode = queryParams.get('productCode');
  console.log(productCode)

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


  useEffect(() => {
    if (productCode) {
      
      handleSelect({ value: productCode });
    }
  }, [productCode]);

  const handleSelect = async (selectedOption) => {
   
    setSelectedItem(selectedOption);
    const access_token = await localforage.getItem('access_token');
    
    const selectData = { product_code: selectedOption.value };
    // post the selected option to Django
    fetch('http://127.0.0.1:8000/rop/', {
      method: 'POST',
    headers: { "Content-Type": "application/json", 
    'Authorization': 'Bearer '+ String(access_token)},
      
      body: JSON.stringify(selectData),
     
    })
      .then(response => response.json())
      .then(data => {
        
        setTableData(data);
        console.log(dataTable);
      }) 

  }
  useEffect(() => {
    console.log(tableData);
  }, [tableData,productCode]);



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
                  value={selectedItem}
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
              <Table className="scrollable-table">
      <tbody>
        {tableHeaders.map((header, index) => (
          <tr key={index}>
            <th>{header}</th>
            <td>{parsedTableData.length > 0 && parsedTableData[index]}</td>
          </tr>
        ))}
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