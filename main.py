import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

print("E-Commerce Sales Analysis Project Started!")

# Load dataset
df = pd.read_csv("data/sales_data.csv")

# -----------------------------
# 1. Basic Data Understanding
# -----------------------------

print("\nFirst 5 Rows:")
print(df.head())

print("\nDataset Shape:")
print(df.shape)

print("\nDataset Information:")
df.info()

print("\nMissing Values:")
print(df.isnull().sum())

print("\nDuplicate Rows:")
print(df.duplicated().sum())

print("\nStatistical Summary:")
print(df.describe())

# -----------------------------
# 2. Sales and Profit Analysis
# -----------------------------

total_sales = df["Sales"].sum()
total_profit = df["Profit"].sum()

print("\nTotal Sales:", total_sales)
print("Total Profit:", total_profit)

# -----------------------------
# 3. Product Analysis
# -----------------------------

product_sales = df.groupby("Product")["Sales"].sum()

print("\nSales by Product:")
print(product_sales)

top_product = product_sales.idxmax()

print("Top Selling Product:", top_product)

# -----------------------------
# 4. Category Analysis
# -----------------------------

category_sales = df.groupby("Category")["Sales"].sum()

print("\nSales by Category:")
print(category_sales)

top_category = category_sales.idxmax()

print("Top Category:", top_category)

# -----------------------------
# 5. Region Analysis
# -----------------------------

region_sales = df.groupby("Region")["Sales"].sum()

print("\nSales by Region:")
print(region_sales)

top_region = region_sales.idxmax()

print("Top Region:", top_region)

# -----------------------------
# 6. Monthly Analysis
# -----------------------------

df["Order_Date"] = pd.to_datetime(df["Order_Date"])

df["Month"] = df["Order_Date"].dt.month

monthly_sales = df.groupby("Month")["Sales"].sum()

print("\nMonthly Sales:")
print(monthly_sales)

best_month = monthly_sales.idxmax()
best_month_sales = monthly_sales.max()

month_names = {
    1: "January",
    2: "February",
    3: "March"
}

print("Best Sales Month:", month_names[best_month])
print("Best Month Sales:", best_month_sales)

# -----------------------------
# 7. Profit Analysis
# -----------------------------

product_profit = df.groupby("Product")["Profit"].sum()

print("\nProfit by Product:")
print(product_profit)

top_profit_product = product_profit.idxmax()
top_profit = product_profit.max()

print("Most Profitable Product:", top_profit_product)
print("Highest Profit:", top_profit)
# Product Sales Chart

plt.figure(figsize=(8, 5))

product_sales.plot(kind="bar")

plt.title("Sales by Product")
plt.xlabel("Product")
plt.ylabel("Sales")

plt.tight_layout()

plt.savefig("charts/product_sales.png")

plt.show()
# Category Sales Chart

plt.figure(figsize=(7, 7))

category_sales.plot(
    kind="pie",
    autopct="%1.1f%%"
)

plt.title("Sales by Category")
plt.ylabel("")

plt.tight_layout()

plt.savefig("charts/category_sales.png")

plt.show()
# Region Sales Chart

plt.figure(figsize=(8, 5))

region_sales.plot(kind="bar")

plt.title("Sales by Region")
plt.xlabel("Region")
plt.ylabel("Sales")

plt.tight_layout()

plt.savefig("charts/region_sales.png")

plt.show()
# Profit by Product Chart

plt.figure(figsize=(8, 5))

product_profit.plot(kind="bar")

plt.title("Profit by Product")
plt.xlabel("Product")
plt.ylabel("Profit")

plt.tight_layout()

plt.savefig("charts/product_profit.png")

plt.show()
# Profit Margin Analysis

df["Profit_Margin"] = (df["Profit"] / df["Sales"]) * 100

print("\nProfit Margin:")
print(df[["Product", "Sales", "Profit", "Profit_Margin"]])
# Top 3 Selling Products

top_3_products = product_sales.sort_values(ascending=False).head(3)

print("\nTop 3 Selling Products:")
print(top_3_products)
# Best and Worst Region Analysis

best_region = region_sales.idxmax()
best_region_sales = region_sales.max()

worst_region = region_sales.idxmin()
worst_region_sales = region_sales.min()

print("\nBest Region:", best_region)
print("Best Region Sales:", best_region_sales)

print("Worst Region:", worst_region)
print("Worst Region Sales:", worst_region_sales)
# Average Order Value (AOV)

average_order_value = df["Sales"].mean()

print("\nAverage Order Value:", average_order_value)
# Monthly Sales Growth Analysis

monthly_sales = monthly_sales.sort_index()

monthly_growth = monthly_sales.pct_change() * 100

print("\nMonthly Sales Growth:")
print(monthly_growth)
highest_growth_month = monthly_growth.idxmax()
highest_growth = monthly_growth.max()

print("\nHighest Sales Growth Month:", highest_growth_month)
print("Highest Sales Growth:", highest_growth, "%")
# Sales vs Profit Analysis

sales_profit = df.groupby("Product")[["Sales", "Profit"]].sum()

print("\nSales vs Profit:")
print(sales_profit)
top_sales_product = sales_profit["Sales"].idxmax()
top_profit_product = sales_profit["Profit"].idxmax()

print("\nHighest Sales Product:", top_sales_product)
print("Highest Profit Product:", top_profit_product)
# Sales vs Profit Comparison Chart

sales_profit.plot(
    kind="bar",
    figsize=(9, 5)
)

plt.title("Sales vs Profit by Product")
plt.xlabel("Product")
plt.ylabel("Amount")

plt.tight_layout()

plt.savefig("charts/sales_vs_profit.png")

plt.show()
# ==============================
# AUTOMATIC BUSINESS INSIGHTS
# ==============================

print("\n========== BUSINESS INSIGHTS ==========")

print("1. Top Selling Product:", top_product)

print("2. Most Profitable Product:", top_profit_product)

print("3. Top Category:", top_category)

print("4. Best Region:", best_region)

print("5. Worst Region:", worst_region)

print("6. Best Sales Month:", month_names[best_month])

print("7. Highest Sales Growth Month:", highest_growth_month)

print("8. Average Order Value:", average_order_value)

print("9. Highest Profit:", top_profit)

print("========================================")
# Monthly Sales Trend Chart

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

plt.savefig("charts/monthly_sales_trend.png")

plt.show()
# ==============================
# SAVE ANALYSIS REPORT
# ==============================

analysis_report = df.groupby("Product")[["Sales", "Profit"]].sum()

analysis_report["Profit_Margin"] = (
    analysis_report["Profit"] / analysis_report["Sales"]
) * 100

analysis_report.to_csv("product_analysis_report.csv")

print("\nAnalysis report saved successfully!")
