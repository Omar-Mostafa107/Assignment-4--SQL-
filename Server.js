const express = require("express");
const mysql2 = require("mysql2/promise");

const app = express();

app.use(express.json());

const db = mysql2.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "store",
  waitForConnections: true,
  connectionLimit: 10,
});

// Test Database Connection شغال فل ✅

// db.getConnection()
//   .then((connection) => {
//     console.log("Database connected successfully");
//     connection.release();
//   })
//   .catch((error) => {
//     console.log("Database connection failed");
//     console.log(error.message);
//   });

// app.get("/", (req, res) => {
//   res.json({
//     message: "Store API is running",
//   });
// });

// Create Product
app.post("/products", async (req, res) => {
  try {
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;

    const [result] = await db.execute(
      `INSERT INTO Products
       (ProductName, Price, StockQuantity, SupplierID)
       VALUES (?, ?, ?, ?)`,
      [ProductName, Price, StockQuantity, SupplierID],
    );

    res.status(201).json({
      message: "Product created successfully",
      ProductID: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
});

// Get All Products
app.get("/products", async (req, res) => {
  try {
    const [products] = await db.execute("SELECT * FROM Products");

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving products",
      error: error.message,
    });
  }
});

// Get Product By ID
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await db.execute(
      "SELECT * FROM Products WHERE ProductID = ?",
      [id],
    );

    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(products[0]);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving product",
      error: error.message,
    });
  }
});

// Update Product
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { ProductName, Price, StockQuantity, SupplierID } = req.body;

    const [result] = await db.execute(
      `UPDATE Products
       SET ProductName = ?,
           Price = ?,
           StockQuantity = ?,
           SupplierID = ?
       WHERE ProductID = ?`,
      [ProductName, Price, StockQuantity, SupplierID, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
});

// Delete Product
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM Products WHERE ProductID = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
});

// Create Supplier
app.post("/suppliers", async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;

    const [result] = await db.execute(
      `INSERT INTO Suppliers
       (SupplierName, ContactNumber)
       VALUES (?, ?)`,
      [SupplierName, ContactNumber],
    );

    res.status(201).json({
      message: "Supplier created successfully",
      SupplierID: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating supplier",
      error: error.message,
    });
  }
});

// Get All Suppliers
app.get("/suppliers", async (req, res) => {
  try {
    const [suppliers] = await db.execute("SELECT * FROM Suppliers");

    res.json(suppliers);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving suppliers",
      error: error.message,
    });
  }
});

// Update Supplier
app.put("/suppliers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { SupplierName, ContactNumber } = req.body;

    const [result] = await db.execute(
      `UPDATE Suppliers
       SET SupplierName = ?,
           ContactNumber = ?
       WHERE SupplierID = ?`,
      [SupplierName, ContactNumber, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.json({
      message: "Supplier updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating supplier",
      error: error.message,
    });
  }
});

// Delete Supplier
app.delete("/suppliers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM Suppliers WHERE SupplierID = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.json({
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting supplier",
      error: error.message,
    });
  }
});

// Record Sale
app.post("/sales", async (req, res) => {
  try {
    const { ProductID, QuantitySold, SaleDate } = req.body;

    const [result] = await db.execute(
      `INSERT INTO Sales
       (ProductID, QuantitySold, SaleDate)
       VALUES (?, ?, ?)`,
      [ProductID, QuantitySold, SaleDate],
    );

    res.status(201).json({
      message: "Sale recorded successfully",
      SaleID: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error recording sale",
      error: error.message,
    });
  }
});

// Get All Sales
app.get("/sales", async (req, res) => {
  try {
    const [sales] = await db.execute("SELECT * FROM Sales");

    res.json(sales);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving sales",
      error: error.message,
    });
  }
});

app.get("/sales/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const [sales] = await db.execute(
      `SELECT *
       FROM Sales
       WHERE ProductID = ?`,
      [productId],
    );

    res.json(sales);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving product sales",
      error: error.message,
    });
  }
});

app.post("/database/add-category", async (req, res) => {
  try {
    await db.execute(
      `ALTER TABLE Products
       ADD COLUMN Category VARCHAR(100)`,
    );

    res.json({
      message: "Category column added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding Category column",
      error: error.message,
    });
  }
});

// Remove Category Column
app.delete("/database/remove-category", async (req, res) => {
  try {
    await db.execute(
      `ALTER TABLE Products
       DROP COLUMN Category`,
    );

    res.json({
      message: "Category column removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error removing Category column",
      error: error.message,
    });
  }
});

