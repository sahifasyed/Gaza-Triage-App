import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppState } from '@/contexts/AppStateContext';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from '@/hooks/use-toast';
import { 
  QrCode, 
  CheckCircle, 
  Clock, 
  MapPin, 
  User, 
  Activity,
  Package,
  Radio
} from 'lucide-react';

export const SavedCases: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { savedCases, resolveCase, startBroadcast, currentBroadcast } = useAppState();
  const [showQRFor, setShowQRFor] = useState<string | null>(null);

  const redCases = savedCases.filter(c => c.priority === 'red' && !c.resolved);
  const blueCases = savedCases.filter(c => c.priority === 'blue' && !c.resolved);
  const resolvedCases = savedCases.filter(c => c.resolved);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatSymptoms = (symptoms: string[]) => {
    if (symptoms.length === 0) return 'No symptoms';
    return symptoms.map(s => t(`symptom.${s}`)).join(', ');
  };

  const formatSupplies = (supplies?: string[]) => {
    if (!supplies || supplies.length === 0) return '';
    return supplies.map(s => t(`supply.${s}`)).join(', ');
  };

  const generateQRData = (caseData: any) => {
    return JSON.stringify({
      id: caseData.id,
      type: caseData.type,
      priority: caseData.priority,
      timestamp: caseData.timestamp,
      patientName: caseData.patientName || 'Anonymous',
      symptoms: caseData.symptoms,
      supplies: caseData.supplies,
      location: caseData.location,
      gps: caseData.gpsCoordinates,
      app: 'Gaza Triage App'
    });
  };

  const handleMarkResolved = (caseId: string) => {
    resolveCase(caseId);
    toast({
      title: "Case marked as resolved",
      duration: 2000,
    });
  };

  const handleStartBroadcast = (caseId: string) => {
    startBroadcast(caseId);
    toast({
      title: "Started emergency broadcast",
      description: "Broadcasting to nearby devices",
      duration: 3000,
    });
  };

  const CaseCard = ({ caseData }: { caseData: any }) => (
    <Card className={`border-2 ${
      caseData.priority === 'red' ? 'border-red-500' : 
      caseData.priority === 'blue' ? 'border-blue-500' : 
      'border-green-500'
    }`}>
      <CardHeader className={`${
        caseData.priority === 'red' ? 'bg-red-500' : 
        caseData.priority === 'blue' ? 'bg-blue-500' : 
        'bg-green-500'
      } text-white`}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {caseData.type === 'supply' ? <Package className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
            <span>
              {caseData.priority === 'red' ? '🔴 CRITICAL' : 
               caseData.priority === 'blue' ? '🔵 URGENT' : 
               '🟢 NON-URGENT'}
            </span>
          </div>
          {caseData.bluetoothBroadcasting && (
            <Radio className="w-5 h-5 animate-pulse" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {caseData.patientName && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span><strong>Name:</strong> {caseData.patientName}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span><strong>Time:</strong> {formatTime(caseData.timestamp)}</span>
        </div>

        {caseData.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span><strong>Location:</strong> {caseData.location}</span>
          </div>
        )}

        {caseData.type === 'supply' ? (
          <div>
            <strong>Supplies:</strong> {formatSupplies(caseData.supplies)}
            {caseData.otherSupplyNeed && (
              <p className="text-sm text-muted-foreground mt-1">
                Other: {caseData.otherSupplyNeed}
              </p>
            )}
          </div>
        ) : (
          <div>
            <strong>Symptoms:</strong> {formatSymptoms(caseData.symptoms)}
          </div>
        )}

        {showQRFor === caseData.id && (
          <div className="flex justify-center p-4 bg-white rounded-lg border">
            <QRCodeSVG value={generateQRData(caseData)} size={200} />
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQRFor(showQRFor === caseData.id ? null : caseData.id)}
            className="flex-1"
          >
            <QrCode className="w-4 h-4 mr-1" />
            {showQRFor === caseData.id ? 'Hide QR' : 'Show QR'}
          </Button>

          {!caseData.resolved && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMarkResolved(caseData.id)}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Resolve
              </Button>

              {(caseData.priority === 'red' || caseData.priority === 'blue') && 
               !caseData.bluetoothBroadcasting && 
               currentBroadcast?.id !== caseData.id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStartBroadcast(caseData.id)}
                  className="flex-1"
                >
                  <Radio className="w-4 h-4 mr-1" />
                  Broadcast
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout 
      title={t('saved.title')}
      showBack={true}
      onBack={() => navigate('/')}
    >
      <div className="space-y-6">
        {/* Critical Cases */}
        {redCases.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-red-600 mb-3">🔴 CRITICAL CASES ({redCases.length})</h2>
            <div className="space-y-3">
              {redCases.map(caseData => (
                <CaseCard key={caseData.id} caseData={caseData} />
              ))}
            </div>
          </div>
        )}

        {/* Urgent Cases */}
        {blueCases.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-blue-600 mb-3">🔵 URGENT CASES ({blueCases.length})</h2>
            <div className="space-y-3">
              {blueCases.map(caseData => (
                <CaseCard key={caseData.id} caseData={caseData} />
              ))}
            </div>
          </div>
        )}

        {/* No Active Cases */}
        {redCases.length === 0 && blueCases.length === 0 && (
          <div className="text-center py-8">
            <Activity className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No active emergency cases</p>
            <p className="text-sm text-muted-foreground mt-2">
              Red and blue priority cases will appear here
            </p>
          </div>
        )}

        {/* Resolved Cases */}
        {resolvedCases.length > 0 && (
          <div className="border-t pt-6">
            <h2 className="text-lg font-bold text-green-600 mb-3">✅ RESOLVED CASES ({resolvedCases.length})</h2>
            <div className="space-y-3">
              {resolvedCases.slice(-5).map(caseData => (
                <CaseCard key={caseData.id} caseData={caseData} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};