// HomePage.jsx
import React, { useState, useEffect } from "react";
import "./HomePage.css";
import Lead from "./Components/Leads/AddLead";
import Quotation from "./Components/Quotation";
import AddCustomerForm from "./Components/Customer/AddCustomer";
import Order from "./Components/Order";
import ViewCustomers from "./Components/Customer/ViewCustomer";
import ViewLeads from "./Components/Leads/ViewLeads";
import ViewQuotations from "./Components/ViewQuotations";
import ViewOrders from "./Components/Order/ViewOrder";
import ViewFollowUps from "./Components/FollowUps/ViewFollowUp";
import Todo from "./Components/Todo";
import FollowUpPage from "./Components/FollowUps/AddFollowUp";

import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

const HomePage = ({ setCurrentPage, loggedInUser }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [customerCount, setCustomerCount] = useState(0);
  const [leadsCount, setLeadsCount] = useState(0);
  const [quotationsCount, setQuotationsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  const modules = ["Lead", "Quotation", "Order", "Customer", "Follow-Up", "ToDo",];
  const [expandedModule, setExpandedModule] = useState(null);
  const [activeModule, setActiveModule] = useState("Dashboard");
  const [activeSub, setActiveSub] = useState(null);

  // base URL for API calls: prefer explicit REACT_APP_API_URL, otherwise
  // use localhost in development, or relative paths in production
  const defaultBase = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';
  const baseUrl = process.env.REACT_APP_API_URL || defaultBase;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchCustomerCount = async () => {
    try {
      const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}/api/customers` : '/api/customers';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCustomerCount(Array.isArray(data) ? data.length : (data.count || 0));
      } else {
        console.error('Failed to fetch customers', res.status, res.statusText);
      }
    } catch (err) { console.error(err); }
  };
  const fetchLeadsCount = async () => {
    try {
      const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}/api/leads` : '/api/leads';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLeadsCount(Array.isArray(data) ? data.length : (data.count || 0));
      } else {
        console.error('Failed to fetch leads', res.status, res.statusText);
      }
    } catch (err) { console.error(err); }
  };
  const fetchQuotationsCount = async () => {
    try {
      const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}/api/quotations` : '/api/quotations';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setQuotationsCount(Array.isArray(data) ? data.length : (data.count || 0));
      } else {
        console.error('Failed to fetch quotations', res.status, res.statusText);
      }
    } catch (err) { console.error(err); }
  };
  const fetchOrdersCount = async () => {
    try {
      const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}/api/orders` : '/api/orders';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrdersCount(Array.isArray(data) ? data.length : (data.count || 0));
      } else {
        console.error('Failed to fetch orders', res.status, res.statusText);
      }
    } catch (err) { console.error(err); }
  };
  
  useEffect(() => {
    if (activeModule === "Dashboard") {
      fetchCustomerCount();
      fetchLeadsCount();
      fetchQuotationsCount();
      fetchOrdersCount();
    }
  }, [activeModule]);

  const toggleModule = (mod) => {
    if (expandedModule === mod) {
      setExpandedModule(null);
      setActiveModule('Dashboard');  // Return to dashboard when collapsing
    } else {
      setExpandedModule(mod);
    }
  };  const handleSelectSub = (mod, sub) => {
    setActiveModule(mod);
    setActiveSub(sub);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setCurrentPage("login");
    }
  };

  const chartData = [
    { name: "Customers", value: customerCount },
    { name: "Leads", value: leadsCount },
    { name: "Quotations", value: quotationsCount },
    { name: "Orders", value: ordersCount },
  ];

  const getIcon = (item) => {
    const icons = {
      Dashboard: "📊",
      Lead: "📈",
      Quotation: "📃",
      Order: "📦",
      Customer: "👥",
      "Follow-Up": "🔔",
      ToDo: "📝",
      Logout: "🚪",
    };
    return <span>{icons[item] || "🔹"}</span>;
  };

  const renderContent = () => {
    if (activeModule === "Dashboard") {
      return (
        <div className="dashboard-content">
          <p>📊 Welcome to Lingouda's Dashboard! Overview of activities & sales operations.</p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Customers</h3>
              <p className="stat-number">{customerCount}</p>
            </div>
            <div className="stat-card">
              <h3>Leads</h3>
              <p className="stat-number">{leadsCount}</p>
            </div>
            <div className="stat-card">
              <h3>Quotations</h3>
              <p className="stat-number">{quotationsCount}</p>
            </div>
            <div className="stat-card">
              <h3>Orders</h3>
              <p className="stat-number">{ordersCount}</p>
            </div>
          </div>

          <div className="charts-container">
            {/* Bar Chart */}
            <div className="chart-wrapper">
              <h3>Activity Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="chart-wrapper">
              <h3>Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7300'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    }

    switch (activeModule) {
      case "Lead":
        if (activeSub === "Add") return <Lead onAdded={fetchLeadsCount} />;
        if (activeSub === "View") return <ViewLeads onRefreshParent={fetchLeadsCount} />;
        return null;

      case "Quotation":
        if (activeSub === "Add") return <Quotation />;
        if (activeSub === "View") return <ViewQuotations onRefreshParent={fetchQuotationsCount} />;
        return null;

      case "Order":
        if (activeSub === "Add") return <Order />;
        if (activeSub === "View") return <ViewOrders onRefreshParent={fetchOrdersCount} />;
        return null;

      case "Customer":
        if (activeSub === "Add") return <AddCustomerForm onCustomerAdded={fetchCustomerCount} />;
        if (activeSub === "View") return <ViewCustomers onRefreshParent={fetchCustomerCount} />;
        return null;

      case "Follow-Up":
        if (activeSub === "Add") return <FollowUpPage onCustomerAdded={fetchCustomerCount} />;
        if (activeSub === "View") return <ViewFollowUps onRefreshParent={fetchCustomerCount} />;
        return null;

      case "ToDo":
        return <Todo />;

      default:
        return <div>Welcome — choose a module from the left.</div>;
    }
  };

  return (
    <div className={`container ${darkMode ? "dark" : "light"}`}>
      <div className={`top-bar ${darkMode ? "dark" : "light"}`}>
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? "⬅️" : "➡️"}
        </button>
        <h2 className="top-bar-title">Welcome, {loggedInUser?.name || "Admin"}</h2>
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-bar" />
        </div>
        <span style={{ marginLeft: "auto", color: "white" }}>{currentTime.toLocaleTimeString()}</span>
        <button className="dark-mode-button" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
        <span className="notification-bell">🔔</span>
      </div>

      <div className="content-wrapper">
        <div className={`sidebar ${sidebarOpen ? "expanded" : "collapsed"}`}>
          <h2 className="logo">{sidebarOpen ? "My Sale App" : "🔷"}</h2>
          <ul className="sidebar-list">
  {/* Dashboard */}
  <li
    className={`sidebar-list-item ${activeModule === "Dashboard" ? "active" : ""}`}
    onClick={() => { setActiveModule("Dashboard"); setActiveSub(null); setExpandedModule(null); }}
  >
    {getIcon("Dashboard")}
    {sidebarOpen && <span style={{ marginLeft: "10px" }}>Dashboard</span>}
  </li>

  {/* Modules */}
  {modules.map((mod) => (
    <li key={mod} className={`module-group`}>
      <div
        className={`sidebar-list-item module-item ${activeModule === mod && !activeSub ? "active" : ""}`}
        onClick={() => toggleModule(mod)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {getIcon(mod)}
          {sidebarOpen && <span style={{ marginLeft: "10px" }}>{mod}</span>}
        </div>
        {sidebarOpen && <span style={{ marginRight: 8 }}>{expandedModule === mod ? "▾" : "▸"}</span>}
      </div>

      {expandedModule === mod && (
        <ul className="submenu">
          <li
            className={`sidebar-subitem ${activeModule === mod && activeSub === "Add" ? "active" : ""}`}
            onClick={() => handleSelectSub(mod, "Add")}
          >
            ➕ {sidebarOpen && <span style={{ marginLeft: 8 }}>Add {mod}</span>}
          </li>
          <li
            className={`sidebar-subitem ${activeModule === mod && activeSub === "View" ? "active" : ""}`}
            onClick={() => handleSelectSub(mod, "View")}
          >
            🔎 {sidebarOpen && <span style={{ marginLeft: 8 }}>View {mod}s</span>}
          </li>
        </ul>
      )}
    </li>
  ))}

  {/* ToDo */}
  <li
    className={`sidebar-list-item ${activeModule === "ToDo" ? "active" : ""}`}
    onClick={() => { setActiveModule("ToDo"); setActiveSub(null); setExpandedModule(null); }}
  >
    {getIcon("ToDo")}
    {sidebarOpen && <span style={{ marginLeft: "10px" }}>To Do</span>}
  </li>

  {/* Logout at bottom */}
  <li
    className={`sidebar-list-item`}
    onClick={handleLogout}
    style={{ marginTop: "auto" }}
  >
    {getIcon("Logout")}
    {sidebarOpen && <span style={{ marginLeft: "10px" }}>Logout</span>}
  </li>
</ul>

        </div>

        <div className="main-content">
          <h1>{activeModule}{activeSub ? ` — ${activeSub}` : ""}</h1>

          {activeModule === "Dashboard" && (
            <div className="marquee-wrapper">
              <marquee behavior="scroll" direction="left" className="marquee">
                📢 Welcome to Sales's Dashboard! Stay updated with the latest information here.
              </marquee>
            </div>
          )}

          <div className="page-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
