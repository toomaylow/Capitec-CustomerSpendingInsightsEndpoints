import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  ShoppingCart, Film, Car, Utensils, ShoppingBag, Zap,
  TrendingUp, TrendingDown, CreditCard, Target, Bell,
  ChevronDown, Search, Filter, ArrowUpRight, ArrowDownRight,
  Calendar, BarChart2, PieChart as PieIcon, List, User,
  Home, Settings, LogOut, Menu, X, RefreshCw
} from "lucide-react";

// ─── MOCK DATA (from CustomerSpendingInsightsEndpoints.md) ─────────────────
const CUSTOMER_PROFILE = {
  customerId: "12345",
  name: "John Doe",
  email: "john.doe@email.com",
  joinDate: "2023-01-15",
  accountType: "premium",
  totalSpent: 15420.50,
  currency: "ZAR"
};

const SPENDING_SUMMARY = {
  period: "30d",
  totalSpent: 4250.75,
  transactionCount: 47,
  averageTransaction: 90.44,
  topCategory: "Groceries",
  comparedToPrevious: { spentChange: 12.5, transactionChange: -3.2 }
};

const SPENDING_CATEGORIES = {
  dateRange: { startDate: "2024-08-16", endDate: "2024-09-16" },
  totalAmount: 4250.75,
  categories: [
    { name: "Groceries",      amount: 1250.30, percentage: 29.4, transactionCount: 15, color: "#FF6B6B", icon: "shopping-cart" },
    { name: "Entertainment",  amount: 890.20,  percentage: 20.9, transactionCount: 8,  color: "#4ECDC4", icon: "film" },
    { name: "Transportation", amount: 680.45,  percentage: 16.0, transactionCount: 12, color: "#45B7D1", icon: "car" },
    { name: "Dining",         amount: 520.30,  percentage: 12.2, transactionCount: 9,  color: "#F7DC6F", icon: "utensils" },
    { name: "Shopping",       amount: 450.80,  percentage: 10.6, transactionCount: 6,  color: "#BB8FCE", icon: "shopping-bag" },
    { name: "Utilities",      amount: 458.70,  percentage: 10.8, transactionCount: 3,  color: "#85C1E9", icon: "zap" }
  ]
};

const MONTHLY_TRENDS = {
  trends: [
    { month: "2024-01", totalSpent: 3890.25, transactionCount: 42, averageTransaction: 92.62 },
    { month: "2024-02", totalSpent: 4150.80, transactionCount: 38, averageTransaction: 109.23 },
    { month: "2024-03", totalSpent: 3750.60, transactionCount: 45, averageTransaction: 83.35 },
    { month: "2024-04", totalSpent: 4200.45, transactionCount: 39, averageTransaction: 107.70 },
    { month: "2024-05", totalSpent: 3980.30, transactionCount: 44, averageTransaction: 90.46 },
    { month: "2024-06", totalSpent: 4250.75, transactionCount: 47, averageTransaction: 90.44 }
  ]
};

