import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lightbulb, BarChart3, Target, Sparkles, ArrowRight, X } from 'lucide-react';

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGetStarted: () => void;
}

const modules = [
  {
    icon: Lightbulb,
    title: "Idea Validation",
    description: "Quickly validate your startup idea with AI insights and market analysis.",
    color: "text-blue-400"
  },
  {
    icon: BarChart3,
    title: "Market Research", 
    description: "Analyze your target market, competitors, and industry trends.",
    color: "text-green-400"
  },
  {
    icon: Target,
    title: "PMF Analysis",
    description: "Assess your product-market fit for sustainable growth.",
    color: "text-purple-400"
  },
  {
    icon: Sparkles,
    title: "All-in-One Analysis",
    description: "Get a complete startup analysis covering all aspects.",
    color: "text-primary"
  }
];

export function OnboardingModal({ open, onOpenChange, onGetStarted }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onGetStarted();
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-foreground">
            {currentStep === 0 ? "Welcome to Productica" : "Choose Your Analysis"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {currentStep === 0 ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-foreground">
                  AI-Powered Product Validation
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Productica helps entrepreneurs validate their startup ideas using advanced AI analysis. 
                  Get insights on market potential, competition, and product-market fit in minutes.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleSkip}>
                  Skip Tutorial
                </Button>
                <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-center text-muted-foreground">
                Choose from our specialized AI modules to get started:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((module, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <module.icon className={`w-5 h-5 ${module.color}`} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-foreground">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Button variant="outline" onClick={handleSkip}>
                  Skip
                </Button>
                <Button onClick={onGetStarted} className="bg-primary hover:bg-primary/90">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}