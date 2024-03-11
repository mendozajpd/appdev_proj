import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Chart, Doughnut, Line } from 'react-chartjs-2'; // Import Doughnut and Line
import 'chart.js/auto';
import Sidebar from './sidebar';
import { Breadcrumbs } from "./components/Breadcrumbs";
import BACKEND_URL from "../config";
import '../css/admindashboard.css';

const HomePage = () => {
  const [timeInterval, setTimeInterval] = useState('months');
  const navigate = useNavigate();

  const handleIntervalChange = (event) => {
    setTimeInterval(event.target.value);
  };

  // Chart data and options
  const downloadsDataMonthly = [1000000, 1500000, 500000, 1800000, 700000, 62000, 320000, 180000, 14000, 55600, 9000, 43000];
  const downloadsLabelsMonthly = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const downloadsDataYearly = [4000000, 12000000, 6180000];
  const downloadsLabelsYearly = ['2022', '2023', '2024'];

  const downloadsHighestIndexMonthly = downloadsDataMonthly.indexOf(Math.max(...downloadsDataMonthly));
  const downloadsHighestLabelMonthly = downloadsLabelsMonthly[downloadsHighestIndexMonthly];
  const totalDownloadsMonthly = downloadsDataMonthly.reduce((acc, cur) => acc + cur, 0);

  const downloadsHighestIndexYearly = downloadsDataYearly.indexOf(Math.max(...downloadsDataYearly));
  const downloadsHighestLabelYearly = downloadsLabelsYearly[downloadsHighestIndexYearly];
  const totalDownloadsYearly = downloadsDataYearly.reduce((acc, cur) => acc + cur, 0);

  const downloadsChart = {
    labels: timeInterval === 'months' ? downloadsLabelsMonthly : downloadsLabelsYearly,
    datasets: [
      {
        label: timeInterval === 'months' ? 'App Downloads (Monthly)' : 'App Downloads (Yearly)',
        data: timeInterval === 'months' ? downloadsDataMonthly : downloadsDataYearly,
        backgroundColor: 'black',
        borderColor: 'red',
        borderWidth: 1,
      },
    ],
  };

  const linechartOptions = {
    maintainAspectRatio: false,
    responsive: false,
    plugins: {
      title: {
        display: true,
        text: 'MAEDIA HARBOR MONITORING GRAPH'
      },
    },
    scales: {
      y: {
        grid: {
          color: 'black'
        }
      },
      x: {
        grid: {
          color: 'black'
        }
      }
    }
  };

  const doughnutData = {
    labels: ['Listeners', 'Admin', 'Artist'],
    datasets: [{
      data: [300, 50, 100],
      backgroundColor: ['#CD1818', '#1B1A55', '#EBF400'],
      hoverBackgroundColor: ['#7D0A0A', '#070F2B', '#FFCE56']
    }]
  };

  const data = [];
  const data2 = [];
  let prev = 100;
  let prev2 = 80;
  for (let i = 0; i < 1000; i++) {
    prev += 5 - Math.random() * 10;
    data.push({ x: i, y: prev });
    prev2 += 5 - Math.random() * 10;
    data2.push({ x: i, y: prev2 });
  }

  const totalDuration = 10000;
  const delayBetweenPoints = totalDuration / data.length;
  const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
  const animation = {
    x: {
      type: 'number',
      easing: 'linear',
      duration: delayBetweenPoints,
      from: NaN,
      delay(ctx) {
        if (ctx.type !== 'data' || ctx.xStarted) {
          return 0;
        }
        ctx.xStarted = true;
        return ctx.index * delayBetweenPoints;
      }
    },
    y: {
      type: 'number',
      easing: 'linear',
      duration: delayBetweenPoints,
      from: previousY,
      delay(ctx) {
        if (ctx.type !== 'data' || ctx.yStarted) {
          return 0;
        }
        ctx.yStarted = true;
        return ctx.index * delayBetweenPoints;
      }
    }
  };

  const redColor = '#FF5733';
  const blueColor = '#3377FF';

  const lineConfig = {
    type: 'line',
    data: {
      datasets: [{
        label: 'Data 1',
        borderColor: redColor,
        backgroundColor: 'rgba(255, 0, 0, 0.3)', // Background color for Data 1
        borderWidth: 1,
        radius: 0,
        data: data.map(({ x, y }) => ({ x, y: y || null })),
        pointStyle: data.map(({ y }) => y === null ? 'circle' : undefined),
        pointRadius: data.map(({ y }) => y === null ? 3 : undefined),
      },
      {
        label: 'Data 2',
        borderColor: blueColor,
        backgroundColor: 'rgba(0, 0, 255, 0.3)', // Background color for Data 2
        borderWidth: 1,
        radius: 0,
        data: data2.map(({ x, y }) => ({ x, y: y || null })),
        pointStyle: data2.map(({ y }) => y === null ? 'circle' : undefined),
        pointRadius: data2.map(({ y }) => y === null ? 3 : undefined),
      }]
    },
    options: {
      animation,
      interaction: {
        intersect: false
      },
      plugins: {
        legend: false,
        title: {
          display: true,
          text: 'ARTIST UPLOAD AND LISTENERS DOWNLOAD'
        },
        background: {
          color: 'black'
        }
      },
      scales: {
        x: {
          type: 'linear'
        }
      }
    }
  };

  const radarConfig = {
    type: 'radar',
    data: data,
    options: {
      elements: {
        line: {
          borderWidth: 3
        }
      }
    },
  };

  const data1 = {
    labels: [
      'Eating',
      'Drinking',
      'Sleeping',
      'Designing',
      'Coding',
      'Cycling',
      'Running'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 90, 81, 56, 55, 40],
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    }, {
      label: 'My Second Dataset',
      data: [28, 48, 40, 19, 96, 27, 100],
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(54, 162, 235)'
    }]
  };

  // End of chart data and options

  return (
    <>
      <Sidebar />
      <Row xs={1}>
        <Col>
          {/* <Breadcrumbs /> */}
          <div className="chart-container">
            <select className="form-select" value={timeInterval} onChange={handleIntervalChange}>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
            <Row>
              <Col>
                <div style={{ padding: '10px' }}></div>
                <Chart type="line" data={downloadsChart} options={linechartOptions} height={300} width={500} />
              </Col>
            </Row>
            <Row>
              <Col>
                <div style={{ padding: '10px' }}>
                  <Line data={lineConfig.data} options={lineConfig.options} />
                </div>
              </Col>
            </Row>
            <Row>

              <Col>
                <Line data={data1} />
              </Col>
            </Row>

          </div>

        </Col>
      </Row >
      <div className="dough">
        <Row>
          <div style={{ marginRight: '20px' }}>
            <Doughnut data={doughnutData} options={{}} height={300} width={500} />
          </div>
        </Row >

      </div >

      {/* </Container > */}
    </>
  );
};

export default HomePage;

