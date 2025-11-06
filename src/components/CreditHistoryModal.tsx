import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreditCard, Calendar, TrendingUp, Package } from 'lucide-react';

interface CreditHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseCredits: () => void;
}

// Mock credit history data
const creditHistory = [
  {
    id: 1,
    type: 'used',
    amount: -1,
    description: 'Idea Validation Analysis',
    date: new Date(2024, 0, 15, 14, 30),
    module: 'Idea Validation'
  },
  {
    id: 2,
    type: 'used',
    amount: -1,
    description: 'Market Research Analysis',
    date: new Date(2024, 0, 15, 13, 15),
    module: 'Market Research'
  },
  {
    id: 3,
    type: 'added',
    amount: 10,
    description: 'Starter Pack Purchase',
    date: new Date(2024, 0, 14, 10, 0),
    module: 'Purchase'
  },
  {
    id: 4,
    type: 'bonus',
    amount: 5,
    description: 'Demo User Welcome Bonus',
    date: new Date(2024, 0, 14, 9, 0),
    module: 'Bonus'
  }
];


export function CreditHistoryModal({ open, onOpenChange }: Omit<CreditHistoryModalProps, 'onPurchaseCredits'>) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'used': return 'text-red-400';
      case 'added': return 'text-green-400';
      case 'bonus': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'used': return TrendingUp;
      case 'added': return CreditCard;
      case 'bonus': return Package;
      default: return Calendar;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Recent Activity
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Credit History */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Recent Activity</h3>
            <ScrollArea className="h-60">
              <div className="space-y-3">
                {creditHistory.map((item) => {
                  const IconComponent = getTypeIcon(item.type);
                  return (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {item.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(item.date)} • {item.module}
                          </p>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${getTypeColor(item.type)}`}>
                        {item.amount > 0 ? '+' : ''}{item.amount}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}