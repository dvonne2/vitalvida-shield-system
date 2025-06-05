
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  AlertTriangle, 
  Shield, 
  Users, 
  FileCheck, 
  Search,
  Filter,
  Download,
  Lock,
  Unlock,
  TrendingDown,
  TrendingUp
} from "lucide-react";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock data for demonstration
  const daApplications = [
    {
      id: "DA001",
      name: "John Adebayo",
      recruiter: "Mike Okafor",
      guarantor: "sarah.johnson@firstbank.com",
      status: "pending_sla",
      trustScore: 85,
      flagCount: 0,
      submittedAt: "2024-01-15T10:30:00Z",
      lastActivity: "2024-01-15T14:20:00Z",
      validations: {
        guarantor: "valid",
        documents: "complete",
        sla: "pending",
        address: "verified"
      }
    },
    {
      id: "DA002", 
      name: "Grace Okonkwo",
      recruiter: "James Okoro",
      guarantor: "david.williams@zenithbank.com",
      status: "approved",
      trustScore: 92,
      flagCount: 0,
      submittedAt: "2024-01-14T09:15:00Z",
      lastActivity: "2024-01-15T16:45:00Z",
      validations: {
        guarantor: "valid",
        documents: "verified",
        sla: "passed",
        address: "verified"
      }
    },
    {
      id: "DA003",
      name: "Ahmed Hassan",
      recruiter: "Susan Igwe",
      guarantor: "invalid@fakeemail.com",
      status: "rejected",
      trustScore: 15,
      flagCount: 3,
      submittedAt: "2024-01-13T11:20:00Z",
      lastActivity: "2024-01-13T11:25:00Z",
      validations: {
        guarantor: "invalid",
        documents: "missing",
        sla: "not_taken",
        address: "pending"
      }
    }
  ];

  const fraudAlerts = [
    {
      id: "F001",
      type: "duplicate_guarantor",
      severity: "high",
      description: "Guarantor email used for multiple DAs",
      targetId: "DA004",
      timestamp: "2024-01-15T15:30:00Z",
      status: "investigating"
    },
    {
      id: "F002", 
      type: "ip_mismatch",
      severity: "medium",
      description: "G1 submission from non-banking IP",
      targetId: "DA005",
      timestamp: "2024-01-15T12:15:00Z",
      status: "blocked"
    },
    {
      id: "F003",
      type: "document_forgery",
      severity: "critical",
      description: "AI detected forged government ID",
      targetId: "DA006",
      timestamp: "2024-01-15T09:45:00Z",
      status: "blocked"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      "approved": "default",
      "pending_sla": "secondary",
      "rejected": "destructive",
      "under_review": "outline"
    };
    const colors = {
      "approved": "bg-green-50 text-green-700 border-green-200",
      "pending_sla": "bg-yellow-50 text-yellow-700 border-yellow-200",
      "rejected": "bg-red-50 text-red-700 border-red-200",
      "under_review": "bg-blue-50 text-blue-700 border-blue-200"
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      "critical": "bg-red-100 text-red-800 border-red-300",
      "high": "bg-orange-100 text-orange-800 border-orange-300",
      "medium": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "low": "bg-blue-100 text-blue-800 border-blue-300"
    };
    
    return (
      <Badge className={colors[severity as keyof typeof colors]}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-red-700">Zero Trust Monitoring & Audit Trail</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-red-100 text-red-800 border-red-300">
              <AlertTriangle className="w-3 h-3 mr-1" />
              3 Active Alerts
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="applications">DA Applications</TabsTrigger>
          <TabsTrigger value="fraud-alerts">Fraud Alerts</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="system-health">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by DA name, ID, or recruiter..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications Table */}
          <div className="space-y-4">
            {daApplications.map((da) => (
              <Card key={da.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{da.name}</h3>
                        {getStatusBadge(da.status)}
                      </div>
                      <p className="text-sm text-gray-600">ID: {da.id}</p>
                      <p className="text-sm text-gray-600">Recruiter: {da.recruiter}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Trust Score:</span>
                        <Badge variant={da.trustScore >= 90 ? "default" : da.trustScore >= 70 ? "secondary" : "destructive"}>
                          {da.trustScore}%
                        </Badge>
                      </div>
                    </div>

                    {/* Guarantor Info */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Guarantor</h4>
                      <p className="text-sm text-gray-600 break-all">{da.guarantor}</p>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600">Bank domain verified</span>
                      </div>
                    </div>

                    {/* Validation Status */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Validations</h4>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Guarantor:</span>
                          <span className={da.validations.guarantor === "valid" ? "text-green-600" : "text-red-600"}>
                            {da.validations.guarantor === "valid" ? "✅" : "❌"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Documents:</span>
                          <span className={da.validations.documents === "verified" ? "text-green-600" : "text-yellow-600"}>
                            {da.validations.documents === "verified" ? "✅" : "🔄"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>SLA:</span>
                          <span className={da.validations.sla === "passed" ? "text-green-600" : "text-yellow-600"}>
                            {da.validations.sla === "passed" ? "✅" : "⏳"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Address:</span>
                          <span className={da.validations.address === "verified" ? "text-green-600" : "text-yellow-600"}>
                            {da.validations.address === "verified" ? "✅" : "📍"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {da.status === "under_review" && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Unlock className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Lock className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                      {da.flagCount > 0 && (
                        <div className="flex items-center space-x-1 text-red-600">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="text-xs">{da.flagCount} flags</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fraud-alerts" className="space-y-4">
          <div className="space-y-4">
            {fraudAlerts.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-red-500">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-gray-900">Alert {alert.id}</span>
                      </div>
                      {getSeverityBadge(alert.severity)}
                    </div>
                    <div className="lg:col-span-2">
                      <h4 className="font-medium text-gray-900 mb-1">{alert.type.replace('_', ' ').toUpperCase()}</h4>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Target: {alert.targetId}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button size="sm" variant="outline">
                        Investigate
                      </Button>
                      <Button size="sm" variant="destructive">
                        Block User
                      </Button>
                      <p className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Audit Trail</CardTitle>
              <CardDescription>All actions are logged and cannot be deleted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                <div className="grid grid-cols-4 gap-4 p-2 bg-gray-50 font-semibold">
                  <span>Timestamp</span>
                  <span>User</span>
                  <span>Action</span>
                  <span>Details</span>
                </div>
                <div className="grid grid-cols-4 gap-4 p-2 border-b">
                  <span>15:30:22</span>
                  <span>admin@vitalvida.com</span>
                  <span>DA_APPROVED</span>
                  <span>DA002 - Grace Okonkwo</span>
                </div>
                <div className="grid grid-cols-4 gap-4 p-2 border-b">
                  <span>15:25:18</span>
                  <span>system</span>
                  <span>FRAUD_DETECTED</span>
                  <span>IP mismatch for DA005</span>
                </div>
                <div className="grid grid-cols-4 gap-4 p-2 border-b">
                  <span>15:20:45</span>
                  <span>admin@vitalvida.com</span>
                  <span>GUARANTOR_FLAGGED</span>
                  <span>Duplicate use detected</span>
                </div>
                <div className="grid grid-cols-4 gap-4 p-2 border-b">
                  <span>15:15:32</span>
                  <span>system</span>
                  <span>SLA_FAILED</span>
                  <span>DA003 - Score: 18/21</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Validation Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Email Validation</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">IP Geolocation</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Facial Recognition</span>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Document Scanner</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Fraud Prevention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Attempts Blocked</span>
                    <Badge variant="destructive">156</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-sm font-medium">99.2%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">False Positives</span>
                    <div className="flex items-center space-x-1">
                      <TrendingDown className="w-3 h-3 text-green-600" />
                      <span className="text-sm font-medium">0.8%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Response Time</span>
                    <span className="text-sm font-medium">1.2s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="text-sm font-medium">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Connections</span>
                    <span className="text-sm font-medium">1,247</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
