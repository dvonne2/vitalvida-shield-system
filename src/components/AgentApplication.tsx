import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, CheckCircle, AlertCircle, User, Shield, Phone, Mail, MapPin, FileText, Clock, CheckSquare, Rocket, House, MapPinIcon, X } from "lucide-react";
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
  utilityBill: File | null; // NEW FIELD
  
  // Step 4: Guarantors
  guarantor1: GuarantorData;
  guarantor2: GuarantorData;
}

const AgentApplication = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
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
    aware1500Payment: "yes", // Set to "yes" by default since it's automatically accepted
    aware2500MaxPayment: "yes", // Set to "yes" by default since it's automatically accepted
    deliveryCities: "",
    
    // Step 3
    passportPhoto: null,
    governmentId: null,
    utilityBill: null, // NEW FIELD
    
    // Step 4
    guarantor1: { name: "", phone: "", email: "", office: "", idDocument: null, passportPhoto: null },
    guarantor2: { name: "", phone: "", email: "", office: "", idDocument: null, passportPhoto: null }
  });

  const validateFile = (file: File, field: string) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload only JPG, PNG, or PDF files.",
        variant: "destructive",
      });
      return false;
    }
    
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload files smaller than 5MB.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const simulateUpload = (field: string) => {
    setUploadProgress(prev => ({ ...prev, [field]: 0 }));
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev[field] + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadProgress(prev => ({ ...prev, [field]: 0 }));
          }, 1000);
          return { ...prev, [field]: 100 };
        }
        return { ...prev, [field]: newProgress };
      });
    }, 200);
  };

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
    if (!file) return;
    
    if (!validateFile(file, field)) return;
    
    simulateUpload(field);
    
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

  const handleDrop = (e: React.DragEvent, field: string, guarantorType?: string, fileType?: string) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(field, file, guarantorType, fileType);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (field: string, guarantorType?: string, fileType?: string) => {
    if (guarantorType && fileType) {
      setFormData(prev => ({
        ...prev,
        [guarantorType]: {
          ...prev[guarantorType as keyof typeof prev.guarantor1],
          [fileType]: null
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: null }));
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
        // Simplified validation - we automatically set the payment awareness fields to "yes"
        return formData.hasSmartphone && formData.hasVehicle && formData.hasDriversLicense && 
               formData.canHouseProducts && formData.willUsePortal && formData.deliveryCities;
      case 3:
        return formData.passportPhoto && formData.governmentId && formData.utilityBill;
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
      case 2: return "Delivery Agent Readiness Assessment";
      case 3: return "Document Upload";
      case 4: return "Guarantor Details";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Let's start with your basic information";
      case 2: return "Help us understand if you're ready to start delivering with Vitalvida";
      case 3: return "Upload your identification documents";
      case 4: return "Provide details for your two guarantors";
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

  const FileUploadArea = ({ 
    field, 
    label, 
    helpText, 
    file, 
    guarantorType, 
    fileType 
  }: {
    field: string;
    label: string;
    helpText: string;
    file: File | null;
    guarantorType?: string;
    fileType?: string;
  }) => {
    const progress = uploadProgress[field] || 0;
    const isUploading = progress > 0 && progress < 100;
    
    return (
      <div className="space-y-2">
        <Label className="text-base font-medium text-slate-700">
          {label} <span className="text-red-500">*</span>
        </Label>
        <div
          className={`border-2 border-dashed rounded-xl p-6 transition-colors ${
            file ? 'border-green-300 bg-green-50' : 'border-slate-300 bg-slate-50 hover:border-slate-400'
          }`}
          onDrop={(e) => handleDrop(e, field, guarantorType, fileType)}
          onDragOver={handleDragOver}
        >
          {file ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(field, guarantorType, fileType)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {isUploading && (
                <div className="space-y-2">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600">Uploading... {progress}%</p>
                </div>
              )}
              {progress === 100 && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <p className="text-sm font-medium">Upload successful!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Drop files here or click to browse</p>
                <p className="text-xs text-slate-500 mt-1">{helpText}</p>
                <p className="text-xs text-slate-400 mt-2">Supported formats: JPG, PNG, PDF • Max size: 5MB</p>
              </div>
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                className="hidden"
                id={field}
                onChange={(e) => handleFileUpload(field, e.target.files?.[0] || null, guarantorType, fileType)}
              />
              <Label
                htmlFor={field}
                className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer transition-colors"
              >
                Choose File
              </Label>
            </div>
          )}
        </div>
      </div>
    );
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
            {/* Step 2 Header */}
            {currentStep === 2 && (
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <CheckSquare className="w-5 h-5" />
                  <span>Step 2: Delivery Agent Readiness Assessment</span>
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Help us understand if you're ready to start delivering with Vitalvida
                </CardDescription>
                <div className="mt-4">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </CardHeader>
            )}

            {/* Step 3 Header */}
            {currentStep === 3 && (
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Step 3: Document Upload</span>
                </CardTitle>
                <CardDescription className="text-green-100">
                  Upload your identification documents
                </CardDescription>
                <div className="mt-4">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </CardHeader>
            )}

            {/* Other Steps Header */}
            {currentStep !== 2 && currentStep !== 3 && (
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getStepIcon()}
                  <span>Step {currentStep}: {getStepTitle()}</span>
                </CardTitle>
                <CardDescription>
                  {getStepDescription()}
                </CardDescription>
              </CardHeader>
            )}

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

              {/* Step 2: Delivery Readiness Assessment */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  {/* Essential Requirements Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <Rocket className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-semibold text-gray-900">Essential Requirements</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                        <Label className="text-base font-medium text-slate-700">
                          Do you have a smartphone? <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup 
                          value={formData.hasSmartphone} 
                          onValueChange={(value) => handleInputChange("hasSmartphone", value)}
                          className="mt-3"
                        >
                          <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <RadioGroupItem value="yes" id="smartphone-yes" />
                            <Label htmlFor="smartphone-yes" className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <RadioGroupItem value="no" id="smartphone-no" />
                            <Label htmlFor="smartphone-no" className="cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                        <p className="text-sm text-slate-600 mt-2 italic">Required for receiving delivery requests and navigation</p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                        <Label className="text-base font-medium text-slate-700">
                          Do you have reliable transportation? <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup 
                          value={formData.hasVehicle} 
                          onValueChange={(value) => handleInputChange("hasVehicle", value)}
                          className="mt-3"
                        >
                          <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <RadioGroupItem value="yes" id="vehicle-yes" />
                            <Label htmlFor="vehicle-yes" className="cursor-pointer">Yes (motorcycle, bicycle, or car)</Label>
                          </div>
                          <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <RadioGroupItem value="no" id="vehicle-no" />
                            <Label htmlFor="vehicle-no" className="cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                        <Label className="text-base font-medium text-slate-700">
                          Do you have a valid Driver's License? <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup 
                          value={formData.hasDriversLicense} 
                          onValueChange={(value) => handleInputChange("hasDriversLicense", value)}
                          className="mt-3"
                        >
                          <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <RadioGroupItem value="yes" id="license-yes" />
                            <Label htmlFor="license-yes" className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <RadioGroupItem value="no" id="license-no" />
                            <Label htmlFor="license-no" className="cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                        <p className="text-sm text-slate-600 mt-2 italic">Required for vehicle operation and identity verification</p>
                      </div>
                    </div>
                  </div>

                  {/* Storage & Communication Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <House className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-semibold text-gray-900">Storage & Communication</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                        <Label className="text-base font-medium text-slate-700">
                          Can you safely store products at your location? <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup 
                          value={formData.canHouseProducts} 
                          onValueChange={(value) => handleInputChange("canHouseProducts", value)}
                          className="mt-3"
                        >
                          <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <RadioGroupItem value="yes" id="house-yes" />
                            <Label htmlFor="house-yes" className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <RadioGroupItem value="no" id="house-no" />
                            <Label htmlFor="house-no" className="cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                        <p className="text-sm text-slate-600 mt-2 italic">Secure storage space needed for inventory management</p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                        <Label className="text-base font-medium text-slate-700">
                          Are you comfortable using our Delivery Agent Portal? <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup 
                          value={formData.willUsePortal} 
                          onValueChange={(value) => handleInputChange("willUsePortal", value)}
                          className="mt-3"
                        >
                          <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <RadioGroupItem value="yes" id="portal-yes" />
                            <Label htmlFor="portal-yes" className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <RadioGroupItem value="no" id="portal-no" />
                            <Label htmlFor="portal-no" className="cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                        <p className="text-sm text-slate-600 mt-2 italic">Our portal handles updates, communications, and payment tracking</p>
                      </div>
                    </div>
                  </div>

                  {/* Compensation Highlight */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
                    <div className="flex items-center space-x-2 text-amber-900 font-semibold mb-3">
                      <span className="text-lg">💰</span>
                      <span>Compensation Structure</span>
                    </div>
                    <div className="text-amber-800 space-y-1">
                      <div>• <strong>₦1,500</strong> per pickup and return trip</div>
                      <div>• <strong>Maximum ₦2,500</strong> per delivery</div>
                      <div>• Weekly payments via our portal</div>
                    </div>
                  </div>

                  {/* Delivery Areas Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-semibold text-gray-900">Delivery Areas</h3>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                      <Label htmlFor="deliveryCities" className="text-base font-medium text-slate-700">
                        Which cities would you like to deliver in? <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="deliveryCities"
                        value={formData.deliveryCities}
                        onChange={(e) => handleInputChange("deliveryCities", e.target.value)}
                        placeholder="e.g., Lagos, Abuja, Port Harcourt"
                        className="mt-3"
                        required
                      />
                      <p className="text-sm text-slate-600 mt-2 italic">List all cities where you're available to make deliveries</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Enhanced Document Upload */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-semibold text-gray-900">Required Documents</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <FileUploadArea
                        field="passportPhoto"
                        label="Passport Photograph"
                        helpText="Upload a clear, recent passport-style photo"
                        file={formData.passportPhoto}
                      />
                      
                      <FileUploadArea
                        field="governmentId"
                        label="Government-issued ID"
                        helpText="National ID, Driver's License, or International Passport"
                        file={formData.governmentId}
                      />
                      
                      <FileUploadArea
                        field="utilityBill"
                        label="Utility Bill or Address Proof"
                        helpText="Upload a recent utility bill, bank statement, or government correspondence showing your current address"
                        file={formData.utilityBill}
                      />
                    </div>
                  </div>

                  {/* Address Verification Info */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <div className="flex items-center space-x-2 text-amber-900 font-semibold mb-3">
                      <MapPin className="w-5 h-5" />
                      <span>Address Verification</span>
                    </div>
                    <div className="text-amber-800 space-y-2">
                      <p>• Document must show your current home address for delivery logistics and verification</p>
                      <p>• Address on utility bill must match your residential address provided in Step 1</p>
                      <p>• Document must be dated within the last 3 months</p>
                    </div>
                  </div>

                  {/* File Requirements */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center space-x-2 text-blue-900 font-semibold mb-3">
                      <CheckCircle className="w-5 h-5" />
                      <span>File Requirements</span>
                    </div>
                    <div className="text-blue-800 space-y-1">
                      <p>• Accepted formats: JPG, PNG, PDF only</p>
                      <p>• Maximum file size: 5MB per document</p>
                      <p>• Ensure documents are clear and readable</p>
                      <p>• All three documents must be uploaded to proceed</p>
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
                      <li>• IDs and addresses will be used for automated KYC validation</li>
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
                  className="px-6 py-2"
                >
                  Previous
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid() || isSubmitting}
                  className={`px-6 py-2 ${
                    currentStep === 2 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl" 
                      : currentStep === 3
                      ? "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
                      : ""
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : currentStep === 4 ? "Submit Application" : currentStep === 2 ? "Continue Assessment" : currentStep === 3 ? "Upload Complete" : "Next"}
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
            <li>• Automated verification will validate all information</li>
            <li>• You'll get updates via WhatsApp and email</li>
            <li>• Processing typically takes 24–48 hours</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentApplication;
