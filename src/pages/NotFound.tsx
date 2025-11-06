import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-card-foreground">Page Not Found</h2>
          <p className="text-text-muted">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="default" 
            onClick={() => window.history.back()}
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={() => window.location.href = "/"}
            className="bg-secondary hover:bg-secondary-hover text-secondary-foreground"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
