import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, FileText, Users, DollarSign, CheckCircle } from 'lucide-react';

interface Contract {
  id: string;
  vendorName: string;
  contractType: string;
  value: string;
  expiryDate: string;
  status: 'expiring' | 'in-progress' | 'renewed' | 'expired';
  riskLevel: 'low' | 'medium' | 'high';
}

interface RenewalWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
  onUpdateContract: (contractId: string, updates: Partial<Contract>) => void;
}

export default function RenewalWorkflowModal({ 
  isOpen, 
  onClose, 
  contract,
  onUpdateContract 
}: RenewalWorkflowModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    contactPerson: '',
    contactEmail: '',
    negotiationNotes: '',
    proposedTerms: '',
    meetingDate: '',
    renewalValue: ''
  });

  const steps = [
    { id: 1, title: 'Contact Information', icon: Users },
    { id: 2, title: 'Contract Review', icon: FileText },
    { id: 3, title: 'Negotiation', icon: DollarSign },
    { id: 4, title: 'Schedule Meeting', icon: CalendarIcon },
    { id: 5, title: 'Finalize', icon: CheckCircle }
  ];

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalize = () => {
    if (contract) {
      onUpdateContract(contract.id, { status: 'in-progress' });
      onClose();
      setCurrentStep(1);
    }
  };

  if (!contract) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Renewal Workflow - {contract.vendorName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
            </p>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-between items-center">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.id} 
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    step.id === currentStep 
                      ? 'bg-primary/10 text-primary' 
                      : step.id < currentStep 
                        ? 'bg-green-50 text-green-600' 
                        : 'text-muted-foreground'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Contract Info Card */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="font-medium">Contract Type</Label>
                <p>{contract.contractType}</p>
              </div>
              <div>
                <Label className="font-medium">Current Value</Label>
                <p>{contract.value}</p>
              </div>
              <div>
                <Label className="font-medium">Expiry Date</Label>
                <p>{contract.expiryDate}</p>
              </div>
              <div>
                <Label className="font-medium">Risk Level</Label>
                <Badge variant={contract.riskLevel === 'high' ? 'destructive' : contract.riskLevel === 'medium' ? 'default' : 'secondary'}>
                  {contract.riskLevel}
                </Badge>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-4">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPerson">Primary Contact</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Email Address</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="contact@vendor.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Contract Review</h3>
                <div>
                  <Label htmlFor="proposedTerms">Proposed Terms & Changes</Label>
                  <Textarea
                    id="proposedTerms"
                    value={formData.proposedTerms}
                    onChange={(e) => setFormData(prev => ({ ...prev, proposedTerms: e.target.value }))}
                    placeholder="Enter any proposed changes to contract terms..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="renewalValue">Proposed Renewal Value</Label>
                  <Input
                    id="renewalValue"
                    value={formData.renewalValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, renewalValue: e.target.value }))}
                    placeholder="$50,000"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Negotiation Notes</h3>
                <div>
                  <Label htmlFor="negotiationNotes">Discussion Points & Notes</Label>
                  <Textarea
                    id="negotiationNotes"
                    value={formData.negotiationNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, negotiationNotes: e.target.value }))}
                    placeholder="Key negotiation points, vendor feedback, internal notes..."
                    rows={5}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Schedule Meeting</h3>
                <div>
                  <Label htmlFor="meetingDate">Preferred Meeting Date</Label>
                  <Input
                    id="meetingDate"
                    type="date"
                    value={formData.meetingDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, meetingDate: e.target.value }))}
                  />
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    📅 Meeting invitation will be sent to both parties once scheduled.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Finalize Renewal Process</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Ready to Start Renewal</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>✓ Contact information collected</li>
                    <li>✓ Contract terms reviewed</li>
                    <li>✓ Negotiation points documented</li>
                    <li>✓ Meeting scheduled</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  Clicking "Start Renewal Process" will move this contract to the "In Progress" tab and begin the formal renewal workflow.
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleFinalize} className="bg-green-600 hover:bg-green-700">
                Start Renewal Process
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}