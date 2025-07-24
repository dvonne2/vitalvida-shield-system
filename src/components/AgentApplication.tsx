
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, CheckCircle, AlertCircle, User, Shield, Phone, Mail, MapPin, FileText, Clock, CheckSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GuarantorData {
  name: string;
  phone: string;
  email: string;
  office: string;
  idDocument: File | null;
  passportPhoto: File | null;
}

interface ApplicationData {
  // Step 1: Basic Personal Info
  fullName: string;
  phone: string;
  whatsapp: string;
  city: string;
  state: string;
  
  // Step 2: Delivery Readiness
  hasSmartphone: string;
  hasVehicle: string;
  hasDriversLicense: string;
  canHouseProducts: string;
  willUsePortal: string;
  aware1500Payment: string;
  aware2500MaxPayment: string;
  deliveryCities: string;
  
  // Step 3: Documents
  passportPhoto: File | null;
  governmentId: File | null;
  
  // Step 4: Guarantors
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
    // Step 1
    fullName: "",
    phone: "",
    whatsapp: "",
    city: "",
    state: "",
    
    // Step 2
    hasSmartphone: "",
    hasVehicle: "",
    hasDriversLicense: "",
    canHouseProducts: "",
    willUsePortal: "",
    aware1500Payment: "",
    aware2500MaxPayment: "",
    deliveryCities: "",
    
    // Step 3
    passportPhoto: null,
    governmentId: null,
    
