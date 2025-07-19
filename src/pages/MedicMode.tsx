import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppState, determineTriagePriority } from '@/contexts/AppStateContext';
import { toast } from '@/hooks/use-toast';
import { MapPin, CheckCircle, HelpCircle } from 'lucide-react';

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

export const MedicMode: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { addCase, addToConsultQueue, getCurrentLocation } = useAppState();
  
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    location: ''
  });
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [gpsLocation, setGpsLocation] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [triagePriority, setTriagePriority] = useState<'red' | 'blue' | 'green'>('green');
  const [savedCaseId, setSavedCaseId] = useState<string>('');

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

  // Update triage priority when symptoms change
  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      setTriagePriority(determineTriagePriority(selectedSymptoms));
    }
  }, [selectedSymptoms]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    if (!formData.patientName.trim() || selectedSymptoms.length === 0) {
      toast({
        title: "Please fill in patient name and select symptoms",
        variant: "destructive",
      });
      return;
    }

    const coords = await getCurrentLocation();
    
    const newCase = addCase({
      type: 'medic',
      priority: triagePriority,
      symptoms: selectedSymptoms,
      patientName: formData.patientName,
      age: formData.age,
      location: formData.location || gpsLocation,
      gpsCoordinates: coords || undefined
    });

    setSavedCaseId(newCase.id);
    setIsSubmitted(true);
    
    toast({
      title: triagePriority === 'red' ? t('triage.redSaved') : 
             triagePriority === 'blue' ? t('triage.blueSaved') : 
             t('triage.greenSaved'),
      duration: 3000,
    });
  };

  const handleRequestAdvice = () => {
    if (savedCaseId) {
      addToConsultQueue(savedCaseId);
      toast({
        title: "Case added to consultation queue",
        description: "Will be uploaded when internet is available",
        duration: 3000,
      });
    }
  };

  const getTriageDisplay = () => {
    const displays = {
      red: { text: t('triage.red'), class: 'triage-red' },
      blue: { text: t('triage.blue'), class: 'triage-blue' }, 
      green: { text: t('triage.green'), class: 'triage-green' }
    };
    
    return displays[triagePriority];
  };

  return (
    <Layout 
      title={t('medic.title')}
      showBack={true}
      onBack={() => navigate('/')}
    >
      <div className="space-y-6">
        {!isSubmitted ? (
          <>
            {/* Patient Information Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="patientName" className="text-base font-medium">
                  {t('medic.name')} *
                </Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                  placeholder="Enter patient name"
                  className="mt-1 h-12 text-base"
                />
              </div>

              <div>
                <Label htmlFor="age" className="text-base font-medium">
                  {t('medic.age')}
                </Label>
                <Input
                  id="age"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Age"
                  className="mt-1 h-12 text-base"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-base font-medium">
                  {t('medic.location')}
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Specific location or area"
                  className="mt-1 h-12 text-base"
                />
              </div>

              {/* GPS Location Display */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                <MapPin className="w-4 h-4" />
                <span>{t('medic.gpsAuto')}: {gpsLocation}</span>
              </div>
            </div>

            {/* Symptoms Selection */}
            <div>
              <Label className="text-base font-medium block mb-3">
                {t('medic.symptoms')} *
              </Label>
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
            </div>

            {/* Triage Preview */}
            {selectedSymptoms.length > 0 && (
              <div className={`p-4 rounded-xl text-center font-bold ${getTriageDisplay().class}`}>
                {getTriageDisplay().text}
              </div>
            )}

            {/* Submit Button */}
            <Button 
              onClick={handleSubmit}
              className="w-full emergency-button"
              disabled={!formData.patientName.trim() || selectedSymptoms.length === 0}
            >
              {t('medic.submit')}
            </Button>
          </>
        ) : (
          /* Post-Submission View */
          <div className="space-y-6 text-center">
            <div className={`p-6 rounded-xl font-bold ${getTriageDisplay().class}`}>
              {getTriageDisplay().text}
            </div>

            {triagePriority === 'red' && (
              <div className="success-state flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {t('triage.redSaved')}
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleRequestAdvice}
                variant="outline"
                className="w-full h-12 flex items-center gap-2"
              >
                <HelpCircle className="w-5 h-5" />
                {t('medic.requestAdvice')}
              </Button>

              <Button 
                onClick={() => navigate('/')}
                className="w-full h-12"
                variant="outline"
              >
                {t('common.back')} to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};