const TRANSACTIONS = [
  { id: "txn_123456", date: "2024-09-16T14:30:00Z", merchant: "Pick n Pay",     category: "Groceries",      amount: 245.80, description: "Weekly groceries",        paymentMethod: "Credit Card",  icon: "shopping-cart", categoryColor: "#FF6B6B" },
  { id: "txn_123457", date: "2024-09-15T10:15:00Z", merchant: "Netflix",         category: "Entertainment",  amount: 199.00, description: "Monthly subscription",    paymentMethod: "Debit Order",  icon: "film",          categoryColor: "#4ECDC4" },
  { id: "txn_123458", date: "2024-09-14T08:45:00Z", merchant: "Uber",            category: "Transportation", amount: 85.50,  description: "Ride to airport",         paymentMethod: "Credit Card",  icon: "car",           categoryColor: "#45B7D1" },
  { id: "txn_123459", date: "2024-09-13T19:20:00Z", merchant: "Nando's",         category: "Dining",         amount: 320.40, description: "Family dinner",           paymentMethod: "Credit Card",  icon: "utensils",      categoryColor: "#F7DC6F" },
  { id: "txn_123460", date: "2024-09-12T11:00:00Z", merchant: "Woolworths",      category: "Shopping",       amount: 450.80, description: "Clothing purchase",       paymentMethod: "Credit Card",  icon: "shopping-bag",  categoryColor: "#BB8FCE" },
  { id: "txn_123461", date: "2024-09-11T09:30:00Z", merchant: "Eskom",           category: "Utilities",      amount: 458.70, description: "Monthly electricity",     paymentMethod: "Debit Order",  icon: "zap",           categoryColor: "#85C1E9" },
  { id: "txn_123462", date: "2024-09-10T14:00:00Z", merchant: "Checkers",        category: "Groceries",      amount: 312.60, description: "Grocery top-up",         paymentMethod: "Credit Card",  icon: "shopping-cart", categoryColor: "#FF6B6B" },
  { id: "txn_123463", date: "2024-09-09T16:45:00Z", merchant: "DStv",            category: "Entertainment",  amount: 899.00, description: "Annual subscription",     paymentMethod: "Debit Order",  icon: "film",          categoryColor: "#4ECDC4" },
  { id: "txn_123464", date: "2024-09-08T07:15:00Z", merchant: "Shell Garage",    category: "Transportation", amount: 620.00, description: "Fuel fill-up",           paymentMethod: "Credit Card",  icon: "car",           categoryColor: "#45B7D1" },
  { id: "txn_123465", date: "2024-09-07T12:30:00Z", merchant: "Vida e Caffè",    category: "Dining",         amount: 95.00,  description: "Coffee & lunch",          paymentMethod: "Credit Card",  icon: "utensils",      categoryColor: "#F7DC6F" }
];

const GOALS = {
  goals: [
    { id: "goal_001", category: "Entertainment", monthlyBudget: 1000.00, currentSpent: 650.30, percentageUsed: 65.03, daysRemaining: 12, status: "on_track" },
    { id: "goal_002", category: "Groceries",     monthlyBudget: 1500.00, currentSpent: 1450.80, percentageUsed: 96.72, daysRemaining: 12, status: "warning"  }
  ]
};

// ─── HELPERS ───────────────────────────────────────────────────────────────
const fmt = (n) => `R ${Number(n).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtShort = (n) => `R ${Number(n).toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtMonth = (m) => { const d = new Date(m + "-01"); return d.toLocaleString("default", { month: "short" }); };
const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });

const ICON_MAP = {
  "shopping-cart": ShoppingCart,
  "film": Film,
  "car": Car,
  "utensils": Utensils,
  "shopping-bag": ShoppingBag,
  "zap": Zap
};

const CategoryIcon = ({ icon, size = 18, className = "" }) => {
  const Comp = ICON_MAP[icon] || ShoppingCart;
  return <Comp size={size} className={className} />;
};

// ─── CAPITEC BRAND COLORS ──────────────────────────────────────────────────
// Primary: Capitec Blue #003DA5 / Red #E4002B  Secondary: light grays
const CAP_BLUE = "#003DA5";
const CAP_RED  = "#E4002B";
const CAP_DARK = "#001F5B";

// ─── ANIMATED COUNTER ──────────────────────────────────────────────────────
const AnimatedNumber = ({ value, prefix = "", suffix = "", decimals = 2 }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);
  return <>{prefix}{display.toLocaleString("en-ZA", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
};

// ─── CUSTOM TOOLTIP ────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 16px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
      <p style={{ margin: 0, fontSize: 12, color: "#6b7280", fontWeight: 600, letterSpacing: 0.5 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: p.color || CAP_BLUE }}>
          {fmtShort(p.value)}
        </p>
      ))}
    </div>
  );
};

