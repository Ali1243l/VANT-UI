import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, SlidersHorizontal } from 'lucide-react';
import type { Language } from '../types';
import { useSiteControls } from '../context/SiteControlsContext';

export type AvailabilityFilterType = 'all' | 'in_stock' | 'coming_soon' | 'sold_out';

interface Props {
  categories: string[];
  active: string;
  onChange: (c: string) => void;
  getLabel?: (category: string) => string;
  lang?: Language;
  availability?: AvailabilityFilterType;
  onAvailabilityChange?: (a: AvailabilityFilterType) => void;
  availabilityCounts?: Record<AvailabilityFilterType, number>;
}

export default function CategoryFilter({
  categories,
  active,
  onChange,
  getLabel,
  lang = 'ar',
  availability = 'all',
  onAvailabilityChange,
  availabilityCounts,
}: Props) {
  const { getControl } = useSiteControls();
  const filterControl = getControl('btn_filter_availability');
  const activeRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isAr = lang === 'ar';

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [active]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const availabilityOptions: { id: AvailabilityFilterType; label_ar: string; label_en: string; dot?: string }[] = [
    { id: 'all', label_ar: 'الكل', label_en: 'All' },
    { id: 'in_stock', label_ar: 'متوفر', label_en: 'In Stock', dot: 'bg-emerald-500' },
    { id: 'coming_soon', label_ar: 'قريباً', label_en: 'Coming Soon', dot: 'bg-[#004ad7] dark:bg-[#3b82f6]' },
    { id: 'sold_out', label_ar: 'منتهي', label_en: 'Sold Out' },
  ];

  const currentOption = availabilityOptions.find((o) => o.id === availability) || availabilityOptions[0];

  return (
    <nav aria-label="Categories & Filters" className="pb-2.5 pt-0.5 sm:pb-3 sm:pt-1">
      {/* Centered, balanced luxury bar with seamless inline filter */}
      <div className="mx-auto flex max-w-7xl items-center justify-center px-3 sm:px-6">
        <div className="flex items-center gap-2 max-w-full">
          {/* 1. Category Tabs Track (Smooth Scroll, Perfectly Centered on Desktop) */}
          <div
            role="tablist"
            className="no-scrollbar flex items-center gap-1.5 sm:gap-2 overflow-x-auto [scroll-snap-type:x_proximity] select-none py-1"
          >
            {categories.map((c) => {
              const isActive = c === active;
              const displayLabel = getLabel ? getLabel(c) : c;

              return (
                <button
                  key={c}
                  ref={isActive ? activeRef : undefined}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onChange(c)}
                  className={`shrink-0 snap-center whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs sm:text-[13px] font-medium transition-all duration-200 active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-[#15171c] dark:bg-white text-white dark:text-[#15171c] font-semibold shadow-xs ring-1 ring-black/10 dark:ring-white/20'
                      : 'bg-black/[0.035] dark:bg-white/[0.06] text-[#6b7280] dark:text-[#9ca3af] hover:text-[#15171c] dark:hover:text-[#f3f4f6] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] border border-black/5 dark:border-white/5'
                  }`}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>

          {/* 2. Soft Elegant Divider */}
          {filterControl.visible && onAvailabilityChange && (
            <span className="h-4.5 w-px bg-black/12 dark:bg-white/15 shrink-0 mx-0.5" aria-hidden="true" />
          )}

          {/* 3. Availability Filter Pill (Controlled via SiteControls) */}
          {filterControl.visible && onAvailabilityChange && (
            <div className="relative shrink-0 z-20" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-[13px] font-medium transition-all duration-200 active:scale-95 cursor-pointer border shadow-2xs ${
                  availability !== 'all'
                    ? 'border-[#004ad7]/40 dark:border-[#3b82f6]/40 bg-[#004ad7]/10 dark:bg-[#3b82f6]/15 text-[#004ad7] dark:text-[#3b82f6] font-semibold ring-1 ring-[#004ad7]/20'
                    : 'border-black/10 dark:border-white/10 bg-black/[0.035] dark:bg-white/[0.06] text-[#6b7280] dark:text-[#9ca3af] hover:text-[#15171c] dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.1]'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5 opacity-75" />
                <span>{isAr ? currentOption.label_ar : currentOption.label_en}</span>
                {currentOption.dot && (
                  <span className={`h-1.5 w-1.5 rounded-full ${currentOption.dot} animate-pulse`} />
                )}
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-flex items-center"
                >
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </motion.span>
              </button>

              {/* Floating Dropdown Menu with Spring Physics & Deep Glass Blur */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    role="menu"
                    className={`absolute z-50 mt-1.5 min-w-[155px] rounded-2xl border border-black/10 dark:border-white/15 bg-white/95 dark:bg-[#1a1d24]/95 p-1.5 shadow-2xl backdrop-blur-xl text-[#15171c] dark:text-white ${
                      isAr ? 'left-0 sm:right-auto' : 'right-0 sm:left-auto'
                    }`}
                  >
                    <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[#6b7280] dark:text-[#9ca3af] uppercase select-none">
                      {isAr ? 'حالة التوفر' : 'Availability'}
                    </div>

                    {availabilityOptions.map((opt) => {
                      const isSelected = availability === opt.id;
                      const count = availabilityCounts ? availabilityCounts[opt.id] : undefined;

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            onAvailabilityChange(opt.id);
                            setIsOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#004ad7]/10 dark:bg-[#3b82f6]/15 text-[#004ad7] dark:text-[#3b82f6] font-semibold'
                              : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#6b7280] dark:text-[#9ca3af] hover:text-[#15171c] dark:hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {opt.dot ? (
                              <span className={`h-1.5 w-1.5 rounded-full ${opt.dot}`} />
                            ) : (
                              <span className="h-1.5 w-1.5" />
                            )}
                            <span>{isAr ? opt.label_ar : opt.label_en}</span>
                            {typeof count === 'number' && (
                              <span className="text-[10px] opacity-60 tabular-nums">({count})</span>
                            )}
                          </div>
                          {isSelected && <Check className="h-3.5 w-3.5 text-[#004ad7] dark:text-[#3b82f6]" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
