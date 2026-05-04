type AdminPage =
  | "dashboard"
  | "products"
  | "categories"
  | "orders"
  | "advertisements"
  | "maintenance-accounts"
  | "maintenance-timer";
 
interface Product {
  id: string; name: string; category: string; subCategory: string;
  price: number; stock: number; sku: string; status: "Active" | "Inactive";
}
interface Category {
  id: string; name: string; subCategories: string[]; productCount: number; status: "Active" | "Inactive";
}
interface Order {
  id: string; item: string; sku: string; color: string;
  qty: number; total: number; date: string; status: "Pending" | "Confirmed" | "Cancelled";
  store: string;
}
interface Advertisement {
  id: string; title: string; type: "Image" | "Video"; status: "Active" | "Inactive";
  duration: number; uploadDate: string; size: string;
}
interface Account {
  id: string; name: string; username: string; role: "Super Admin" | "Admin" | "Staff";
  status: "Active" | "Inactive"; lastLogin: string;
}
 