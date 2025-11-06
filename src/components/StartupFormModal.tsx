import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStartupContext, StartupData } from "@/hooks/useStartupContext";
import { submitToNotion } from "@/lib/notion";
import { toast } from "sonner";
import { Loader2, CheckCircle, Lock, Building2 } from "lucide-react";

interface StartupFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRODUCT_STAGES = [
  "Idea Stage",
  "MVP Development",
  "Beta Testing",
  "Early Revenue",
  "Growth Stage",
  "Scale Stage",
  "Mature Product"
];

const REVENUE_RANGES = [
  "Pre-revenue",
  "$0 - $1K/month",
  "$1K - $10K/month",
  "$10K - $50K/month",
  "$50K - $100K/month",
  "$100K - $500K/month",
  "$500K+/month"
];

export function StartupFormModal({ open, onOpenChange }: StartupFormModalProps) {
  const { setStartupData, startupData, isSubmitted } = useStartupContext();
  const [formData, setFormData] = useState<StartupData>({
    fullName: '',
    phoneNumber: '',
    emailId: '',
    startupName: '',
    features: '',
    productStage: '',
    revenue: '',
    isSubmitted: false
  });
  
  const [errors, setErrors] = useState<Partial<StartupData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedState, setIsSubmittedState] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (open && startupData) {
      setFormData(startupData);
      setIsSubmittedState(startupData.isSubmitted || false);
    } else if (open) {
      setFormData({
        fullName: '',
        phoneNumber: '',
        emailId: '',
        startupName: '',
        features: '',
        productStage: '',
        revenue: '',
        isSubmitted: false
      });
      setIsSubmittedState(false);
    }
  }, [open, startupData]);

  const validateForm = () => {
    const newErrors: Partial<StartupData> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (!formData.emailId.trim()) {
      newErrors.emailId = 'Email ID is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.emailId)) {
      newErrors.emailId = 'Please enter a valid email';
    }

    if (!formData.startupName.trim()) {
      newErrors.startupName = 'Startup name is required';
    }

    if (!formData.features.trim()) {
      newErrors.features = 'Features are required';
    }

    if (!formData.productStage) {
      newErrors.productStage = 'Product stage is required';
    }

    if (!formData.revenue) {
      newErrors.revenue = 'Revenue is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isSubmittedState) {
      toast.error("This form has already been submitted and cannot be edited.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const dataToSubmit: StartupData = {
        ...formData,
        isSubmitted: true,
        submittedAt: new Date().toISOString()
      };

      // Submit to Notion
      const notionResult = await submitToNotion(dataToSubmit);
      
      if (notionResult.success) {
        // Save to local context
        setStartupData(dataToSubmit);
        setIsSubmittedState(true);
        toast.success("Startup details saved and submitted to Notion! This form is now locked.");
      } else {
        // Still save locally even if Notion fails
        setStartupData(dataToSubmit);
        setIsSubmittedState(true);
        toast.warning(`Details saved locally, but Notion submission failed: ${notionResult.message}`);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof StartupData, value: string) => {
    if (isSubmittedState) return; // Prevent editing if already submitted
    
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isFormDisabled = isSubmittedState || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-card-foreground flex items-center gap-2">
            My Startup - Coming Soon
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            The startup form feature is currently under development. Stay tuned for updates!
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-8 text-center">
          <div className="mb-6">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Coming Soon
            </h3>
            <p className="text-text-muted">
              We're working hard to bring you an amazing startup form experience. 
              This feature will be available soon!
            </p>
          </div>
          
          <div className="space-y-2 text-sm text-text-muted">
            <p>✨ Planned features:</p>
            <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
              <li>Comprehensive startup profile creation</li>
              <li>Integration with AI agents for personalized insights</li>
              <li>Progress tracking and milestone management</li>
              <li>Data export and analytics</li>
            </ul>
          </div>
        </div>
        
        <div className="hidden">
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-card-foreground">
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                disabled={isFormDisabled}
                className={`bg-input border-input-border focus:border-input-focus ${
                  errors.fullName ? 'border-destructive' : ''
                } ${isFormDisabled ? 'opacity-60' : ''}`}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-card-foreground">
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Enter your phone number"
                disabled={isFormDisabled}
                className={`bg-input border-input-border focus:border-input-focus ${
                  errors.phoneNumber ? 'border-destructive' : ''
                } ${isFormDisabled ? 'opacity-60' : ''}`}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-destructive">{errors.phoneNumber}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emailId" className="text-card-foreground">
              Email ID *
            </Label>
            <Input
              id="emailId"
              type="email"
              value={formData.emailId}
              onChange={(e) => handleInputChange('emailId', e.target.value)}
              placeholder="Enter your email address"
              disabled={isFormDisabled}
              className={`bg-input border-input-border focus:border-input-focus ${
                errors.emailId ? 'border-destructive' : ''
              } ${isFormDisabled ? 'opacity-60' : ''}`}
            />
            {errors.emailId && (
              <p className="text-sm text-destructive">{errors.emailId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startupName" className="text-card-foreground">
              Startup Name *
            </Label>
            <Input
              id="startupName"
              type="text"
              value={formData.startupName}
              onChange={(e) => handleInputChange('startupName', e.target.value)}
              placeholder="Enter your startup name"
              disabled={isFormDisabled}
              className={`bg-input border-input-border focus:border-input-focus ${
                errors.startupName ? 'border-destructive' : ''
              } ${isFormDisabled ? 'opacity-60' : ''}`}
            />
            {errors.startupName && (
              <p className="text-sm text-destructive">{errors.startupName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="features" className="text-card-foreground">
              Features *
            </Label>
            <Textarea
              id="features"
              value={formData.features}
              onChange={(e) => handleInputChange('features', e.target.value)}
              placeholder="Describe the key features of your startup/product..."
              rows={4}
              disabled={isFormDisabled}
              className={`bg-input border-input-border focus:border-input-focus resize-none ${
                errors.features ? 'border-destructive' : ''
              } ${isFormDisabled ? 'opacity-60' : ''}`}
            />
            {errors.features && (
              <p className="text-sm text-destructive">{errors.features}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productStage" className="text-card-foreground">
                Product Stage *
              </Label>
              <Select
                value={formData.productStage}
                onValueChange={(value) => handleInputChange('productStage', value)}
                disabled={isFormDisabled}
              >
                <SelectTrigger className={`bg-input border-input-border focus:border-input-focus ${
                  errors.productStage ? 'border-destructive' : ''
                } ${isFormDisabled ? 'opacity-60' : ''}`}>
                  <SelectValue placeholder="Select product stage" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_STAGES.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.productStage && (
                <p className="text-sm text-destructive">{errors.productStage}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue" className="text-card-foreground">
                Revenue *
              </Label>
              <Select
                value={formData.revenue}
                onValueChange={(value) => handleInputChange('revenue', value)}
                disabled={isFormDisabled}
              >
                <SelectTrigger className={`bg-input border-input-border focus:border-input-focus ${
                  errors.revenue ? 'border-destructive' : ''
                } ${isFormDisabled ? 'opacity-60' : ''}`}>
                  <SelectValue placeholder="Select revenue range" />
                </SelectTrigger>
                <SelectContent>
                  {REVENUE_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.revenue && (
                <p className="text-sm text-destructive">{errors.revenue}</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmittedState ? 'Close' : 'Cancel'}
            </Button>
            {!isSubmittedState && (
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Details
                  </>
                )}
              </Button>
            )}
          </div>

          {isSubmittedState && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Form submitted successfully!</span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Your startup details have been saved and submitted to Google Sheets. This form is now locked and cannot be edited.
              </p>
            </div>
          )}
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}