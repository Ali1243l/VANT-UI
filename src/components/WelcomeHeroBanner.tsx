import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowDown, ChevronLeft, ChevronRight, ArrowUpRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import type { Language } from '../types';

interface Props {
  lang: Language;
  onExplore: () => void;
  onDismiss: () => void;
  onSelectCategory?: (category: string) => void;
  backgroundImageUrl?: string;
  isOpen: boolean;
}

interface TrendItem {
  id: string;
  category: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  tagEn: string;
  tagAr: string;
  image: string;
}

const FEATURED_TRENDS: TrendItem[] = [
  {
    id: 'trend-1',
    category: 'Tailoring',
    titleEn: 'Sculptural Tailoring',
    titleAr: 'الخياطة المنحوتة',
    subtitleEn: 'Sharp shoulders & dropped closures',
    subtitleAr: 'أكتاف هندسية وتفاصيل حرة',
    tagEn: '01 / STRUCTURE',
    tagAr: '٠١ / الهيكل',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'trend-2',
    category: 'Outerwear',
    titleEn: 'Raw Edge Cashmere',
    titleAr: 'الكشمير الطبيعي الخام',
    subtitleEn: '650gsm unlined double-face',
    subtitleAr: 'كشمير منغولي مزدوج الوجه',
    tagEn: '02 / TEXTURE',
    tagAr: '٠٢ / الملمس',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'trend-3',
    category: 'Knitwear',
    titleEn: 'Heavy Rib Knitwear',
    titleAr: 'التريكو السميك المضلع',
    subtitleEn: 'Sculptural 7-gauge merino',
    subtitleAr: 'صوف ميرينو سميك عيار 7',
    tagEn: '03 / VOLUME',
    tagAr: '٠٣ / الحجم',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'trend-4',
    category: 'Accessories',
    titleEn: 'Monolithic Leather',
    titleAr: 'الجلود المعمارية الصلبة',
    subtitleEn: 'Full-grain box calf & palladium',
    subtitleAr: 'جلد عجل فرنسي بقطع البلاديوم',
    tagEn: '04 / ACCENT',
    tagAr: '٠٤ / التفاصيل',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'trend-5',
    category: 'Footwear',
    titleEn: 'Bevelled Square-Toe',
    titleAr: 'الأحذية بمقدمة مربعة',
    subtitleEn: 'Stacked leather & hand-waxed finish',
    subtitleAr: 'جلد ملمع بنعل كلاسيكي مكدس',
    tagEn: '05 / GROUND',
    tagAr: '٠٥ / الأساس',
    image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=600&q=80',
  },
];

const DEFAULT_BANNER_BG = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80';

