import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to HealthCare+",
      "find_doctor": "Find a Doctor",
      "emergency": "SOS Emergency",
      "symptom_triage": "Symptom Triage",
      "login": "Login",
      "book_appointment": "Book Appointment"
    }
  },
  hi: {
    translation: {
      "welcome": "हेल्थकेयर+ में आपका स्वागत है",
      "find_doctor": "डॉक्टर खोजें",
      "emergency": "आपातकालीन (SOS)",
      "symptom_triage": "लक्षण जांच",
      "login": "लॉग इन करें",
      "book_appointment": "अपॉइंटमेंट बुक करें"
    }
  },
  ta: {
    translation: {
      "welcome": "ஹெல்த்கேர்+ க்கு நல்வரவு",
      "find_doctor": "மருத்துவரைக் கண்டறியவும்",
      "emergency": "அவசரம் (SOS)",
      "symptom_triage": "அறிகுறி சோதனை",
      "login": "உள்நுழைக",
      "book_appointment": "சந்திப்பை பதிவு செய்யவும்"
    }
  },
  bn: {
    translation: {
      "welcome": "HealthCare+ এ স্বাগতম",
      "find_doctor": "ডাক্তার খুঁজুন",
      "emergency": "জরুরী অবস্থা (SOS)",
      "symptom_triage": "লক্ষণ পরীক্ষা",
      "login": "লগইন করুন",
      "book_appointment": "অ্যাপয়েন্টমেন্ট বুক করুন"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
