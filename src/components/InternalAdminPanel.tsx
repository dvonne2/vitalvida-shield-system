import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Bot,
  TrendingUp,
  Users,
  FileCheck,
  Shield
} from "lucide-react";

interface Application {
  id: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  submittedAt: string;
  status: "submitted" | "waiting_guarantor1" | "waiting_guarantor2" | "approved" | "rejected";
  guarantor1: {
    name: string;
    email: string;
    status: "pending" | "verified" | "invalid";
    verifiedAt?: string;
  };
  guarantor2: {
    name: string;
    email: string;
    status: "pending" | "verified" | "invalid";
    verifiedAt?: string;
  };
  documents: {
    passport: boolean;
    governmentId: boolean;
  };
  aiVerdict: {
    status: "processing" | "approved" | "rejected";
    reason?: string;
    confidence: number;
  };
  lastActivity: string;
}

const InternalAdminPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Admin-only metrics dashboard data
  const adminStats = [
    { title: "Active Agents", value: "1,247", icon: Users, trend: "+12%" },
    { title: "Auto-Approved", value: "892", icon: CheckCircle, trend: "+8%" },
    { title: "AI Accuracy", value: "96.2%", icon: Bot, trend: "+2.1%" },
    { title: "Processing Time", value: "< 2 min", icon: TrendingUp, trend: "-15%" },
  ];

  // Application management stats
  const applicationStats = [
    { title: "Total Applications", value: "247", icon: Users, trend: "+12%" },
    { title: "Auto-Approved", value: "89", icon: CheckCircle, trend: "+8%" },
    { title: "Pending Review", value: "15", icon: Clock, trend: "-2%" },
    { title: "AI Accuracy", value: "96.2%", icon: Bot, trend: "+1.5%" },
  ];

  // Mock data for demonstration
  const applications: Application[] = [
    {
      id: "DA001",
      fullName: "John Adebayo",
      phone: "+234812345678",
      whatsapp: "+234812345678",
      submittedAt: "2024-01-15T10:30:00Z",
      status: "approved",
      guarantor1: {
        name: "Sarah Johnson",
        email: "sarah.johnson@firstbank.com",
        status: "verified",
        verifiedAt: "2024-01-15T14:20:00Z"
      },
      guarantor2: {
        name: "David Williams",
        email: "david.williams@finance.gov.ng",
        status: "verified",
        verifiedAt: "2024-01-15T16:45:00Z"
      },
      documents: {
        passport: true,
        governmentId: true
      },
      aiVerdict: {
        status: "approved",
        reason: "All validations passed. Both guarantors verified within 24 hours.",
        confidence: 95
      },
      lastActivity: "2024-01-15T16:45:00Z"
    },
    {
      id: "DA002",
      fullName: "Grace Okonkwo",
      phone: "+234813456789",
      whatsapp: "+234813456789",
      submittedAt: "2024-01-14T09:15:00Z",
      status: "waiting_guarantor2",
      guarantor1: {
        name: "Michael Chen",
        email: "michael.chen@zenithbank.com",
        status: "verified",
        verifiedAt: "2024-01-14T12:30:00Z"
      },
      guarantor2: {
        name: "Amina Hassan",
        email: "amina.hassan@health.gov.ng",
        status: "pending"
      },
      documents: {
        passport: true,
        governmentId: true
      },
      aiVerdict: {
        status: "processing",
        reason: "Waiting for guarantor 2 verification. First reminder sent.",
        confidence: 80
      },
      lastActivity: "2024-01-14T12:30:00Z"
    },
    {
      id: "DA003",
      fullName: "Ahmed Hassan",
      phone: "+234814567890",
      whatsapp: "+234814567890",
      submittedAt: "2024-01-13T11:20:00Z",
      status: "rejected",
      guarantor1: {
        name: "Invalid User",
        email: "fake@gmail.com",
        status: "invalid"
      },
      guarantor2: {
        name: "Another Invalid",
        email: "another@yahoo.com",
        status: "invalid"
      },
      documents: {
        passport: false,
        governmentId: true
      },
      aiVerdict: {
        status: "rejected",
        reason: "Invalid guarantor emails - not from corporate or government domains. Missing passport photo.",
        confidence: 99
      },
      lastActivity: "2024-01-13T11:25:00Z"
    }
  ];

  const getStatusBadge = (status: Application["status"]) => {
    const statusStyles: Record<Application["status"], string> = {
      submitted: "bg-blue-50 text-blue-700 border-blue-200",
      waiting_guarantor1: "bg-yellow-50 text-yellow-700 border-yellow-200",
      waiting_guarantor2: "bg-orange-50 text-orange-700 border-orange-200",
      approved: "bg-green-50 text-green-700 border-green-200",
      rejected: "bg-red-50 text-red-700 border-red-200"
    };
    
    return (
      <Badge className={statusStyles[status]}>
        {status.replace(/_/g, ' ').toUpperCase()}
      </Badge>
    );
  };

  const getVerdictBadge = (verdict: Application["aiVerdict"]) => {
    const verdictStyles: Record<Application["aiVerdict"]["status"], string> = {
      processing: "bg-blue-50 text-blue-700 border-blue-200",
      approved: "bg-green-50 text-green-700 border-green-200",
      rejected: "bg-red-50 text-red-700 border-red-200"
    };
    
    return (
      <Badge className={verdictStyles[verdict.status]}>
        <Bot className="w-3 h-3 mr-1" />
        {verdict.status.toUpperCase()} ({verdict.confidence}%)
      </Badge>
    );
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.phone.includes(searchTerm) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Internal Admin Panel</h2>
            <p className="text-gray-600">AI-Powered Agent Application Management</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-purple-100 text-purple-800 border-purple-300">
              <Bot className="w-3 h-3 mr-1" />
              AI Automation Active
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      {/* Admin-Only Metrics Dashboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">System Overview</h3>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <Shield className="w-3 h-3 mr-1" />
            Admin Access Only
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-600">{stat.trend}</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Application Management Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {applicationStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">{stat.trend}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="system-logs">System Logs</TabsTrigger>
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
                      placeholder="Search by name, phone, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="waiting_guarantor1">Waiting Guarantor 1</option>
                    <option value="waiting_guarantor2">Waiting Guarantor 2</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{app.fullName}</h3>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-sm text-gray-600">ID: {app.id}</p>
                      <p className="text-sm text-gray-600">Phone: {app.phone}</p>
                      <p className="text-xs text-gray-500">
                        Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Documents */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Documents</h4>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Passport:</span>
                          <span className={app.documents.passport ? "text-green-600" : "text-red-600"}>
                            {app.documents.passport ? "✅" : "❌"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Gov ID:</span>
                          <span className={app.documents.governmentId ? "text-green-600" : "text-red-600"}>
                            {app.documents.governmentId ? "✅" : "❌"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Guarantors */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Guarantors</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Bank Staff:</span>
                          <span className={app.guarantor1.status === "verified" ? "text-green-600" : 
                                         app.guarantor1.status === "invalid" ? "text-red-600" : "text-yellow-600"}>
                            {app.guarantor1.status === "verified" ? "✅" : 
                             app.guarantor1.status === "invalid" ? "❌" : "⏳"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Civil Servant:</span>
                          <span className={app.guarantor2.status === "verified" ? "text-green-600" : 
                                         app.guarantor2.status === "invalid" ? "text-red-600" : "text-yellow-600"}>
                            {app.guarantor2.status === "verified" ? "✅" : 
                             app.guarantor2.status === "invalid" ? "❌" : "⏳"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Verdict */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">AI Verdict</h4>
                      {getVerdictBadge(app.aiVerdict)}
                      <p className="text-xs text-gray-600 mt-1">
                        {app.aiVerdict.reason}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <p className="text-xs text-gray-500">
                        Last activity: {new Date(app.lastActivity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span>AI Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-approval Rate</span>
                    <span className="font-medium">89%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fraud Detection</span>
                    <span className="font-medium">98.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Processing Time</span>
                    <span className="font-medium">&lt; 2 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Common Issues</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Invalid guarantor emails</span>
                    <span className="text-red-600">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Missing documents</span>
                    <span className="text-orange-600">32%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>No guarantor response</span>
                    <span className="text-yellow-600">23%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent System Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                <div className="grid grid-cols-4 gap-4 p-2 bg-gray-50 font-semibold">
                  <span>Time</span>
                  <span>Event</span>
                  <span>ID</span>
                  <span>Status</span>
                </div>
                <div className="grid grid-cols-4 gap-4 p-2 border-b">
                  <span>15:30:22</span>
                  <span>AUTO_APPROVED</span>
                  <span>DA001</span>
                  <span className="text-green-600">SUCCESS</span>
                </div>
                <div className="grid grid-cols-4 gap-4 p-2 border-b">
                  <span>15:25:18</span>
                  <span>GUARANTOR_REMINDED</span>
                  <span>DA002</span>
                  <span className="text-yellow-600">PENDING</span>
                </div>
                <div className="grid grid-cols-4 gap-4 p-2 border-b">
                  <span>15:20:45</span>
                  <span>EMAIL_INVALID</span>
                  <span>DA003</span>
                  <span className="text-red-600">REJECTED</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InternalAdminPanel;
