import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "./transactionsTable.css"; // Import the CSS file

const TransactionsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [month, setMonth] = useState("March"); // Default month

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/transactions?month=${month}`
        );
        setData(response.data.transactions);
        setError("");
      } catch (err) {
        setError("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [month]);

  useEffect(() => {
    // Initialize DataTable after data is fetched
    const table = $("#transactionsTable").DataTable();

    return () => {
      // Cleanup the DataTable on component unmount
      if (table) {
        table.destroy();
      }
    };
  }, [data]);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      {/* Table Header */}
      <div className="table-header">
        <h2>Transactions for {month}</h2>
        <div className="input-group">
          <label htmlFor="month-select">Select Month: </label>
          <select
            id="month-select"
            value={month}
            onChange={handleMonthChange}
            className="form-select"
          >
            {[
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
            ].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Body */}
      <div className="table-body">
        <table
          id="transactionsTable"
          className="table table-striped table-bordered darkTable"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Description</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Date of Sale</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="8">No transactions available.</td>
              </tr>
            ) : (
              data.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.title}</td>
                  <td>${transaction.price.toFixed(2)}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.sold ? "Yes" : "No"}</td>
                  <td>
                    {new Date(transaction.dateOfSale).toLocaleDateString()}
                  </td>
                  <td>
                    {transaction.image ? (
                      <img
                        src={transaction.image}
                        alt={transaction.title}
                        style={{
                          width: "100px",
                          height: "auto",
                          borderRadius: "5px",
                        }}
                      />
                    ) : (
                      "No Image Available"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
