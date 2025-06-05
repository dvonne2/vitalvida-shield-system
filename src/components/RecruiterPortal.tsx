
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Plus, TrendingDown, TrendingUp, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RecruiterPortal = () => {
  const { toast } = useToast();
  const [recruiterData] = useState({
    name: "Mike Okafor",
    id: "REC001",
    trustScore: 85,
    totalSubmissions: 12,
    approved: 8,
    pending: 2,
    rejected: 2,
    lastSubmission: "2024-01-15",
    canSubmit: true,
    violations: 1,
    payoutEligible: true
  });

  const [myDAs] = useState([
    {
      id: "DA001",
      name: "John Adebayo",
      status: "pending_sla",
      submittedDate: "2024-01-15",
      guarantor: "sarah.johnson@firstbank.com",
      slaScore: null,
      deliveryStatus: "not_started",
      earnings: 0
    },
    {
      id: "DA002",
      name: "Grace Okonkwo", 
      status: "active",
      submittedDate: "2024-01-10",
      guarantor: "david.williams@zenithbank.com",
      slaScore: 21,
      deliveryStatus: "completed_first",
      earnings: 15000
    },
    {
      id: "DA003",
      name: "Ahmed Hassan",
      status: "rejected",
      submittedDate: "2024-01-08",
      guarantor: "invalid@fakeemail.com",
      slaScore: null,
      deliveryStatus: "blocked",
      earnings: -68000
    }
  ]);

  const handleNewSubmission = () => {
    if (!recruiterData.canSubmit) {
      toast({
        title: "Submission Blocked",
        description: "Complete pending DA requirements before submitting new candidates.",
        variant: "destructive",
      });
      return;
    }
    
    if (recruiterData.trustScore < 70) {
      toast({
        title: "Trust Score Too Low",
        description: "Your trust score must be ≥70 to submit new DAs.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "New DA Submission",
      description: "Redirecting to DA registration form...",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      "pending_sla": "bg-yellow-50 text-yellow-700 border-yellow-200",
      "active": "bg-green-50 text-green-700 border-green-200",
      "rejected": "bg-red-50 text-red-700 border-red-200",
      "under_review": "bg-blue-50 text-blue-700 border-blue-200"
    };
    
    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Recruiter Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recruiter Portal</h2>
            <p className="text-gray-600">Welcome back, {recruiterData.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Recruiter ID</p>
            <p className="font-mono text-lg">{recruiterData.id}</p>
          </div>
        </div>

        {/* Trust Score & Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Trust Score</p>
                  <p className={`text-2xl font-bold ${getTrustScoreColor(recruiterData.trustScore)}`}>
                    {recruiterData.trustScore}%
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${recruiterData.trustScore >= 90 ? 'bg-green-500' : recruiterData.trustScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total DAs</p>
                  <p className="text-2xl font-bold text-gray-900">{recruiterData.totalSubmissions}</p>
                </div>
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((recruiterData.approved / recruiterData.totalSubmissions) * 100)}%
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Violations</p>
                  <p className="text-2xl font-bold text-red-600">{recruiterData.violations}</p>
                </div>
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Warning Messages */}
      {recruiterData.violations > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-800">
                Your last DA cost Vitalvida ₦68,000. Don't make that mistake again.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {recruiterData.trustScore < 70 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-800">
                Trust score below 70%. New DA submissions are blocked until improvement.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">My Delivery Agents</h3>
        <Button 
          onClick={handleNewSubmission}
          disabled={!recruiterData.canSubmit || recruiterData.trustScore < 70}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Submit New DA
        </Button>
      </div>

      {/* Submission Rules */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">Submission Rules</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• One DA submission at a time</li>
            <li>• Must wait until current DA passes SLA and completes first delivery</li>
            <li>• Trust score must be ≥70</li>
            <li>• No payment until DA makes successful delivery</li>
          </ul>
        </CardContent>
      </Card>

      {/* DA List */}
      <div className="space-y-4">
        {myDAs.map((da) => (
          <Card key={da.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">{da.name}</h4>
                  <p className="text-sm text-gray-600">ID: {da.id}</p>
                  <p className="text-sm text-gray-500">Submitted: {da.submittedDate}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  {getStatusBadge(da.status)}
                  <p className="text-xs text-gray-500">
                    Guarantor: {da.guarantor.length > 25 ? da.guarantor.substring(0, 25) + '...' : da.guarantor}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">SLA Score</p>
                  {da.slaScore ? (
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${da.slaScore >= 20 ? 'text-green-600' : 'text-red-600'}`}>
                        {da.slaScore}/21
                      </span>
                      {da.slaScore >= 20 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  ) : (
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Delivery Status</p>
                  <Badge variant={da.deliveryStatus === "completed_first" ? "default" : "secondary"}>
                    {da.deliveryStatus.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Earnings Impact</p>
                  <div className="flex items-center space-x-1">
                    {da.earnings >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`font-bold ${da.earnings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₦{Math.abs(da.earnings).toLocaleString()}
                    </span>
                  </div>
                  {da.earnings < 0 && (
                    <p className="text-xs text-red-600">Loss from fraud/disappearance</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payout Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payout Status</CardTitle>
          <CardDescription>
            Payments are only released after successful DA deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pending Earnings</p>
              <p className="text-2xl font-bold text-yellow-600">₦0</p>
              <p className="text-xs text-gray-500">Awaiting DA deliveries</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Available for Payout</p>
              <p className="text-2xl font-bold text-green-600">₦15,000</p>
              <p className="text-xs text-gray-500">From successful DAs</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Losses</p>
              <p className="text-2xl font-bold text-red-600">₦68,000</p>
              <p className="text-xs text-gray-500">From fraud incidents</p>
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              disabled={!recruiterData.payoutEligible}
              className="w-full"
            >
              Request Payout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterPortal;
