import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [month, setMonth] = useState("March"); // Default to November
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  let chartRef = React.createRef();

  // Months for dropdown
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Fetch pie chart data when the component mounts or the month changes
  useEffect(() => {
    const fetchPieChartData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/transactions/pie-chart?month=${month}`
        );
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          setChartData({
            labels: data.map((item) => item.category),
            datasets: [
              {
                label: "Items per Category",
                data: data.map((item) => item.count),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.7)", // Light Red with transparency
                  "rgba(54, 162, 235, 0.7)", // Light Blue with transparency
                  "rgba(255, 206, 86, 0.7)", // Light Yellow with transparency
                  "rgba(75, 192, 192, 0.7)", // Light Teal with transparency
                  "rgba(153, 102, 255, 0.7)", // Light Purple with transparency
                  "rgba(255, 159, 64, 0.7)", // Light Orange with transparency
                  "rgba(255, 99, 71, 0.7)", // Vibrant Red-Orange
                  "rgba(199, 0, 57, 0.7)", // Dark Red
                  "rgba(255, 204, 0, 0.7)", // Bright Yellow
                  "rgba(0, 255, 0, 0.7)", // Light Green
                ],
                hoverOffset: 8, // Increased offset for hover effect
              },
            ],
          });
          setError(""); // Clear error if data is fetched successfully
        } else {
          setError("No data returned for this month");
          setChartData(null); // Clear chart data if no data found
        }
      } catch (err) {
        setError("Failed to fetch pie chart data");
        setChartData(null); // Clear chart data on error
      } finally {
        setLoading(false);
      }
    };

    fetchPieChartData();
  }, [month]);

  // Handle month change
  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  // Cleanup the chart instance
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Pie Chart for {month}</h1>

      {/* Month Selector */}
      <div style={styles.dropdownContainer}>
        <label htmlFor="month-select">Select Month:</label>
        <select
          id="month-select"
          value={month}
          onChange={handleMonthChange}
          style={styles.select}
        >
          {months.map((m, idx) => (
            <option key={idx} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Error Handling */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Loading Spinner */}
      {loading && <p style={styles.loading}>Loading...</p>}

      {/* Pie Chart Display */}
      {chartData ? (
        <div style={styles.chartWrapper}>
          <Pie
            data={chartData}
            ref={chartRef}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    },
                  },
                },
              },
              elements: {
                arc: {
                  borderWidth: 4,
                  borderColor: "#ffffff", // White border around slices
                  hoverBorderColor: "#000000", // Black border on hover
                },
              },
            }}
          />
        </div>
      ) : (
        !loading && <p style={styles.noData}>No chart data available</p>
      )}
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "30px",
    background: "#e0e5ec", // Light background for neumorphism
    borderRadius: "20px",
    boxShadow: "8px 8px 16px #a3a3a3, -8px -8px 16px #ffffff", // Neumorphic effect
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#333",
  },
  dropdownContainer: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "15px",
    border: "1px solid #ccc",
    background: "#fff",
    color: "#333",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  error: {
    color: "#FF6A5F",
    fontWeight: "bold",
  },
  loading: {
    color: "#333",
    fontSize: "18px",
    fontWeight: "bold",
  },
  chartWrapper: {
    marginTop: "20px",
    borderRadius: "20px",
    boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)",
    padding: "20px",
    background: "#ffffff", // Background for the chart
  },
  noData: {
    color: "#666",
    fontSize: "16px",
  },
};

export default PieChart;
