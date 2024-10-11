import React, { useState, useEffect } from "react";
import Statistics from "./components/Statistics"; // Import the Statistics component
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import TransactionsTable from "./components/TransactionTable";

// Styles for the App component
const styles = {
  body: {
    background: "black", // Navy blue to light blue gradient
    margin: 0,
    padding: 0,
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  appContainer: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    maxWidth: "100%",
    color: "white", // White text for contrast
  },
  header: {
    backgroundColor: "#2c3e50", // Dark blue background color
    color: "white", // White text
    padding: "20px 20px", // Padding for spacing and responsiveness
    fontSize: "1.5rem", // Slightly smaller font size for elegance
    textAlign: "center", // Center the text horizontally
    textTransform: "uppercase", // Make the text uppercase for emphasis
    letterSpacing: "1.5px", // Subtle spacing between letters
    fontWeight: "bold", // Bold text for importance
    borderBottom: "5px solid #1abc9c", // Add a bright green bottom border
    borderRadius: "0 0 0px 20px", // Smooth rounded edges at the bottom
    backgroundImage: "linear-gradient(135deg, #2c3e50, #34495e, #1abc9c)", // Gradient from dark blue to bright green
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", // Stronger shadow for more depth
  },
  mainContent: {
    padding: "40px",
    maxWidth: "2100px",
    margin: "0 auto",
  },
  componentSection: {
    marginBottom: "50px", // Add space between components
  },
  footer: {
    backgroundColor: "#2c3e50", // Dark blue background to match the header
    color: "white", // White text for contrast
    padding: "40px 20px", // Padding to create spacing
    fontSize: "1.2rem", // Slightly smaller font size for footer
    textAlign: "center",
    borderTop: "5px solid #1abc9c", // Bright green top border to match header
    borderRadius: "20px 20px 0 0", // Rounded edges at the top
    backgroundImage: "linear-gradient(135deg, #2c3e50, #34495e, #1abc9c)", // Gradient like the header
    boxShadow: "0 -4px 15px rgba(0, 0, 0, 0.2)", // Shadow effect to create depth
    marginTop: "60px", // Space between footer and content
  },
};

const App = () => {
  const [month, setMonth] = useState("November");

  // Apply gradient background to the entire body using useEffect
  useEffect(() => {
    document.body.style.background = styles.body.background;
    document.body.style.margin = styles.body.margin;
    document.body.style.padding = styles.body.padding;
    document.body.style.minHeight = styles.body.minHeight;
    document.body.style.fontFamily = styles.body.fontFamily;
  }, []);

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1>Monthly Transaction Statistics</h1>
      </header>

      <main style={styles.mainContent}>
        {/* Render the Statistics Component */}
        <div style={styles.componentSection}>
          <Statistics />
        </div>

        {/* Bar Chart */}
        <div style={styles.componentSection}>
          <BarChart />
        </div>

        {/* Pie Chart */}
        <div style={styles.componentSection}>
          <PieChart />
        </div>

        {/* Transactions Table */}
        <div style={styles.componentSection}>
          <TransactionsTable />
        </div>
      </main>

      <footer style={styles.footer}>
        <p>© 2024 Roxiler Task. All rights reserved.</p>
        {/* Navigation buttons using href */}
        <a
          href="http://localhost:5000/api/transactions/combined-data?month=July"
          style={{ margin: "5px", padding: "10px", textDecoration: "none" }}
        >
          <button style={{ padding: "10px" }}>Go to combined Data</button>
        </a>
        <a
          href="/"
          style={{ margin: "5px", padding: "10px", textDecoration: "none" }}
        >
          <button style={{ padding: "10px" }}>Back to Home</button>
        </a>
        <a
          href=" http://localhost:5000/api/transactions/initialize-data"
          style={{ margin: "5px", padding: "10px", textDecoration: "none" }}
        >
          <button style={{ padding: "10px" }}>Fetch Seed DATA</button>
        </a>
        <p>By Default it shows July Month Data</p>
      </footer>
    </div>
  );
};

export default App;
