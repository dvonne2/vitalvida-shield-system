
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentApplication from "@/components/AgentApplication";
import ProtectedAdminPanel from "@/components/ProtectedAdminPanel";
import ConsolidatedBanner from "@/components/ConsolidatedBanner";

const Index = () => {
  const [activeTab, setActiveTab] = useState("agent-application");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Consolidated Banner */}
      <ConsolidatedBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Portal */}
        <Card className="shadow-lg">
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
