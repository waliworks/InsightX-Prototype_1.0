
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-border max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-6">
          <span className="text-3xl font-bold">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <Button asChild variant="default">
            <Link to="/" className="flex items-center gap-2">
              <Home size={18} />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Previous Page
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
