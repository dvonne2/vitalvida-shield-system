
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Bot } from "lucide-react";
import AgentApplication from "@/components/AgentApplication";
import ProtectedAdminPanel from "@/components/ProtectedAdminPanel";

const Index = () => {
  const [activeTab, setActiveTab] = useState("agent-application");

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
                <p className="text-xs text-gray-500">AI-Powered Delivery Agent Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                AI System Active
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Portal */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>AI-Powered Delivery Agent Portal</span>
            </CardTitle>
            <CardDescription className="text-blue-100">
              Self-service recruitment automation with AI validation
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
                <TabsTrigger value="agent-application" className="data-[state=active]:bg-blue-50">
                  Agent Application
                </TabsTrigger>
                <TabsTrigger value="internal-admin" className="data-[state=active]:bg-blue-50">
                  Internal Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="agent-application" className="p-6">
                <AgentApplication />
              </TabsContent>

              <TabsContent value="internal-admin" className="p-6">
                <ProtectedAdminPanel />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