export default function WelcomeHeroBanner({
  lang,
  onExplore,
  onDismiss,
  onSelectCategory,
  backgroundImageUrl = DEFAULT_BANNER_BG,
  isOpen,
}: Props) {
  const isAr = lang === 'ar';
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [bgImage] = useState<string>(backgroundImageUrl);

  const scrollTrends = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const distance = 200;
    const sign = direction === 'left' ? -1 : 1;
    // Account for RTL scroll direction
    const scrollAmount = isAr ? -sign * distance : sign * distance;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleTrendClick = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    onExplore();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          key="welcome-hero-banner"
          initial={{ opacity: 0, height: 0, y: -10 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden mx-auto max-w-7xl px-2.5 sm:px-6 mb-4 sm:mb-6"
          aria-label={isAr ? 'أصل التشكيلة وتريند الموسم' : 'Collection Foundation & Featured Trends'}
        >
          {/* Card 1: Top Hero Welcome Banner with Editorial Background Image Layer (CSS Selector 1) */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[28px] border border-black/8 dark:border-white/10 bg-white dark:bg-[#121419] p-3.5 sm:p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
            
            {/* Background Image Layer with atmospheric high-fashion overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img
                src={bgImage}
                alt=""
                className="h-full w-full object-cover object-center opacity-25 dark:opacity-20 scale-105 transition-opacity duration-700"
              />
              {/* Multilayer gradient for crystal-clear text readability in light and dark mode */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/70 dark:from-[#121419] dark:via-[#121419]/90 dark:to-[#121419]/70 backdrop-blur-[1px]" />
            </div>

            {/* Content Container (Layered above background image) */}
            <div className="relative z-10">
              {/* Minimalist Top Editorial Bar */}
              <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-black/8 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#004ad7] dark:bg-[#3b82f6]" />
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] sm:tracking-[0.22em] text-[#15171c] dark:text-[#f3f4f6] uppercase">
                    {isAr ? 'ڤانت · كتالوج شتاء ٢٠٢٦' : 'MAISON VANT · WINTER CAPSULE 2026'}
                  </span>
                  <span className="hidden sm:inline text-black/20 dark:text-white/20">|</span>
                  <span className="hidden sm:inline text-[11px] text-[#6b7280] dark:text-[#9ca3af]">
                    {isAr ? 'إصدار أرشيفي محدود' : 'Archived Capsule Release'}
                  </span>
                </div>

                {/* Dismiss Button */}
                <button
                  type="button"
                  onClick={onDismiss}
                  className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-[#6b7280] dark:text-[#9ca3af] hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#15171c] dark:hover:text-white transition-all active:scale-90"
                  aria-label={isAr ? 'إخفاء المقدمة' : 'Dismiss intro'}
                  title={isAr ? 'إخفاء' : 'Dismiss'}
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              {/* Editorial Statement & Brand Manifesto */}
              <div className="pt-3 sm:pt-4 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6">
                <div className="max-w-2xl">
                  <h2 className="text-xl sm:text-2xl md:text-[28px] font-semibold text-[#15171c] dark:text-white tracking-tight leading-snug sm:leading-[1.25]">
                    {isAr ? (
                      <>
                        الصياغة المعمارية للأزياء الهادئة — قطع نادرة من الصوف الإيطالي والكشمير
                      </>
                    ) : (
                      <>
                        Architectural Silhouettes in Virgin Wool & Mongolian Cashmere
                      </>
                    )}
                  </h2>
                  <p className="mt-1.5 text-[11px] sm:text-xs md:text-sm text-[#15171c]/75 dark:text-white/75 leading-relaxed max-w-xl">
                    {isAr
                      ? 'تصاميم تم تفصيلها بدقة هندسية في أرقى المعامل الإيطالية، حيث تلتقي الأكتاف المنسدلة بالحواف الحرة لتقديم تجربة ارتداء لا تضاهى.'
                      : 'Engineered with sculptural precision from virgin Italian wool, unlined Mongolian double-face cashmere, and French calfskin.'}
                  </p>
                </div>

                {/* Primary Direct Explore Button */}
                <div className="shrink-0 flex items-center">
                  <button
                    type="button"
                    onClick={onExplore}
                    className="group inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#15171c] dark:bg-white px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold text-white dark:text-[#15171c] transition-all hover:bg-black/80 dark:hover:bg-white/80 active:scale-95 shadow-sm"
                  >
                    <span>{isAr ? 'تصفح كافة القطع' : 'Browse All Pieces'}</span>
                    <ArrowDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-y-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Separated, Cleanly Formatted "تريند ٢٠٢٦" Section */}
          <div className="mt-2.5 sm:mt-3 rounded-2xl sm:rounded-[24px] border border-black/8 dark:border-white/10 bg-white/90 dark:bg-[#14171e]/90 p-3 sm:p-5 shadow-xs backdrop-blur-md">
            {/* Trends Section Header with Refined Sparkles Icon (CSS Selector 2) */}
            <div className="flex items-center justify-between mb-2.5 sm:mb-3 px-0.5">
              <div className="flex items-center gap-2">
                {/* Changed from flame to luxury refined sparkles icon */}
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#004ad7]/10 dark:bg-[#3b82f6]/15 text-[#004ad7] dark:text-[#3b82f6]">
                  <Sparkles className="h-3 w-3" />
                </div>
                <h3 className="text-[12px] sm:text-[13px] font-bold tracking-wider text-[#15171c] dark:text-white uppercase">
                  {isAr ? 'تريند موسم ٢٠٢٦' : 'Featured Trends 2026'}
                </h3>
                <span className="text-[9px] sm:text-[10px] font-medium text-[#004ad7] dark:text-[#3b82f6] px-2 py-0.5 rounded-full bg-[#004ad7]/10 dark:bg-[#3b82f6]/15">
                  {isAr ? '٥ تريندات' : '5 Trends'}
                </span>
              </div>

              {/* Horizontal Scroll Navigation Arrows */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollTrends('left')}
                  className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] text-[#15171c] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
                  aria-label={isAr ? 'التمرير لليمين' : 'Scroll left'}
                >
                  <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTrends('right')}
                  className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] text-[#15171c] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
                  aria-label={isAr ? 'التمرير لليسار' : 'Scroll right'}
                >
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Strip with Proportioned Mobile & Desktop Cards */}
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar scroll-smooth pb-0.5 pt-0.5 -mx-0.5 px-0.5"
            >
              {FEATURED_TRENDS.map((trend) => (
                <div
                  key={trend.id}
                  onClick={() => handleTrendClick(trend.category)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleTrendClick(trend.category);
                    }
                  }}
                  className="group relative h-36 w-32 sm:h-48 sm:w-44 shrink-0 cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border border-black/8 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] transition-all duration-300 hover:border-[#004ad7]/40 dark:hover:border-[#3b82f6]/50 hover:shadow-lg dark:hover:shadow-2xl hover:-translate-y-0.5 select-none"
                >
                  {/* Background Trend Image with smooth hover scale */}
                  <img
                    src={trend.image}
                    alt={isAr ? trend.titleAr : trend.titleEn}
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
                    loading="lazy"
                  />

                  {/* Gradient Overlay for high typographic legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity group-hover:from-black/90 group-hover:via-black/40" />

                  {/* Top Tag Pill */}
                  <div className="absolute top-1.5 ltr:left-1.5 rtl:right-1.5 sm:top-2 sm:ltr:left-2 sm:rtl:right-2 z-10 flex items-center gap-1 rounded-md bg-black/45 backdrop-blur-md px-1.5 py-0.5 text-[8px] sm:text-[9px] font-semibold text-white/90 border border-white/10">
                    <span>{isAr ? trend.tagAr : trend.tagEn}</span>
                  </div>

                  {/* Quick Explore Icon on Hover */}
                  <div className="absolute top-1.5 ltr:right-1.5 rtl:left-1.5 sm:top-2 sm:ltr:right-2 sm:rtl:left-2 z-10 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </div>

                  {/* Bottom Content Card */}
                  <div className="absolute bottom-0 inset-x-0 p-2 sm:p-3 z-10 text-white">
                    <h4 className="text-[11px] sm:text-[13px] font-semibold tracking-tight leading-tight drop-shadow-xs">
                      {isAr ? trend.titleAr : trend.titleEn}
                    </h4>
                    <p className="mt-0.5 text-[9px] sm:text-[10px] text-white/70 line-clamp-1">
                      {isAr ? trend.subtitleAr : trend.subtitleEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