// ─── PROGRESS BAR ──────────────────────────────────────────────────────────
const ProgressBar = ({ pct, color, status }) => {
  const barColor = status === "warning" ? CAP_RED : status === "exceeded" ? "#7f1d1d" : color || CAP_BLUE;
  return (
    <div style={{ background: "#f1f5f9", borderRadius: 999, height: 8, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: barColor, borderRadius: 999, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("30d");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chartType, setChartType] = useState("area");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const filteredTx = TRANSACTIONS.filter(t => {
    const matchCat = categoryFilter === "all" || t.category === categoryFilter;
    const matchSearch = t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const trendData = MONTHLY_TRENDS.trends.map(t => ({ ...t, monthLabel: fmtMonth(t.month) }));

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* ── TOP NAV ── */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 8px rgba(0,61,165,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", padding: 6 }}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Capitec Logo — text-based faithful recreation */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="https://avatars.githubusercontent.com/u/109590421?s=280&v=4"
              alt="Capitec"
              width={36}
              height={36}
              style={{ borderRadius: 18, background: '#fff', display: 'block' }}
            />
            <span style={{ fontWeight: 800, fontSize: 14, color: '#000', letterSpacing: -0.5 }}>CAPITEC</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "#f1f5f9", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <Search size={15} color="#94a3b8" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search transactions…"
              style={{ border: "none", background: "none", outline: "none", fontSize: 13, color: "#374151", width: 160 }}
            />
          </div>

          <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 8 }}>
            <Bell size={20} color="#64748b" />
            <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, background: CAP_RED, borderRadius: "50%", border: "2px solid #fff" }} />
          </button>

          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${CAP_BLUE}, ${CAP_RED})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>
            JD
          </div>
        </div>
      </nav>

      <div style={{ display: "flex", flex: 1 }}>
        {/* ── SIDEBAR ── */}
        <aside style={{ width: sidebarOpen ? 240 : 68, background: "#fff", borderRight: "1px solid #e5e7eb", transition: "width 0.25s ease", overflow: "hidden", flexShrink: 0, display: "flex", flexDirection: "column", position: "sticky", top: 64, height: "calc(100vh - 64px)" }}>
          {[
            { id: "overview",      icon: Home,     label: "Overview" },
            { id: "trends",        icon: BarChart2, label: "Trends" },
            { id: "categories",    icon: PieIcon,   label: "Categories" },
            { id: "transactions",  icon: List,      label: "Transactions" },
            { id: "goals",         icon: Target,    label: "Goals" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 20px", border: "none", cursor: "pointer",
                background: activeTab === id ? `linear-gradient(90deg, rgba(0,61,165,0.08), transparent)` : "none",
                color: activeTab === id ? CAP_BLUE : "#64748b",
                fontFamily: "inherit", fontWeight: activeTab === id ? 700 : 500,
                fontSize: 14, textAlign: "left", whiteSpace: "nowrap",
                borderLeft: activeTab === id ? `3px solid ${CAP_BLUE}` : "3px solid transparent",
                transition: "all 0.15s"
              }}
            >
              <Icon size={20} style={{ flexShrink: 0 }} />
              {sidebarOpen && label}
            </button>
          ))}

          <div style={{ flex: 1 }} />

          <button style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", border: "none", cursor: "pointer", background: "none", color: "#94a3b8", fontFamily: "inherit", fontWeight: 500, fontSize: 14, whiteSpace: "nowrap" }}>
            <Settings size={20} style={{ flexShrink: 0 }} />
            {sidebarOpen && "Settings"}
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px 20px", border: "none", cursor: "pointer", background: "none", color: "#94a3b8", fontFamily: "inherit", fontWeight: 500, fontSize: 14, whiteSpace: "nowrap" }}>
            <LogOut size={20} style={{ flexShrink: 0 }} />
            {sidebarOpen && "Log out"}
          </button>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>

          {/* HEADER ROW */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: CAP_DARK, letterSpacing: -0.5 }}>
                {activeTab === "overview" ? "Spending Overview" :
                 activeTab === "trends" ? "Monthly Trends" :
                 activeTab === "categories" ? "Category Breakdown" :
                 activeTab === "transactions" ? "Transactions" : "Spending Goals"}
              </h1>
              <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: 14 }}>
                Welcome back, <span style={{ color: CAP_BLUE, fontWeight: 600 }}>{CUSTOMER_PROFILE.name}</span> · {CUSTOMER_PROFILE.accountType.charAt(0).toUpperCase() + CUSTOMER_PROFILE.accountType.slice(1)} Account
              </p>
            </div>

            {/* Period Selector */}
            <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4, gap: 2 }}>
              {[{ v: "7d", l: "7D" }, { v: "30d", l: "30D" }, { v: "90d", l: "90D" }, { v: "1y", l: "1Y" }].map(({ v, l }) => (
                <button key={v} onClick={() => setPeriod(v)} style={{
                  padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: period === v ? "#fff" : "transparent",
                  color: period === v ? CAP_BLUE : "#64748b",
                  fontWeight: period === v ? 700 : 500,
                  fontSize: 13, fontFamily: "inherit",
                  boxShadow: period === v ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.15s"
                }}>{l}</button>
              ))}
            </div>
          </div>

          {/* ════ OVERVIEW TAB ════ */}
          {activeTab === "overview" && (
            <div>
              {/* KPI CARDS */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
                {[
                  {
                    label: "Total Spent (30d)", value: SPENDING_SUMMARY.totalSpent, change: SPENDING_SUMMARY.comparedToPrevious.spentChange,
                    accent: CAP_BLUE, icon: <CreditCard size={20} />, isCurrency: true
                  },
                  {
                    label: "Transactions", value: SPENDING_SUMMARY.transactionCount, change: SPENDING_SUMMARY.comparedToPrevious.transactionChange,
                    accent: "#4ECDC4", icon: <RefreshCw size={20} />, isCurrency: false, decimals: 0
                  },
                  {
                    label: "Avg. Transaction", value: SPENDING_SUMMARY.averageTransaction, change: null,
                    accent: "#BB8FCE", icon: <BarChart2 size={20} />, isCurrency: true
                  },
                  {
                    label: "Total Lifetime Spend", value: CUSTOMER_PROFILE.totalSpent, change: null,
                    accent: CAP_RED, icon: <TrendingUp size={20} />, isCurrency: true
                  }
                ].map((kpi, i) => (
                  <div key={i} style={{
                    background: "#fff", borderRadius: 16, padding: "22px 24px",
                    boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    animation: `fadeUp 0.4s ease ${i * 80}ms both`
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.06)"; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600, letterSpacing: 0.2 }}>{kpi.label}</span>
                      <span style={{ background: `${kpi.accent}18`, color: kpi.accent, borderRadius: 8, padding: "6px 8px", display: "flex" }}>{kpi.icon}</span>
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: CAP_DARK, letterSpacing: -0.5, fontVariantNumeric: "tabular-nums" }}>
                      {kpi.isCurrency ? "R " : ""}
                      <AnimatedNumber value={kpi.value} decimals={kpi.decimals ?? 2} />
                    </div>
                    {kpi.change !== null && (
                      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: kpi.change >= 0 ? CAP_RED : "#10b981", fontWeight: 600 }}>
                        {kpi.change >= 0 ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                        {Math.abs(kpi.change)}% vs last period
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* AREA CHART + PIE */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, marginBottom: 24 }}>
                <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: CAP_DARK }}>Spending Trend</h3>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["area", "bar"].map(ct => (
                        <button key={ct} onClick={() => setChartType(ct)} style={{
                          padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontFamily: "inherit",
                          background: chartType === ct ? CAP_BLUE : "#f1f5f9",
                          color: chartType === ct ? "#fff" : "#64748b", fontWeight: 600
                        }}>{ct.charAt(0).toUpperCase() + ct.slice(1)}</button>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    {chartType === "area" ? (
                      <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={CAP_BLUE} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={CAP_BLUE} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="monthLabel" tick={{ fontSize: 12, fill: "#94a3b8", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} tickFormatter={v => `R${(v/1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="totalSpent" stroke={CAP_BLUE} strokeWidth={2.5} fill="url(#blueGrad)" dot={{ fill: CAP_BLUE, strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: CAP_BLUE }} />
                      </AreaChart>
                    ) : (
                      <BarChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="monthLabel" tick={{ fontSize: 12, fill: "#94a3b8", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} tickFormatter={v => `R${(v/1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="totalSpent" fill={CAP_BLUE} radius={[6, 6, 0, 0]} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>

                <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: CAP_DARK }}>By Category</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={SPENDING_CATEGORIES.categories} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="amount" stroke="none">
                        {SPENDING_CATEGORIES.categories.map((cat, i) => <Cell key={i} fill={cat.color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [fmt(v), ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                    {SPENDING_CATEGORIES.categories.slice(0, 4).map((cat, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
                        <span style={{ flex: 1, color: "#374151", fontWeight: 500 }}>{cat.name}</span>
                        <span style={{ color: "#64748b", fontFamily: "DM Mono", fontSize: 12 }}>{cat.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RECENT TRANSACTIONS */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: CAP_DARK }}>Recent Transactions</h3>
                  <button onClick={() => setActiveTab("transactions")} style={{ background: "none", border: "none", color: CAP_BLUE, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>View all →</button>
                </div>
                {TRANSACTIONS.slice(0, 5).map((tx, i) => (
                  <div key={tx.id} style={{ display: "flex", alignItems: "center", padding: "12px 0", borderBottom: i < 4 ? "1px solid #f8fafc" : "none" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: `${tx.categoryColor}18`, display: "flex", alignItems: "center", justifyContent: "center", color: tx.categoryColor, marginRight: 14, flexShrink: 0 }}>
                      <CategoryIcon icon={tx.icon} size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 600, color: CAP_DARK, fontSize: 14 }}>{tx.merchant}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>{tx.category} · {fmtDate(tx.date)}</p>
                    </div>
                    <span style={{ fontWeight: 700, color: CAP_DARK, fontFamily: "DM Mono", fontSize: 15 }}>−{fmt(tx.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ TRENDS TAB ════ */}
          {activeTab === "trends" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                <h3 style={{ margin: "0 0 24px", fontSize: 17, fontWeight: 700, color: CAP_DARK }}>Monthly Spend Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="blueG2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={CAP_BLUE} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={CAP_BLUE} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="monthLabel" tick={{ fontSize: 13, fill: "#94a3b8", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} tickFormatter={v => `R${(v/1000).toFixed(1)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="totalSpent" stroke={CAP_BLUE} strokeWidth={3} fill="url(#blueG2)" dot={{ fill: "#fff", stroke: CAP_BLUE, strokeWidth: 2.5, r: 5 }} activeDot={{ r: 7, fill: CAP_BLUE }} name="Total Spent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                  <h3 style={{ margin: "0 0 24px", fontSize: 17, fontWeight: 700, color: CAP_DARK }}>Transaction Count</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={trendData} margin={{ left: -10, right: 0, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="monthLabel" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="transactionCount" fill={CAP_RED} radius={[5, 5, 0, 0]} name="Transactions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                  <h3 style={{ margin: "0 0 24px", fontSize: 17, fontWeight: 700, color: CAP_DARK }}>Avg. Transaction Value</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={trendData} margin={{ left: -10, right: 0, top: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="purpleG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#BB8FCE" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#BB8FCE" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="monthLabel" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `R${v}`} />
                      <Tooltip formatter={v => [fmt(v), "Avg"]} />
                      <Area type="monotone" dataKey="averageTransaction" stroke="#BB8FCE" strokeWidth={2.5} fill="url(#purpleG)" dot={{ fill: "#BB8FCE", strokeWidth: 0, r: 4 }} name="Avg Transaction" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ════ CATEGORIES TAB ════ */}
          {activeTab === "categories" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: CAP_DARK }}>Spend Distribution</h3>
                  <p style={{ margin: "0 0 20px", color: "#94a3b8", fontSize: 13 }}>{SPENDING_CATEGORIES.dateRange.startDate} – {SPENDING_CATEGORIES.dateRange.endDate}</p>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={SPENDING_CATEGORIES.categories} cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={4} dataKey="amount" stroke="none" label={({ name, percentage }) => `${percentage}%`} labelLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}>
                        {SPENDING_CATEGORIES.categories.map((cat, i) => <Cell key={i} fill={cat.color} />)}
                      </Pie>
                      <Tooltip formatter={v => [fmt(v), ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                  <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 700, color: CAP_DARK }}>Category Details</h3>
                  {SPENDING_CATEGORIES.categories.map((cat, i) => (
                    <div key={i} style={{ marginBottom: 18 }}>
                      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ width: 32, height: 32, borderRadius: 8, background: `${cat.color}20`, display: "flex", alignItems: "center", justifyContent: "center", color: cat.color, marginRight: 10, flexShrink: 0 }}>
                          <CategoryIcon icon={cat.icon} size={15} />
                        </span>
                        <span style={{ flex: 1, fontWeight: 600, color: CAP_DARK, fontSize: 14 }}>{cat.name}</span>
                        <span style={{ fontFamily: "DM Mono", fontSize: 14, fontWeight: 600, color: CAP_DARK }}>{fmt(cat.amount)}</span>
                      </div>
                      <ProgressBar pct={cat.percentage} color={cat.color} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 12, color: "#94a3b8" }}>
                        <span>{cat.transactionCount} transactions</span>
                        <span>{cat.percentage}% of total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category cards grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                {SPENDING_CATEGORIES.categories.map((cat, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", border: `1px solid ${cat.color}30`, transition: "transform 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = ""}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${cat.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: cat.color, marginBottom: 14 }}>
                      <CategoryIcon icon={cat.icon} size={22} />
                    </div>
                    <p style={{ margin: "0 0 4px", fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{cat.name}</p>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: CAP_DARK, fontFamily: "DM Mono", letterSpacing: -0.3 }}>{fmt(cat.amount)}</p>
                    <p style={{ margin: "6px 0 0", fontSize: 12, color: "#94a3b8" }}>{cat.transactionCount} transactions</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ TRANSACTIONS TAB ════ */}
          {activeTab === "transactions" && (
            <div>
              {/* Filters */}
              <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", marginBottom: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <Filter size={16} color="#94a3b8" />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>Filter by:</span>
                {["all", ...SPENDING_CATEGORIES.categories.map(c => c.name)].map(cat => (
                  <button key={cat} onClick={() => setCategoryFilter(cat)} style={{
                    padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontFamily: "inherit",
                    background: categoryFilter === cat ? CAP_BLUE : "#f1f5f9",
                    color: categoryFilter === cat ? "#fff" : "#64748b",
                    fontWeight: categoryFilter === cat ? 700 : 500, transition: "all 0.15s"
                  }}>{cat === "all" ? "All" : cat}</button>
                ))}
              </div>

              <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}>{filteredTx.length} transactions</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>Sorted by: <strong style={{ color: "#374151" }}>Latest first</strong></span>
                  </div>
                </div>

                {filteredTx.map((tx, i) => (
                  <div key={tx.id} style={{
                    display: "flex", alignItems: "center", padding: "16px 24px",
                    borderBottom: i < filteredTx.length - 1 ? "1px solid #f8fafc" : "none",
                    transition: "background 0.15s"
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: `${tx.categoryColor}18`, display: "flex", alignItems: "center", justifyContent: "center", color: tx.categoryColor, marginRight: 16, flexShrink: 0 }}>
                      <CategoryIcon icon={tx.icon} size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 700, color: CAP_DARK, fontSize: 15 }}>{tx.merchant}</p>
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94a3b8" }}>{tx.description}</p>
                    </div>
                    <div style={{ textAlign: "right", marginRight: 16 }}>
                      <span style={{ display: "inline-block", background: `${tx.categoryColor}18`, color: tx.categoryColor, padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{tx.category}</span>
                      <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>{tx.paymentMethod}</p>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 120 }}>
                      <p style={{ margin: 0, fontWeight: 800, color: CAP_DARK, fontFamily: "DM Mono", fontSize: 16 }}>−{fmt(tx.amount)}</p>
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94a3b8" }}>{fmtDate(tx.date)} {fmtTime(tx.date)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: "12px 0", textAlign: "center", fontSize: 12, color: "#94a3b8" }}>
                Showing {filteredTx.length} of 1,250 total · <span style={{ color: CAP_BLUE, cursor: "pointer", fontWeight: 600 }}>Load more</span>
              </div>
            </div>
          )}

          {/* ════ GOALS TAB ════ */}
          {activeTab === "goals" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {GOALS.goals.map((goal, i) => {
                  const cat = SPENDING_CATEGORIES.categories.find(c => c.name === goal.category);
                  const remaining = goal.monthlyBudget - goal.currentSpent;
                  return (
                    <div key={goal.id} style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: goal.status === "warning" ? `1px solid ${CAP_RED}30` : "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ width: 46, height: 46, borderRadius: 13, background: cat ? `${cat.color}18` : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: cat?.color || "#94a3b8" }}>
                            {cat && <CategoryIcon icon={cat.icon} size={22} />}
                          </span>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, color: CAP_DARK, fontSize: 17 }}>{goal.category}</p>
                            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>{goal.daysRemaining} days remaining</p>
                          </div>
                        </div>
                        <span style={{
                          padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: goal.status === "warning" ? `${CAP_RED}18` : "#dcfce7",
                          color: goal.status === "warning" ? CAP_RED : "#16a34a"
                        }}>
                          {goal.status === "warning" ? "⚠ Near limit" : "✓ On track"}
                        </span>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Spent</span>
                          <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Budget</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                          <span style={{ fontSize: 24, fontWeight: 800, color: CAP_DARK, fontFamily: "DM Mono" }}>{fmt(goal.currentSpent)}</span>
                          <span style={{ fontSize: 24, fontWeight: 800, color: "#94a3b8", fontFamily: "DM Mono" }}>{fmt(goal.monthlyBudget)}</span>
                        </div>
                        <ProgressBar pct={goal.percentageUsed} color={cat?.color} status={goal.status} />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12 }}>
                          <span style={{ color: "#94a3b8" }}>{goal.percentageUsed.toFixed(1)}% used</span>
                          <span style={{ color: remaining > 0 ? "#16a34a" : CAP_RED, fontWeight: 600 }}>
                            {remaining > 0 ? `${fmt(remaining)} left` : `${fmt(Math.abs(remaining))} over`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Budget Summary */}
              <div style={{ background: `linear-gradient(135deg, ${CAP_BLUE} 0%, ${CAP_DARK} 100%)`, borderRadius: 16, padding: 28, color: "#fff" }}>
                <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 700 }}>Budget Health Summary</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                  {[
                    { label: "Total Budget",   value: GOALS.goals.reduce((a, g) => a + g.monthlyBudget, 0) },
                    { label: "Total Spent",    value: GOALS.goals.reduce((a, g) => a + g.currentSpent, 0) },
                    { label: "Remaining",      value: GOALS.goals.reduce((a, g) => a + (g.monthlyBudget - g.currentSpent), 0) }
                  ].map((s, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "18px 20px" }}>
                      <p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.7, fontWeight: 600, letterSpacing: 0.3 }}>{s.label.toUpperCase()}</p>
                      <p style={{ margin: 0, fontSize: 22, fontWeight: 800, fontFamily: "DM Mono" }}>{fmt(s.value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#fff", borderTop: "1px solid #e5e7eb", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>© 2024 Capitec Bank Ltd · All rights reserved</span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy Policy", "Terms of Use", "Contact Us"].map(l => (
            <span key={l} style={{ fontSize: 12, color: "#94a3b8", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f8fafc; } ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 3px; }
      `}</style>
    </div>
  );
}
