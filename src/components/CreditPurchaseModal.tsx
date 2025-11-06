import { useState } from "react";
import { CreditCard, Package, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCreditSystem } from "@/hooks/useCreditSystem";

interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  popular?: boolean;
  bonus?: number;
}

const creditPackages: CreditPackage[] = [
  { id: "basic", credits: 10, price: 9.99 },
  { id: "pro", credits: 25, price: 19.99, bonus: 5, popular: true },
  { id: "premium", credits: 50, price: 34.99, bonus: 15 },
];

interface CreditPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreditPurchaseModal({ open, onOpenChange }: CreditPurchaseModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("pro");
  const [isProcessing, setIsProcessing] = useState(false);
  const { addCredits } = useCreditSystem();

  const handlePurchase = async () => {
    const pkg = creditPackages.find(p => p.id === selectedPackage);
    if (!pkg) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add credits including bonus
    const totalCredits = pkg.credits + (pkg.bonus || 0);
    addCredits(totalCredits);
    
    setIsProcessing(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-[hsl(var(--modal-background))] border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <CreditCard className="w-5 h-5 text-accent" />
            Purchase Credits
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            Choose a credit package to continue using Productica's AI analysis tools.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid gap-4">
            {creditPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedPackage === pkg.id 
                    ? "ring-2 ring-accent border-accent bg-accent/5" 
                    : "border-border hover:border-accent/50 hover:bg-card-hover"
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground">
                      {pkg.credits} Credits
                      {pkg.bonus && (
                        <Badge variant="secondary" className="ml-2">
                          +{pkg.bonus} bonus
                        </Badge>
                      )}
                    </CardTitle>
                    {pkg.popular && (
                      <Badge className="bg-accent text-accent-foreground">
                        Most Popular
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-text-muted" />
                      <span className="text-text-secondary">
                        Total: {pkg.credits + (pkg.bonus || 0)} credits
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">
                        ${pkg.price}
                      </div>
                      <div className="text-sm text-text-muted">
                        ${(pkg.price / (pkg.credits + (pkg.bonus || 0))).toFixed(2)} per credit
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Sparkles className="w-4 h-4" />
              <span>Credits never expire • Instant delivery</span>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePurchase}
                disabled={isProcessing}
                className="bg-accent hover:bg-accent-hover text-accent-foreground min-w-[120px]"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  `Buy Credits • $${creditPackages.find(p => p.id === selectedPackage)?.price}`
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}