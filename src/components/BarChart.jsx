import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./BarChart.css"; // Custom CSS for the bar chart

const BarChartComponent = () => {
  const [month, setMonth] = useState("March"); // Default to November
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  // Fetch bar chart data when the component mounts or the month changes
  useEffect(() => {
    const fetchBarChartData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/transactions/bar-chart?month=${month}`
        );
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          setChartData(data); // Set the raw data for processing later
          setError(""); // Clear error if data is fetched successfully
        } else {
          setError("No data returned for this month");
          setChartData(null); // Clear chart data if no data found
        }
      } catch (err) {
        setError("Failed to fetch bar chart data");
        setChartData(null); // Clear chart data on error
      } finally {
        setLoading(false);
      }
    };

    fetchBarChartData();
  }, [month]);

  // Handle month change
  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <div className="chart-container">
      <h1>Bar Chart for {month}</h1>

      {/* Month Selector */}
      <div className="dropdown-container">
        <label htmlFor="month-select">Select Month: </label>
        <select id="month-select" value={month} onChange={handleMonthChange}>
          {months.map((m, idx) => (
            <option key={idx} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Error Handling */}
      {error && <p className="error">{error}</p>}

      {/* Loading Spinner */}
      {loading && <p className="loading">Loading...</p>}

      {/* Bar Chart Display */}
      {chartData ? (
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      ) : (
        !loading && <p>No chart data available</p>
      )}
    </div>
  );
};

export default BarChartComponent;
