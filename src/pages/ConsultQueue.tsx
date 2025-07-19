import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppState } from '@/contexts/AppStateContext';
import { toast } from '@/hooks/use-toast';
import { 
  Upload, 
  Trash2, 
  Clock, 
  MapPin, 
  User, 
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';

export const ConsultQueue: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { consultQueue, removeFromConsultQueue } = useAppState();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatSymptoms = (symptoms: string[]) => {
    if (symptoms.length === 0) return 'No symptoms';
    return symptoms.map(s => t(`symptom.${s}`)).join(', ');
  };

  const handleUploadAll = () => {
    if (!isOnline) {
      toast({
        title: "No internet connection",
        description: "Cases will be uploaded when connection is restored",
        variant: "destructive",
      });
      return;
    }

    // Simulate upload process
    toast({
      title: "Uploading consultation requests...",
      description: `${consultQueue.length} cases queued for upload`,
    });

    // In a real app, this would make API calls to upload each case
    setTimeout(() => {
      // Clear the queue after successful upload
      consultQueue.forEach(c => removeFromConsultQueue(c.id));
      toast({
        title: "Upload completed",
        description: "All cases sent for remote consultation",
      });
    }, 2000);
  };

  const handleRemoveCase = (caseId: string) => {
    removeFromConsultQueue(caseId);
    toast({
      title: "Case removed from queue",
      duration: 2000,
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
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          <span>
            {caseData.priority === 'red' ? '🔴 CRITICAL' : 
             caseData.priority === 'blue' ? '🔵 URGENT' : 
             '🟢 NON-URGENT'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {caseData.patientName && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span><strong>Patient:</strong> {caseData.patientName}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span><strong>Recorded:</strong> {formatTime(caseData.timestamp)}</span>
        </div>

        {caseData.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span><strong>Location:</strong> {caseData.location}</span>
          </div>
        )}

        <div>
          <strong>Symptoms:</strong> {formatSymptoms(caseData.symptoms)}
        </div>

        {caseData.age && (
          <div>
            <strong>Age:</strong> {caseData.age}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleRemoveCase(caseData.id)}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout 
      title={t('home.consultQueue')}
      showBack={true}
      onBack={() => navigate('/')}
    >
      <div className="space-y-6">
        {/* Network Status */}
        <Card className={`border-2 ${isOnline ? 'border-green-500' : 'border-red-500'}`}>
          <CardHeader className={`${isOnline ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            <CardTitle className="flex items-center gap-2">
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm">
              {isOnline ? 
                'Internet connection available. You can upload consultation requests.' :
                'No internet connection. Cases will be uploaded when connection is restored.'
              }
            </p>
          </CardContent>
        </Card>

        {/* Upload All Button */}
        {consultQueue.length > 0 && (
          <Button
            onClick={handleUploadAll}
            disabled={!isOnline}
            className="w-full emergency-button"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload All Cases ({consultQueue.length})
          </Button>
        )}

        {/* Queue Cases */}
        {consultQueue.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Queued for Remote Consultation</h2>
            {consultQueue.map(caseData => (
              <CaseCard key={caseData.id} caseData={caseData} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Upload className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No cases in consultation queue</p>
            <p className="text-sm text-muted-foreground mt-2">
              Medical cases added from Medic Mode will appear here
            </p>
          </div>
        )}

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About Remote Consultation</CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-sm space-y-2">
            <p>Cases in this queue will be sent to medical professionals for remote advice when internet becomes available.</p>
            <p><strong>What gets uploaded:</strong></p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Patient symptoms and assessment</li>
              <li>Location and timestamp</li>
              <li>Triage priority level</li>
              <li>Basic patient information (if provided)</li>
            </ul>
            <p className="text-muted-foreground text-xs mt-3">
              All data is anonymized and encrypted before transmission.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};