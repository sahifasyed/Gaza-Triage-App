import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppState } from '@/contexts/AppStateContext';
import { User, Stethoscope, Package, Heart, FileText, Radio, HelpCircle } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { savedCases, currentBroadcast } = useAppState();

  const criticalCases = savedCases.filter(c => c.priority === 'red' && !c.resolved).length;
  const urgentCases = savedCases.filter(c => c.priority === 'blue' && !c.resolved).length;

  return (
    <Layout showBack={false}>
      <div className="space-y-6 py-8">
        {/* Emergency Alert if broadcasting */}
        {currentBroadcast && (
          <div className="bg-destructive text-destructive-foreground p-4 rounded-xl animate-pulse">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5" />
              <span className="font-medium">
                Broadcasting Emergency Signal
              </span>
            </div>
          </div>
        )}

        {/* Main Action Buttons */}
        <div className="grid gap-4">
          <Button
            onClick={() => navigate('/public')}
            className="emergency-button"
          >
            <User className="w-6 h-6" />
            <span>{t('home.publicMode')}</span>
          </Button>

          <Button
            onClick={() => navigate('/medic-verification')}
            className="emergency-button"
          >
            <Stethoscope className="w-6 h-6" />
            <span>{t('home.medicMode')}</span>
          </Button>

          <Button
            onClick={() => navigate('/supply-request')}
            className="emergency-button destructive"
          >
            <Package className="w-6 h-6" />
            <span>{t('home.supplyRequest')}</span>
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/first-aid')}
            className="h-20 flex flex-col gap-1 text-sm"
          >
            <Heart className="w-5 h-5" />
            <span className="text-center leading-tight">{t('home.firstAid')}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/saved-cases')}
            className="h-20 flex flex-col gap-1 text-sm relative"
          >
            <FileText className="w-5 h-5" />
            <span className="text-center leading-tight">{t('home.savedCases')}</span>
            {(criticalCases > 0 || urgentCases > 0) && (
              <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {criticalCases + urgentCases}
              </div>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/consult-queue')}
            className="h-20 flex flex-col gap-1 text-sm"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-center leading-tight">{t('home.consultQueue')}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/bluetooth-status')}
            className="h-20 flex flex-col gap-1 text-sm"
          >
            <Radio className="w-5 h-5" />
            <span className="text-center leading-tight">{t('home.bluetoothStatus')}</span>
            {currentBroadcast && (
              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-3 h-3 animate-pulse"></div>
            )}
          </Button>
        </div>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
          <p>{t('app.title')}</p>
          <p className="text-xs mt-1">Offline Emergency Triage System</p>
        </div>
      </div>
    </Layout>
  );
};