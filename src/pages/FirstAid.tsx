import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Stethoscope, 
  Droplets, 
  Brain, 
  Heart, 
  Shield, 
  Bone 
} from 'lucide-react';

const firstAidTopics = [
  {
    key: 'notBreathing',
    icon: Stethoscope,
    color: 'bg-red-500 text-white'
  },
  {
    key: 'severeBleeding',
    icon: Droplets,
    color: 'bg-red-600 text-white'
  },
  {
    key: 'unconscious',
    icon: Brain,
    color: 'bg-orange-500 text-white'
  },
  {
    key: 'headInjury',
    icon: Shield,
    color: 'bg-yellow-600 text-white'
  },
  {
    key: 'chestPain',
    icon: Heart,
    color: 'bg-pink-600 text-white'
  },
  {
    key: 'brokenBone',
    icon: Bone,
    color: 'bg-purple-600 text-white'
  }
];

export const FirstAid: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Layout 
      title={t('firstAid.title')}
      showBack={true}
      onBack={() => navigate('/')}
    >
      <div className="space-y-4">
        {/* Emergency Notice */}
        <div className="bg-destructive text-destructive-foreground p-4 rounded-xl text-center">
          <p className="font-bold">⚠️ EMERGENCY FIRST AID ⚠️</p>
          <p className="text-sm mt-1">Call for medical help immediately if possible</p>
        </div>

        {/* First Aid Cards */}
        <div className="space-y-4">
          {firstAidTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <Card key={topic.key} className="border-2">
                <CardHeader className={`${topic.color} rounded-t-lg`}>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="w-6 h-6" />
                    <span>{t(`firstAid.${topic.key}`)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-base leading-relaxed">
                    {t(`firstAid.${topic.key}Advice`)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* General Emergency Advice */}
        <div className="bg-muted p-4 rounded-xl mt-6">
          <h3 className="font-bold text-center mb-2">General Emergency Guidelines</h3>
          <ul className="text-sm space-y-1">
            <li>• Stay calm and assess the situation</li>
            <li>• Ensure scene safety first</li>
            <li>• Call for medical help if available</li>
            <li>• Do not move seriously injured persons unless necessary</li>
            <li>• Monitor consciousness and breathing continuously</li>
          </ul>
        </div>

        <div className="bg-muted p-4 rounded-xl">
          <h3 className="font-bold text-center mb-2">إرشادات الطوارئ العامة</h3>
          <ul className="text-sm space-y-1" dir="rtl">
            <li>• حافظ على الهدوء وقيّم الوضع</li>
            <li>• تأكد من سلامة المكان أولاً</li>
            <li>• اطلب المساعدة الطبية إن أمكن</li>
            <li>• لا تحرك المصابين بجروح خطيرة إلا عند الضرورة</li>
            <li>• راقب الوعي والتنفس باستمرار</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};