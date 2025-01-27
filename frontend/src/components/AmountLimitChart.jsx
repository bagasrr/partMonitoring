import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AmountLimitChart = ({ data }) => {
  // Siapkan data untuk chart
  const chartData = {
    labels: data.map((item) => item.name), // Nama item sebagai label
    datasets: [
      {
        label: "Amount", // Label untuk dataset amount
        data: data.map((item) => item.amount), // Data amount
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Warna bar untuk amount
        borderColor: "rgba(75, 192, 192, 1)", // Warna border bar untuk amount
        borderWidth: 1,
      },
      {
        label: "Lower Limit", // Label untuk dataset lowerLimit
        data: data.map((item) => item.lowerLimit), // Data lowerLimit
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Warna bar untuk lowerLimit
        borderColor: "rgba(255, 99, 132, 1)", // Warna border bar untuk lowerLimit
        borderWidth: 1,
      },
    ],
  };

  // Konfigurasi options untuk stacked bar chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14, // Ukuran font legend
            weight: "bold", // Ketebalan font legend
          },
          color: "#333", // Warna font legend
        },
      },
      title: {
        display: true,
        text: "Perbandingan Amount dan Lower Limit (Stacked)",
        font: {
          size: 16, // Ukuran font judul
          weight: "bold", // Ketebalan font judul
        },
        color: "#333", // Warna font judul
        padding: 20, // Padding judul
      },
    },
    scales: {
      x: {
        stacked: true, // Aktifkan stacking untuk sumbu X
        title: {
          display: true,
          text: "Nama Item",
          font: {
            size: 14, // Ukuran font label sumbu X
            weight: "bold", // Ketebalan font label sumbu X
          },
          color: "#333", // Warna font label sumbu X
        },
        grid: {
          color: "#e0e0e0", // Warna grid sumbu X
        },
      },
      y: {
        stacked: true, // Aktifkan stacking untuk sumbu Y
        beginAtZero: true,
        title: {
          display: true,
          text: "Jumlah",
          font: {
            size: 14, // Ukuran font label sumbu Y
            weight: "bold", // Ketebalan font label sumbu Y
          },
          color: "#333", // Warna font label sumbu Y
        },
        grid: {
          color: "#e0e0e0", // Warna grid sumbu Y
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default AmountLimitChart;
