import { usePage } from "@inertiajs/react";
import { lazy, Suspense } from "react";
import SideNavDrawer from "@/Kiosk-Admin/components/nav";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdminProps {
  auth?: {
    user?: {
      name: string;
      role?: string;
    };
  };
  [key: string]: any;
}

// ─── Whitelisted pages only ───────────────────────────────────────────────────
// Dagdag ka lang dito pag may bagong page — wala nang iba
const PAGES: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
    "/product/product-item":  lazy(() => import("@/Kiosk-Admin/pages/ProductItemPage")),
  // "/admin/inventory":   lazy(() => import("@/Kiosk-Admin/pages/Inventory")),  // future
  // "/admin/alerts":      lazy(() => import("@/Kiosk-Admin/pages/Alerts")),     // future
  // "/admin/dashboard":   lazy(() => import("@/Kiosk-Admin/pages/Dashboard")),  // future
};

// ─── 404 fallback ─────────────────────────────────────────────────────────────
const NotFound = () => (
  <div style={{ padding: 32, color: "#ff6b6b" }}>
    <h2>404 — Page not found</h2>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function Admin({ auth, ...props }: AdminProps) {
  const { url } = usePage();

  // Strip query strings e.g. /admin/item-category?page=1 → /admin/item-category
  const path = url.split("?")[0];

  const CurrentPage = PAGES[path] ?? NotFound;

  return (
    <SideNavDrawer auth={auth}>
      <div style={{ padding: 32 }}>
        <Suspense fallback={<div style={{ color: "#888" }}>Loading...</div>}>
          <CurrentPage {...props} />
        </Suspense>
      </div>
    </SideNavDrawer>
  );
}