
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1C1C1C] via-[#2A1B3D] to-[#1C1C1C] text-[#F1F5F9]">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <AlertTriangle className="w-24 h-24 mx-auto mb-6 text-[#B3A369]" />
          <h1 className="text-6xl md:text-8xl font-display font-bold text-[#B3A369] mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#F1F5F9]">
            Cosmic Route Not Found
          </h2>
          <p className="text-lg text-[#A0A0A0] mb-8 max-w-lg mx-auto">
            Looks like you've drifted into uncharted cosmic space. The page you're looking for doesn't exist in our galaxy.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleGoHome}
            className="bg-gradient-to-r from-[#B3A369] to-[#CD7F32] hover:from-[#CD7F32] hover:to-[#B3A369] text-[#1C1C1C] font-bold px-8 py-4 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Planet CUHZ
          </Button>
          
          <p className="text-sm text-[#A0A0A0] mt-4">
            Route attempted: <code className="bg-[#232323] px-2 py-1 rounded text-[#B3A369]">{location.pathname}</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
