import { useRef } from 'react';
import type { Language } from '../types';

interface Props {
  lang: Language;
  isLiveDatabase: boolean;
  onAdminTrigger?: () => void;
}

export default function Footer({ lang, isLiveDatabase, onAdminTrigger }: Props) {
  const isAr = lang === 'ar';
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopyrightClick = () => {
    if (!onAdminTrigger) return;
    tapCountRef.current += 1;
    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      onAdminTrigger();
    } else {
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 1200);
    }
  };

  const socialLinks = [
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@vant.atelier',
      href: 'https://instagram.com',
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      handle: '@vant_official',
      href: 'https://pinterest.com',
      icon: (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.546.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: '@vant.studio',
      href: 'https://tiktok.com',
      icon: (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="mt-auto border-t border-black/5 dark:border-white/10 pt-6 pb-8 text-center text-xs text-[#6b7280] dark:text-[#9ca3af]">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        {/* Social Accounts Showcase - Ergonomic Capsule Row for Mobile & Desktop (CSS Selector 1) */}
        <div
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 pb-5 mb-5 border-b border-black/5 dark:border-white/8 text-xs"
          aria-label={isAr ? 'حسابات التواصل الاجتماعي الرسمية' : 'Official Social Media Accounts'}
        >
          {socialLinks.map((social, index) => (
            <div key={social.id} className="flex items-center gap-2 sm:gap-3.5">
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-full border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] px-2.5 py-1 sm:px-3 sm:py-1.5 text-[#15171c]/75 dark:text-white/75 hover:text-[#004ad7] dark:hover:text-[#3b82f6] hover:border-[#004ad7]/30 dark:hover:border-[#3b82f6]/40 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] active:scale-95 transition-all shadow-2xs"
                title={`${social.name}: ${social.handle}`}
              >
                <span className="flex h-4 w-4 sm:h-4.5 sm:w-4.5 items-center justify-center text-[#15171c]/80 dark:text-white/80 group-hover:text-[#004ad7] dark:group-hover:text-[#3b82f6] transition-colors">
                  {social.icon}
                </span>
                <span className="font-mono text-[11px] sm:text-[11.5px] tracking-tight direction-ltr">
                  {social.handle}
                </span>
              </a>

              {/* Minimalist divider shown on larger screens */}
              {index < socialLinks.length - 1 && (
                <span className="hidden sm:inline select-none text-black/20 dark:text-white/20 text-xs" aria-hidden="true">
                  ·
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Lower row: Copyright and Live Database Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p
            onClick={handleCopyrightClick}
            className="tracking-wide select-none cursor-default active:opacity-75 transition-opacity"
            title={isAr ? 'دار ڤانت' : 'Maison VANT'}
          >
            {isAr ? 'ڤانت · كتالوج الأزياء الحصري © 2026' : 'VANT · Capsule Lookbook © 2026'}
          </p>

          <div className="flex items-center gap-3 text-[11px]">
            {isLiveDatabase && (
              <span className="flex items-center gap-1.5 text-[#004ad7] dark:text-[#3b82f6] font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-[#004ad7] dark:bg-[#3b82f6] animate-pulse" />
                {isAr ? 'قاعدة بيانات متصلة' : 'Live Database'}
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
