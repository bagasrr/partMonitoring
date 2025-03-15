import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DayUsedChart = ({ data }) => {
  // Siapkan data untuk chart
  const chartData = {
    labels: data.map((item) => `${item.name} (${item.item_number})`), // Nama item sebagai label
    datasets: [
      {
        label: "Hari Pemakaian",
        data: data.map((item) => item.dayUsed), // dayUsed sebagai data
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Warna bar
        borderColor: "rgba(75, 192, 192, 1)", // Warna border bar
        borderWidth: 1,
      },
    ],
  };

  // Konfigurasi options untuk horizontal bar chart
  const options = {
    indexAxis: "y", // Mengubah orientasi chart menjadi horizontal
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Part yang Paling Banyak Digunakan (Hari)",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Hari Digunakan",
        },
        ticks: {
          stepSize: 1, // Menampilkan hanya angka bulat
        },
      },
      y: {
        title: {
          display: true,
          text: "Nama Part",
        },
      },
    },
  };

  return (
    <div className="w-full min-h-[250px]">
      <Bar data={chartData} options={options} />;
    </div>
  );
};

export default DayUsedChart;
