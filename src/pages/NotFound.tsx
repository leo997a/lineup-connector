
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-barcelona-primary/10 to-barcelona-secondary/10 p-4">
      <div className="text-center max-w-md w-full bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl p-8 animate-scale-in">
        <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-barcelona-primary to-barcelona-secondary">404</h1>
        <p className="text-xl text-gray-600 mb-6">This page doesn't exist</p>
        <Button 
          onClick={() => window.location.href = '/'} 
          className="bg-barcelona-primary hover:bg-barcelona-primary/90 transition-all duration-300"
        >
          <Home className="mr-2 h-4 w-4" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
