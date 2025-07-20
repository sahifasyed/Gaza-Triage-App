import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Stethoscope, CheckCircle } from 'lucide-react';

export const MedicVerification: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [pmcId, setPmcId] = useState('');

  const handleContinue = () => {
    // Store verification status in localStorage
    const verificationData = {
      isVerified: !!pmcId.trim(),
      pmcId: pmcId.trim(),
      verificationTime: Date.now()
    };
    
    localStorage.setItem('medicVerification', JSON.stringify(verificationData));
    navigate('/medic');
  };

  const handleVerifyLater = () => {
    // Store unverified status
    const verificationData = {
      isVerified: false,
      pmcId: '',
      verificationTime: Date.now()
    };
    
    localStorage.setItem('medicVerification', JSON.stringify(verificationData));
    navigate('/medic');
  };

  return (
    <Layout 
      title={t('medicVerification.title')}
      showBack={true}
      onBack={() => navigate('/')}
    >
      <div className="space-y-6 py-8">
        {/* Header Icon */}
        <div className="flex justify-center">
          <div className="bg-primary/10 rounded-full p-4">
            <Stethoscope className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {t('medicVerification.title')}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t('medicVerification.description')}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pmcId" className="text-sm font-medium">
              {t('medicVerification.pmcIdLabel')}
            </Label>
            <Input
              id="pmcId"
              type="text"
              value={pmcId}
              onChange={(e) => setPmcId(e.target.value)}
              placeholder={t('medicVerification.pmcIdPlaceholder')}
              className="h-12"
            />
          </div>

          {/* Verification Status */}
          {pmcId.trim() && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span>{t('medicVerification.willBeVerified')}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleContinue}
            className="w-full h-12 text-base font-medium"
          >
            {t('medicVerification.continueButton')}
          </Button>

          <Button 
            variant="outline"
            onClick={handleVerifyLater}
            className="w-full h-12 text-base font-medium"
          >
            {t('medicVerification.verifyLaterButton')}
          </Button>
        </div>

        {/* Info Note */}
        <div className="text-center text-xs text-muted-foreground border-t pt-4">
          <p>{t('medicVerification.delayNote')}</p>
        </div>
      </div>
    </Layout>
  );
};