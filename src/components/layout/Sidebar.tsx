
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { User, Database, Table, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const menuItems = [
    { name: "Dashboard", path: "/", icon: <Database className="h-5 w-5" /> },
    { name: "Customers", path: "/users", icon: <User className="h-5 w-5" /> },
    { name: "Products", path: "/products", icon: <Database className="h-5 w-5" /> },
    { name: "Billings", path: "/billings", icon: <Table className="h-5 w-5" /> },
  ];

  return (
    <div 
      className={`flex flex-col h-screen bg-sidebar transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className={`p-4 flex ${collapsed ? "justify-center" : "justify-between"} items-center border-b border-sidebar-border`}>
        {!collapsed && (
          <div className="text-white font-bold text-2xl">OmegaDB</div>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-sidebar-accent"
        >
          {collapsed ? <ArrowRight /> : <ArrowLeft />}
        </Button>
      </div>

      <div className="mt-6 flex-1">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-all ${
                    location.pathname === item.path ? "bg-sidebar-accent" : ""
                  }`}
                >
                  <div className="flex items-center">
                    {item.icon}
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>

      <div className="p-4 border-t border-sidebar-border text-sidebar-foreground">
        {!collapsed && (
          <div className="text-sm">
            <div>© 2025 OmegaDB</div>
            <div className="text-gray-400">Billing Nexus v1.0</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
