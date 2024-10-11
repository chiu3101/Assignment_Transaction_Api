import React, { useState, useEffect } from "react";
import axios from "axios";

const Statistics = () => {
  const [month, setMonth] = useState("March"); // Default to November
  const [stats, setStats] = useState(null);
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

  // Fetch statistics when the component mounts or the month changes
  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/transactions/statistics?month=${month}`
        );
        setStats(response.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [month]);

  // Handle month change
  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Statistics for {month}</h1>

      {/* Month Selector */}
      <div style={styles.dropdownContainer}>
        <label htmlFor="month-select" style={styles.label}>
          Select Month:{" "}
        </label>
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

      {/* Display Statistics in a Colorful Table */}
      {stats && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Statistic</th>
              <th style={styles.th}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>Total Sales</td>
              <td style={styles.td}>${stats.totalSales}</td>
            </tr>
            <tr>
              <td style={styles.td}>Total Sold Sales</td>
              <td style={styles.td}>${stats.totalSoldSales}</td>
            </tr>
            <tr>
              <td style={styles.td}>Total Deficit Sales</td>
              <td style={styles.td}>${stats.totalDeficitSales}</td>
            </tr>
            <tr>
              <td style={styles.td}>Sold Items</td>
              <td style={styles.td}>{stats.soldItems} items</td>
            </tr>
            <tr>
              <td style={styles.td}>Unsold Items</td>
              <td style={styles.td}>{stats.notSoldItems} items</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

// Enhanced Colorful Styles for the Component
const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px",
    background: "linear-gradient(135deg, #f06, #f79d00)",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    fontFamily: "'Poppins', sans-serif",
    color: "#fff",
    textAlign: "center",
  },
  header: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#fff",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  },
  dropdownContainer: {
    marginBottom: "30px",
  },
  label: {
    marginRight: "10px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  select: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "30px",
    border: "none",
    background: "#fff",
    color: "#333",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    outline: "none",
    transition: "background 0.3s",
  },
  selectHover: {
    background: "#f06", // Optional hover state if added
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.15)",
  },
  th: {
    backgroundColor: "#f79d00",
    color: "#fff",
    padding: "15px",
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: "1px",
    textAlign: "left",
    fontSize: "16px",
  },
  td: {
    padding: "15px",
    textAlign: "left",
    fontSize: "15px",
    color: "#333",
    borderBottom: "1px solid #ddd",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    margin: "20px 0",
  },
  loading: {
    color: "#fff",
    fontSize: "18px",
    margin: "20px 0",
    fontWeight: "bold",
  },
};

export default Statistics;
