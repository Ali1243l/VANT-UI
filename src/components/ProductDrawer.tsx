import { useEffect, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion, useDragControls, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Check, AlertCircle, Copy, Ruler, MessageCircle, Truck, Share2, Sparkles } from 'lucide-react';
import { ALL_SIZES, type Product, type Language, type Size } from '../types';
import { formatPrice } from '../lib/supabase';
import ShareModal from './ShareModal';
import { SIZE_GUIDE_DATA, calculateRecommendedSize } from '../data/sizeGuide';
import { useSiteControls } from '../context/SiteControlsContext';

interface Props {
  product: Product | null;
  lang: Language;
  onClose: () => void;
}

// Snappy, zero-glitch directional slide variants for carousel
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 55 : -55,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 480, damping: 38 },
      opacity: { duration: 0.16 },
      scale: { duration: 0.16 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 55 : -55,
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: 'spring' as const, stiffness: 480, damping: 38 },
      opacity: { duration: 0.14 },
      scale: { duration: 0.14 },
    },
  }),
};


export default function ProductDrawer({ product, lang, onClose }: Props) {
  const controls = useDragControls();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const { getControl, formatPrice } = useSiteControls();
  const whatsappControl = getControl('btn_product_whatsapp');
  const shareControl = getControl('btn_product_share');
  const copyControl = getControl('btn_product_copy');
  const sizeGuideControl = getControl('btn_product_size_guide');
  const bespokeControl = getControl('btn_product_bespoke');
  const whatsappPhoneControl = getControl('cfg_whatsapp_phone');
  const bespokePhoneControl = getControl('cfg_bespoke_phone');

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [sizeFeedback, setSizeFeedback] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [calcHeight, setCalcHeight] = useState<string>('');
  const [calcWeight, setCalcWeight] = useState<string>('');

  const dynamicRecommendation = useMemo(() => {
    if (calcHeight.length !== 3) return null;
    if (calcWeight.length < 2) return null;
    const h = parseInt(calcHeight, 10);
    const w = parseInt(calcWeight, 10);
    if (isNaN(h) || isNaN(w) || h < 120 || h > 220 || w < 30 || w > 200) return null;
    return calculateRecommendedSize(h, w);
  }, [calcHeight, calcWeight]);

  // Normalize images list (always at least 1 image)
  const images = product?.images && product.images.length > 0
    ? product.images
    : product?.image_url
    ? [product.image_url]
    : [];

  // Reset local state when product changes and pre-cache all product images immediately
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedSize(null);
      setSizeFeedback(null);
      setCopiedTitle(false);
      setShowSizeGuide(false);

      // Instantly preload all images for this product so image 2, 3, etc. load with 0 delay
      const list = product.images && product.images.length > 0 ? product.images : [product.image_url];
      list.forEach((src) => {
        if (src) {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setLoadedImages((prev) => new Set(prev).add(src));
          };
        }
      });
    }
  }, [product]);

  const paginate = useCallback(
    (newDirection: number) => {
      if (images.length <= 1) return;
      setSlideDirection(newDirection);
      setActiveImageIndex((prev) => {
        let next = prev + newDirection;
        if (next < 0) next = images.length - 1;
        if (next >= images.length) next = 0;
        return next;
      });
    },
    [images.length]
  );

  // Keyboard navigation: ESC to close, Left/Right for gallery
  useEffect(() => {
    if (!product) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSizeGuide) {
          setShowSizeGuide(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        paginate(lang === 'ar' ? -1 : 1);
      } else if (e.key === 'ArrowLeft') {
        paginate(lang === 'ar' ? 1 : -1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [product, onClose, paginate, lang, showSizeGuide]);

  const availability = product?.availability ?? 'in_stock';
  const isSoldOut = availability === 'sold_out';
  const availableSizes = isSoldOut
    ? new Set<string>()
    : new Set((product?.sizes ?? []).map((s) => s.toUpperCase()));

  const displayTitle = lang === 'ar' && product?.title_ar ? product.title_ar : product?.title;
  const displayCategory = lang === 'ar' && product?.category_ar ? product.category_ar : product?.category;
  const displayDescription = lang === 'ar' && product?.description_ar ? product.description_ar : product?.description;

  let statusBadgeLabel = '';
  let statusBadgeClasses = '';
  let statusBannerText = '';
  let statusDotClass = '';
  let buttonLabel = '';

  switch (availability) {
    case 'sold_out':
      statusBadgeLabel = lang === 'ar' ? 'عرض منتهي' : 'Sold Out';
      statusBadgeClasses = 'bg-black/80 dark:bg-black/90 text-white/90 border-white/15';
      statusBannerText =
        lang === 'ar'
          ? 'عرض منتهي — نعتذر، نفدت الكمية والمقاسات بالكامل. يمكنك اختيار مقاسك بالأسفل لطلب إعادة توفيره.'
          : 'Sold Out — All sizes and allocations are currently exhausted. Select your size below to request a restock.';
      buttonLabel = selectedSize
        ? lang === 'ar'
          ? `طلب إعادة توفير مقاس (${selectedSize}) عبر واتساب`
          : `Request Restock for Size (${selectedSize})`
        : lang === 'ar'
        ? 'طلب إعادة توفير أو استفسار عبر واتساب'
        : 'Inquire on Restock via WhatsApp';
      break;
    case 'coming_soon':
      statusBadgeLabel = lang === 'ar' ? 'قريباً' : 'Coming Soon';
      statusBadgeClasses = 'bg-[#004ad7] dark:bg-[#3b82f6] text-white border-white/20 shadow-xs';
      statusBannerText =
        lang === 'ar'
          ? 'قريباً — هذه القطعة قيد التجهيز الفاخر ضمن التشكيلة القادمة. يمكنك حجز أسبقية الاستلام فور توفرها.'
          : 'Coming Soon — This piece is in production for the upcoming drop. You may pre-register priority allocation.';
      buttonLabel = selectedSize
        ? lang === 'ar'
          ? `حجز مسبق لمقاس (${selectedSize}) عبر واتساب`
          : `Pre-Order Size (${selectedSize}) via WhatsApp`
        : lang === 'ar'
        ? 'حجز مسبق واستفسار عبر واتساب'
        : 'Pre-Order & Inquire via WhatsApp';
      break;
    case 'limited':
      statusBadgeLabel = lang === 'ar' ? 'قطع محدودة' : 'Limited Stock';
      statusBadgeClasses = 'bg-[#004ad7]/15 dark:bg-[#3b82f6]/20 text-[#004ad7] dark:text-[#3b82f6] border-[#004ad7]/30';
      statusDotClass = 'bg-[#004ad7] dark:bg-[#3b82f6] animate-pulse';
      statusBannerText =
        lang === 'ar'
          ? 'قطع محدودة — تتوفر أعداد قليلة جداً من هذا الإصدار في المخزون.'
          : 'Limited Allocation — Only a few pieces remain in current stock.';
      buttonLabel = selectedSize
        ? lang === 'ar'
          ? `طلب مقاس (${selectedSize}) عبر واتساب`
          : `Order Size (${selectedSize}) via WhatsApp`
        : lang === 'ar'
        ? 'طلب واستفسار عبر واتساب'
        : 'Order & Inquire via WhatsApp';
      break;
    case 'in_stock':
    default:
      statusBadgeLabel = lang === 'ar' ? 'متوفر' : 'In Stock';
      statusBadgeClasses = 'bg-white/90 dark:bg-[#16191f]/90 text-[#15171c] dark:text-white border-black/10 dark:border-white/15';
      statusDotClass = 'bg-[#004ad7] dark:bg-[#3b82f6]';
      statusBannerText =
        lang === 'ar'
          ? 'متوفر وجاهز للشحن الفوري والتسليم.'
          : 'In Stock and ready for immediate complimentary dispatch.';
      buttonLabel = selectedSize
        ? lang === 'ar'
          ? `طلب مقاس (${selectedSize}) عبر واتساب`
          : `Order Size (${selectedSize}) via WhatsApp`
        : lang === 'ar'
        ? 'طلب واستفسار عبر واتساب'
        : 'Order & Inquire via WhatsApp';
      break;
  }

  const whatsappText = encodeURIComponent(
    lang === 'ar'
      ? isSoldOut
        ? selectedSize
          ? `مرحباً دار ڤانت، أود الاستفسار عن إمكانية إعادة توفير مقاس (${selectedSize}) لقطعة "${displayTitle ?? ''}" (عرض منتهي - السعر: ${product ? formatPrice(product.price) : ''})`
          : `مرحباً دار ڤانت، أود الاستفسار عن إمكانية إعادة توفير قطعة "${displayTitle ?? ''}" (عرض منتهي - السعر: ${product ? formatPrice(product.price) : ''})`
        : availability === 'coming_soon'
        ? selectedSize
          ? `مرحباً دار ڤانت، أود حجز أسبقية لمقاس (${selectedSize}) من قطعة "${displayTitle ?? ''}" (قريباً - السعر: ${product ? formatPrice(product.price) : ''})`
          : `مرحباً دار ڤانت، أود الاستفسار وحجز أسبقية لقطعة "${displayTitle ?? ''}" (قريباً - السعر: ${product ? formatPrice(product.price) : ''})`
        : selectedSize
        ? `مرحباً دار ڤانت، أود طلب قطعة "${displayTitle ?? ''}" بمقاس (${selectedSize}) (السعر: ${product ? formatPrice(product.price) : ''})`
        : `مرحباً دار ڤانت، أود الاستفسار والطلب لقطعة "${displayTitle ?? ''}" (السعر: ${product ? formatPrice(product.price) : ''})`
      : isSoldOut
      ? selectedSize
        ? `Hello Maison VANT, I would like to inquire about restocking size (${selectedSize}) for "${displayTitle ?? ''}" (Sold Out - Price: ${product ? formatPrice(product.price) : ''})`
        : `Hello Maison VANT, I would like to inquire about restocking "${displayTitle ?? ''}" (Sold Out - Price: ${product ? formatPrice(product.price) : ''})`
      : availability === 'coming_soon'
      ? selectedSize
        ? `Hello Maison VANT, I would like to pre-register size (${selectedSize}) for "${displayTitle ?? ''}" (Coming Soon - Price: ${product ? formatPrice(product.price) : ''})`
        : `Hello Maison VANT, I would like to pre-register/inquire about "${displayTitle ?? ''}" (Coming Soon - Price: ${product ? formatPrice(product.price) : ''})`
      : selectedSize
      ? `Hello Maison VANT, I would like to order "${displayTitle ?? ''}" in size (${selectedSize}) (Price: ${product ? formatPrice(product.price) : ''})`
      : `Hello Maison VANT, I would like to order/inquire about "${displayTitle ?? ''}" (Price: ${product ? formatPrice(product.price) : ''})`
  );
  const targetPhone = (whatsappPhoneControl?.actionValue || '').replace(/[^0-9]/g, '');
  const whatsappUrl = targetPhone ? `https://wa.me/${targetPhone}?text=${whatsappText}` : `https://wa.me/?text=${whatsappText}`;

  const bespokeWhatsappText = encodeURIComponent(
    lang === 'ar'
      ? `مرحباً دار ڤانت، أود الاستفسار عن خدمة التفصيل الخاص (Made-to-Measure) لقطعة "${displayTitle ?? ''}" (الطول: ${calcHeight} سم، الوزن: ${calcWeight} كغم، السعر: ${product ? formatPrice(product.price) : ''})`
      : `Hello Maison VANT, I would like to inquire about Made-to-Measure bespoke tailoring for "${displayTitle ?? ''}" (Height: ${calcHeight} cm, Weight: ${calcWeight} kg, Price: ${product ? formatPrice(product.price) : ''})`
  );
  const targetBespokePhone = (bespokePhoneControl?.actionValue || '').replace(/[^0-9]/g, '');
  const bespokeWhatsappUrl = targetBespokePhone ? `https://wa.me/${targetBespokePhone}?text=${bespokeWhatsappText}` : `https://wa.me/?text=${bespokeWhatsappText}`;

  const handleCopyTitle = async () => {
    if (!displayTitle) return;
    try {
      await navigator.clipboard.writeText(displayTitle);
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = displayTitle;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    }
  };

  const handleSizeClick = (size: Size) => {
    setSelectedSize(size);
    if (isSoldOut) {
      setSizeFeedback(
        lang === 'ar'
          ? `المقاس (${size}) منتهي حالياً ضمن هذا العرض — تم تحديده لطلب إعادة توفيره عبر واتساب بالأسفل`
          : `Size (${size}) is sold out — selected for restock request via WhatsApp below`
      );
    } else if (availableSizes.has(size)) {
      setSizeFeedback(
        lang === 'ar'
          ? `المقاس (${size}) متوفر وجاهز للشحن الفوري`
          : `Size (${size}) is currently in stock & ready for dispatch`
      );
    } else {
      setSizeFeedback(
        lang === 'ar'
          ? `عذراً، المقاس (${size}) نفد من المخزون لهذه القطعة`
          : `Apologies, size (${size}) is currently out of stock`
      );
    }
  };

  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentImageSrc = images[activeImageIndex];
  const isCurrentImgLoaded = currentImageSrc ? loadedImages.has(currentImageSrc) : false;

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop with click to dismiss and luxury blur fade */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/65 dark:bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={onClose}
          />

          {/* Responsive Sheet/Modal Container */}
          <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none md:items-center md:p-6 lg:p-10">
            <motion.div
              key="sheet-content"
              role="dialog"
              aria-modal="true"
              aria-label={displayTitle}
              className="pointer-events-auto relative flex w-full flex-col overflow-hidden bg-[#f8f9fa] dark:bg-[#16191f] shadow-2xl transition-colors duration-250 
                         rounded-t-[28px] max-h-[92dvh]
                         md:max-h-[86vh] md:max-w-4xl lg:max-w-5xl md:rounded-[32px] md:border md:border-black/5 md:dark:border-white/10"
              initial={isMobile ? { y: '100%', opacity: 0.6 } : { opacity: 0, scale: 0.95, y: 18 }}
              animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={isMobile ? { y: '100%', opacity: 0 } : { opacity: 0, scale: 0.96, y: 14 }}
              transition={
                isMobile
                  ? { type: 'spring', damping: 30, stiffness: 320, mass: 0.85 }
                  : { type: 'spring', damping: 28, stiffness: 320, mass: 0.8 }
              }
              drag={isMobile ? 'y' : false}
              dragListener={false}
              dragControls={controls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, info) => {
                if (isMobile && (info.offset.y > 120 || info.velocity.y > 600)) {
                  onClose();
                }
              }}
            >
              {/* Mobile Drag Handle */}
              <div
                className="flex shrink-0 cursor-grab items-center justify-center pb-2 pt-3 md:hidden [touch-action:none] select-none"
                onPointerDown={(e) => controls.start(e)}
              >
                <span className="h-1.5 w-12 rounded-full bg-black/20 dark:bg-white/20" />
              </div>

              {/* Dedicated Close Button (Visible on both desktop and mobile) */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-[#0d0f12]/80 text-[#15171c] dark:text-white backdrop-blur-md shadow-xs border border-black/5 dark:border-white/10 transition-all hover:bg-white dark:hover:bg-[#0d0f12] active:scale-95 ltr:right-4 rtl:left-4"
                aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
              >
                <X className="h-4 w-4" />
              </button>

              {/* Responsive Layout Grid (Split screen on Desktop, Stack on Mobile) */}
              <div className="grid flex-1 overflow-y-auto overscroll-contain md:grid-cols-12 md:overflow-hidden">
                {/* GALLERY SECTION (Column 1-7 on desktop) */}
                <div className="relative flex flex-col justify-between bg-black/[0.02] dark:bg-black/20 p-4 sm:p-6 md:col-span-7 md:border-e md:border-black/5 md:dark:border-white/10 md:overflow-y-auto">
                  {/* Main Active Image Viewport (Selector 1: Absolute overlay eliminates transition layout glitches) */}
                  <div className="relative flex items-center justify-center min-h-[340px] sm:min-h-[400px] md:h-[490px] w-full overflow-hidden rounded-2xl bg-black/[0.02] dark:bg-white/[0.02]">
                    {/* Sleek Skeleton UI placeholder with pulse & shimmer */}
                    {!isCurrentImgLoaded && (
                      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-black/[0.02] to-black/[0.06] dark:from-white/[0.02] dark:to-white/[0.05] animate-pulse pointer-events-none">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-sm">
                          <div className="h-4 w-4 rounded-full border-2 border-[#004ad7] dark:border-[#3b82f6] border-t-transparent animate-spin" />
                        </div>
                        <span className="mt-3 text-[11px] font-medium tracking-[0.25em] text-black/30 dark:text-white/30 uppercase select-none">
                          VANT · ڤانت
                        </span>
                      </div>
                    )}

                    {/* Absolute positioning container with ultra-smooth touch drag swipe */}
                    <AnimatePresence initial={false} custom={slideDirection}>
                      <motion.div
                        key={activeImageIndex}
                        custom={slideDirection}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        drag={images.length > 1 ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.25}
                        onDragEnd={(_, info) => {
                          if (images.length <= 1) return;
                          const swipeThreshold = 40;
                          const isRtl = lang === 'ar';
                          if (info.offset.x < -swipeThreshold || info.velocity.x < -250) {
                            paginate(isRtl ? -1 : 1);
                          } else if (info.offset.x > swipeThreshold || info.velocity.x > 250) {
                            paginate(isRtl ? 1 : -1);
                          }
                        }}
                        className="absolute inset-0 z-10 flex items-center justify-center p-3 select-none cursor-grab active:cursor-grabbing touch-pan-y"
                      >
                        <img
                          src={currentImageSrc}
                          alt={`${displayTitle} - ${activeImageIndex + 1}`}
                          decoding="async"
                          referrerPolicy="no-referrer"
                          draggable={false}
                          onLoad={() => {
                            if (currentImageSrc) {
                              setLoadedImages((prev) => new Set(prev).add(currentImageSrc));
                            }
                          }}
                          className={`max-h-full max-w-full object-contain drop-shadow-sm select-none pointer-events-none transition-opacity duration-150 ${
                            isCurrentImgLoaded ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Carousel Navigation Arrows (if multiple images) */}
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => paginate(-1)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 dark:bg-[#16191f]/85 text-[#15171c] dark:text-white backdrop-blur-md shadow-md border border-black/5 dark:border-white/10 transition-all hover:scale-105 active:scale-95"
                          aria-label={lang === 'ar' ? 'الصورة السابقة' : 'Previous image'}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => paginate(1)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 dark:bg-[#16191f]/85 text-[#15171c] dark:text-white backdrop-blur-md shadow-md border border-black/5 dark:border-white/10 transition-all hover:scale-105 active:scale-95"
                          aria-label={lang === 'ar' ? 'الصورة التالية' : 'Next image'}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>

                        {/* Image Counter Badge */}
                        <div className="absolute bottom-3 right-3 z-20 rounded-full bg-black/60 dark:bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-white backdrop-blur-sm tabular-nums">
                          {activeImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Animated Thumbnail Navigation Strip */}
                  {images.length > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-2.5">
                      {images.map((img, idx) => {
                        const isActive = idx === activeImageIndex;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSlideDirection(idx > activeImageIndex ? 1 : -1);
                              setActiveImageIndex(idx);
                            }}
                            className={`relative h-14 w-14 overflow-hidden rounded-xl border-2 transition-all active:scale-95 ${
                              isActive
                                ? 'border-[#004ad7] dark:border-[#3b82f6] shadow-sm'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                            aria-label={`View image ${idx + 1}`}
                          >
                            <img
                              src={img}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                            {isActive && (
                              <motion.div
                                layoutId="active-thumb"
                                className="absolute inset-0 bg-[#004ad7]/10 dark:bg-[#3b82f6]/15"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* DETAILS SECTION (Selector 2: Details Column with Quick Copy & Size Guide) */}
                <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-5 md:overflow-y-auto">
                  <div>
                    {/* Quiet Category & Availability Status Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      {displayCategory && (
                        <p className="text-xs font-semibold tracking-widest uppercase text-[#6b7280] dark:text-[#9ca3af]">
                          {displayCategory}
                        </p>
                      )}
                      <span className="text-black/20 dark:text-white/20">•</span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border backdrop-blur-md ${statusBadgeClasses}`}>
                        {statusDotClass && <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass}`} />}
                        <span>{statusBadgeLabel}</span>
                      </span>
                    </div>

                    {/* Prominent Availability Status Banner */}
                    <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-[#004ad7]/15 dark:border-[#3b82f6]/20 bg-[#004ad7]/[0.05] dark:bg-[#3b82f6]/[0.08] px-3.5 py-2 text-xs text-[#15171c] dark:text-white/90">
                      <span className="flex h-2 w-2 rounded-full bg-[#004ad7] dark:bg-[#3b82f6] shrink-0" />
                      <span dir="auto" className="font-medium leading-relaxed">{statusBannerText}</span>
                    </div>

                    {/* Title - Full Width, Straight and Prominent Editorial Typography */}
                    <h2
                      dir="auto"
                      className="mt-3 text-2xl sm:text-3xl font-bold leading-tight text-[#15171c] dark:text-white"
                    >
                      {displayTitle}
                    </h2>

                    {/* Price & Action Row (Copy & Share moved down here for clean balance) */}
                    <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                      <p className="text-2xl sm:text-3xl font-bold tabular-nums text-[#004ad7] dark:text-[#3b82f6]">
                        {formatPrice(product.price)}
                      </p>

                      {/* Action Buttons: Share & Copy (Controlled via SiteControls) */}
                      <div className="flex items-center gap-2">
                        {/* Piece Share Button */}
                        {shareControl.visible && (
                          <button
                            type="button"
                            onClick={() => setShowShareModal(true)}
                            className="flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/15 bg-white/80 dark:bg-white/10 px-3 py-1.5 text-xs font-medium text-[#15171c] dark:text-white hover:border-[#004ad7] dark:hover:border-[#3b82f6] transition-all active:scale-95 shadow-2xs cursor-pointer"
                            title={lang === 'ar' ? shareControl.label_ar : shareControl.label_en}
                            aria-label={lang === 'ar' ? shareControl.label_ar : shareControl.label_en}
                          >
                            <Share2 className="h-3.5 w-3.5 text-[#004ad7] dark:text-[#3b82f6]" />
                            <span>{lang === 'ar' ? shareControl.label_ar : shareControl.label_en}</span>
                          </button>
                        )}

                        {/* Quick Copy Button */}
                        {copyControl.visible && (
                          <button
                            type="button"
                            onClick={handleCopyTitle}
                            className="flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/15 bg-white/80 dark:bg-white/10 px-3 py-1.5 text-xs font-medium text-[#15171c] dark:text-white hover:border-[#004ad7] dark:hover:border-[#3b82f6] transition-all active:scale-95 shadow-2xs cursor-pointer"
                            title={lang === 'ar' ? copyControl.label_ar : copyControl.label_en}
                            aria-label={lang === 'ar' ? copyControl.label_ar : copyControl.label_en}
                          >
                            {copiedTitle ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-[#004ad7] dark:text-[#3b82f6]" />
                                <span className="font-semibold text-[#004ad7] dark:text-[#3b82f6]">
                                  {lang === 'ar' ? 'تم النسخ!' : 'Copied!'}
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5 text-[#6b7280] dark:text-[#9ca3af]" />
                                <span>{lang === 'ar' ? copyControl.label_ar : copyControl.label_en}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {displayDescription && (
                      <p
                        dir="auto"
                        className="mt-4 text-sm leading-relaxed text-[#15171c]/75 dark:text-white/70"
                      >
                        {displayDescription}
                      </p>
                    )}

                    {/* Interactive Size Selection Matrix & Size Guide Trigger */}
                    <div className="mt-6 border-t border-black/8 dark:border-white/10 pt-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-sm font-semibold text-[#15171c] dark:text-white">
                            {isSoldOut
                              ? lang === 'ar'
                                ? 'المقاسات (نفدت جميع المقاسات)'
                                : 'Sizes (All Sizes Sold Out)'
                              : availability === 'coming_soon'
                              ? lang === 'ar'
                                ? 'المقاسات المتاحة للحجز المسبق'
                                : 'Sizes for Pre-Order'
                              : lang === 'ar'
                              ? 'المقاسات المتوفرة'
                              : 'Available Sizes'}
                          </h3>
                          {/* Size Guide Trigger Button (Controlled via SiteControls) */}
                          {sizeGuideControl.visible && (
                            <button
                              type="button"
                              onClick={() => setShowSizeGuide(!showSizeGuide)}
                              className="flex items-center gap-1 text-xs font-medium text-[#004ad7] dark:text-[#3b82f6] hover:underline cursor-pointer"
                            >
                              <Ruler className="h-3.5 w-3.5" />
                              <span>{lang === 'ar' ? sizeGuideControl.label_ar : sizeGuideControl.label_en}</span>
                            </button>
                          )}
                        </div>

                        {selectedSize && (
                          <span className="text-xs font-semibold text-[#004ad7] dark:text-[#3b82f6]">
                            {lang === 'ar' ? `المقاس: ${selectedSize}` : `Selected: ${selectedSize}`}
                          </span>
                        )}
                      </div>

                      {/* Sold Out Sizes Clarification Note */}
                      {isSoldOut && (
                        <p className="mt-1.5 text-[11px] text-[#6b7280] dark:text-[#9ca3af]">
                          {lang === 'ar'
                            ? 'انتهت الكميات المتوفرة لجميع القياسات أعلاه. يمكنك اختيار مقاسك للطلب الفوري لإعادة التوفير.'
                            : 'All standard sizes are currently sold out. Tap your desired size to request a restock.'}
                        </p>
                      )}

                      {/* Expandable Size Guide Panel with Dynamic Smart Fit Recommender */}
                      <AnimatePresence>
                        {showSizeGuide && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden mt-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#20242c]/90 p-4 shadow-sm"
                          >
                            <div className="flex items-center justify-between pb-2.5 border-b border-black/5 dark:border-white/10">
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-[#004ad7] dark:text-[#3b82f6]" />
                                <span className="text-xs font-semibold text-[#15171c] dark:text-white">
                                  {lang === 'ar' ? 'دليل المقاسات الذكي والمخصص' : 'Dynamic Fit Guide & Calculator'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowSizeGuide(false)}
                                className="text-[#6b7280] dark:text-[#9ca3af] hover:text-black dark:hover:text-white cursor-pointer"
                                aria-label={lang === 'ar' ? 'إغلاق الدليل' : 'Close guide'}
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* 1. Dynamic Smart Fit Calculator Input Box */}
                            <div className="mt-3 rounded-xl border border-[#004ad7]/20 dark:border-[#3b82f6]/25 bg-[#004ad7]/[0.03] dark:bg-[#3b82f6]/[0.06] p-3">
                              <span className="text-[11px] font-semibold text-[#004ad7] dark:text-[#3b82f6] block mb-2">
                                {lang === 'ar'
                                  ? 'اقتراح المقاس التلقائي — أدخل طولك ووزنك:'
                                  : 'Smart Fit Recommender — Enter height & weight:'}
                              </span>
                              {/* Inputs with Strict Adult Validation */}
                              {(() => {
                                const heightNum = calcHeight ? parseInt(calcHeight, 10) : null;
                                const weightNum = calcWeight ? parseInt(calcWeight, 10) : null;
                                const isHeightInvalid = calcHeight.length === 3 && (heightNum! < 120 || heightNum! > 220);
                                const isWeightInvalid = calcWeight.length >= 2 && (weightNum! < 30 || weightNum! > 200);

                                return (
                                  <>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-[10px] text-[#6b7280] dark:text-[#9ca3af] block mb-1">
                                          {lang === 'ar' ? 'الطول (120 - 220 سم)' : 'Height (120 - 220 cm)'}
                                        </label>
                                        <input
                                          type="text"
                                          inputMode="numeric"
                                          maxLength={3}
                                          placeholder={lang === 'ar' ? '3 أرقام (مثال: 175)' : '3 digits (e.g. 175)'}
                                          value={calcHeight}
                                          onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                                            setCalcHeight(val);
                                          }}
                                          className={`w-full rounded-lg border px-2.5 py-1.5 text-xs text-[#15171c] dark:text-white outline-none transition-colors ${
                                            isHeightInvalid
                                              ? 'border-red-500 bg-red-500/10 dark:bg-red-500/15'
                                              : 'border-black/10 dark:border-white/15 bg-white dark:bg-[#16191f] focus:border-[#004ad7]'
                                          }`}
                                        />
                                        {isHeightInvalid && (
                                          <p className="text-[9px] text-red-500 dark:text-red-400 mt-1 leading-tight font-medium">
                                            {lang === 'ar' ? 'الطول للبالغين: 120 إلى 220 سم (3 أرقام)' : 'Adult height: 120 - 220 cm'}
                                          </p>
                                        )}
                                      </div>

                                      <div>
                                        <label className="text-[10px] text-[#6b7280] dark:text-[#9ca3af] block mb-1">
                                          {lang === 'ar' ? 'الوزن (30 - 200 كغم)' : 'Weight (30 - 200 kg)'}
                                        </label>
                                        <input
                                          type="text"
                                          inputMode="numeric"
                                          maxLength={3}
                                          placeholder={lang === 'ar' ? 'مثال: 72' : 'e.g. 72'}
                                          value={calcWeight}
                                          onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                                            setCalcWeight(val);
                                          }}
                                          className={`w-full rounded-lg border px-2.5 py-1.5 text-xs text-[#15171c] dark:text-white outline-none transition-colors ${
                                            isWeightInvalid
                                              ? 'border-red-500 bg-red-500/10 dark:bg-red-500/15'
                                              : 'border-black/10 dark:border-white/15 bg-white dark:bg-[#16191f] focus:border-[#004ad7]'
                                          }`}
                                        />
                                        {isWeightInvalid && (
                                          <p className="text-[9px] text-red-500 dark:text-red-400 mt-1 leading-tight font-medium">
                                            {lang === 'ar' ? 'الوزن للبالغين: 30 إلى 200 كغم' : 'Adult weight: 30 - 200 kg'}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Live Dynamic Recommendation Result */}
                                    {dynamicRecommendation && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`mt-3 pt-2.5 border-t flex flex-col gap-2 rounded-xl p-2.5 ${
                                          dynamicRecommendation.isBespoke
                                            ? 'border-amber-500/30 bg-amber-500/[0.08] dark:bg-amber-500/[0.1]'
                                            : 'border-[#004ad7]/15 dark:border-[#3b82f6]/20 bg-[#004ad7]/[0.03] dark:bg-[#3b82f6]/[0.05]'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="text-[11px] text-[#15171c] dark:text-white">
                                              {lang === 'ar' ? 'المقاس المقترح:' : 'Recommended Fit:'}
                                            </span>
                                            <span
                                              className={`rounded-md px-2 py-0.5 text-xs font-bold text-white shadow-2xs ${
                                                dynamicRecommendation.isBespoke
                                                  ? 'bg-amber-600 dark:bg-amber-500'
                                                  : 'bg-[#004ad7] dark:bg-[#3b82f6]'
                                              }`}
                                            >
                                              {dynamicRecommendation.displaySize}
                                            </span>
                                            {dynamicRecommendation.reason_ar && (
                                              <span
                                                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                                                  dynamicRecommendation.isBespoke
                                                    ? 'text-amber-700 dark:text-amber-400 bg-amber-500/15'
                                                    : 'text-[#004ad7] dark:text-[#3b82f6] bg-[#004ad7]/10 dark:bg-[#3b82f6]/20'
                                                }`}
                                              >
                                                {lang === 'ar' ? dynamicRecommendation.reason_ar : dynamicRecommendation.reason_en}
                                              </span>
                                            )}
                                          </div>

                                          {dynamicRecommendation.isBespoke ? (
                                            bespokeControl.visible ? (
                                              <a
                                                href={bespokeWhatsappUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-lg bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs active:scale-95 cursor-pointer text-center"
                                              >
                                                {lang === 'ar' ? bespokeControl.label_ar : bespokeControl.label_en}
                                              </a>
                                            ) : null
                                          ) : dynamicRecommendation.size ? (
                                            <button
                                              type="button"
                                              onClick={() => handleSizeClick(dynamicRecommendation.size!)}
                                              className="rounded-lg bg-[#004ad7] dark:bg-[#3b82f6] px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs hover:opacity-95 active:scale-95 cursor-pointer"
                                            >
                                              {lang === 'ar'
                                                ? `اعتماد مقاس (${dynamicRecommendation.displaySize})`
                                                : `Select (${dynamicRecommendation.displaySize})`}
                                            </button>
                                          ) : null}
                                        </div>

                                        <p className="text-[10px] text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                                          {lang === 'ar' ? dynamicRecommendation.note_ar : dynamicRecommendation.note_en}
                                        </p>
                                      </motion.div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>

                            {/* 2. Comprehensive Sizing Matrix Table */}
                            <div className="overflow-x-auto mt-3">
                              <table className="w-full text-center text-xs">
                                <thead>
                                  <tr className="text-[#6b7280] dark:text-[#9ca3af] border-b border-black/5 dark:border-white/5">
                                    <th className="py-1.5 px-2 font-semibold">{lang === 'ar' ? 'المقاس' : 'Size'}</th>
                                    <th className="py-1.5 px-2 font-semibold">{lang === 'ar' ? 'الطول المقترح (سم)' : 'Height (cm)'}</th>
                                    <th className="py-1.5 px-2 font-semibold">{lang === 'ar' ? 'الوزن المقترح (كغم)' : 'Weight (kg)'}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {SIZE_GUIDE_DATA.map((row) => {
                                    const isRowSelected = selectedSize === row.size;
                                    const isCalcMatch = dynamicRecommendation?.size === row.size;
                                    return (
                                      <tr
                                        key={row.size}
                                        className={`border-b border-black/5 dark:border-white/5 transition-colors ${
                                          isRowSelected || isCalcMatch
                                            ? 'bg-[#004ad7]/10 dark:bg-[#3b82f6]/15 font-semibold text-[#004ad7] dark:text-[#3b82f6]'
                                            : 'text-[#15171c] dark:text-white/90'
                                        }`}
                                      >
                                        <td className="py-1.5 px-2 font-bold">{row.size}</td>
                                        <td className="py-1.5 px-2 tabular-nums">{row.height}</td>
                                        <td className="py-1.5 px-2 tabular-nums">{row.weight}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            <p className="mt-2 text-[10px] text-[#6b7280] dark:text-[#9ca3af] leading-tight">
                              {lang === 'ar'
                                ? '• القياسات ديناميكية وقابلة للتعديل وتناسب القصة العصرية المريحة.'
                                : '• Sizing data is dynamic and tailored for contemporary relaxed luxury.'}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <ul className="mt-3.5 flex flex-wrap gap-2.5">
                        {ALL_SIZES.map((size) => {
                          const isAvailable = availableSizes.has(size);
                          const isSelected = selectedSize === size;

                          return (
                            <li key={size}>
                              <button
                                type="button"
                                onClick={() => handleSizeClick(size)}
                                className={`flex h-11 min-w-12 items-center justify-center rounded-xl border text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
                                  isSelected
                                    ? 'border-[#004ad7] bg-[#004ad7] text-white shadow-md shadow-[#004ad7]/30 dark:border-[#3b82f6] dark:bg-[#3b82f6]'
                                    : isAvailable
                                    ? 'border-black/15 dark:border-white/20 bg-white dark:bg-[#20242c] text-[#15171c] dark:text-white hover:border-[#004ad7] dark:hover:border-[#3b82f6]'
                                    : 'border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] text-black/35 dark:text-white/30 line-through hover:border-black/25 dark:hover:border-white/25'
                                }`}
                                aria-label={`${size} ${isAvailable ? 'available' : isSoldOut ? 'sold out - tap to request restock' : 'out of stock'}`}
                              >
                                {size}
                              </button>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Size selection feedback banner - cohesive cobalt blue palette */}
                      {sizeFeedback && (
                        <div
                          className={`mt-3 flex items-center gap-2 rounded-xl p-2.5 text-xs transition-colors ${
                            selectedSize && availableSizes.has(selectedSize)
                              ? 'bg-[#004ad7]/8 dark:bg-[#3b82f6]/15 text-[#004ad7] dark:text-[#3b82f6] border border-[#004ad7]/20 dark:border-[#3b82f6]/30'
                              : 'bg-[#004ad7]/6 dark:bg-[#3b82f6]/10 text-[#004ad7] dark:text-[#3b82f6] border border-[#004ad7]/15 dark:border-[#3b82f6]/25'
                          }`}
                        >
                          {selectedSize && availableSizes.has(selectedSize) ? (
                            <Check className="h-4 w-4 shrink-0 text-[#004ad7] dark:text-[#3b82f6]" />
                          ) : (
                            <AlertCircle className="h-4 w-4 shrink-0 text-[#004ad7] dark:text-[#3b82f6]" />
                          )}
                          <span className="font-medium">{sizeFeedback}</span>
                        </div>
                      )}
                    </div>

                    {/* Garment Specifications Accordion/List */}
                    <div className="mt-6 border-t border-black/8 dark:border-white/10 pt-4 text-xs space-y-2 text-[#6b7280] dark:text-[#9ca3af]">
                      <div className="flex justify-between py-1">
                        <span>{lang === 'ar' ? 'الخامة والتصنيع' : 'Material & Craft'}</span>
                        <span className="font-medium text-[#15171c] dark:text-white">
                          {lang === 'ar' ? 'حرفية يدوية فائقة' : 'Handcrafted Luxury'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>{lang === 'ar' ? 'طريقة العرض' : 'Presentation'}</span>
                        <span className="font-medium text-[#15171c] dark:text-white">
                          {lang === 'ar' ? 'كتالوج لوك بوك حصري' : 'Exclusive Lookbook Piece'}
                        </span>
                      </div>
                    </div>
                  </div>

                    {/* Nationwide Express Delivery Banner (3-5 days across all governorates) */}
                    <div className="mt-6 flex items-center gap-2.5 rounded-2xl border border-black/8 dark:border-white/10 bg-black/[0.025] dark:bg-white/[0.04] p-3 text-xs text-[#15171c] dark:text-[#f3f4f6]">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#004ad7]/10 dark:bg-[#3b82f6]/20 text-[#004ad7] dark:text-[#3b82f6]">
                        <Truck className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1 leading-snug">
                        <span className="font-semibold block text-[12px]">
                          {lang === 'ar' ? 'مدة التوصيل: 3 ~ 5 أيام لكافة المحافظات' : 'Delivery: 3 ~ 5 Days to All Governorates'}
                        </span>
                        <span className="text-[11px] text-[#6b7280] dark:text-[#9ca3af]">
                          {lang === 'ar'
                            ? 'شحن مضمون ومباشر لكافة محافظات العراق مع حق المعاينة والفحص عند الاستلام.'
                            : 'Insured direct dispatch to all Iraqi governorates with preview inspection upon arrival.'}
                        </span>
                      </div>
                    </div>

                    {/* Primary CTA / WhatsApp Inquire & Order Button (Controlled via SiteControls) */}
                    {whatsappControl.visible && (
                      <div className="mt-4 pt-2">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#004ad7] hover:bg-[#003db3] dark:bg-[#3b82f6] dark:hover:bg-[#2563eb] text-white text-sm font-semibold tracking-wide transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(0,74,215,0.28)] dark:shadow-[0_4px_24px_rgba(59,130,246,0.35)] cursor-pointer"
                        >
                          <MessageCircle className="h-4.5 w-4.5 fill-white/20 stroke-white stroke-[2]" />
                          <span>
                            {selectedSize
                              ? `${lang === 'ar' ? whatsappControl.label_ar : whatsappControl.label_en} (${selectedSize})`
                              : buttonLabel || (lang === 'ar' ? whatsappControl.label_ar : whatsappControl.label_en)}
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

          {/* Share Modal Dialog */}
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            product={product}
            lang={lang}
          />
        </>
      )}
    </AnimatePresence>
  );
}
