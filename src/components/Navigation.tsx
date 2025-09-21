import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Waves, Fish, Microscope, Map, AlertTriangle } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Waves },
    { path: "/fisheries", label: "Fisheries Dashboard", icon: Fish },
    { path: "/scientists", label: "Scientists Dashboard", icon: Microscope },
    { path: "/ocean-map", label: "Ocean Map", icon: Map },
    { path: "/sos", label: "SOS Alerts", icon: AlertTriangle },
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <Waves className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">NEERVA</h1>
              <p className="text-xs text-muted-foreground">
                AI-Driven Unified Data Platform for Oceanographic, Fisheries,
                and Molecular Biodiversity Insights
              </p>
            </div>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                asChild
                variant={location.pathname === path ? "default" : "ghost"}
                size="sm"
                className="transition-colors"
              >
                <Link to={path} className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;