
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { getBillings, getUserById } from "@/services/api";
import { toast } from "sonner";

interface RecentBillingsProps {
  limit?: number;
  showViewAll?: boolean;
}

const RecentBillings = ({ limit = 5, showViewAll = false }: RecentBillingsProps) => {
  const [billings, setBillings] = useState<any[]>([]);
  const [users, setUsers] = useState<Record<number, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBillings = async () => {
      setIsLoading(true);
      try {
        const data = await getBillings();
        // Sort billings by date (most recent first) and limit
        const sortedBillings = [...data]
          .sort((a, b) => new Date(b.billing_date).getTime() - new Date(a.billing_date).getTime())
          .slice(0, limit);
        
        setBillings(sortedBillings);
        
        // Fetch user data for each billing
        const userIds = new Set(sortedBillings.map((billing) => billing.user_id));
        const userMap: Record<number, any> = {};
        
        for (const userId of userIds) {
          try {
            const userData = await getUserById(userId);
            userMap[userId] = userData;
          } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
          }
        }
        
        setUsers(userMap);
      } catch (error) {
        console.error("Error fetching billings:", error);
        toast.error("Failed to load recent billings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillings();
  }, [limit]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Function to safely format currency values
  const formatCurrency = (amount: any): string => {
    if (amount === undefined || amount === null) {
      return '₹0.00';
    }
    return `₹${Number(amount).toLocaleString()}`;
  };

  return (
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
                <TableCell colSpan={7} className="text-center py-4">
                  Loading billings...
                </TableCell>
              </TableRow>
            ) : billings.length > 0 ? (
              billings.map((billing) => {
                const user = users[billing.user_id];
                return (
                  <TableRow key={billing.billing_id}>
                    <TableCell className="font-medium">#{billing.billing_id}</TableCell>
                    <TableCell>{user?.username || 'Unknown'}</TableCell>
                    <TableCell>{billing.billing_date ? formatDate(billing.billing_date) : 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(billing.amount)}</TableCell>
                    <TableCell>{billing.payment_method || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${
                          billing.status?.toLowerCase() === 'paid' 
                            ? 'border-green-500 text-green-600 bg-green-50' 
                            : 'border-yellow-500 text-yellow-600 bg-yellow-50'
                        }`}
                      >
                        {billing.status || 'Unknown'}
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
                );
              })
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
      {showViewAll && (
        <div className="py-4 px-6 text-center border-t">
          <Link to="/billings">
            <Button variant="link" className="text-omega-600">
              View all billings
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
};

export default RecentBillings;
