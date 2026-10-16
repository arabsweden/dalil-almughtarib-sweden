import React, { useState } from 'react';
import { Menu, X, ShieldAlert, Sparkles } from 'lucide-react';

interface HeaderProps {
  onNavigateSection: (sectionId: string) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateSection, activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'advisor', label: 'المستشار القانوني الشخصي' },
    { id: 'assistant', label: 'اسأل القانون الذكي' },
    { id: 'events', label: 'فعاليات الجالية' },
    { id: 'law', label: 'القانون والحقوق' },
    { id: 'family', label: 'الأسرة والسوسيال' },
    { id: 'podcast', label: 'بودكاست السويد' },
    { id: 'tax', label: 'حاسبة الضرائب' },
    { id: 'muslim', label: 'المسلم بستوكهولم' },
    { id: 'glossary', label: 'المعجم الرسمي' },
  ];

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('all');
            }}
            className="text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 font-['Cairo',sans-serif]"
          >
            دليل المغترب في السويد
          </a>

          {/* Zone 2: 4–5 Clean Single-Line Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 cursor-pointer ${
                  activeSection === item.id ? 'text-amber-900 font-bold border-b-2 border-amber-900 pb-0.5' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleNavClick('contacts')}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>أرقام الطوارئ والجهات</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className="block w-full text-right py-2 text-sm font-medium text-stone-700 hover:text-stone-900"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => handleNavClick('contacts')}
              className="w-full py-2.5 text-xs font-semibold text-white bg-stone-900 rounded-lg flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>أرقام الطوارئ والجهات الرسمية</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
