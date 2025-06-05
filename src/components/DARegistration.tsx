
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Upload, MapPin, User, Phone, Mail, FileText, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DARegistration = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    lga: "",
    state: "",
    guarantorEmail: "",
    nin: "",
    passportPhoto: null,
    govId: null,
    addressProof: null,
  });

  const [validationStatus, setValidationStatus] = useState({
    guarantor: "pending", // pending, valid, invalid
    sla: "not_taken", // not_taken, passed, failed
    documents: "incomplete", // incomplete, complete, verified
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const submitStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Step Completed",
        description: `Step ${currentStep} saved successfully.`,
      });
    } else {
      toast({
        title: "Application Submitted",
        description: "Your DA registration is now under review.",
      });
    }
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "complete";
    if (step === currentStep) return "current";
    return "pending";
  };

  const steps = [
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Documents", icon: FileText },
    { id: 3, title: "Guarantor", icon: Shield },
    { id: 4, title: "SLA Exam", icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Delivery Agent Registration</h2>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Zero Trust Mode
          </Badge>
        </div>
        <Progress value={(currentStep / 4) * 100} className="mb-4" />
        <div className="grid grid-cols-4 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const status = getStepStatus(step.id);
            return (
              <div
                key={step.id}
                className={`flex items-center space-x-2 p-3 rounded-lg ${
                  status === "complete"
                    ? "bg-green-100 text-green-800"
                    : status === "current"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
              <CardDescription>
                All fields are required and will be auto-validated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="Enter full name as on ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+234..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@domain.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Complete residential address"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lga">LGA</Label>
                      <Input
                        id="lga"
                        value={formData.lga}
                        onChange={(e) => handleInputChange("lga", e.target.value)}
                        placeholder="Local Government Area"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="nin">NIN (National Identification Number)</Label>
                    <Input
                      id="nin"
                      value={formData.nin}
                      onChange={(e) => handleInputChange("nin", e.target.value)}
                      placeholder="11-digit NIN"
                      maxLength={11}
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Passport Photograph</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Upload clear passport photo</p>
                        <Input type="file" accept="image/*" className="mt-2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Government ID</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">NIN/Passport/Driver's License</p>
                        <Input type="file" accept="image/*" className="mt-2" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Proof of Address</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Utility bill (not older than 3 months)</p>
                      <Input type="file" accept="image/*,application/pdf" className="mt-2" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Important Notice</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-2">
                      Your guarantor must be a bank employee with a corporate email address. 
                      They will receive a secure verification link and must submit their own documents.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="guarantorEmail">Guarantor's Bank Email</Label>
                    <Input
                      id="guarantorEmail"
                      type="email"
                      value={formData.guarantorEmail}
                      onChange={(e) => handleInputChange("guarantorEmail", e.target.value)}
                      placeholder="guarantor@bankname.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Must match pattern: *@*bank*.com*
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">SLA Examination</h3>
                    <p className="text-sm text-blue-700">
                      You must score minimum 20/21 to pass. The exam covers delivery protocols, 
                      customer service standards, and fraud prevention procedures.
                    </p>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Start SLA Exam
                  </Button>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <Button onClick={submitStep}>
                  {currentStep === 4 ? "Submit Application" : "Next Step"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Validation Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Guarantor Verification</span>
                <Badge variant={validationStatus.guarantor === "valid" ? "default" : "secondary"}>
                  {validationStatus.guarantor === "pending" ? "⏳ Pending" : 
                   validationStatus.guarantor === "valid" ? "✅ Valid" : "❌ Invalid"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SLA Exam</span>
                <Badge variant={validationStatus.sla === "passed" ? "default" : "secondary"}>
                  {validationStatus.sla === "not_taken" ? "⏳ Not Taken" : 
                   validationStatus.sla === "passed" ? "✅ Passed" : "❌ Failed"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Document Verification</span>
                <Badge variant={validationStatus.documents === "verified" ? "default" : "secondary"}>
                  {validationStatus.documents === "incomplete" ? "⏳ Incomplete" : 
                   validationStatus.documents === "complete" ? "🔄 Reviewing" : "✅ Verified"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-red-600">Fraud Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-red-700">
                <p>• Any false information will result in permanent ban</p>
                <p>• Guarantor liability up to ₦2,000,000</p>
                <p>• All submissions are logged and monitored</p>
                <p>• IP address and device fingerprinting active</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DARegistration;
