
import { useState, useEffect } from "react";
import DashboardCard from "./DashboardCard";
import RecentBillings from "../billing/RecentBillings";
import { ArrowDown, ArrowUp, Database, Table, User } from "lucide-react";
import { getUsers, getProducts, getBillings } from "@/services/api";
import { toast } from "sonner";

const Dashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [billingsCount, setBillingsCount] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setIsError(false);
      
      try {
        // Fetch all data in parallel for better performance
        const [usersData, productsData, billingsData] = await Promise.all([
          getUsers(),
          getProducts(),
          getBillings()
        ]);
        
        // Process users data
        setUsersCount(Array.isArray(usersData) ? usersData.length : 0);
        
        // Process products data
        setProductsCount(Array.isArray(productsData) ? productsData.length : 0);
        
        // Process billings data
        setBillingsCount(Array.isArray(billingsData) ? billingsData.length : 0);
        
        // Calculate total revenue with safety checks
        if (Array.isArray(billingsData)) {
          const revenue = billingsData.reduce((sum: number, billing: any) => {
            const amount = billing?.amount ? parseFloat(billing.amount) : 0;
            return isNaN(amount) ? sum : sum + amount;
          }, 0);
          setTotalRevenue(revenue);
          
          // Count status with safety checks
          const paid = billingsData.filter((billing: any) => 
            billing?.status && billing.status.toLowerCase() === 'paid').length;
          const pending = billingsData.filter((billing: any) => 
            billing?.status && billing.status.toLowerCase() === 'pending').length;
          setPaidCount(paid);
          setPendingCount(pending);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsError(true);
        toast.error("Failed to load dashboard data. Please check your connection to the API server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Safe formatter for currency
  const formatCurrency = (value: number): string => {
    return `₹${value.toLocaleString()}`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-omega-900">Dashboard</h1>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">
            Unable to connect to the server. Please make sure the backend is running and accessible.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <DashboardCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<ArrowUp className="h-4 w-4" />}
          description="Total value of all transactions"
          isLoading={isLoading}
        />
        <DashboardCard
          title="Total Customers"
          value={usersCount}
          icon={<User className="h-4 w-4" />}
          description="Registered customers in the system"
          isLoading={isLoading}
        />
        <DashboardCard
          title="Products"
          value={productsCount}
          icon={<Database className="h-4 w-4" />}
          description="Available product models"
          isLoading={isLoading}
        />
        <DashboardCard
          title="Invoices"
          value={billingsCount}
          icon={<Table className="h-4 w-4" />}
          description={`${paidCount} paid, ${pendingCount} pending`}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <RecentBillings limit={5} showViewAll={true} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
