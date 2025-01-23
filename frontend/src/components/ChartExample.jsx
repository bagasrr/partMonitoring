import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { getItems } from "../utils/items";

const ChartComponent = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Amount",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Lower Limit",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  });

  const [itemDetails, setItemDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getItems();
        if (Array.isArray(data)) {
          const transformedData = {
            labels: data.map((item) => (item.name.length > 10 ? item.name.substring(0, 10) + "..." : item.name)),
            datasets: [
              {
                label: "Amount",
                data: data.map((item) => item.amount),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
              {
                label: "Lower Limit",
                data: data.map((item) => item.lowerLimit),
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
            ],
          };

          setChartData(transformedData);
          setItemDetails(data);
        } else {
          console.error("Data tidak valid:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Bar Chart Stock dan Lower Limit</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const item = itemDetails[context.dataIndex];
                  return [
                    `Name: ${item.name}`,
                    `Amount: ${item.amount}`,
                    `Description: ${item.description}`,
                    `Lower Limit: ${item.lowerLimit}`,
                    `Machine Name: ${item.machine.machine_name}`,
                    `Machine Number: ${item.machine.machine_number}`,
                  ];
                },
              },
            },
            hover: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Items",
              },
              ticks: {
                maxRotation: 0,
                minRotation: 0,
                callback: function (value, index, values) {
                  return value.length > 10 ? value.substring(0, 10) + "..." : value;
                },
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: "Quantity",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ChartComponent;