    // Step 4
    guarantor1: { name: "", phone: "", email: "", office: "", idDocument: null, passportPhoto: null },
    guarantor2: { name: "", phone: "", email: "", office: "", idDocument: null, passportPhoto: null }
  });

  const validateEmail = async (email: string, type: "bank" | "civil") => {
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

  const handleFileUpload = (field: string, file: File | null, guarantorType?: string, fileType?: string) => {
    if (guarantorType && fileType) {
      setFormData(prev => ({
        ...prev,
        [guarantorType]: {
          ...prev[guarantorType as keyof typeof prev.guarantor1],
          [fileType]: file
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const submitApplication = async () => {
    setIsSubmitting(true);
    
    // Simulate form submission with loading animation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast({
      title: "Application Submitted Successfully!",
      description: "Verification emails have been sent to your guarantors. You'll receive updates via WhatsApp and email.",
    });

    setIsSubmitting(false);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.phone && formData.whatsapp && formData.city && formData.state;
      case 2:
        return formData.hasSmartphone && formData.hasVehicle && formData.hasDriversLicense && 
               formData.canHouseProducts && formData.willUsePortal && formData.aware1500Payment && 
               formData.aware2500MaxPayment && formData.deliveryCities;
      case 3:
        return formData.passportPhoto && formData.governmentId;
      case 4:
        return formData.guarantor1.name && formData.guarantor1.phone && formData.guarantor1.email && 
               formData.guarantor1.office && formData.guarantor1.idDocument && formData.guarantor1.passportPhoto &&
               formData.guarantor2.name && formData.guarantor2.phone && formData.guarantor2.email && 
               formData.guarantor2.office && formData.guarantor2.idDocument && formData.guarantor2.passportPhoto &&
               emailValidation.guarantor1 === "valid" && emailValidation.guarantor2 === "valid";
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
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
      case 1: return "Basic Personal Info";
      case 2: return "Delivery Readiness & Self-Disqualification";
      case 3: return "Document Upload";
      case 4: return "Guarantor Details";
      default: return "";
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 1: return <User className="w-5 h-5" />;
      case 2: return <CheckSquare className="w-5 h-5" />;
      case 3: return <FileText className="w-5 h-5" />;
      case 4: return <Shield className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Delivery Agent Application</h1>
        <p className="text-gray-600">Join our network of trusted delivery agents</p>
        <Progress value={(currentStep / 4) * 100} className="max-w-md mx-auto" />
        <div className="text-sm text-gray-500">Step {currentStep} of 4</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Application Form */}
        <div className="lg:col-span-3">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getStepIcon()}
                <span>Step {currentStep}: {getStepTitle()}</span>
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Let's start with your basic information"}
                {currentStep === 2 && "Please answer these questions honestly to ensure you're ready"}
                {currentStep === 3 && "Upload your identification documents"}
                {currentStep === 4 && "Provide details for your two guarantors"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Basic Personal Info */}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City of Residence *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Enter your city"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State of Residence *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="Enter your state"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Delivery Readiness */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Do you have a smartphone? *</Label>
                      <RadioGroup value={formData.hasSmartphone} onValueChange={(value) => handleInputChange("hasSmartphone", value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="smartphone-yes" />
                          <Label htmlFor="smartphone-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="smartphone-no" />
                          <Label htmlFor="smartphone-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Do you have a motorcycle, bicycle, or car? *</Label>
                      <RadioGroup value={formData.hasVehicle} onValueChange={(value) => handleInputChange("hasVehicle", value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="vehicle-yes" />
                          <Label htmlFor="vehicle-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="vehicle-no" />
                          <Label htmlFor="vehicle-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Do you have a Driver's License? *</Label>
                      <RadioGroup value={formData.hasDriversLicense} onValueChange={(value) => handleInputChange("hasDriversLicense", value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="license-yes" />
                          <Label htmlFor="license-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="license-no" />
                          <Label htmlFor="license-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Are you able to house our products at your house or office? *</Label>
                      <RadioGroup value={formData.canHouseProducts} onValueChange={(value) => handleInputChange("canHouseProducts", value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="house-yes" />
                          <Label htmlFor="house-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="house-no" />
                          <Label htmlFor="house-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Are you willing to use the Delivery Agent Portal for updates and communication? *</Label>
                      <RadioGroup value={formData.willUsePortal} onValueChange={(value) => handleInputChange("willUsePortal", value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="portal-yes" />
                          <Label htmlFor="portal-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="portal-no" />
                          <Label htmlFor="portal-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Are you aware that we only pay ₦1,500 for you to go pick up goods and return home? *</Label>
                      <RadioGroup value={formData.aware1500Payment} onValueChange={(value) => handleInputChange("aware1500Payment", value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="payment1500-yes" />
                          <Label htmlFor="payment1500-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="payment1500-no" />
                          <Label htmlFor="payment1500-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Are you aware that we do not pay more than ₦2,500 per delivery? *</Label>
                      <RadioGroup value={formData.aware2500MaxPayment} onValueChange={(value) => handleInputChange("aware2500MaxPayment", value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="payment2500-yes" />
                          <Label htmlFor="payment2500-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="payment2500-no" />
                          <Label htmlFor="payment2500-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="deliveryCities">Which cities in your state would you like to deliver in? *</Label>
                      <Input
                        id="deliveryCities"
                        value={formData.deliveryCities}
                        onChange={(e) => handleInputChange("deliveryCities", e.target.value)}
                        placeholder="e.g. Aba, Umuahia"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Document Upload */}
              {currentStep === 3 && (
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

              {/* Step 4: Guarantor Details */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  {/* Guarantor 1 - Bank Staff */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">👤 Guarantor 1 – Bank Staff</h3>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Government-Issued ID *</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                          <p className="text-xs text-gray-600">Upload ID document</p>
                          <Input 
                            type="file" 
                            accept="image/*,application/pdf" 
                            className="mt-2 text-xs"
                            onChange={(e) => handleFileUpload("", e.target.files?.[0] || null, "guarantor1", "idDocument")}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Passport Photograph *</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                          <p className="text-xs text-gray-600">Upload passport photo</p>
                          <Input 
                            type="file" 
                            accept="image/*" 
                            className="mt-2 text-xs"
                            onChange={(e) => handleFileUpload("", e.target.files?.[0] || null, "guarantor1", "passportPhoto")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Guarantor 2 - Civil Servant */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold">👤 Guarantor 2 – Civil Servant</h3>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Government-Issued ID *</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                          <p className="text-xs text-gray-600">Upload ID document</p>
                          <Input 
                            type="file" 
                            accept="image/*,application/pdf" 
                            className="mt-2 text-xs"
                            onChange={(e) => handleFileUpload("", e.target.files?.[0] || null, "guarantor2", "idDocument")}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Passport Photograph *</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                          <p className="text-xs text-gray-600">Upload passport photo</p>
                          <Input 
                            type="file" 
                            accept="image/*" 
                            className="mt-2 text-xs"
                            onChange={(e) => handleFileUpload("", e.target.files?.[0] || null, "guarantor2", "passportPhoto")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Guarantor Rules */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-medium text-amber-900 mb-2">📌 Guarantor Rules</h4>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• At least 1 guarantor must reside in Lagos</li>
                      <li>• Emails must be valid, verifiable work emails</li>
                      <li>• IDs and addresses will be used for AI-driven KYC validation</li>
                    </ul>
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
                  disabled={!isStepValid() || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : currentStep === 4 ? "Submit Application" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requirements Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-green-200 bg-green-50 sticky top-6">
            <CardContent className="p-4">
              <h4 className="font-medium text-green-900 mb-3 flex items-center">
                <CheckSquare className="w-4 h-4 mr-2" />
                📦 Requirements
              </h4>
              <ul className="text-sm text-green-800 space-y-2">
                <li>• Valid government-issued ID</li>
                <li>• Bank staff guarantor with corporate email</li>
                <li>• Civil servant guarantor with .gov.ng email</li>
                <li>• Working phone and WhatsApp numbers</li>
                <li>• Smartphone and vehicle access</li>
                <li>• Driver's license</li>
                <li>• Ability to house products</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* What Happens Next - Bottom Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            📣 What Happens Next?
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your guarantors will receive verification emails</li>
            <li>• AI will validate all information automatically</li>
            <li>• You'll get updates via WhatsApp and email</li>
            <li>• Processing typically takes 24–48 hours</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentApplication;
