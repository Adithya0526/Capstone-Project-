
// User data
export interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  address: string;
}

// Product data
export interface Product {
  pid: number;
  model: string;
  max_watts: number;
  basic_price: number;
}

// Billing data
export interface Billing {
  billing_id: number;
  user_id: number;
  billing_date: string;
  amount: number;
  payment_method: string;
  status: string;
}

// Bill Items data
export interface BillItem {
  item_id: number;
  bill_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

// Mock data based on the SQL provided
export const users: User[] = [
  {
    id: 1,
    username: 'Arun Kumar',
    phone: '9876543210',
    email: 'arun.kumar@example.com',
    address: '12, NS Palayam Main Road, Coimbatore - 641035'
  },
  {
    id: 2,
    username: 'Priya Dharshini',
    phone: '8765432109',
    email: 'priya.d@example.com',
    address: '45, Gandhi Nagar, NS Palayam, Coimbatore - 641035'
  },
  {
    id: 3,
    username: 'Sathish Kumar',
    phone: '7654321098',
    email: 'sathish.k@example.com',
    address: '78, VOC Street, NS Palayam, Coimbatore - 641035'
  },
  {
    id: 4,
    username: 'Divya Lakshmi',
    phone: '6543210987',
    email: 'divya.l@example.com',
    address: '32, Bharathi Nagar, NS Palayam, Coimbatore - 641035'
  },
  {
    id: 5,
    username: 'Karthik Raja',
    phone: '9432109876',
    email: 'karthik.r@example.com',
    address: '90, KVR Layout, NS Palayam, Coimbatore - 641035'
  },
  {
    id: 6,
    username: 'Meena Kumari',
    phone: '8321098765',
    email: 'meena.k@example.com',
    address: '21, Indira Nagar, NS Palayam, Coimbatore - 641035'
  },
  {
    id: 7,
    username: 'Vigneshwaran',
    phone: '7210987654',
    email: 'vignesh.v@example.com',
    address: '11, Raja Garden, NS Palayam, Coimbatore - 641035'
  },
  {
    id: 8,
    username: 'Lakshmi Narayan',
    phone: '6109876543',
    email: 'lakshmi.n@example.com',
    address: '3A, SNR Street, NS Palayam, Coimbatore - 641035'
  }
];

export const products: Product[] = [
  { pid: 1, model: 'v4 1.5hp bldc pump with controler (hh)', max_watts: 1200, basic_price: 26500 },
  { pid: 2, model: 'v4 2.0hp bldc pump with controler (hh)', max_watts: 1500, basic_price: 30000 },
  { pid: 3, model: 'v6 2.0hp bldc pump with controler (hh)', max_watts: 1500, basic_price: 32000 },
  { pid: 4, model: 'v6 3.0hp bldc pump with controler (hh)', max_watts: 2250, basic_price: 41000 },
  { pid: 5, model: 'v6 5.0hp bldc pump with controler (hh)', max_watts: 3750, basic_price: 68500 },
  { pid: 6, model: 'v6 7.5hp bldc pump with controler (hh)', max_watts: 5600, basic_price: 88500 },
  { pid: 7, model: 'v6 10.0hp bldc pump with controler (hh)', max_watts: 7500, basic_price: 108500 },
  { pid: 8, model: 'v8 10.0hp bldc pump with controler (hh)', max_watts: 7500, basic_price: 118500 },
  { pid: 9, model: 'v8 15.0hp bldc pump with controler (hh)', max_watts: 11250, basic_price: 168500 },
  { pid: 10, model: 'v8 20.0hp bldc pump with controler (hh)', max_watts: 15000, basic_price: 208500 },
  { pid: 11, model: 'v8 25.0hp bldc pump with controler (hh)', max_watts: 18750, basic_price: 248500 }
];

export const billings: Billing[] = [
  { billing_id: 1, user_id: 1, billing_date: '2025-04-01', amount: 53000, payment_method: 'Credit Card', status: 'Paid' },
  { billing_id: 2, user_id: 3, billing_date: '2025-04-02', amount: 88500, payment_method: 'UPI', status: 'Paid' },
  { billing_id: 3, user_id: 5, billing_date: '2025-04-03', amount: 68500, payment_method: 'Cash', status: 'Pending' },
  { billing_id: 4, user_id: 7, billing_date: '2025-04-04', amount: 137000, payment_method: 'Debit Card', status: 'Paid' },
  { billing_id: 5, user_id: 2, billing_date: '2025-04-05', amount: 108500, payment_method: 'Net Banking', status: 'Pending' }
];

export const billItems: BillItem[] = [
  { item_id: 1, bill_id: 1, product_id: 1, quantity: 2, price: 26500 },
  { item_id: 2, bill_id: 2, product_id: 6, quantity: 1, price: 88500 },
  { item_id: 3, bill_id: 3, product_id: 5, quantity: 1, price: 68500 },
  { item_id: 4, bill_id: 4, product_id: 4, quantity: 2, price: 41000 },
  { item_id: 5, bill_id: 5, product_id: 7, quantity: 1, price: 108500 }
];

// Helper function to get user name by ID
export const getUserById = (id: number): User | undefined => {
  return users.find(user => user.id === id);
};

// Helper function to get product by ID
export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.pid === id);
};

// Helper function to get bill items by bill ID
export const getBillItemsByBillId = (billId: number): BillItem[] => {
  return billItems.filter(item => item.bill_id === billId);
};

// Helper function to calculate total revenue
export const calculateTotalRevenue = (): number => {
  return billings.reduce((sum, bill) => sum + bill.amount, 0);
};

// Helper function to get billing status counts
export const getBillingStatusCounts = () => {
  const statusCounts = { paid: 0, pending: 0 };
  billings.forEach(bill => {
    if (bill.status.toLowerCase() === 'paid') {
      statusCounts.paid += 1;
    } else {
      statusCounts.pending += 1;
    }
  });
  return statusCounts;
};
