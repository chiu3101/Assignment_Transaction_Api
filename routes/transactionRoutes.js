const express = require("express");
const axios = require("axios");
const Transaction = require("./models/Transaction");
const router = express.Router();

router.get("/initialize-data", async (req, res) => {
  try {
    await Transaction.deleteMany({});

    const response = await axios.get(process.env.API_URL);
    const transactions = response.data;

    await Transaction.insertMany(transactions);
    res.status(201).json({ message: "Data initialized successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to initialize data" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { page = 1, perPage = 10, search = "", month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const monthIndex = new Date(`${month} 1, 2021`).getMonth() + 1;

    let query = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
    };

    if (search) {
      const numberSearch = Number(search);

      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          ...(isNaN(numberSearch)
            ? []
            : [{ price: { $gte: numberSearch, $lt: numberSearch + 1 } }]),
        ],
      };
    }

    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    const totalTransactions = await Transaction.countDocuments(query);

    res.status(200).json({
      transactions,
      totalPages: Math.ceil(totalTransactions / perPage),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

router.get("/statistics", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const monthIndex = new Date(`${month} 1, 2021`).getMonth() + 1;

    const transactions = await Transaction.find({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
    });

    const totalSales = transactions.reduce(
      (sum, transaction) => sum + transaction.price,
      0
    );

    const totalSoldSales = transactions
      .filter((transaction) => transaction.sold)
      .reduce((sum, transaction) => sum + transaction.price, 0);

    const totalDeficitSales = transactions
      .filter((transaction) => !transaction.sold)
      .reduce((sum, transaction) => sum + transaction.price, 0);

    const soldItems = transactions.filter(
      (transaction) => transaction.sold
    ).length;
    const notSoldItems = transactions.length - soldItems;

    res.status(200).json({
      totalSales,
      totalSoldSales,
      totalDeficitSales,
      soldItems,
      notSoldItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
});

const validMonths = [
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

router.get("/bar-chart", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month || !validMonths.includes(month)) {
      return res.status(400).json({
        message: "A valid month is required (e.g., January, February)",
      });
    }

    const monthIndex = new Date(`${month} 1, 2021`).getMonth() + 1;

    const priceRanges = [
      { min: 0, max: 50 },
      { min: 51, max: 100 },
      { min: 101, max: 150 },
      { min: 151, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: Infinity },
    ];

    const counts = await Promise.all(
      priceRanges.map(async (range) => {
        const query = {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
        };
        if (range.max === Infinity) {
          query.price = { $gte: range.min };
        } else {
          query.price = { $gte: range.min, $lte: range.max };
        }
        const count = await Transaction.countDocuments(query);
        return count;
      })
    );

    const barChartData = priceRanges.map((range, index) => ({
      range: `${range.min} - ${range.max === Infinity ? "above" : range.max}`,
      count: counts[index],
    }));

    res.status(200).json(barChartData);
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    res.status(500).json({
      message: "Failed to fetch bar chart data",
      error: error.message,
    });
  }
});

router.get("/pie-chart", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month || !validMonths.includes(month)) {
      return res.status(400).json({
        message: "A valid month is required (e.g., January, February)",
      });
    }

    const monthIndex = new Date(`${month} 1, 2021`).getMonth() + 1;

    const pieChartData = await Transaction.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
    ]);

    res.status(200).json(pieChartData);
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({
      message: "Failed to fetch pie chart data",
      error: error.message,
    });
  }
});
router.get("/combined-data", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month || !validMonths.includes(month)) {
      return res.status(400).json({
        message: "A valid month is required (e.g., January, February)",
      });
    }
    const monthIndex = new Date(`${month} 1, 2021`).getMonth() + 1;

    const priceRanges = [
      { min: 0, max: 50 },
      { min: 51, max: 100 },
      { min: 101, max: 150 },
      { min: 151, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: Infinity },
    ];

    const transactions = await Transaction.find({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
    });

    const totalSales = transactions.reduce(
      (sum, transaction) => sum + transaction.price,
      0
    );
    const soldItems = transactions.filter((t) => t.sold).length;
    const notSoldItems = transactions.length - soldItems;

    const barChartData = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await Transaction.countDocuments({
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
          price: { $gte: range.min, $lte: range.max },
        });
        return count;
      })
    );

    const pieChartData = await Transaction.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const transactionDataWithImages = transactions.map((transaction) => ({
      title: transaction.title,
      price: transaction.price,
      sold: transaction.sold,
      dateOfSale: transaction.dateOfSale,
      category: transaction.category,
      imageUrl: transaction.image, // Include the image URL here
    }));

    res.status(200).json({
      transactions: transactionDataWithImages, // Return transactions with image URLs
      statistics: {
        totalSales,
        soldItems,
        notSoldItems,
      },
      barChartData,
      pieChartData,
    });
  } catch (error) {
    console.error("Error fetching combined data:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch combined data", error: error.message });
  }
});
module.exports = router;
