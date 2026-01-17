import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <h1 className="text-9xl font-bold text-primary">
        404
      </h1>
      <h2 className="text-xl font-semibold mb-4">
        Oops! Page not found
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        The page you're looking for doesn't exist.
      </p>
      <Button asChild>
        <a href="/" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Return to Home
        </a>
      </Button>
    </div>
  );
};

export default NotFound;
