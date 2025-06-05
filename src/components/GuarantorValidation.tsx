
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Upload, CheckCircle, XCircle, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GuarantorValidation = () => {
  const { toast } = useToast();
  const [guarantorData, setGuarantorData] = useState({
    email: "",
    fullName: "",
    bankName: "",
    staffId: "",
    phone: "",
    documents: {
      passport: null,
      govId: null,
      staffId: null,
      utilityBill: null,
      selfie: null,
    }
  });

  const [validationResults, setValidationResults] = useState({
    emailDomain: "pending", // valid, invalid, pending
    ipLocation: "pending", // valid, invalid, pending
    facialMatch: "pending", // valid, invalid, pending
    documentAuth: "pending", // valid, invalid, pending
    duplicateCheck: "pending", // valid, invalid, pending
  });

  const handleEmailValidation = () => {
    const bankDomainRegex = /.*@.*bank.*\.com$/i;
    if (bankDomainRegex.test(guarantorData.email)) {
      setValidationResults(prev => ({ ...prev, emailDomain: "valid" }));
      toast({
        title: "Email Domain Valid",
        description: "Corporate bank email detected. Sending verification link...",
      });
    } else {
      setValidationResults(prev => ({ ...prev, emailDomain: "invalid" }));
      toast({
        title: "Invalid Email Domain",
        description: "Email must be from a bank domain (@*bank*.com)",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "invalid":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "valid":
        return "✅ Valid";
      case "invalid":
        return "❌ Invalid";
      default:
        return "⏳ Pending";
    }
  };

  const validationChecks = [
    { key: "emailDomain", label: "Corporate Bank Email", description: "Must match *@*bank*.com pattern" },
    { key: "ipLocation", label: "IP Address Match", description: "Must originate from Nigerian banking infrastructure" },
    { key: "facialMatch", label: "Facial Verification", description: "Selfie must match government ID photo" },
    { key: "documentAuth", label: "Document Authentication", description: "All documents must be authentic and current" },
    { key: "duplicateCheck", label: "Duplicate Prevention", description: "Cannot guarantee multiple DAs simultaneously" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Guarantor 1 (G1) Auto-Validation</h2>
            <p className="text-green-700">System-only validation. No manual override permitted.</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-800">Legal Notice</span>
          </div>
          <p className="text-sm text-red-700">
            You are personally liable up to ₦2,000,000 if this DA disappears or commits fraud. 
            Only proceed if you personally know and trust this individual.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>G1 Contact Information</CardTitle>
              <CardDescription>
                This form must be completed by the guarantor themselves via secure email link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Corporate Bank Email</Label>
                <div className="flex space-x-2">
                  <Input
                    id="email"
                    type="email"
                    value={guarantorData.email}
                    onChange={(e) => setGuarantorData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.name@bankname.com"
                    className="flex-1"
                  />
                  <Button onClick={handleEmailValidation} variant="outline">
                    Validate
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must match regex pattern: .*@.*bank.*\.com$
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={guarantorData.fullName}
                    onChange={(e) => setGuarantorData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="As on government ID"
                  />
                </div>
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={guarantorData.bankName}
                    onChange={(e) => setGuarantorData(prev => ({ ...prev, bankName: e.target.value }))}
                    placeholder="Full bank name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="staffId">Staff ID</Label>
                  <Input
                    id="staffId"
                    value={guarantorData.staffId}
                    onChange={(e) => setGuarantorData(prev => ({ ...prev, staffId: e.target.value }))}
                    placeholder="Employee ID number"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={guarantorData.phone}
                    onChange={(e) => setGuarantorData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+234..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>
                All documents must be uploaded by the guarantor personally
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Passport Photograph</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Upload passport photo</p>
                    <Input type="file" accept="image/*" className="mt-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Government ID</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">NIN/Passport/Driver's License</p>
                    <Input type="file" accept="image/*" className="mt-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bank Staff ID/Employment Letter</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Official bank documentation</p>
                    <Input type="file" accept="image/*,application/pdf" className="mt-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Utility Bill</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Not older than 3 months</p>
                    <Input type="file" accept="image/*,application/pdf" className="mt-2" />
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label>Facial Verification Selfie</Label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50">
                  <Upload className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                  <p className="text-sm text-blue-700 font-medium">
                    Take a clear selfie holding your government ID
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    AI will compare your face to the ID photo for verification
                  </p>
                  <Input type="file" accept="image/*" capture="user" className="mt-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Validation Status */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Auto-Validation Results</CardTitle>
              <CardDescription>Real-time system validation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {validationChecks.map((check) => (
                <div key={check.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{check.label}</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(validationResults[check.key as keyof typeof validationResults])}
                      <Badge variant="outline" className="text-xs">
                        {getStatusText(validationResults[check.key as keyof typeof validationResults])}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{check.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-600">System Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Email domain check initiated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>IP geolocation pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Awaiting document upload</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Geographic Validation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">IP Location Check</span>
              </div>
              <p className="text-xs text-gray-600">
                Validating Nigerian banking infrastructure IP range...
              </p>
              <div className="mt-3 p-3 bg-gray-50 rounded text-xs">
                <strong>Current IP:</strong> 197.210.xxx.xxx<br />
                <strong>ISP:</strong> Pending verification<br />
                <strong>Location:</strong> Lagos, Nigeria
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GuarantorValidation;
