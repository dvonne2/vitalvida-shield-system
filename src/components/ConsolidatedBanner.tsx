
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ConsolidatedBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left side - Logo and titles */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Vitalvida</h1>
              <p className="text-blue-100 text-sm">
                AI-Powered Delivery Agent Portal • Self-service recruitment automation with AI validation
              </p>
            </div>
          </div>

          {/* Right side - Status indicator */}
          <div className="flex items-center">
            <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              AI System Active
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedBanner;
