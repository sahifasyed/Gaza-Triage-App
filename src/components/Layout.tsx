import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Cross } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showLangToggle?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  showBack = false, 
  onBack,
  showLangToggle = true 
}) => {
  const { language, setLanguage, t, dir } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div dir={dir} className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              {dir === 'rtl' ? '←' : '→'} {t('common.back')}
            </Button>
          )}
          
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Cross className="w-6 h-6 text-primary-foreground" />
            <h1 className="text-lg font-semibold">
              {title || t('app.title')}
            </h1>
          </div>

          {showLangToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-primary-foreground hover:bg-primary-foreground/10 min-w-[60px]"
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-md mx-auto">
        {children}
      </main>
    </div>
  );
};