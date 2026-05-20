import { useState } from "react";

import ItemCategory from '@/Kiosk-Admin/pages/ItemCategory';

const NAV_SECTIONS = [
  {
    label: null,
    items: [
      { icon: "⊞", label: "Dashboard", badge: null, active: true },
      { icon: "📦", label: "Inventory", badge: "3", active: false },
      { icon: "📈", label: "Stock Monitor", badge: null, active: false },
      { icon: "🔔", label: "Alerts", badge: "12", active: false },
    ],
  },
  {
    label: "Management",
    items: [
      { icon: "🏷️", label: "Categories", badge: null, active: false },
      { icon: "🏭", label: "Suppliers", badge: null, active: false },
      { icon: "📋", label: "Purchase Orders", badge: "2", active: false },
      { icon: "🔄", label: "Transfers", badge: null, active: false },
    ],
  },
  {
    label: "Reports",
    items: [
      { icon: "📊", label: "Analytics", badge: null, active: false },
      { icon: "📉", label: "Low Stock", badge: "7", active: false },
      { icon: "📅", label: "History", badge: null, active: false },
      { icon: "⬇️", label: "Export", badge: null, active: false },
    ],
  },
  {
    label: "Discover",
    items: [
      { icon: "🔥", label: "Hot Items", badge: null, active: false },
      { icon: "🏷", label: "Tags", badge: null, active: false },
      { icon: "🌐", label: "Sources", badge: null, active: false },
      { icon: "🏆", label: "Leaderboard", badge: null, active: false },
    ],
  },
];

const SHORTCUTS = [
  { icon: "📬", label: "Gmail" },
  { icon: "🐙", label: "GitHub" },
  { icon: "🤖", label: "ChatGPT" },
  { icon: "🍊", label: "Stack" },
];

