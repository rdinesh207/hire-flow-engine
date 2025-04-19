
import { Loader } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center space-y-4">
        <Loader className="w-12 h-12 text-recruitment-secondary animate-spin" />
        <h3 className="text-xl font-medium">Loading...</h3>
      </div>
    </div>
  );
};

export default LoadingScreen;
