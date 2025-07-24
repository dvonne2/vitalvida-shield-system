
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle, AlertCircle, User, Shield, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GuarantorData {
  name: string;
  phone: string;
  email: string;
  office: string;
}

interface ApplicationData {
  fullName: string;
  phone: string;
  whatsapp: string;
  passportPhoto: File | null;
  governmentId: File | null;
  guarantor1: GuarantorData;
  guarantor2: GuarantorData;
}

const AgentApplication = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailValidation, setEmailValidation] = useState({
    guarantor1: "pending",
    guarantor2: "pending"
  });

  const [formData, setFormData] = useState<ApplicationData>({
    fullName: "",
    phone: "",
    whatsapp: "",
    passportPhoto: null,
    governmentId: null,
    guarantor1: { name: "", phone: "", email: "", office: "" },
    guarantor2: { name: "", phone: "", email: "", office: "" }
  });

  const validateEmail = async (email: string, type: "bank" | "civil") => {
    // Simulate email validation
    const isValid = type === "bank" ? 
      email.includes("@") && email.includes(".com") && !email.includes("@gmail") && !email.includes("@yahoo") :
      email.includes("@") && email.includes(".gov.ng");
    
    return isValid;
  };

  const handleEmailValidation = async (email: string, guarantorType: "guarantor1" | "guarantor2") => {
    const type = guarantorType === "guarantor1" ? "bank" : "civil";
    const isValid = await validateEmail(email, type);
    
    setEmailValidation(prev => ({
      ...prev,
      [guarantorType]: isValid ? "valid" : "invalid"
    }));

    if (!isValid) {
      toast({
        title: "Invalid Email",
        description: `${guarantorType === "guarantor1" ? "Bank staff" : "Civil servant"} email must be from ${type === "bank" ? "corporate domain" : ".gov.ng domain"}`,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes("guarantor")) {
      const [guarantor, subField] = field.split(".");
      setFormData(prev => ({
        ...prev,
        [guarantor]: {
          ...prev[guarantor as keyof typeof prev.guarantor1],
          [subField]: value
        }
      }));

      if (subField === "email") {
        handleEmailValidation(value, guarantor as "guarantor1" | "guarantor2");
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const submitApplication = async () => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Application Submitted Successfully!",
      description: "Verification emails have been sent to your guarantors. You'll receive updates via WhatsApp and email.",
    });

    // Reset form or redirect
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      submitApplication();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Personal Information";
      case 2: return "Document Upload";
      case 3: return "Guarantor Details";
      default: return "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Delivery Agent Application</h1>
        <p className="text-gray-600">Join our network of trusted delivery agents</p>
        <Progress value={(currentStep / 3) * 100} className="max-w-md mx-auto" />
      </div>

      {/* Application Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Step {currentStep}: {getStepTitle()}</span>
          </CardTitle>
          <CardDescription>
            All information will be verified automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name as on ID"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+234..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                    placeholder="+234..."
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label>Passport Photograph *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload clear passport photo</p>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="mt-2"
                    onChange={(e) => handleFileUpload("passportPhoto", e.target.files?.[0] || null)}
                  />
                </div>
              </div>
              <div>
                <Label>Government-issued ID *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">National ID, Driver's License, or International Passport</p>
                  <Input 
                    type="file" 
                    accept="image/*,application/pdf" 
                    className="mt-2"
                    onChange={(e) => handleFileUpload("governmentId", e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
              {/* Guarantor 1 - Bank Staff */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Guarantor 1 - Bank Staff</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="g1-name">Full Name *</Label>
                    <Input
                      id="g1-name"
                      value={formData.guarantor1.name}
                      onChange={(e) => handleInputChange("guarantor1.name", e.target.value)}
                      placeholder="Bank staff full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="g1-phone">Phone Number *</Label>
                    <Input
                      id="g1-phone"
                      value={formData.guarantor1.phone}
                      onChange={(e) => handleInputChange("guarantor1.phone", e.target.value)}
                      placeholder="+234..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="g1-email">Corporate Email *</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="g1-email"
                        value={formData.guarantor1.email}
                        onChange={(e) => handleInputChange("guarantor1.email", e.target.value)}
                        placeholder="name@bankname.com"
                        required
                      />
                      {emailValidation.guarantor1 === "valid" && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {emailValidation.guarantor1 === "invalid" && (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="g1-office">Office/Branch *</Label>
                    <Input
                      id="g1-office"
                      value={formData.guarantor1.office}
                      onChange={(e) => handleInputChange("guarantor1.office", e.target.value)}
                      placeholder="Bank branch location"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Guarantor 2 - Civil Servant */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Guarantor 2 - Civil Servant</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="g2-name">Full Name *</Label>
                    <Input
                      id="g2-name"
                      value={formData.guarantor2.name}
                      onChange={(e) => handleInputChange("guarantor2.name", e.target.value)}
                      placeholder="Civil servant full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="g2-phone">Phone Number *</Label>
                    <Input
                      id="g2-phone"
                      value={formData.guarantor2.phone}
                      onChange={(e) => handleInputChange("guarantor2.phone", e.target.value)}
                      placeholder="+234..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="g2-email">Government Email *</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="g2-email"
                        value={formData.guarantor2.email}
                        onChange={(e) => handleInputChange("guarantor2.email", e.target.value)}
                        placeholder="name@agency.gov.ng"
                        required
                      />
                      {emailValidation.guarantor2 === "valid" && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {emailValidation.guarantor2 === "invalid" && (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="g2-office">Office/Agency *</Label>
                    <Input
                      id="g2-office"
                      value={formData.guarantor2.office}
                      onChange={(e) => handleInputChange("guarantor2.office", e.target.value)}
                      placeholder="Government agency/office"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={isSubmitting || (currentStep === 3 && (emailValidation.guarantor1 !== "valid" || emailValidation.guarantor2 !== "valid"))}
            >
              {isSubmitting ? "Submitting..." : currentStep === 3 ? "Submit Application" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-900 mb-2">What Happens Next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your guarantors will receive verification emails</li>
              <li>• AI will validate all information automatically</li>
              <li>• You'll get updates via WhatsApp and email</li>
              <li>• Processing typically takes 24-48 hours</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <h4 className="font-medium text-green-900 mb-2">Requirements</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Valid government-issued ID</li>
              <li>• Bank staff guarantor with corporate email</li>
              <li>• Civil servant guarantor with .gov.ng email</li>
              <li>• Working phone and WhatsApp numbers</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentApplication;
