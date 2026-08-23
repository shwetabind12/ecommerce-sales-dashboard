import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);

  // LOGIN
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // FILTERS
  const [selectedProduct, setSelectedProduct] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");

  // LOAD CSV DATA
  useEffect(() => {
    fetch("/sales_data.csv")
      .then((response) => response.text())
      .then((csv) => {
        const rows = csv.trim().split("\n");
        const headers = rows[0].split(",");

        const result = rows.slice(1).map((row) => {
          const values = row.split(",");
          const obj = {};

          headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim();
          });

          obj.Sales = Number(obj.Sales) || 0;
          obj.Profit = Number(obj.Profit) || 0;
          obj.Quantity = Number(obj.Quantity) || 0;

          return obj;
        });

        setData(result);
      })
      .catch((error) => {
        console.error("CSV Error:", error);
      });
  }, []);

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">

          <div className="login-icon">🛒</div>

          <h1>E-Commerce Analytics</h1>

          <p>Login to access your dashboard</p>

          <input
            type="text"
            id="username"
            placeholder="Username"
          />

          <input
            type="password"
            id="password"
            placeholder="Password"
          />

          <button
            onClick={() => {
              const username =
                document.getElementById("username").value;

              const password =
                document.getElementById("password").value;

              if (
                username === "admin" &&
                password === "1234"
              ) {
                setIsLoggedIn(true);
              } else {
                alert("Invalid username or password");
              }
            }}
          >
            Login
          </button>

          <small>
            Demo Login: admin / 1234
          </small>

        </div>
      </div>
    );
  }

  // FILTER OPTIONS

  const products = [
    "All",
    ...new Set(data.map((item) => item.Product)),
  ];

  const categories = [
    "All",
    ...new Set(data.map((item) => item.Category)),
  ];

  const regions = [
    "All",
    ...new Set(data.map((item) => item.Region)),
  ];

  const months = [
    "All",
    ...new Set(
      data.map((item) =>
        new Date(item.Order_Date).toLocaleString("en-US", {
          month: "long",
        })
      )
    ),
  ];

  // FILTERED DATA

  const filteredData = data.filter((item) => {
    const productMatch =
      selectedProduct === "All" ||
      item.Product === selectedProduct;

    const categoryMatch =
      selectedCategory === "All" ||
      item.Category === selectedCategory;

    const regionMatch =
      selectedRegion === "All" ||
      item.Region === selectedRegion;

    const monthMatch =
      selectedMonth === "All" ||
      new Date(item.Order_Date).toLocaleString("en-US", {
        month: "long",
      }) === selectedMonth;

    return (
      productMatch &&
      categoryMatch &&
      regionMatch &&
      monthMatch
    );
  });

  // BASIC CALCULATIONS

  const totalSales = filteredData.reduce(
    (sum, item) => sum + item.Sales,
    0
  );

  const totalProfit = filteredData.reduce(
    (sum, item) => sum + item.Profit,
    0
  );

  const averageOrder =
    filteredData.length > 0
      ? totalSales / filteredData.length
      : 0;

  // TOP PRODUCT

  const productTotals = {};

  filteredData.forEach((item) => {
    if (!productTotals[item.Product]) {
      productTotals[item.Product] = 0;
    }

    productTotals[item.Product] += item.Sales;
  });

  const topProduct =
    Object.keys(productTotals).length > 0
      ? Object.keys(productTotals).reduce((a, b) =>
          productTotals[a] > productTotals[b] ? a : b
        )
      : "-";

  // TOP CATEGORY

  const categoryTotals = {};

  filteredData.forEach((item) => {
    if (!categoryTotals[item.Category]) {
      categoryTotals[item.Category] = 0;
    }

    categoryTotals[item.Category] += item.Sales;
  });

  const topCategory =
    Object.keys(categoryTotals).length > 0
      ? Object.keys(categoryTotals).reduce((a, b) =>
          categoryTotals[a] > categoryTotals[b] ? a : b
        )
      : "-";

  const topCategoryPercentage =
    totalSales > 0 && topCategory !== "-"
      ? (
          (categoryTotals[topCategory] / totalSales) *
          100
        ).toFixed(1)
      : "0.0";

  // TOP REGION

  const regionTotals = {};

  filteredData.forEach((item) => {
    if (!regionTotals[item.Region]) {
      regionTotals[item.Region] = 0;
    }

    regionTotals[item.Region] += item.Sales;
  });

  const topRegion =
    Object.keys(regionTotals).length > 0
      ? Object.keys(regionTotals).reduce((a, b) =>
          regionTotals[a] > regionTotals[b] ? a : b
        )
      : "-";

  // PRODUCT SALES

  const productSales = Object.entries(productTotals).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // REGION SALES

  const regionSales = Object.entries(regionTotals).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // PRODUCT PROFIT

  const profitTotals = {};

  filteredData.forEach((item) => {
    if (!profitTotals[item.Product]) {
      profitTotals[item.Product] = 0;
    }

    profitTotals[item.Product] += item.Profit;
  });

  const profitData = Object.entries(profitTotals).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // MAX VALUES

  const maxProduct =
    productSales.length > 0
      ? Math.max(...productSales.map((item) => item.value))
      : 1;

  const maxRegion =
    regionSales.length > 0
      ? Math.max(...regionSales.map((item) => item.value))
      : 1;

  const maxProfit =
    profitData.length > 0
      ? Math.max(...profitData.map((item) => item.value))
      : 1;

  // RESET FILTERS

  const resetFilters = () => {
    setSelectedProduct("All");
    setSelectedCategory("All");
    setSelectedRegion("All");
    setSelectedMonth("All");
  };

  // DASHBOARD

  return (
    <div className="dashboard">

      {/* HEADER */}

      <header className="header">

        <div>
          <h1>🛒 E-Commerce Dashboard</h1>
          <p>Sales & Profit Analysis</p>
        </div>

        <div className="date-box">
          📊 Business Analytics

          <button
            className="logout-btn"
            onClick={() => {
              setIsLoggedIn(false);
              resetFilters();
            }}
          >
            Logout
          </button>
        </div>

      </header>

      {/* FILTERS */}

      <section className="filters">

        <div className="filter-box">
          <label>Product</label>

          <select
            value={selectedProduct}
            onChange={(e) =>
              setSelectedProduct(e.target.value)
            }
          >
            {products.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <label>Category</label>

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <label>Region</label>

          <select
            value={selectedRegion}
            onChange={(e) =>
              setSelectedRegion(e.target.value)
            }
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <label>Month</label>

          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(e.target.value)
            }
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <button
          className="reset-btn"
          onClick={resetFilters}
        >
          Reset Filters
        </button>

      </section>

      {/* SUMMARY CARDS */}

      <section className="cards">

        <div className="card sales-card">
          <div className="card-icon">💰</div>

          <div>
            <p>Total Sales</p>

            <h2>
              ₹{totalSales.toLocaleString("en-IN")}
            </h2>

            <span>Overall Revenue</span>
          </div>
        </div>

        <div className="card profit-card">
          <div className="card-icon">📈</div>

          <div>
            <p>Total Profit</p>

            <h2>
              ₹{totalProfit.toLocaleString("en-IN")}
            </h2>

            <span>Overall Profit</span>
          </div>
        </div>

        <div className="card order-card">
          <div className="card-icon">🛍️</div>

          <div>
            <p>Average Order</p>

            <h2>
              ₹{Math.round(
                averageOrder
              ).toLocaleString("en-IN")}
            </h2>

            <span>Average Order Value</span>
          </div>
        </div>

        <div className="card product-card">
          <div className="card-icon">🏆</div>

          <div>
            <p>Top Product</p>

            <h2>{topProduct}</h2>

            <span>Best Selling Product</span>
          </div>
        </div>

      </section>

      {/* INFORMATION CARDS */}

      <section className="info-cards">

        <div className="info-card">
          <span>🏆 Top Category</span>

          <strong>{topCategory}</strong>

          <small>
            {topCategoryPercentage}% of total sales
          </small>
        </div>

        <div className="info-card">
          <span>🌎 Top Region</span>

          <strong>{topRegion}</strong>

          <small>Highest regional sales</small>
        </div>

        <div className="info-card">
          <span>💰 Total Profit</span>

          <strong>
            ₹{totalProfit.toLocaleString("en-IN")}
          </strong>

          <small>Overall business profit</small>
        </div>

      </section>

      {/* PRODUCT + REGION CHARTS */}

      <section className="chart-grid">

        <div className="chart-box">

          <h2>📊 Sales by Product</h2>

          <p className="chart-subtitle">
            Product-wise sales performance
          </p>

          <div className="bars">

            {productSales.map((item) => (

              <div
                className="bar-row"
                key={item.name}
              >

                <div className="bar-label">

                  <span>{item.name}</span>

                  <b>
                    ₹{item.value.toLocaleString("en-IN")}
                  </b>

                </div>

                <div className="bar-background">

                  <div
                    className="bar"
                    style={{
                      width: `${
                        (item.value / maxProduct) * 100
                      }%`,
                    }}
                  ></div>

                </div>

              </div>

            ))}

          </div>

        </div>

        <div className="chart-box">

          <h2>🌎 Sales by Region</h2>

          <p className="chart-subtitle">
            Regional sales performance
          </p>

          <div className="bars">

            {regionSales.map((item) => (

              <div
                className="bar-row"
                key={item.name}
              >

                <div className="bar-label">

                  <span>{item.name}</span>

                  <b>
                    ₹{item.value.toLocaleString("en-IN")}
                  </b>

                </div>

                <div className="bar-background">

                  <div
                    className="bar region-bar"
                    style={{
                      width: `${
                        (item.value / maxRegion) * 100
                      }%`,
                    }}
                  ></div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* PROFIT CHART */}

      <section className="chart-box profit-chart">

        <h2>💹 Profit by Product</h2>

        <p className="chart-subtitle">
          Product-wise profit analysis
        </p>

        <div className="profit-bars">

          {profitData.map((item) => (

            <div
              className="profit-item"
              key={item.name}
            >

              <div className="profit-value">
                ₹{item.value.toLocaleString("en-IN")}
              </div>

              <div
                className="profit-column"
                style={{
                  height: `${
                    (item.value / maxProfit) * 220
                  }px`,
                }}
              ></div>

              <span>{item.name}</span>

            </div>

          ))}

        </div>

      </section>

      {/* CATEGORY SECTION */}

      <section className="category-section">

        <div className="category-card">

          <h2>📦 Sales by Category</h2>

          <div className="category-content">

            <div className="donut">

              <div className="donut-center">

                <strong>
                  {topCategoryPercentage}%
                </strong>

                <span>{topCategory}</span>

              </div>

            </div>

            <div className="category-details">

              {Object.entries(categoryTotals).map(
                ([name, value]) => (

                  <div
                    className="category-item"
                    key={name}
                  >

                    <span>
                      <i className="dot"></i>
                      {name}
                    </span>

                    <strong>
                      {totalSales > 0
                        ? (
                            (value / totalSales) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

        {/* BUSINESS INSIGHTS */}

        <div className="insight-card">

          <h2>💡 Business Insights</h2>

          <div className="insight">

            <span>🥇</span>

            <p>
              <b>{topProduct}</b> is the best-selling
              product.
            </p>

          </div>

          <div className="insight">

            <span>📦</span>

            <p>
              <b>{topCategory}</b> dominates category
              sales.
            </p>

          </div>

          <div className="insight">

            <span>🌎</span>

            <p>
              <b>{topRegion}</b> region generates the
              highest sales.
            </p>

          </div>

          <div className="insight">

            <span>💰</span>

            <p>
              Total business profit is{" "}
              <b>
                ₹{totalProfit.toLocaleString("en-IN")}
              </b>.
            </p>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer>

        <p>
          E-Commerce Sales Analysis Dashboard
        </p>

        <span>
          Built with React • Data Analytics • Visualization
        </span>

      </footer>

    </div>
  );
}

export default App;