const MOCK_PRODUCTS: Product[] = [
  { id:"P001", name:"GLOSTAD Loveseat",       category:"Living Room", subCategory:"Sofas",     price:5999,  stock:12, sku:"G0008-12345", status:"Active"   },
  { id:"P002", name:"KLIPPAN Loveseat",        category:"Living Room", subCategory:"Sofas",     price:11999, stock:8,  sku:"K0012-67890", status:"Active"   },
  { id:"P003", name:"VIMLE Sofa",              category:"Living Room", subCategory:"Sofas",     price:31999, stock:5,  sku:"V0034-11111", status:"Active"   },
  { id:"P004", name:"POÄNG Armchair",          category:"Living Room", subCategory:"Armchair",  price:8999,  stock:20, sku:"P0056-22222", status:"Active"   },
  { id:"P005", name:"BILLY Bookcase",          category:"Living Room", subCategory:"Bookcase",  price:4999,  stock:15, sku:"B0078-33333", status:"Active"   },
  { id:"P006", name:"EKEDALEN Table",          category:"Dining Room", subCategory:"Tables",    price:14999, stock:6,  sku:"E0090-44444", status:"Inactive" },
  { id:"P007", name:"KALLAX Shelf Unit",       category:"Living Room", subCategory:"Shelves",   price:6999,  stock:10, sku:"K0023-55555", status:"Active"   },
  { id:"P008", name:"HÖNEFOSS Mirror",         category:"Bath Room",   subCategory:"Fixtures",  price:2999,  stock:18, sku:"H0045-66666", status:"Active"   },
];
 
const MOCK_CATEGORIES: Category[] = [
  { id:"C001", name:"Living Room", subCategories:["Sofas","Sofa Beds","Cabinets","Armchair","Bookcase","Carpets","Shelves","Side Table","Cushions"], productCount:24, status:"Active" },
  { id:"C002", name:"Dining Room", subCategories:["Tables","Chairs","Dining Sets","Storage"],                                                         productCount:18, status:"Active" },
  { id:"C003", name:"Kitchen",     subCategories:["Storage","Cookware","Accessories","Appliances"],                                                    productCount:32, status:"Active" },
  { id:"C004", name:"Bed Room",    subCategories:["Beds","Mattresses","Wardrobes","Bedding","Lighting"],                                               productCount:28, status:"Active" },
  { id:"C005", name:"Appliances",  subCategories:["Refrigerators","Washing Machines","Ovens","Air Conditioners"],                                      productCount:15, status:"Active" },
  { id:"C006", name:"Bath Room",   subCategories:["Fixtures","Towels","Storage","Accessories"],                                                        productCount:12, status:"Inactive" },
];
 
const MOCK_ORDERS: Order[] = [
  { id:"ORD-001", item:"GLOSTAD Loveseat",  sku:"G0008-12345", color:"Dark Gray", qty:1, total:5999,  date:"2026-04-27", status:"Confirmed",  store:"Alturas Mall"  },
  { id:"ORD-002", item:"KLIPPAN Loveseat",  sku:"K0012-67890", color:"Gray",      qty:2, total:23998, date:"2026-04-27", status:"Pending",    store:"Farm City"     },
  { id:"ORD-003", item:"POÄNG Armchair",    sku:"P0056-22222", color:"Beige",     qty:1, total:8999,  date:"2026-04-26", status:"Confirmed",  store:"Alturas City"  },
  { id:"ORD-004", item:"BILLY Bookcase",    sku:"B0078-33333", color:"White",     qty:3, total:14997, date:"2026-04-26", status:"Cancelled",  store:"Alturas Mall"  },
  { id:"ORD-005", item:"VIMLE Sofa",        sku:"V0034-11111", color:"Beige",     qty:1, total:31999, date:"2026-04-25", status:"Confirmed",  store:"Farm City"     },
  { id:"ORD-006", item:"KALLAX Shelf Unit", sku:"K0023-55555", color:"Black",     qty:2, total:13998, date:"2026-04-25", status:"Pending",    store:"Alturas Mall"  },
];
 
const MOCK_ADS: Advertisement[] = [
  { id:"AD001", title:"Big HOME Fair - Main",     type:"Video", status:"Active",   duration:10, uploadDate:"2026-04-01", size:"642 KB" },
  { id:"AD002", title:"Summer Sale Banner",       type:"Image", status:"Active",   duration:8,  uploadDate:"2026-04-10", size:"124 KB" },
  { id:"AD003", title:"New Arrivals Promo",       type:"Image", status:"Inactive", duration:6,  uploadDate:"2026-04-15", size:"98 KB"  },
  { id:"AD004", title:"Dining Room Feature",      type:"Video", status:"Active",   duration:12, uploadDate:"2026-04-20", size:"1.2 MB" },
];
 
const MOCK_ACCOUNTS: Account[] = [
  { id:"A001", name:"Juan dela Cruz",   username:"jdelacruz",  role:"Super Admin", status:"Active",   lastLogin:"2026-04-27 09:12" },
  { id:"A002", name:"Maria Santos",     username:"msantos",    role:"Admin",       status:"Active",   lastLogin:"2026-04-27 08:45" },
  { id:"A003", name:"Pedro Reyes",      username:"preyes",     role:"Staff",       status:"Active",   lastLogin:"2026-04-26 17:30" },
  { id:"A004", name:"Ana Villanueva",   username:"avillanueva",role:"Staff",       status:"Inactive", lastLogin:"2026-04-10 11:00" },
];