import pandas as pd
import matplotlib.pyplot as plt

# Load dataset
df = pd.read_csv("Data/sales_data.csv")

# Convert date
df["Order_Date"] = pd.to_datetime(df["Order_Date"])

# -----------------------------
# KPI Calculations
# -----------------------------

total_sales = df["Sales"].sum()
total_profit = df["Profit"].sum()
average_order_value = df["Sales"].mean()

product_sales = df.groupby("Product")["Sales"].sum()
category_sales = df.groupby("Category")["Sales"].sum()
region_sales = df.groupby("Region")["Sales"].sum()

top_product = product_sales.idxmax()
top_category = category_sales.idxmax()
top_region = region_sales.idxmax()

# Monthly Sales
df["Month"] = df["Order_Date"].dt.month
monthly_sales = df.groupby("Month")["Sales"].sum()

# -----------------------------
# Dashboard Information
# -----------------------------

print("\n================================")
print("       E-COMMERCE DASHBOARD")
print("================================")

print("Total Sales:", total_sales)
print("Total Profit:", total_profit)
print("Average Order Value:", average_order_value)

print("Top Product:", top_product)
print("Top Category:", top_category)
print("Top Region:", top_region)

print("================================")

# -----------------------------
# 1. Product Sales Chart
# -----------------------------

plt.figure(figsize=(8, 5))

product_sales.plot(kind="bar")

plt.title("Sales by Product")
plt.xlabel("Product")
plt.ylabel("Sales")

plt.tight_layout()
plt.show()

# -----------------------------
# 2. Category Sales Chart
# -----------------------------

plt.figure(figsize=(7, 7))

category_sales.plot(
    kind="pie",
    autopct="%1.1f%%"
)

plt.title("Sales by Category")
plt.ylabel("")

plt.show()

# -----------------------------
# 3. Region Sales Chart
# -----------------------------

plt.figure(figsize=(8, 5))

region_sales.plot(kind="bar")

plt.title("Sales by Region")
plt.xlabel("Region")
plt.ylabel("Sales")

plt.tight_layout()
plt.show()

# -----------------------------
# 4. Monthly Sales Trend
# -----------------------------

plt.figure(figsize=(9, 5))

plt.plot(
    monthly_sales.index,
    monthly_sales.values,
    marker="o"
)

plt.title("Monthly Sales Trend")
plt.xlabel("Month")
plt.ylabel("Sales")

plt.xticks(monthly_sales.index)
plt.grid(True)

plt.tight_layout()
plt.show()