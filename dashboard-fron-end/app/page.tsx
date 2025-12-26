"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import SalesDashboard from "../components/SalesDashboard";
import { SalesRecord } from "../types/sales";
import { Loading } from "../components/Loading";

export default function HomePage() {
 return (
    <>
    <h1>Home</h1>
    <p>Home page</p>

    <Link href="/sales">Sales</Link>
    <br />
    <Link href="/supplier-report">Supplier Report</Link>
    <br />
    <Link href="/products">Products</Link>
    <br />
    <Link href="/customers">Customers</Link>
    <br />
    <Link href="/orders">Orders</Link>
    <br />
    <Link href="/users">Users</Link>
    <br />
    <Link href="/dashboard">Dashboard</Link>

    </>
  );
}
