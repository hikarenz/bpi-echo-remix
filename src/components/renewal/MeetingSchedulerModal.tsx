import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, Video, MapPin } from 'lucide-react';

interface Contract {
  id: string;
  vendorName: string;
  contractType: string;
  value: string;
  expiryDate: string;
  status: 'expiring' | 'in-progress' | 'renewed' | 'expired';
  riskLevel: 'low' | 'medium' | 'high';
}

interface MeetingSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
  onScheduleMeeting: (contract: Contract, meetingData: any) => void;
}

export default function MeetingSchedulerModal({ 
  isOpen, 
  onClose, 
  contract,
  onScheduleMeeting 
}: MeetingSchedulerModalProps) {
  const [meetingData, setMeetingData] = useState({
    title: '',
    date: '',
    time: '',
    duration: '60',
    type: 'video',
    location: '',
    agenda: '',
    attendees: '',
    notes: ''
  });

  const handleSchedule = () => {
    if (contract) {
      onScheduleMeeting(contract, meetingData);
      onClose();
      // Reset form
      setMeetingData({
        title: '',
        date: '',
        time: '',
        duration: '60',
        type: 'video',
        location: '',
        agenda: '',
        attendees: '',
        notes: ''
      });
    }
  };

  if (!contract) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Meeting - {contract.vendorName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meeting Type Selection */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setMeetingData(prev => ({ ...prev, type: 'video' }))}
              className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                meetingData.type === 'video' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted hover:border-primary/50'
              }`}
            >
              <Video className="h-5 w-5" />
              <span className="text-sm font-medium">Video Call</span>
            </button>
            
            <button
              onClick={() => setMeetingData(prev => ({ ...prev, type: 'in-person' }))}
              className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                meetingData.type === 'in-person' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted hover:border-primary/50'
              }`}
            >
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">In Person</span>
            </button>
            
            <button
              onClick={() => setMeetingData(prev => ({ ...prev, type: 'phone' }))}
              className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                meetingData.type === 'phone' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted hover:border-primary/50'
              }`}
            >
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Phone Call</span>
            </button>
          </div>

          {/* Contract Context */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">Contract Context</h4>
              <Badge variant="outline">{contract.contractType}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Value:</span>
                <span className="ml-2 font-medium">{contract.value}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Expires:</span>
                <span className="ml-2 font-medium">{contract.expiryDate}</span>
              </div>
            </div>
          </div>

          {/* Meeting Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                value={meetingData.title}
                onChange={(e) => setMeetingData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={`Contract Renewal Discussion - ${contract.vendorName}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={meetingData.date}
                  onChange={(e) => setMeetingData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={meetingData.time}
                  onChange={(e) => setMeetingData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Select 
                  value={meetingData.duration} 
                  onValueChange={(value) => setMeetingData(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {meetingData.type === 'in-person' && (
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={meetingData.location}
                    onChange={(e) => setMeetingData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Office address or meeting room"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="attendees">Attendees</Label>
              <Input
                id="attendees"
                value={meetingData.attendees}
                onChange={(e) => setMeetingData(prev => ({ ...prev, attendees: e.target.value }))}
                placeholder="Email addresses separated by commas"
              />
            </div>

            <div>
              <Label htmlFor="agenda">Meeting Agenda</Label>
              <Textarea
                id="agenda"
                value={meetingData.agenda}
                onChange={(e) => setMeetingData(prev => ({ ...prev, agenda: e.target.value }))}
                placeholder="1. Contract terms review&#10;2. Pricing discussion&#10;3. Service level agreements&#10;4. Renewal timeline"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={meetingData.notes}
                onChange={(e) => setMeetingData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional information or preparation notes..."
                rows={2}
              />
            </div>
          </div>

          {/* Meeting Preparation Checklist */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Meeting Preparation</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>📋 Review current contract terms and performance</li>
              <li>💰 Prepare budget and pricing discussions</li>
              <li>📊 Gather performance metrics and feedback</li>
              <li>🎯 Define renewal objectives and must-haves</li>
              <li>📝 Prepare list of questions and concerns</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            <Button 
              onClick={handleSchedule}
              disabled={!meetingData.date || !meetingData.time}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}