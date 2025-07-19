import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppState } from '@/contexts/AppStateContext';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from '@/hooks/use-toast';
import { 
  Radio, 
  Clock, 
  StopCircle, 
  QrCode, 
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';

export const BluetoothStatus: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentBroadcast, stopBroadcast } = useAppState();
  const [elapsedTime, setElapsedTime] = useState<string>('');
  const [showFallbackQR, setShowFallbackQR] = useState(false);
  const [bluetoothAvailable] = useState('bluetooth' in navigator);

  // Update elapsed time
  useEffect(() => {
    if (!currentBroadcast?.broadcastStartTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - currentBroadcast.broadcastStartTime!;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setElapsedTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentBroadcast?.broadcastStartTime]);

  const handleStopBroadcast = () => {
    stopBroadcast();
    toast({
      title: "Emergency broadcast stopped",
      duration: 2000,
    });
  };

  const generateQRData = () => {
    if (!currentBroadcast) return '';
    
    return JSON.stringify({
      id: currentBroadcast.id,
      type: 'emergency',
      priority: currentBroadcast.priority,
      timestamp: currentBroadcast.timestamp,
      location: currentBroadcast.location,
      gps: currentBroadcast.gpsCoordinates,
      app: 'Gaza Triage App'
    });
  };

  return (
    <Layout 
      title={t('bluetooth.title')}
      showBack={true}
      onBack={() => navigate('/')}
    >
      <div className="space-y-6">
        {/* Bluetooth Availability Status */}
        <Card className={`border-2 ${bluetoothAvailable ? 'border-green-500' : 'border-orange-500'}`}>
          <CardHeader className={`${bluetoothAvailable ? 'bg-green-500' : 'bg-orange-500'} text-white`}>
            <CardTitle className="flex items-center gap-2">
              <Radio className="w-5 h-5" />
              <span>Bluetooth Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {bluetoothAvailable ? (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span>Bluetooth Low Energy (BLE) available</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-orange-700 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{t('bluetooth.notAvailable')}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('bluetooth.fallbackQR')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Broadcast Status */}
        {currentBroadcast ? (
          <Card className="border-2 border-red-500">
            <CardHeader className="bg-red-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <Radio className="w-5 h-5 animate-pulse" />
                <span>{t('bluetooth.broadcasting')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Case ID:</strong> {currentBroadcast.id.slice(-8)}
                </div>
                <div>
                  <strong>Priority:</strong> 
                  <span className={`ml-1 ${
                    currentBroadcast.priority === 'red' ? 'text-red-600' : 
                    currentBroadcast.priority === 'blue' ? 'text-blue-600' : 
                    'text-green-600'
                  }`}>
                    {currentBroadcast.priority.toUpperCase()}
                  </span>
                </div>
                <div>
                  <strong>Type:</strong> {currentBroadcast.type}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <strong>Time:</strong> {elapsedTime}
                </div>
              </div>

              {currentBroadcast.location && (
                <div className="text-sm">
                  <strong>Location:</strong> {currentBroadcast.location}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  onClick={handleStopBroadcast}
                  className="flex-1"
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  {t('bluetooth.stopBroadcast')}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowFallbackQR(!showFallbackQR)}
                  className="flex-1"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Backup
                </Button>
              </div>

              {showFallbackQR && (
                <div className="flex justify-center p-4 bg-white rounded-lg border">
                  <QRCodeSVG value={generateQRData()} size={200} />
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Radio className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">{t('bluetooth.stopped')}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Emergency broadcasts will start automatically for red and blue priority cases
              </p>
            </CardContent>
          </Card>
        )}

        {/* BLE Technical Info */}
        {bluetoothAvailable && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Emergency Broadcast Details</CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-sm space-y-2">
              <p><strong>Technology:</strong> Bluetooth Low Energy (BLE)</p>
              <p><strong>Range:</strong> ~10-50 meters in open areas</p>
              <p><strong>Auto-broadcast:</strong> Red and Blue priority cases</p>
              <p><strong>Duration:</strong> Until manually stopped or case resolved</p>
              <p><strong>Data transmitted:</strong> Case ID, priority, location, timestamp</p>
              <p className="text-muted-foreground text-xs mt-3">
                This feature helps nearby medics and emergency responders locate critical cases even without internet connectivity.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};