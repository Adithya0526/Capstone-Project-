
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import CreateBillForm from "./CreateBillForm";
import { getBillings, createBilling } from "@/services/api";

interface Billing {
  billing_id: number;
  user_id: number;
  billing_date: string;
  amount: number;
  payment_method: string;
  status: string;
  username: string;
}

const BillingsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [billingsData, setBillingsData] = useState<Billing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBillings = async () => {
      try {
        setIsLoading(true);
        const data = await getBillings();
        // Ensure data is always an array
        setBillingsData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching billings:", error);
        toast.error("Failed to load billing data");
        // Initialize with empty array on error
        setBillingsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillings();
  }, []);

  // Make sure billingsData is an array before filtering
  const filteredBillings = Array.isArray(billingsData) ? billingsData.filter((billing) => {
    const matchesSearch =
      billing?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      billing?.billing_id?.toString().includes(searchQuery) ||
      billing?.amount?.toString().includes(searchQuery) ||
      billing?.payment_method?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" ||
      billing?.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  }) : [];

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleCreateBill = async (formData: any) => {
    try {
      // Create the billing record via API
      const newBill = await createBilling({
        user_id: parseInt(formData.user_id),
        billing_date: formData.billing_date.toISOString().split('T')[0],
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
        status: formData.status,
        description: formData.description || "",
      });
      
      // Add the new bill to the billings data with the username
      const updatedBillingsData = await getBillings();
      setBillingsData(Array.isArray(updatedBillingsData) ? updatedBillingsData : []);
      
      // Close the dialog
      setIsDialogOpen(false);
      
      // Show a success message
      toast.success("New bill created successfully");
    } catch (error) {
      console.error("Error creating bill:", error);
      toast.error("Failed to create new bill");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-omega-900">Billings</h1>
        <Button 
          className="bg-omega-600 hover:bg-omega-700"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Bill
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search billings..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBillings.length > 0 ? (
                filteredBillings.map((billing) => (
                  <TableRow key={billing.billing_id}>
                    <TableCell className="font-medium">#{billing.billing_id}</TableCell>
                    <TableCell>{billing.username || 'Unknown'}</TableCell>
                    <TableCell>{formatDate(billing.billing_date)}</TableCell>
                    <TableCell>₹{billing.amount ? billing.amount.toLocaleString() : '0'}</TableCell>
                    <TableCell>{billing.payment_method}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${
                          billing.status?.toLowerCase() === 'paid' 
                            ? 'border-green-500 text-green-600 bg-green-50' 
                            : 'border-yellow-500 text-yellow-600 bg-yellow-50'
                        }`}
                      >
                        {billing.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link to={`/billings/${billing.billing_id}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No billings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create New Bill Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Bill</DialogTitle>
          </DialogHeader>
          <CreateBillForm 
            onSubmit={handleCreateBill}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingsList;
