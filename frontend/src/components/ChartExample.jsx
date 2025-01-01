import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { getAllItem } from "../utils/getItem";

const ChartComponent = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllItem();
        // const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
          const transformedData = {
            labels: data.map((item) => item.name),
            datasets: [
              {
                label: "Stok Barang",
                data: data.map((item) => item.stok),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          };

          setChartData(transformedData);
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
      <h2>Bar Chart Stok Barang</h2>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default ChartComponent;
