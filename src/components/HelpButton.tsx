import { useState } from 'react';
import { HelpCircle, MessageSquare, Mail, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
const faqs = [{
  question: "How does the AI analysis work?",
  answer: "Our AI analyzes your startup idea using multiple data sources including market trends, competitor analysis, and industry reports. It provides insights on market potential, target audience, competition, and growth opportunities."
}, {
  question: "How many credits do I need per analysis?",
  answer: "Each analysis module (Idea Validation, Market Research, PMF Analysis, or All-in-One) costs 1 credit. Demo users get 5 free credits to explore the platform."
}, {
  question: "Can I export my analysis results?",
  answer: "Yes! You can export your analysis results as PDF or Word documents, and save them to your dashboard for future reference."
}, {
  question: "Is my data secure?",
  answer: "Absolutely. We use enterprise-grade encryption and never share your business ideas or analysis results with third parties."
}];
export function HelpButton() {
  const [showHelp, setShowHelp] = useState(false);
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');
  return <>
      <Button onClick={() => setShowHelp(true)} size="sm" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(207,207,207,0.4)] hover:scale-110" data-help-button>
        <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-2xl sm:max-w-lg lg:max-w-2xl bg-card border-border mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Help & Support
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2">
              <Button variant={activeTab === 'faq' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('faq')} className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                FAQ
              </Button>
              <Button variant={activeTab === 'contact' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('contact')} className="flex items-center gap-2" data-contact-tab>
                <Mail className="w-4 h-4" />
                Contact
              </Button>
            </div>

            {/* FAQ Section */}
            {activeTab === 'faq' && <div className="space-y-4">
                <h3 className="font-medium text-foreground">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-medium text-foreground">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>)}
                </Accordion>
              </div>}

            {/* Contact Section */}
            {activeTab === 'contact' && <div className="space-y-4">
                <h3 className="font-medium text-foreground">Get in Touch</h3>
                <div className="grid gap-4">
                  <Card className="bg-card/50 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">+91 7069133331</h4>
                          <p className="text-sm text-muted-foreground">
                            Get instant help from our support team
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">Email Support</h4>
                          <p className="text-sm text-muted-foreground">info@productoca.in</p>
                          <p className="text-xs text-muted-foreground">
                            We'll respond within 24 hours
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>}
          </div>
        </DialogContent>
      </Dialog>
    </>;
}