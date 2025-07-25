
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, LogOut, Shield } from 'lucide-react';
import InternalAdminPanel from './InternalAdminPanel';
import AdminLogin from './AdminLogin';

const ProtectedAdminPanel = () => {
  const { isAdminLoggedIn, logout } = useAdminAuth();

  if (!isAdminLoggedIn) {
    return <AdminLogin />;
  }

  return (
    <div className="space-y-4">
      {/* Demo Warning Banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-800">Demo Mode Active</span>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
              <Shield className="w-3 h-3 mr-1" />
              Frontend-Only Auth
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        <p className="text-sm text-orange-700 mt-2">
          This admin panel is using temporary frontend authentication. 
          Production version will use secure Laravel backend authentication.
        </p>
      </div>

      {/* Admin Panel Content */}
      <InternalAdminPanel />
    </div>
  );
};

export default ProtectedAdminPanel;
