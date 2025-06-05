
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, FileCheck, AlertTriangle, Eye, TrendingUp } from "lucide-react";
import DARegistration from "@/components/DARegistration";
import GuarantorValidation from "@/components/GuarantorValidation";
import AdminDashboard from "@/components/AdminDashboard";
import RecruiterPortal from "@/components/RecruiterPortal";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { title: "Active DAs", value: "1,247", icon: Users, trend: "+12%" },
    { title: "Valid Guarantors", value: "892", icon: Shield, trend: "+8%" },
    { title: "KYC Completed", value: "94.2%", icon: FileCheck, trend: "+2.1%" },
    { title: "Fraud Blocked", value: "156", icon: AlertTriangle, trend: "-5%" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Vitalvida</h1>
                <p className="text-xs text-gray-500">KYC & Recruitment Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                System Secure
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
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

        {/* Main Portal */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Zero-Trust KYC Portal</span>
            </CardTitle>
            <CardDescription className="text-blue-100">
              Fraud Prevention SOP - No manual overrides permitted
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
                <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="da-registration" className="data-[state=active]:bg-blue-50">
                  DA Registration
                </TabsTrigger>
                <TabsTrigger value="guarantor" className="data-[state=active]:bg-blue-50">
                  Guarantor Validation
                </TabsTrigger>
                <TabsTrigger value="admin" className="data-[state=active]:bg-blue-50">
                  Admin Dashboard
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-6">
                <RecruiterPortal />
              </TabsContent>

              <TabsContent value="da-registration" className="p-6">
                <DARegistration />
              </TabsContent>

              <TabsContent value="guarantor" className="p-6">
                <GuarantorValidation />
              </TabsContent>

              <TabsContent value="admin" className="p-6">
                <AdminDashboard />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
