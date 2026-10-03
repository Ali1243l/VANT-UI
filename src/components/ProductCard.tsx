import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { Product, Language } from '../types';
import { formatPrice } from '../lib/supabase';
import { useSiteControls } from '../context/SiteControlsContext';

interface Props {
  product: Product;
  index: number;
  lang: Language;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string | number) => void;
  onOpen: (p: Product) => void;
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.98,
  },
  visible: (customIndex: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 26,
      delay: Math.min(customIndex, 8) * 0.045,
    },
  }),
};

export default function ProductCard({
  product,
  index,
  lang,
  isWishlisted = false,
  onToggleWishlist,
  onOpen,
}: Props) {
  const { formatPrice } = useSiteControls();
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { width, height } = product;

  // Reserve the image's real ratio when known, so the masonry layout never jumps
  const ratio = width && height ? { aspectRatio: `${width} / ${height}` } : { minHeight: 240 };
  const displayTitle = lang === 'ar' && product.title_ar ? product.title_ar : product.title;
  const isAr = lang === 'ar';

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    }
  };

  const availability = product.availability ?? 'in_stock';

  let badgeText = '';
  let badgeContextText = '';
  let badgeClasses = '';
  let dotClass = '';

  switch (availability) {
    case 'sold_out':
      badgeText = isAr ? 'عرض منتهي' : 'Sold Out';
      badgeContextText = isAr ? 'نفدت الكمية' : 'Restock Pending';
      badgeClasses = 'bg-black/85 dark:bg-black/90 text-white/90 border-white/15';
      break;
    case 'coming_soon':
      badgeText = isAr ? 'قريباً' : 'Coming Soon';
      badgeContextText = isAr ? 'حجز مسبق' : 'Early Access';
      badgeClasses = 'bg-[#004ad7] dark:bg-[#3b82f6] text-white border-white/20 shadow-xs';
      break;
    case 'limited':
      badgeText = isAr ? 'قطع محدودة' : 'Limited Stock';
      badgeContextText = isAr ? 'أعداد قليلة' : 'Few Remaining';
      badgeClasses = 'bg-[#004ad7]/15 dark:bg-[#3b82f6]/20 text-[#004ad7] dark:text-[#3b82f6] border-[#004ad7]/30';
      dotClass = 'bg-[#004ad7] dark:bg-[#3b82f6] animate-pulse';
      break;
    case 'in_stock':
    default:
      badgeText = isAr ? 'متوفر' : 'In Stock';
      badgeContextText = isAr ? 'تسليم فوري' : 'Ready to Ship';
      badgeClasses = 'bg-white/95 dark:bg-[#16191f]/95 text-[#15171c] dark:text-white border-black/10 dark:border-white/15';
      dotClass = 'bg-[#004ad7] dark:bg-[#3b82f6]';
      break;
  }

  return (
    <motion.article
      layout="position"
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      data-preload-product-id={product.id}
      className="mb-3 break-inside-avoid sm:mb-4 group cursor-pointer relative"
      onClick={() => onOpen(product)}
    >
      <div className="block w-full text-start outline-none">
        <div
          className="relative overflow-hidden rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] transition-all duration-300 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:group-hover:shadow-[0_10px_28px_rgba(0,0,0,0.35)] group-hover:-translate-y-0.5"
          style={loaded && !imgError ? undefined : ratio}
        >
          {/* Shimmer skeleton behind loading image */}
          {!loaded && !imgError && (
            <div className="absolute inset-0 bg-black/[0.03] dark:bg-white/[0.04] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.06] dark:via-white/[0.07] to-transparent animate-shimmer" />
            </div>
          )}

          {!imgError ? (
            <img
              src={product.image_url}
              alt={displayTitle}
              width={width ?? undefined}
              height={height ?? undefined}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onLoad={() => setLoaded(true)}
              onError={() => setImgError(true)}
              className={`h-auto w-full object-cover transition-all duration-500 ease-out group-active:scale-[0.985] ${
                availability === 'sold_out' ? 'opacity-80 saturate-[85%]' : ''
              } ${loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-[2px] scale-[1.02]'}`}
            />
          ) : (
            /* Resilient luxury fallback card if image is unavailable */
            <div className="flex flex-col items-center justify-center p-8 min-h-[260px] bg-gradient-to-b from-stone-100 to-stone-200/60 dark:from-[#16191f] dark:to-[#0d0f12] text-[#15171c]/40 dark:text-white/40">
              <svg className="w-12 h-12 stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="mt-3 text-xs tracking-widest uppercase font-medium">VANT · ڤانت</span>
            </div>
          )}

          {/* Availability Status Badge (Always clearly visible on mobile and desktop) */}
          <div
            className={`absolute top-2.5 ltr:left-2.5 rtl:right-2.5 z-20 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9.5px] sm:text-[10px] font-semibold tracking-wide backdrop-blur-md border shadow-2xs select-none ${badgeClasses}`}
          >
            {dotClass && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotClass}`} />}
            <span>{badgeText}</span>
          </div>

          {/* Quick Wishlist Heart Bookmark Button */}
          {onToggleWishlist && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.8 }}
              onClick={handleHeartClick}
              aria-label={
                isWishlisted
                  ? isAr ? 'إزالة من المفضلة' : 'Remove from wishlist'
                  : isAr ? 'إضافة إلى المفضلة' : 'Add to wishlist'
              }
              title={
                isWishlisted
                  ? isAr ? 'في المفضلة' : 'Saved in wishlist'
                  : isAr ? 'حفظ في المفضلة' : 'Save to wishlist'
              }
              className={`absolute top-2.5 ltr:right-2.5 rtl:left-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 shadow-2xs ${
                isWishlisted
                  ? 'bg-[#004ad7] dark:bg-[#3b82f6] text-white shadow-[#004ad7]/30'
                  : 'bg-black/35 text-white/90 hover:bg-black/55 hover:text-white opacity-80 sm:opacity-0 sm:group-hover:opacity-100'
              }`}
            >
              <Heart
                className={`h-3.5 w-3.5 transition-transform ${
                  isWishlisted ? 'fill-current scale-110' : ''
                }`}
              />
            </motion.button>
          )}

          {/* Subtle hover overlay hint */}
          <div className="pointer-events-none absolute inset-0 bg-black/0 dark:bg-white/0 transition-colors duration-300 group-hover:bg-black/[0.02] dark:group-hover:bg-white/[0.03]" />
        </div>

        <div className="px-1 pt-2.5">
          <h3
            dir="auto"
            className="text-[13px] font-medium leading-snug text-[#15171c] dark:text-[#f3f4f6] transition-colors group-hover:text-[#004ad7] dark:group-hover:text-[#3b82f6]"
          >
            {displayTitle}
          </h3>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-[12.5px] font-semibold tabular-nums text-[#004ad7] dark:text-[#3b82f6]">
              {formatPrice(product.price)}
            </p>
            {product.category && (
              <span className="text-[10px] text-[#6b7280] dark:text-[#9ca3af] font-mono">
                {product.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
