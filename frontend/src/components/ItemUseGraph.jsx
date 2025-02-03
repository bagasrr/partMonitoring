import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Ensure Chart.js is imported correctly

const ItemUsageGraph = () => {
  const [usageData, setUsageData] = useState([]);

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/item-usage`);
      setUsageData(response.data);
    } catch (error) {
      console.error("Error fetching item usage data:", error);
    }
  };

  const chartData = {
    labels: usageData.map((usage) => `Item ${usage.item_id}`),
    datasets: [
      {
        label: "Use Count",
        data: usageData.map((usage) => usage.use_count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="container mx-auto my-6">
      <h2 className="text-2xl mb-4">Item Usage Data</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default ItemUsageGraph;