export default function SideNavDrawer() {
  const [open, setOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0d0d0f",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Overlay for mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            display: "none",
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 10,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: open ? 260 : 64,
          minWidth: open ? 260 : 64,
          background: "#111114",
          borderRight: "1px solid #1e1e24",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.32s cubic-bezier(0.4,0,0.2,1), min-width 0.32s cubic-bezier(0.4,0,0.2,1)",
          overflow: "visible",
          position: "relative",
          zIndex: 20,
        }}
      >
        {/* Floating toggle button — always visible on sidebar edge */}
        <button
          onClick={() => setOpen((v) => !v)}
          title={open ? "Collapse" : "Expand"}
          style={{
            position: "absolute",
            top: 18,
            right: -14,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#1e1e2e",
            border: "1px solid #2e2e3e",
            color: "#aaa",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            zIndex: 30,
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
            transition: "background 0.15s, color 0.15s, transform 0.32s cubic-bezier(0.4,0,0.2,1)",
            transform: open ? "rotate(0deg)" : "rotate(180deg)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#6c63ff";
            (e.currentTarget as HTMLButtonElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#1e1e2e";
            (e.currentTarget as HTMLButtonElement).style.color = "#aaa";
          }}
        >
          ◀
        </button>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "18px 14px 14px",
            borderBottom: "1px solid #1e1e24",
            minHeight: 60,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "linear-gradient(135deg, #6c63ff, #3ec6e0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
              boxShadow: "0 0 12px rgba(108,99,255,0.35)",
            }}
          >
            📦
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: "#f0f0f5",
              letterSpacing: "-0.3px",
              opacity: open ? 1 : 0,
              transform: open ? "translateX(0)" : "translateX(-8px)",
              transition: "opacity 0.22s, transform 0.22s",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            StockBase
          </span>

        </div>

        {/* New Post Button */}
        <div style={{ padding: "12px 10px 4px" }}>
          <button
            style={{
              width: "100%",
              background: open ? "#1a1a22" : "transparent",
              border: "1px solid #2a2a35",
              borderRadius: 8,
              color: "#e0e0ee",
              padding: open ? "9px 12px" : "9px 0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: open ? "flex-start" : "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.01em",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#202030";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#6c63ff55";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = open ? "#1a1a22" : "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a35";
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>＋</span>
            <span
              style={{
                opacity: open ? 1 : 0,
                maxWidth: open ? 200 : 0,
                overflow: "hidden",
                transition: "opacity 0.2s, max-width 0.28s",
                whiteSpace: "nowrap",
              }}
            >
              New Entry
            </span>
          </button>
        </div>

        {/* Nav Sections */}
        <nav style={{ flex: 1, overflowY: "auto", overflowX: "clip", padding: "6px 0" }}>
          {NAV_SECTIONS.map((section, si) => (
            <div key={si} style={{ marginBottom: 4 }}>
              {section.label && open && (
                <div
                  style={{
                    padding: "10px 18px 4px",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#444",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    opacity: open ? 1 : 0,
                    transition: "opacity 0.2s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {section.label}
                </div>
              )}
              {!section.label && si > 0 && (
                <div style={{ height: 1, background: "#1e1e24", margin: "6px 10px" }} />
              )}
              {section.items.map((item) => {
                const isActive = activeItem === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => setActiveItem(item.label)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: open ? "9px 14px" : "9px 0",
                      justifyContent: open ? "flex-start" : "center",
                      background: isActive ? "linear-gradient(90deg, #6c63ff18, #3ec6e010)" : "transparent",
                      border: "none",
                      borderLeft: isActive ? "2px solid #6c63ff" : "2px solid transparent",
                      borderRadius: "0 8px 8px 0",
                      color: isActive ? "#a89fff" : "#888",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 400,
                      transition: "all 0.15s",
                      position: "relative",
                      marginLeft: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.background = "#18181e";
                        (e.currentTarget as HTMLButtonElement).style.color = "#ccc";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.color = "#888";
                      }
                    }}
                    title={!open ? item.label : undefined}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        flexShrink: 0,
                        filter: isActive ? "none" : "grayscale(40%)",
                        transition: "filter 0.15s",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span
                      style={{
                        opacity: open ? 1 : 0,
                        maxWidth: open ? 160 : 0,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        transition: "opacity 0.2s, max-width 0.28s",
                        flex: 1,
                        textAlign: "left",
                      }}
                    >
                      {item.label}
                    </span>
                    {item.badge && open && (
                      <span
                        style={{
                          background: isActive ? "#6c63ff" : "#2a2a35",
                          color: isActive ? "#fff" : "#888",
                          fontSize: 10,
                          fontWeight: 700,
                          borderRadius: 20,
                          padding: "1px 7px",
                          flexShrink: 0,
                          transition: "background 0.15s",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Shortcuts Section */}
        {open && (
          <div
            style={{
              borderTop: "1px solid #1e1e24",
              padding: "14px 14px 10px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#444",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Quick Access
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {SHORTCUTS.map((s) => (
                <button
                  key={s.label}
                  title={s.label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "#1a1a22",
                    border: "1px solid #2a2a35",
                    cursor: "pointer",
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#252535";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#6c63ff55";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#1a1a22";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a35";
                  }}
                >
                  {s.icon}
                </button>
              ))}
              <button
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "#1a1a22",
                  border: "1px dashed #2a2a35",
                  cursor: "pointer",
                  fontSize: 18,
                  color: "#444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#252535";
                  (e.currentTarget as HTMLButtonElement).style.color = "#888";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#1a1a22";
                  (e.currentTarget as HTMLButtonElement).style.color = "#444";
                }}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* User Footer */}
        <div
          style={{
            borderTop: "1px solid #1e1e24",
            padding: "12px 10px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6c63ff, #3ec6e0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              flexShrink: 0,
              color: "#fff",
              fontWeight: 700,
            }}
          >
            JD
          </div>
          <div
            style={{
              opacity: open ? 1 : 0,
              maxWidth: open ? 160 : 0,
              overflow: "hidden",
              transition: "opacity 0.2s, max-width 0.28s",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: "#ddd" }}>Juan Dela Cruz</div>
            <div style={{ fontSize: 11, color: "#555" }}>Admin</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: 32,
          overflowY: "auto",
          background: "#0d0d0f",
        }}
      >
        {/* <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              color: "#f0f0f5",
              fontWeight: 800,
              fontSize: 26,
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            {activeItem}
          </h1>
          <p style={{ color: "#555", margin: "4px 0 0", fontSize: 13 }}>
            Backend Inventory Management System
          </p>
        </div> */}

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total Items", value: "4,821", change: "+12", color: "#6c63ff" },
            { label: "Low Stock", value: "47", change: "-3", color: "#ff6b6b" },
            { label: "Orders Pending", value: "15", change: "+2", color: "#ffc107" },
            { label: "Suppliers", value: "132", change: "+1", color: "#3ec6e0" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#111114",
                border: "1px solid #1e1e24",
                borderRadius: 12,
                padding: "18px 20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: stat.color,
                  borderRadius: "12px 12px 0 0",
                }}
              />
              <div style={{ color: "#555", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                {stat.label}
              </div>
              <div style={{ color: "#f0f0f5", fontSize: 28, fontWeight: 800 }}>{stat.value}</div>
              <div style={{ color: stat.change.startsWith("+") ? "#4caf50" : "#ff6b6b", fontSize: 12, marginTop: 4 }}>
                {stat.change} this week
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        {/* <div
          style={{
            background: "#111114",
            border: "1px solid #1e1e24",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e24", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#ddd", fontWeight: 700, fontSize: 14 }}>Recent Stock Activity</span>
            <span style={{ color: "#6c63ff", fontSize: 12, cursor: "pointer" }}>View all →</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0d0d0f" }}>
                {["Item", "Category", "Qty", "Status", "Last Updated"].map((h) => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", color: "#444", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { item: "Laptop Pro X1", cat: "Electronics", qty: 24, status: "In Stock", updated: "2m ago" },
                { item: "USB-C Hub 7-in-1", cat: "Accessories", qty: 7, status: "Low", updated: "15m ago" },
                { item: "Wireless Keyboard", cat: "Peripherals", qty: 58, status: "In Stock", updated: "1h ago" },
                { item: "Monitor 27\" 4K", cat: "Displays", qty: 3, status: "Critical", updated: "3h ago" },
                { item: "Webcam HD 1080p", cat: "Peripherals", qty: 31, status: "In Stock", updated: "5h ago" },
              ].map((row, i) => (
                <tr
                  key={i}
                  style={{ borderTop: "1px solid #1a1a22", transition: "background 0.12s", cursor: "pointer" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "#16161c")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                >
                  <td style={{ padding: "12px 20px", color: "#ccc", fontSize: 13 }}>{row.item}</td>
                  <td style={{ padding: "12px 20px", color: "#666", fontSize: 13 }}>{row.cat}</td>
                  <td style={{ padding: "12px 20px", color: "#aaa", fontSize: 13, fontWeight: 600 }}>{row.qty}</td>
                  <td style={{ padding: "12px 20px" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background:
                          row.status === "In Stock" ? "#4caf5018" :
                          row.status === "Low" ? "#ffc10718" : "#ff6b6b18",
                        color:
                          row.status === "In Stock" ? "#4caf50" :
                          row.status === "Low" ? "#ffc107" : "#ff6b6b",
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 20px", color: "#555", fontSize: 12 }}>{row.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
        <div className="w-full">
            <ItemCategory/>
            </div>
      </main>
    </div>
  );
}