app.put("/database/contact-number", async (req, res) => {
  try {
    await db.execute(
      `ALTER TABLE Suppliers
       MODIFY COLUMN ContactNumber VARCHAR(15)`,
    );

    res.json({
      message: "ContactNumber changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error changing ContactNumber",
      error: error.message,
    });
  }
});

// Add NOT NULL To ProductName
app.put("/database/product-name-not-null", async (req, res) => {
  try {
    await db.execute(
      `ALTER TABLE Products
       MODIFY COLUMN ProductName TEXT NOT NULL`,
    );

    res.json({
      message: "ProductName is now NOT NULL",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error modifying ProductName",
      error: error.message,
    });
  }
});

// Insert FreshFoods + Products + Milk Sale
app.post("/database/insert-data", async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [supplier] = await connection.execute(
      `INSERT INTO Suppliers
       (SupplierName, ContactNumber)
       VALUES (?, ?)`,
      ["FreshFoods", "01001234567"],
    );

    const supplierID = supplier.insertId;

    const [milk] = await connection.execute(
      `INSERT INTO Products
       (ProductName, Price, StockQuantity, SupplierID)
       VALUES (?, ?, ?, ?)`,
      ["Milk", 15.0, 50, supplierID],
    );

    await connection.execute(
      `INSERT INTO Products
       (ProductName, Price, StockQuantity, SupplierID)
       VALUES (?, ?, ?, ?)`,
      ["Bread", 10.0, 30, supplierID],
    );

    await connection.execute(
      `INSERT INTO Products
       (ProductName, Price, StockQuantity, SupplierID)
       VALUES (?, ?, ?, ?)`,
      ["Eggs", 20.0, 40, supplierID],
    );

    await connection.execute(
      `INSERT INTO Sales
       (ProductID, QuantitySold, SaleDate)
       VALUES (?, ?, ?)`,
      [milk.insertId, 2, "2025-05-20"],
    );

    await connection.commit();

    res.json({
      message: "Required data inserted successfully",
    });
  } catch (error) {
    await connection.rollback();

    res.status(500).json({
      message: "Error inserting required data",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

// Update Bread Price To 25
app.put("/products/bread/price", async (req, res) => {
  try {
    const [result] = await db.execute(
      `UPDATE Products
       SET Price = 25.00
       WHERE ProductName = 'Bread'`,
    );

    res.json({
      message: "Bread price updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating Bread price",
      error: error.message,
    });
  }
});

// Delete Eggs
app.delete("/products/eggs", async (req, res) => {
  try {
    const [result] = await db.execute(
      `DELETE FROM Products
       WHERE ProductName = 'Eggs'`,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Eggs product not found",
      });
    }

    res.json({
      message: "Eggs deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Eggs",
      error: error.message,
    });
  }
});

// Total Quantity Sold For Each Product
app.get("/reports/total-sold", async (req, res) => {
  try {
    const [result] = await db.execute(
      `SELECT
          p.ProductID,
          p.ProductName,
          COALESCE(SUM(s.QuantitySold), 0) AS TotalQuantitySold
       FROM Products p
       LEFT JOIN Sales s
       ON p.ProductID = s.ProductID
       GROUP BY p.ProductID, p.ProductName`,
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error generating report",
      error: error.message,
    });
  }
});

// Product With Highest Stock
app.get("/reports/highest-stock", async (req, res) => {
  try {
    const [result] = await db.execute(
      `SELECT *
       FROM Products
       WHERE StockQuantity = (
         SELECT MAX(StockQuantity)
         FROM Products
       )`,
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error generating highest stock report",
      error: error.message,
    });
  }
});

// Suppliers Starting With F
app.get("/reports/suppliers-f", async (req, res) => {
  try {
    const [result] = await db.execute(
      `SELECT *
       FROM Suppliers
       WHERE SupplierName LIKE 'F%'`,
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error generating supplier report",
      error: error.message,
    });
  }
});

// Products Never Sold
app.get("/reports/never-sold", async (req, res) => {
  try {
    const [result] = await db.execute(
      `SELECT p.*
       FROM Products p
       LEFT JOIN Sales s
       ON p.ProductID = s.ProductID
       WHERE s.ProductID IS NULL`,
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error generating never-sold report",
      error: error.message,
    });
  }
});

// All Sales With Product Name
app.get("/reports/sales-details", async (req, res) => {
  try {
    const [result] = await db.execute(
      `SELECT
          p.ProductName,
          s.QuantitySold,
          s.SaleDate
       FROM Sales s
       INNER JOIN Products p
       ON s.ProductID = p.ProductID`,
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error generating sales report",
      error: error.message,
    });
  }
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
