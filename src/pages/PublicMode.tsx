import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppState, determineTriagePriority } from '@/contexts/AppStateContext';
import { toast } from '@/hooks/use-toast';
import { Camera, MapPin, CheckCircle } from 'lucide-react';

const symptoms = [
  'unconscious',
  'notBreathing',
  'severeBleeding', 
  'chestPain',
  'headInjury',
  'difficultyBreathing',
  'severePain',
  'moderateBleeding',
  'nausea',
  'fever',
  'minorCut',
  'bruise'
];

export const PublicMode: React.FC = () => {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const { addCase, getCurrentLocation } = useAppState();
  
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [triagePriority, setTriagePriority] = useState<'red' | 'blue' | 'green'>('green');
  const [caseSaved, setCaseSaved] = useState(false);
  const [location, setLocation] = useState<string>('');

  // Get GPS location on mount
  useEffect(() => {
    getCurrentLocation().then(coords => {
      if (coords) {
        setLocation(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
      } else {
        setLocation('Location unavailable');
      }
    });
  }, [getCurrentLocation]);

  // Update triage priority when symptoms change
  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      const priority = determineTriagePriority(selectedSymptoms);
      setTriagePriority(priority);
      
      // Auto-save case for red and blue priorities
      if ((priority === 'red' || priority === 'blue') && !caseSaved) {
        handleSaveCase(priority);
      }
    }
  }, [selectedSymptoms, caseSaved]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSaveCase = async (priority?: 'red' | 'blue' | 'green') => {
    if (selectedSymptoms.length === 0) return;
    
    const coords = await getCurrentLocation();
    const currentPriority = priority || triagePriority;
    
    const newCase = addCase({
      type: 'public',
      priority: currentPriority,
      symptoms: selectedSymptoms,
      location,
      gpsCoordinates: coords || undefined
    });

    setCaseSaved(true);
    
    toast({
      title: currentPriority === 'red' ? t('triage.redSaved') : 
             currentPriority === 'blue' ? t('triage.blueSaved') : 
             t('triage.greenSaved'),
      duration: 3000,
    });

    console.log('Case saved:', newCase);
  };

  const getTriageDisplay = () => {
    if (selectedSymptoms.length === 0) return null;
    
    const displays = {
      red: { text: t('triage.red'), class: 'triage-red' },
      blue: { text: t('triage.blue'), class: 'triage-blue' },
      green: { text: t('triage.green'), class: 'triage-green' }
    };
    
    return displays[triagePriority];
  };

  return (
    <Layout 
      title={t('public.title')}
      showBack={true}
      onBack={() => navigate('/')}
    >
      <div className="space-y-6">
        {/* Instructions */}
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">
            {t('public.selectSymptoms')}
          </p>
        </div>

        {/* Symptoms Grid */}
        <div className="grid grid-cols-2 gap-3">
          {symptoms.map((symptom) => (
            <Button
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`symptom-button ${selectedSymptoms.includes(symptom) ? 'selected' : ''}`}
              variant="outline"
            >
              <span className="text-center leading-tight">
                {t(`symptom.${symptom}`)}
              </span>
              {selectedSymptoms.includes(symptom) && (
                <CheckCircle className="w-4 h-4 ml-2 flex-shrink-0" />
              )}
            </Button>
          ))}
        </div>

        {/* Triage Level & Status */}
        {selectedSymptoms.length > 0 && (
          <div className="space-y-4">
            {/* Triage Priority Display */}
            <div className={`p-4 rounded-xl text-center font-bold ${getTriageDisplay()?.class}`}>
              {getTriageDisplay()?.text}
            </div>

            {/* Auto-save status for red/blue cases */}
            {(triagePriority === 'red' || triagePriority === 'blue') && caseSaved && (
              <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>{t('public.caseSaved')}</span>
              </div>
            )}

            {/* GPS Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{t('public.gpsLocation')}: {location}</span>
            </div>

            {/* Optional Actions */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-12"
                onClick={() => {/* TODO: Implement camera */}}
              >
                <Camera className="w-4 h-4 mr-2" />
                {t('public.cameraOptional')}
              </Button>
            </div>

            {/* Manual save for green cases */}
            {triagePriority === 'green' && !caseSaved && (
              <Button 
                onClick={() => handleSaveCase()}
                className="w-full emergency-button"
              >
                {t('common.save')} {t('triage.green')}
              </Button>
            )}
          </div>
        )}

        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="w-full h-12 mt-8"
        >
          {t('public.backHome')}
        </Button>
      </div>
    </Layout>
  );
};