
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/services/api";
import { toast } from "sonner";

const ProductsList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setIsError(false);
      setConnectionStatus("Connecting to API...");
      
      try {
        console.log("Fetching products from API...");
        const data = await getProducts();
        console.log("Products data received:", data);
        
        if (Array.isArray(data) && data.length === 0) {
          setConnectionStatus("API connected but no products found.");
        } else {
          setConnectionStatus(null);
        }
        
        // Ensure data is always an array
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsError(true);
        setConnectionStatus("Failed to connect to API server.");
        // Initialize with empty array on error
        setProducts([]);
        toast.error("Failed to load products. Please check your connection to the API server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Make sure products is an array before filtering
  const filteredProducts = Array.isArray(products) ? products.filter(
    (product) =>
      product?.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product?.pid?.toString().includes(searchQuery) ||
      product?.basic_price?.toString().includes(searchQuery)
  ) : [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-omega-900">Products</h1>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">
            Unable to connect to the server. Please make sure the backend is running and accessible.
          </p>
        </div>
      )}
      
      {connectionStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <p className="text-blue-800">{connectionStatus}</p>
        </div>
      )}

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by model, ID or price..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Max Watts</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Error loading products
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.pid}>
                    <TableCell className="font-medium">{product.pid}</TableCell>
                    <TableCell>{product.model}</TableCell>
                    <TableCell>{product.max_watts} W</TableCell>
                    <TableCell>
                      ₹{product.basic_price ? parseFloat(product.basic_price).toLocaleString() : '0'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsList;
