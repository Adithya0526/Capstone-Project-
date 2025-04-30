
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { getBillingById, getBillingItems, updateBillingStatus } from "@/services/api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface BillingData {
  billing_id: number;
  user_id: number;
  billing_date: string;
  amount: number;
  payment_method: string;
  status: string;
  username: string;
  email: string;
  phone: string;
  address: string;
}

interface BillingItem {
  item_id: number;
  bill_id: number;
  product_id: number;
  quantity: number;
  price: number;
  model: string;
  max_watts: number;
}

const BillingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const billingId = parseInt(id || "0", 10);
  
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [billItems, setBillItems] = useState<BillingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  
  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setIsLoading(true);
        const billingData = await getBillingById(billingId);
        setBilling(billingData);
        
        const items = await getBillingItems(billingId);
        setBillItems(items);
      } catch (error) {
        console.error("Error fetching billing details:", error);
        toast.error("Failed to load billing details");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (billingId > 0) {
      fetchBillingData();
    }
  }, [billingId]);

  const handleUpdateStatus = async () => {
    if (!newStatus || !billing) return;
    
    try {
      await updateBillingStatus(billingId, newStatus);
      setBilling({
        ...billing,
        status: newStatus
      });
      setIsUpdateDialogOpen(false);
      toast.success("Billing status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update billing status");
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!billing) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Billing Not Found</h1>
        <p className="mb-4">The billing record you're looking for doesn't exist.</p>
        <Link to="/billings">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Billings
          </Button>
        </Link>
      </div>
    );
  }

  const totalAmount = billItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/billings">
            <Button variant="outline" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-omega-900">Invoice #{billing.billing_id}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button 
            className="bg-omega-600 hover:bg-omega-700"
            onClick={() => {
              setNewStatus(billing.status);
              setIsUpdateDialogOpen(true);
            }}
          >
            Update Status
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{formatDate(billing.billing_date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invoice Number</p>
                <p className="font-medium">#{billing.billing_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{billing.payment_method}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge 
                  variant="outline" 
                  className={`${
                    billing.status.toLowerCase() === 'paid' 
                      ? 'border-green-500 text-green-600 bg-green-50' 
                      : 'border-yellow-500 text-yellow-600 bg-yellow-50'
                  }`}
                >
                  {billing.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <p className="font-semibold text-lg">{billing.username}</p>
            <p className="text-muted-foreground">{billing.email}</p>
            <p className="text-muted-foreground">{billing.phone}</p>
            <p className="text-muted-foreground mt-2">{billing.address}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Max Watts</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billItems.length > 0 ? (
                billItems.map((item) => (
                  <TableRow key={item.item_id}>
                    <TableCell>{item.model}</TableCell>
                    <TableCell>{item.max_watts} W</TableCell>
                    <TableCell className="text-right">₹{item.price.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right font-semibold">₹{(item.price * item.quantity).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No items found</TableCell>
                </TableRow>
              )}
              
              <TableRow>
                <TableCell colSpan={4} className="text-right font-bold">Total</TableCell>
                <TableCell className="text-right font-bold text-lg">₹{billing.amount.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Billing Status</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-2">
              Current Status: <Badge variant="outline">{billing.status}</Badge>
            </p>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingDetails;
