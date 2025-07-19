import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppState } from '@/contexts/AppStateContext';
import { toast } from '@/hooks/use-toast';
import { Package, MapPin, Radio } from 'lucide-react';

const supplyOptions = [
  'water',
  'food', 
  'babyFormula',
  'bandages',
  'power',
  'other'
];

export const SupplyRequest: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { addCase, getCurrentLocation } = useAppState();
  
  const [selectedSupplies, setSelectedSupplies] = useState<string[]>([]);
  const [otherDescription, setOtherDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [requesterName, setRequesterName] = useState('');
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<string>('');

  // Get GPS location on mount
  useEffect(() => {
    getCurrentLocation().then(coords => {
      if (coords) {
        setGpsLocation(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
      } else {
        setGpsLocation('GPS unavailable');
      }
    });
  }, [getCurrentLocation]);

  const toggleSupply = (supply: string) => {
    setSelectedSupplies(prev => 
      prev.includes(supply) 
        ? prev.filter(s => s !== supply)
        : [...prev, supply]
    );
  };

  const handleSubmit = async () => {
    if (selectedSupplies.length === 0) {
      toast({
        title: "Please select at least one supply item",
        variant: "destructive",
      });
      return;
    }

    const coords = await getCurrentLocation();
    
    const newCase = addCase({
      type: 'supply',
      priority: 'blue', // Supply requests are generally urgent but not critical
      symptoms: [], // No medical symptoms for supply requests
      supplies: selectedSupplies,
      otherSupplyNeed: selectedSupplies.includes('other') ? otherDescription : undefined,
      isAnonymous,
      patientName: isAnonymous ? undefined : requesterName,
      location: gpsLocation,
      gpsCoordinates: coords || undefined
    });

    setIsSubmitted(true);
    
    toast({
      title: "✅ Supply request saved offline",
      description: bluetoothEnabled ? "Broadcasting emergency signal..." : "Ready to share via QR code",
      duration: 4000,
    });

    // Auto-start broadcast if enabled
    if (bluetoothEnabled) {
      // Will be handled by the context
    }
  };

  if (isSubmitted) {
    return (
      <Layout 
        title={t('supply.title')}
        showBack={true}
        onBack={() => navigate('/')}
      >
        <div className="space-y-6 text-center">
          <div className="bg-blue-100 border border-blue-300 text-blue-800 p-6 rounded-xl">
            <Package className="w-12 h-12 mx-auto mb-3" />
            <p className="font-bold text-lg">⚠️ {t('supply.saved')}</p>
          </div>

          {bluetoothEnabled && (
            <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-xl">
              <Radio className="w-5 h-5 inline mr-2" />
              Broadcasting emergency signal to nearby devices...
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Location: {gpsLocation}</span>
          </div>

          <Button 
            onClick={() => navigate('/')}
            className="w-full h-12"
          >
            {t('common.back')} to Home
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={t('supply.title')}
      showBack={true}
      onBack={() => navigate('/')}
    >
      <div className="space-y-6">
        {/* Description */}
        <div className="bg-muted p-4 rounded-xl">
          <p className="text-sm text-center">
            {t('supply.description')}
          </p>
        </div>

        {/* Supply Options */}
        <div>
          <Label className="text-base font-medium block mb-3">
            Select needed supplies:
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {supplyOptions.map((supply) => (
              <Button
                key={supply}
                onClick={() => toggleSupply(supply)}
                className={`symptom-button ${selectedSupplies.includes(supply) ? 'selected' : ''}`}
                variant="outline"
              >
                <span className="text-center leading-tight">
                  {t(`supply.${supply}`)}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Other Description */}
        {selectedSupplies.includes('other') && (
          <div>
            <Label htmlFor="otherDescription" className="text-base font-medium">
              {t('supply.otherDescription')}
            </Label>
            <Textarea
              id="otherDescription"
              value={otherDescription}
              onChange={(e) => setOtherDescription(e.target.value)}
              placeholder="Describe other supply needs..."
              className="mt-1"
              rows={3}
            />
          </div>
        )}

        {/* Anonymous Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
          <Label htmlFor="anonymous" className="text-base font-medium">
            {t('supply.anonymous')}
          </Label>
          <Switch
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={setIsAnonymous}
          />
        </div>

        {/* Optional Name */}
        {!isAnonymous && (
          <div>
            <Label htmlFor="requesterName" className="text-base font-medium">
              {t('supply.optionalName')}
            </Label>
            <Input
              id="requesterName"
              value={requesterName}
              onChange={(e) => setRequesterName(e.target.value)}
              placeholder="Your name"
              className="mt-1 h-12"
            />
          </div>
        )}

        {/* Bluetooth Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
          <div>
            <Label htmlFor="bluetooth" className="text-base font-medium">
              {t('supply.bluetooth')}
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Broadcasts to nearby devices for 5 minutes
            </p>
          </div>
          <Switch
            id="bluetooth"
            checked={bluetoothEnabled}
            onCheckedChange={setBluetoothEnabled}
          />
        </div>

        {/* GPS Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted rounded-lg">
          <MapPin className="w-4 h-4" />
          <span>Location: {gpsLocation}</span>
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          className="w-full emergency-button"
          disabled={selectedSupplies.length === 0}
        >
          <Package className="w-5 h-5 mr-2" />
          {t('supply.submit')}
        </Button>
      </div>
    </Layout>
  );
};
