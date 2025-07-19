import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const translations = {
  en: {
    // Home Screen
    'app.title': 'Gaza Triage App',
    'home.publicMode': '👤 Public Mode',
    'home.medicMode': '🩺 Medic Mode',
    'home.supplyRequest': '🆘 Request Urgent Supplies',
    'home.firstAid': '🆘 Emergency First Aid Guide',
    'home.savedCases': '📂 Saved Cases',
    'home.consultQueue': '🌐 Consult Queue',
    'home.bluetoothStatus': '📡 Bluetooth Status',
    
    // Language
    'language.toggle': 'العربية',
    'language.english': 'English',
    'language.arabic': 'Arabic',
    
    // Public Mode
    'public.title': 'Select Symptoms',
    'public.selectSymptoms': 'Tap symptoms you are experiencing:',
    'public.backHome': 'Back to Home',
    'public.cameraOptional': '📷 Add Photo (Optional)',
    'public.caseSaved': '✅ Case saved offline',
    'public.gpsLocation': '📍 GPS Location',
    
    // Symptoms
    'symptom.unconscious': 'Unconscious',
    'symptom.notBreathing': 'Not Breathing ✅',
    'symptom.severeBleeding': 'Severe Bleeding ✅',
    'symptom.chestPain': 'Severe Chest Pain',
    'symptom.headInjury': 'Head Injury',
    'symptom.difficultyBreathing': 'Difficulty Breathing',
    'symptom.severePain': 'Severe Pain',
    'symptom.moderateBleeding': 'Moderate Bleeding',
    'symptom.nausea': 'Nausea/Vomiting',
    'symptom.fever': 'Fever',
    'symptom.minorCut': 'Minor Cut',
    'symptom.bruise': 'Bruise',
    
    // Triage Levels
    'triage.red': '🔴 CRITICAL EMERGENCY',
    'triage.blue': '🔵 URGENT',
    'triage.green': '🟢 NON-URGENT',
    'triage.redSaved': '✅ Emergency case saved offline',
    'triage.blueSaved': '✅ Urgent case saved offline',
    'triage.greenSaved': '✅ Case saved offline',
    
    // Medic Mode
    'medic.title': 'Medic Assessment',
    'medic.name': 'Patient Name',
    'medic.age': 'Age',
    'medic.location': 'Location',
    'medic.gpsAuto': 'GPS (Auto-detected)',
    'medic.symptoms': 'Select Symptoms',
    'medic.submit': 'Submit Assessment',
    'medic.requestAdvice': 'Request Remote Advice Later',
    
    // Supply Request
    'supply.title': 'Request Urgent Supplies',
    'supply.description': 'For civilians in crisis who need supplies but are not injured',
    'supply.water': 'Water',
    'supply.food': 'Food',
    'supply.babyFormula': 'Baby Formula / Diapers',
    'supply.bandages': 'Bandages / First Aid',
    'supply.power': 'Power / Charging',
    'supply.other': 'Other',
    'supply.otherDescription': 'Describe other needs...',
    'supply.bluetooth': 'Enable emergency Bluetooth broadcast?',
    'supply.anonymous': 'Anonymous request',
    'supply.optionalName': 'Optional: Your name',
    'supply.submit': 'Submit Supply Request',
    'supply.saved': '⚠️ Supply Request Only — No injuries reported',
    
    // First Aid
    'firstAid.title': 'Emergency First Aid Guide',
    'firstAid.notBreathing': 'Not Breathing',
    'firstAid.notBreathingAdvice': 'Start hands-only CPR: Push hard and fast in the center of the chest.',
    'firstAid.severeBleeding': 'Severe Bleeding',
    'firstAid.severeBleedingAdvice': 'Apply pressure with clean cloth or hand. Elevate the wound.',
    'firstAid.unconscious': 'Unconscious',
    'firstAid.unconsciousAdvice': 'Check for breathing. Put the person in the recovery position.',
    'firstAid.headInjury': 'Head Injury',
    'firstAid.headInjuryAdvice': 'Do not move the person. Monitor for consciousness.',
    'firstAid.chestPain': 'Chest Pain',
    'firstAid.chestPainAdvice': 'Keep the person calm and seated. Do not give food or water.',
    'firstAid.brokenBone': 'Broken Bone',
    'firstAid.brokenBoneAdvice': 'Immobilize the limb. Do not try to straighten it.',
    
    // Saved Cases
    'saved.title': 'Saved Emergency Cases',
    'saved.noRed': 'No critical cases saved',
    'saved.noBlue': 'No urgent cases saved',
    'saved.generateQR': 'Generate QR Code',
    'saved.markResolved': 'Mark as Resolved',
    'saved.time': 'Time',
    'saved.symptoms': 'Symptoms',
    'saved.location': 'Location',
    
    // Bluetooth Status
    'bluetooth.title': 'Bluetooth Emergency Broadcast',
    'bluetooth.status': 'Current Status',
    'bluetooth.broadcasting': 'Broadcasting Emergency Signal',
    'bluetooth.stopped': 'Broadcast Stopped',
    'bluetooth.timeSince': 'Time since started',
    'bluetooth.stopBroadcast': 'Stop Broadcast',
    'bluetooth.notAvailable': 'Bluetooth not available on this device',
    'bluetooth.fallbackQR': 'Fallback: Generate QR Code instead',
    
    // Common
    'common.back': 'Back',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.save': 'Save',
    'common.continue': 'Continue',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.optional': 'Optional',
    'common.required': 'Required',
  },
  ar: {
    // Home Screen
    'app.title': 'تطبيق فرز غزة',
    'home.publicMode': '👤 الوضع العام',
    'home.medicMode': '🩺 وضع الطبيب',
    'home.supplyRequest': '🆘 طلب مستلزمات عاجلة',
    'home.firstAid': '🆘 دليل الإسعافات الأولية',
    'home.savedCases': '📂 الحالات المحفوظة',
    'home.consultQueue': '🌐 قائمة الاستشارة',
    'home.bluetoothStatus': '📡 حالة البلوتوث',
    
    // Language
    'language.toggle': 'English',
    'language.english': 'الإنجليزية',
    'language.arabic': 'العربية',
    
    // Public Mode
    'public.title': 'اختر الأعراض',
    'public.selectSymptoms': 'اضغط على الأعراض التي تشعر بها:',
    'public.backHome': 'العودة للرئيسية',
    'public.cameraOptional': '📷 إضافة صورة (اختياري)',
    'public.caseSaved': '✅ تم حفظ الحالة بدون إنترنت',
    'public.gpsLocation': '📍 موقع GPS',
    
    // Symptoms
    'symptom.unconscious': 'فاقد الوعي',
    'symptom.notBreathing': 'لا يتنفس ✅',
    'symptom.severeBleeding': 'نزيف شديد ✅',
    'symptom.chestPain': 'ألم شديد في الصدر',
    'symptom.headInjury': 'إصابة في الرأس',
    'symptom.difficultyBreathing': 'صعوبة في التنفس',
    'symptom.severePain': 'ألم شديد',
    'symptom.moderateBleeding': 'نزيف متوسط',
    'symptom.nausea': 'غثيان/قيء',
    'symptom.fever': 'حمى',
    'symptom.minorCut': 'جرح صغير',
    'symptom.bruise': 'كدمة',
    
    // Triage Levels
    'triage.red': '🔴 حالة طوارئ حرجة',
    'triage.blue': '🔵 عاجل',
    'triage.green': '🟢 غير عاجل',
    'triage.redSaved': '✅ تم حفظ حالة الطوارئ بدون إنترنت',
    'triage.blueSaved': '✅ تم حفظ الحالة العاجلة بدون إنترنت',
    'triage.greenSaved': '✅ تم حفظ الحالة بدون إنترنت',
    
    // Medic Mode
    'medic.title': 'تقييم طبي',
    'medic.name': 'اسم المريض',
    'medic.age': 'العمر',
    'medic.location': 'الموقع',
    'medic.gpsAuto': 'GPS (مكتشف تلقائياً)',
    'medic.symptoms': 'اختر الأعراض',
    'medic.submit': 'إرسال التقييم',
    'medic.requestAdvice': 'طلب استشارة طبية لاحقاً',
    
    // Supply Request
    'supply.title': 'طلب مستلزمات عاجلة',
    'supply.description': 'للمدنيين في أزمة يحتاجون مستلزمات ولكن غير مصابين',
    'supply.water': 'ماء',
    'supply.food': 'طعام',
    'supply.babyFormula': 'حليب أطفال / حفاضات',
    'supply.bandages': 'ضمادات / إسعافات أولية',
    'supply.power': 'كهرباء / شحن',
    'supply.other': 'أخرى',
    'supply.otherDescription': 'وصف الاحتياجات الأخرى...',
    'supply.bluetooth': 'تفعيل البث الطارئ عبر البلوتوث؟',
    'supply.anonymous': 'طلب مجهول',
    'supply.optionalName': 'اختياري: اسمك',
    'supply.submit': 'إرسال طلب المستلزمات',
    'supply.saved': '⚠️ طلب مستلزمات فقط — لا توجد إصابات',
    
    // First Aid
    'firstAid.title': 'دليل الإسعافات الأولية الطارئة',
    'firstAid.notBreathing': 'لا يتنفس',
    'firstAid.notBreathingAdvice': 'ابدأ الإنعاش القلبي الرئوي اليدوي: اضغط بقوة وسرعة على وسط الصدر.',
    'firstAid.severeBleeding': 'نزيف شديد',
    'firstAid.severeBleedingAdvice': 'اضغط بقوة باستخدام قطعة قماش نظيفة أو يدك. ارفع مكان الجرح.',
    'firstAid.unconscious': 'فاقد الوعي',
    'firstAid.unconsciousAdvice': 'تحقق من التنفس. ضع الشخص في وضع الاستلقاء الجانبي الآمن.',
    'firstAid.headInjury': 'إصابة في الرأس',
    'firstAid.headInjuryAdvice': 'لا تحرك المصاب. راقب وعيه باستمرار.',
    'firstAid.chestPain': 'ألم في الصدر',
    'firstAid.chestPainAdvice': 'حافظ على هدوء المصاب واجعله جالساً. لا تعطه طعاماً أو ماء.',
    'firstAid.brokenBone': 'كسر في العظم',
    'firstAid.brokenBoneAdvice': 'ثبت الطرف المصاب. لا تحاول تقويمه.',
    
    // Saved Cases
    'saved.title': 'حالات الطوارئ المحفوظة',
    'saved.noRed': 'لا توجد حالات حرجة محفوظة',
    'saved.noBlue': 'لا توجد حالات عاجلة محفوظة',
    'saved.generateQR': 'إنشاء رمز QR',
    'saved.markResolved': 'تحديد كمحلولة',
    'saved.time': 'الوقت',
    'saved.symptoms': 'الأعراض',
    'saved.location': 'الموقع',
    
    // Bluetooth Status
    'bluetooth.title': 'بث الطوارئ عبر البلوتوث',
    'bluetooth.status': 'الحالة الحالية',
    'bluetooth.broadcasting': 'يبث إشارة طوارئ',
    'bluetooth.stopped': 'توقف البث',
    'bluetooth.timeSince': 'الوقت منذ البداية',
    'bluetooth.stopBroadcast': 'إيقاف البث',
    'bluetooth.notAvailable': 'البلوتوث غير متوفر على هذا الجهاز',
    'bluetooth.fallbackQR': 'البديل: إنشاء رمز QR بدلاً من ذلك',
    
    // Common
    'common.back': 'رجوع',
    'common.cancel': 'إلغاء',
    'common.submit': 'إرسال',
    'common.save': 'حفظ',
    'common.continue': 'متابعة',
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.optional': 'اختياري',
    'common.required': 'مطلوب',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [dir, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};