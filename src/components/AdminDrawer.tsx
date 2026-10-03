import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  Unlock,
  Sliders,
  Eye,
  EyeOff,
  RotateCcw,
  Copy,
  Check,
  Download,
  Upload,
  KeyRound,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  Search,
  Package,
  Coins,
  Sparkles,
} from 'lucide-react';
import { useSiteControls, type SiteControlItem, type CurrencyCode } from '../context/SiteControlsContext';
import { ALL_SIZES, type Product, type Language, type ProductAvailability } from '../types';
import { formatPrice } from '../lib/supabase';

interface Props {
  lang?: Language;
}

type TabType = 'products' | 'controls' | 'backup';

export default function AdminDrawer({ lang = 'ar' }: Props) {
  const {
    controls,
    toggleVisibility,
    updateControl,
    resetControl,
    resetAllControls,
    currencyCode,
    setCurrencyCode,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    resetProductsToDefault,
    exportAllDataJSON,
    importAllDataJSON,
    isAdminOpen,
    setIsAdminOpen,
    isAdminUnlocked,
    unlockAdmin,
    lockAdmin,
    setAdminPin,
  } = useSiteControls();

  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [copiedJSON, setCopiedJSON] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Products CMS State
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | number | null>(null);

  // Form State for Add/Edit Product
  const [formTitleAr, setFormTitleAr] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formPrice, setFormPrice] = useState<number>(95000);
  const [formCategory, setFormCategory] = useState('Tailoring');
  const [formCategoryAr, setFormCategoryAr] = useState('الأزياء الرسمية');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formExtraImages, setFormExtraImages] = useState('');
  const [formAvailability, setFormAvailability] = useState<ProductAvailability>('in_stock');
  const [formTags, setFormTags] = useState('');
  const [formDescAr, setFormDescAr] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [formSizes, setFormSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);

  const isAr = lang === 'ar';

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const success = unlockAdmin(pinInput.trim());
    if (success) {
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handleCopyJSON = async () => {
    try {
      const json = exportAllDataJSON();
      await navigator.clipboard.writeText(json);
      setCopiedJSON(true);
      setTimeout(() => setCopiedJSON(false), 2200);
    } catch {
      // fallback
    }
  };

  const handleDownloadJSON = () => {
    const json = exportAllDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vant-catalog-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const ok = importAllDataJSON(importText.trim());
    if (ok) {
      setImportModalOpen(false);
      setImportText('');
      setImportError(null);
    } else {
      setImportError(isAr ? 'صيغة JSON غير صحيحة، يرجى التحقق من النص' : 'Invalid JSON format');
    }
  };

  const handleSavePin = () => {
    if (newPin.trim().length >= 4) {
      setAdminPin(newPin.trim());
      setPinSuccess(true);
      setTimeout(() => {
        setPinSuccess(false);
        setShowPinChange(false);
        setNewPin('');
      }, 1500);
    }
  };

  // Open Edit Form
  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsAddingNew(false);
    setFormTitleAr(prod.title_ar || prod.title);
    setFormTitleEn(prod.title || '');
    setFormPrice(prod.price || 0);
    setFormCategory(prod.category || 'Tailoring');
    setFormCategoryAr(prod.category_ar || 'الأزياء الرسمية');
    setFormImageUrl(prod.image_url || '');
    setFormExtraImages(prod.images && prod.images.length > 1 ? prod.images.slice(1).join('\n') : '');
    setFormAvailability(prod.availability || 'in_stock');
    setFormTags(prod.tags ? prod.tags.join(', ') : '');
    setFormDescAr(prod.description_ar || '');
    setFormDescEn(prod.description || '');
    setFormSizes(prod.sizes || ['S', 'M', 'L', 'XL']);
  };

  // Open Add Form
  const startAddProduct = () => {
    setEditingProduct(null);
    setIsAddingNew(true);
    setFormTitleAr('');
    setFormTitleEn('');
    setFormPrice(95000);
    setFormCategory('Tailoring');
    setFormCategoryAr('الأزياء الرسمية');
    setFormImageUrl('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85');
    setFormExtraImages('');
    setFormAvailability('in_stock');
    setFormTags('');
    setFormDescAr('');
    setFormDescEn('');
    setFormSizes(['S', 'M', 'L', 'XL']);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleAr.trim() && !formTitleEn.trim()) return;

    const extraImagesList = formExtraImages
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const fullImagesList = [formImageUrl.trim(), ...extraImagesList].filter(Boolean);

    const tagsList = formTags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingProduct) {
      // Update existing
      updateProduct(editingProduct.id, {
        title: formTitleEn.trim() || formTitleAr.trim(),
        title_ar: formTitleAr.trim() || formTitleEn.trim(),
        price: Number(formPrice) || 0,
        category: formCategory,
        category_ar: formCategoryAr,
        image_url: formImageUrl.trim(),
        images: fullImagesList.length > 0 ? fullImagesList : [formImageUrl.trim()],
        availability: formAvailability,
        tags: tagsList,
        description: formDescEn.trim(),
        description_ar: formDescAr.trim(),
        sizes: formSizes.length > 0 ? formSizes : ['M', 'L'],
      });
      setEditingProduct(null);
    } else if (isAddingNew) {
      // Add new
      addProduct({
        title: formTitleEn.trim() || formTitleAr.trim(),
        title_ar: formTitleAr.trim() || formTitleEn.trim(),
        price: Number(formPrice) || 0,
        category: formCategory,
        category_ar: formCategoryAr,
        image_url: formImageUrl.trim(),
        images: fullImagesList.length > 0 ? fullImagesList : [formImageUrl.trim()],
        availability: formAvailability,
        tags: tagsList,
        description: formDescEn.trim(),
        description_ar: formDescAr.trim(),
        sizes: formSizes.length > 0 ? formSizes : ['M', 'L'],
      });
      setIsAddingNew(false);
    }
  };

  // Filtered products in CMS
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    const q = productSearch.toLowerCase().trim();
    return products.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        (p.title_ar && p.title_ar.includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    });
  }, [products, productSearch]);

  const controlList = Object.values(controls);

  if (!isAdminOpen) {
    // Show subtle floating badge if admin was unlocked previously
    if (isAdminUnlocked) {
      return (
        <div className="fixed bottom-4 left-4 z-50">
          <button
            type="button"
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-[#161922]/95 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md hover:bg-white/10 transition-all active:scale-95 cursor-pointer ring-1 ring-[#004ad7]/40"
          >
            <Sliders className="h-3.5 w-3.5 text-[#3b82f6]" />
            <span>{isAr ? 'لوحة التحكم (Shift + A)' : 'Admin Console (Shift + A)'}</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>
      );
    }
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-70 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsAdminOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal / Drawer Surface */}
        <motion.div
          initial={{ x: isAr ? '-100%' : '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: isAr ? '-100%' : '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l border-white/10 bg-[#0f1117] text-white shadow-2xl"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-[#141721]">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#004ad7]/20 text-[#3b82f6]">
                <Sliders className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold tracking-wide">
                    {isAr ? 'لوحة إدارة ڤانت المتكاملة' : 'VANT Master Management Console'}
                  </h2>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    Live CMS
                  </span>
                </div>
                <p className="text-[11px] text-white/50">
                  {isAr ? 'إدارة المنتجات والعروض، العملة، الأزرار، والنسخ الاحتياطي' : 'Manage products, offers, currency, buttons & backups'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {isAdminUnlocked && (
                <button
                  type="button"
                  onClick={lockAdmin}
                  title={isAr ? 'قفل لوحة الإدارة' : 'Lock Admin'}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Lock className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsAdminOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Unlocked / Locked Views */}
          {!isAdminUnlocked ? (
            /* PIN Protection Screen */
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#004ad7]/15 text-[#3b82f6] shadow-inner mb-4">
                <Lock className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold">
                {isAr ? 'الوصول محمي برمز PIN' : 'Admin Access Protected'}
              </h3>
              <p className="mt-1 max-w-xs text-xs text-white/60">
                {isAr
                  ? 'أدخل رمز المرور لفتح لوحة التحكم بالمنتجات والأزرار (الرمز الافتراضي: 1234 أو admin)'
                  : 'Enter security PIN to unlock CMS (Default: 1234 or admin)'}
              </p>

              <form onSubmit={handleUnlock} className="mt-6 w-full max-w-xs space-y-3">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                  autoFocus
                  maxLength={12}
                  className={`h-11 w-full rounded-xl border bg-black/40 px-4 text-center text-lg tracking-[0.3em] font-mono outline-none transition-all ${
                    pinError
                      ? 'border-red-500 ring-2 ring-red-500/20 text-red-400'
                      : 'border-white/15 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 text-white'
                  }`}
                />
                {pinError && (
                  <p className="text-[11px] text-red-400">
                    {isAr ? 'الرمز غير صحيح، حاول مجدداً' : 'Incorrect PIN, try again'}
                  </p>
                )}

                <button
                  type="submit"
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#004ad7] font-semibold text-xs text-white shadow-md hover:bg-[#004ad7]/90 active:scale-98 transition-all cursor-pointer"
                >
                  <Unlock className="h-3.5 w-3.5" />
                  <span>{isAr ? 'فتح لوحة التحكم' : 'Unlock Dashboard'}</span>
                </button>
              </form>
            </div>
          ) : (
            /* Main Admin Tabs & Content */
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Navigation Tabs */}
              <div className="flex border-b border-white/10 bg-[#12141c] px-3 pt-2 gap-1 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('products');
                    setEditingProduct(null);
                    setIsAddingNew(false);
                  }}
                  className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'products'
                      ? 'border-[#3b82f6] text-[#3b82f6] bg-white/[0.04]'
                      : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <Package className="h-3.5 w-3.5" />
                  <span>{isAr ? 'إدارة المنتجات والعروض' : 'Products & Offers'}</span>
                  <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[10px]">
                    {products.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('controls');
                    setEditingProduct(null);
                    setIsAddingNew(false);
                  }}
                  className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'controls'
                      ? 'border-[#3b82f6] text-[#3b82f6] bg-white/[0.04]'
                      : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <Coins className="h-3.5 w-3.5" />
                  <span>{isAr ? 'العملة والأزرار' : 'Currency & Buttons'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('backup');
                    setEditingProduct(null);
                    setIsAddingNew(false);
                  }}
                  className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'backup'
                      ? 'border-[#3b82f6] text-[#3b82f6] bg-white/[0.04]'
                      : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{isAr ? 'المزامنة والتصدير' : 'Backup & Sync'}</span>
                </button>
              </div>

              {/* TAB 1: PRODUCTS & OFFERS CMS */}
              {activeTab === 'products' && (
                <div className="flex flex-1 flex-col overflow-hidden p-4">
                  {/* Form Mode (Add or Edit) */}
                  {isAddingNew || editingProduct ? (
                    <div className="flex flex-1 flex-col overflow-y-auto pr-1">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#004ad7]/20 text-[#3b82f6]">
                            {isAddingNew ? <Plus className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                          </div>
                          <h4 className="text-sm font-bold text-white">
                            {isAddingNew
                              ? isAr ? 'إضافة قطعة / عرض جديد' : 'Add New Product / Offer'
                              : isAr ? 'تعديل بيانات القطعة' : 'Edit Product Details'}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingNew(false);
                            setEditingProduct(null);
                          }}
                          className="rounded-lg bg-white/10 px-3 py-1 text-xs text-white/70 hover:bg-white/15 hover:text-white"
                        >
                          {isAr ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>

                      <form onSubmit={handleSaveProductForm} className="space-y-4 pb-6">
                        {/* Title Arabic & English */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-[11px] font-medium text-white/70 mb-1">
                              {isAr ? 'اسم القطعة (بالعربية) *' : 'Title (Arabic) *'}
                            </label>
                            <input
                              type="text"
                              required
                              value={formTitleAr}
                              onChange={(e) => setFormTitleAr(e.target.value)}
                              placeholder="مثال: بليزر صوف إيطالي كلاسيكي"
                              className="h-9 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-xs text-white outline-none focus:border-[#3b82f6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-white/70 mb-1">
                              {isAr ? 'اسم القطعة (بالإنجليزية)' : 'Title (English)'}
                            </label>
                            <input
                              type="text"
                              value={formTitleEn}
                              onChange={(e) => setFormTitleEn(e.target.value)}
                              placeholder="e.g. Italian Virgin Wool Blazer"
                              className="h-9 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-xs text-white outline-none focus:border-[#3b82f6]"
                            />
                          </div>
                        </div>

                        {/* Price & Category */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-[11px] font-medium text-white/70 mb-1">
                              {isAr ? 'السعر (بالدينار العراقي) *' : 'Price (in IQD) *'}
                            </label>
                            <div className="relative flex items-center">
                              <input
                                type="number"
                                required
                                min={0}
                                step={1000}
                                value={formPrice}
                                onChange={(e) => setFormPrice(Number(e.target.value))}
                                className="h-9 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-xs font-mono text-white outline-none focus:border-[#3b82f6]"
                              />
                              <span className="absolute ltr:right-3 rtl:left-3 text-[11px] text-[#3b82f6] font-semibold pointer-events-none">
                                {currencyCode}
                              </span>
                            </div>
                            <p className="mt-1 text-[10px] text-white/40">
                              {isAr ? 'المعاينة:' : 'Preview:'} <span className="text-[#3b82f6] font-semibold">{formatPrice(formPrice, currencyCode)}</span>
                            </p>
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-white/70 mb-1">
                              {isAr ? 'التصنيف' : 'Category'}
                            </label>
                            <select
                              value={formCategory}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormCategory(val);
                                if (val === 'Tailoring') setFormCategoryAr('الأزياء الرسمية');
                                else if (val === 'Outerwear') setFormCategoryAr('المعاطف والسترات');
                                else if (val === 'Knitwear') setFormCategoryAr('التريكو والصوف');
                                else if (val === 'Footwear') setFormCategoryAr('الأحذية');
                                else if (val === 'Accessories') setFormCategoryAr('الإكسسوارات');
                              }}
                              className="h-9 w-full rounded-xl border border-white/15 bg-black/40 px-3 text-xs text-white outline-none focus:border-[#3b82f6]"
                            >
                              <option value="Tailoring">Tailoring / الأزياء الرسمية</option>
                              <option value="Outerwear">Outerwear / المعاطف والسترات</option>
                              <option value="Knitwear">Knitwear / التريكو والصوف</option>
                              <option value="Footwear">Footwear / الأحذية</option>
                              <option value="Accessories">Accessories / الإكسسوارات</option>
                            </select>
                          </div>
                        </div>

                        {/* Availability Status */}
                        <div>
                          <label className="block text-[11px] font-medium text-white/70 mb-1.5">
                            {isAr ? 'حالة التوفر والعرض' : 'Availability Status'}
                          </label>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {[
                              { id: 'in_stock', label_ar: 'متوفر', label_en: 'In Stock', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
                              { id: 'limited', label_ar: 'قطع محدودة', label_en: 'Limited Stock', color: 'bg-[#004ad7]/20 text-[#3b82f6] border-[#3b82f6]/30' },
                              { id: 'coming_soon', label_ar: 'قريباً', label_en: 'Coming Soon', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
                              { id: 'sold_out', label_ar: 'عرض منتهي', label_en: 'Sold Out', color: 'bg-neutral-700 text-neutral-300 border-white/10' },
                            ].map((st) => (
                              <button
                                key={st.id}
                                type="button"
                                onClick={() => setFormAvailability(st.id as ProductAvailability)}
                                className={`flex items-center justify-center rounded-xl border py-2 text-xs font-semibold transition-all cursor-pointer ${
                                  formAvailability === st.id
                                    ? `${st.color} ring-2 ring-[#3b82f6]`
                                    : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.07]'
                                }`}
                              >
                                {isAr ? st.label_ar : st.label_en}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Image URL with live preview */}
                        <div>
                          <label className="block text-[11px] font-medium text-white/70 mb-1">
                            {isAr ? 'رابط الصورة الرئيسية (Image URL) *' : 'Main Image URL *'}
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              required
                              value={formImageUrl}
                              onChange={(e) => setFormImageUrl(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="h-9 flex-1 rounded-xl border border-white/15 bg-black/30 px-3 text-xs text-white outline-none focus:border-[#3b82f6]"
                            />
                          </div>

                          {formImageUrl && (
                            <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-2">
                              <img
                                src={formImageUrl}
                                alt="Preview"
                                className="h-16 w-16 rounded-lg object-cover bg-white/5"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85';
                                }}
                              />
                              <div className="text-[11px] text-white/60">
                                <p className="font-semibold text-white">{isAr ? 'معاينة الصورة الحية' : 'Live Image Preview'}</p>
                                <p className="text-[10px] text-white/40 truncate max-w-xs">{formImageUrl}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Extra Gallery Images */}
                        <div>
                          <label className="block text-[11px] font-medium text-white/70 mb-1">
                            {isAr ? 'صور إضافية للمعرض (رابط لكل سطر)' : 'Additional Gallery Images (one URL per line)'}
                          </label>
                          <textarea
                            rows={2}
                            value={formExtraImages}
                            onChange={(e) => setFormExtraImages(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                            className="w-full rounded-xl border border-white/15 bg-black/30 p-2.5 text-xs text-white outline-none focus:border-[#3b82f6]"
                          />
                        </div>

                        {/* Sizes */}
                        <div>
                          <label className="block text-[11px] font-medium text-white/70 mb-1.5">
                            {isAr ? 'المقاسات المتوفرة' : 'Available Sizes'}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {ALL_SIZES.map((sz) => {
                              const checked = formSizes.includes(sz);
                              return (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() => {
                                    if (checked) {
                                      setFormSizes(formSizes.filter((s) => s !== sz));
                                    } else {
                                      setFormSizes([...formSizes, sz]);
                                    }
                                  }}
                                  className={`h-8 w-12 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                                    checked
                                      ? 'border-[#3b82f6] bg-[#004ad7] text-white'
                                      : 'border-white/15 bg-white/[0.04] text-white/60 hover:bg-white/10'
                                  }`}
                                >
                                  {sz}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Tags / Badges */}
                        <div>
                          <label className="block text-[11px] font-medium text-white/70 mb-1">
                            {isAr ? 'الوسوم والكلمات المفتاحية (مفصولة بفاصلة)' : 'Tags / Offer keywords (comma separated)'}
                          </label>
                          <input
                            type="text"
                            value={formTags}
                            onChange={(e) => setFormTags(e.target.value)}
                            placeholder="صوف, بليزر, عرض_خاص, شتوي"
                            className="h-9 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-xs text-white outline-none focus:border-[#3b82f6]"
                          />
                        </div>

                        {/* Descriptions */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-[11px] font-medium text-white/70 mb-1">
                              {isAr ? 'الوصف (بالعربية)' : 'Description (Arabic)'}
                            </label>
                            <textarea
                              rows={2}
                              value={formDescAr}
                              onChange={(e) => setFormDescAr(e.target.value)}
                              placeholder="تفاصيل الخامة والتفصيل..."
                              className="w-full rounded-xl border border-white/15 bg-black/30 p-2 text-xs text-white outline-none focus:border-[#3b82f6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-white/70 mb-1">
                              {isAr ? 'الوصف (بالإنجليزية)' : 'Description (English)'}
                            </label>
                            <textarea
                              rows={2}
                              value={formDescEn}
                              onChange={(e) => setFormDescEn(e.target.value)}
                              placeholder="Fabric craftsmanship details..."
                              className="w-full rounded-xl border border-white/15 bg-black/30 p-2 text-xs text-white outline-none focus:border-[#3b82f6]"
                            />
                          </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-2 pt-2">
                          <button
                            type="submit"
                            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#004ad7] font-semibold text-xs text-white shadow-md hover:bg-[#004ad7]/90 active:scale-98 transition-all cursor-pointer"
                          >
                            <Check className="h-4 w-4" />
                            <span>{isAddingNew ? (isAr ? 'حفظ وإضافة القطعة فوراً' : 'Save & Publish Piece') : (isAr ? 'حفظ التعديلات' : 'Save Changes')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingNew(false);
                              setEditingProduct(null);
                            }}
                            className="h-10 rounded-xl bg-white/10 px-5 text-xs text-white/80 hover:bg-white/15"
                          >
                            {isAr ? 'إلغاء' : 'Cancel'}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* Products Catalog List */
                    <div className="flex flex-1 flex-col overflow-hidden">
                      {/* Search & Add Action Bar */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="relative flex flex-1 items-center">
                          <Search className={`absolute pointer-events-none h-3.5 w-3.5 text-white/40 ${isAr ? 'right-3' : 'left-3'}`} />
                          <input
                            type="text"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            placeholder={isAr ? 'ابحث في قطع الكتالوج...' : 'Search pieces...'}
                            className={`h-9 w-full rounded-xl border border-white/15 bg-black/30 text-xs text-white placeholder:text-white/40 outline-none focus:border-[#3b82f6] ${
                              isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'
                            }`}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={startAddProduct}
                          className="flex h-9 items-center gap-1.5 rounded-xl bg-[#004ad7] px-3.5 text-xs font-semibold text-white hover:bg-[#004ad7]/90 active:scale-95 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>{isAr ? 'إضافة قطعة / عرض' : 'Add Piece'}</span>
                        </button>
                      </div>

                      {/* Product Items List */}
                      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                        {filteredProducts.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-center text-white/40">
                            <Package className="h-10 w-10 mb-2 opacity-50" />
                            <p className="text-xs">{isAr ? 'لا توجد قطع مطابقة للبحث' : 'No matching pieces found'}</p>
                          </div>
                        ) : (
                          filteredProducts.map((p) => {
                            const avail = p.availability || 'in_stock';
                            let statusBadge = { label: isAr ? 'متوفر' : 'In Stock', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
                            if (avail === 'limited') statusBadge = { label: isAr ? 'محدود' : 'Limited', cls: 'bg-[#004ad7]/20 text-[#3b82f6] border-[#3b82f6]/30' };
                            if (avail === 'coming_soon') statusBadge = { label: isAr ? 'قريباً' : 'Coming Soon', cls: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
                            if (avail === 'sold_out') statusBadge = { label: isAr ? 'منتهي' : 'Sold Out', cls: 'bg-neutral-800 text-neutral-400 border-white/10' };

                            return (
                              <div
                                key={p.id}
                                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 transition-all hover:bg-white/[0.06] hover:border-white/20"
                              >
                                {/* Thumbnail & Info */}
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <img
                                    src={p.image_url}
                                    alt={p.title}
                                    className="h-12 w-12 rounded-lg object-cover bg-white/5 shrink-0 border border-white/10"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85';
                                    }}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <h5 className="text-xs font-semibold text-white truncate">
                                      {isAr && p.title_ar ? p.title_ar : p.title}
                                    </h5>
                                    <div className="mt-0.5 flex items-center gap-2 flex-wrap">
                                      <span className="text-[11px] font-bold text-[#3b82f6] font-mono">
                                        {formatPrice(p.price, currencyCode)}
                                      </span>
                                      <span className="text-[9.5px] text-white/40">
                                        {p.category}
                                      </span>
                                      {/* Quick Status Toggle Pill */}
                                      <button
                                        type="button"
                                        onClick={() => toggleProductAvailability(p.id)}
                                        title={isAr ? 'انقر للتبديل السريع لحالة التوفر' : 'Click to cycle availability status'}
                                        className={`rounded-full border px-2 py-0.2 text-[9px] font-semibold cursor-pointer hover:opacity-80 transition-opacity ${statusBadge.cls}`}
                                      >
                                        {statusBadge.label} ↻
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => startEditProduct(p)}
                                    title={isAr ? 'تعديل القطعة' : 'Edit Piece'}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-[#004ad7] transition-colors"
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingProductId(p.id)}
                                    title={isAr ? 'حذف القطعة / العرض' : 'Delete Piece'}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Delete Confirmation Modal */}
                      {deletingProductId && (
                        <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 animate-fade-in">
                          <div className="flex items-center gap-2 text-xs font-semibold text-red-400">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span>{isAr ? 'هل أنت متأكد من حذف هذا العرض/القطعة نهائياً؟' : 'Confirm permanent deletion?'}</span>
                          </div>
                          <div className="mt-2.5 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                deleteProduct(deletingProductId);
                                setDeletingProductId(null);
                              }}
                              className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500"
                            >
                              {isAr ? 'نعم، حذف' : 'Delete'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingProductId(null)}
                              className="rounded-lg bg-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/15"
                            >
                              {isAr ? 'إلغاء' : 'Cancel'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CONTROLS, CURRENCY & BUTTONS */}
              {activeTab === 'controls' && (
                <div className="flex flex-1 flex-col overflow-y-auto p-4 space-y-5">
                  {/* Currency Format Selector Card */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-[#3b82f6]" />
                        <h4 className="text-xs font-bold text-white">
                          {isAr ? 'تنسيق العملة والأسعار' : 'Currency & Price Formatting'}
                        </h4>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {isAr ? 'تطبيق فوري' : 'Live Updated'}
                      </span>
                    </div>

                    <p className="text-[11px] text-white/60 mb-3">
                      {isAr
                        ? 'اختر صيغة رمز العملة المعتمدة بجانب الأسعار بالأرقام الإنجليزية:'
                        : 'Choose currency symbol format displayed alongside English numbers:'}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrencyCode('د.ع')}
                        className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-all cursor-pointer ${
                          currencyCode === 'د.ع'
                            ? 'border-[#3b82f6] bg-[#004ad7]/20 ring-2 ring-[#3b82f6]'
                            : 'border-white/10 bg-black/20 hover:bg-white/[0.05]'
                        }`}
                      >
                        <span className="text-xs font-bold text-white">د.ع (دينار عراقي)</span>
                        <span className="mt-1 font-mono text-[11px] font-bold text-[#3b82f6]">
                          95,000 د.ع
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrencyCode('IQD')}
                        className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-all cursor-pointer ${
                          currencyCode === 'IQD'
                            ? 'border-[#3b82f6] bg-[#004ad7]/20 ring-2 ring-[#3b82f6]'
                            : 'border-white/10 bg-black/20 hover:bg-white/[0.05]'
                        }`}
                      >
                        <span className="text-xs font-bold text-white">IQD (English Standard)</span>
                        <span className="mt-1 font-mono text-[11px] font-bold text-[#3b82f6]">
                          95,000 IQD
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* WhatsApp Action Phone Settings */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#3b82f6]" />
                      <span>{isAr ? 'أرقام الواتساب للطلبات والتفصيل' : 'WhatsApp Order Numbers'}</span>
                    </h4>

                    {['cfg_whatsapp_phone', 'cfg_bespoke_phone'].map((id) => {
                      const item = controls[id];
                      if (!item) return null;
                      return (
                        <div key={id} className="space-y-1">
                          <label className="block text-[11px] font-medium text-white/70">
                            {isAr ? item.name_ar : item.name_en}
                          </label>
                          <input
                            type="text"
                            value={item.actionValue || ''}
                            onChange={(e) => updateControl(id, { actionValue: e.target.value })}
                            placeholder="+964 780 000 0000"
                            className="h-9 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-xs font-mono text-white outline-none focus:border-[#3b82f6]"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* All Button Controls Toggles & Labels */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">
                        {isAr ? 'التحكم بظهور ونصوص أزرار الموقع' : 'Interface Button Toggles & Labels'}
                      </h4>
                      <button
                        type="button"
                        onClick={resetAllControls}
                        className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>{isAr ? 'استعادة الافتراضي' : 'Reset All'}</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {controlList
                        .filter((c) => !c.id.startsWith('cfg_'))
                        .map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-white/10 bg-white/[0.02] p-3 transition-colors hover:border-white/20"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-white">
                                  {isAr ? item.name_ar : item.name_en}
                                </p>
                                <p className="text-[10px] text-white/40 truncate">
                                  {isAr ? item.description_ar : item.description_en}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => toggleVisibility(item.id)}
                                className={`flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-semibold transition-all cursor-pointer ${
                                  item.visible
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-white/10 text-white/40'
                                }`}
                              >
                                {item.visible ? (
                                  <>
                                    <Eye className="h-3 w-3" />
                                    <span>{isAr ? 'ظاهر' : 'Visible'}</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="h-3 w-3" />
                                    <span>{isAr ? 'مخفي' : 'Hidden'}</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Label Editor */}
                            {item.visible && (
                              <div className="mt-2.5 grid grid-cols-2 gap-2 border-t border-white/5 pt-2">
                                <div>
                                  <span className="text-[9px] text-white/40">
                                    {isAr ? 'النص العربي:' : 'Arabic Label:'}
                                  </span>
                                  <input
                                    type="text"
                                    value={item.label_ar}
                                    onChange={(e) => updateControl(item.id, { label_ar: e.target.value })}
                                    className="mt-0.5 h-7 w-full rounded-lg border border-white/10 bg-black/40 px-2 text-[11px] text-white outline-none focus:border-[#3b82f6]"
                                  />
                                </div>
                                <div>
                                  <span className="text-[9px] text-white/40">
                                    {isAr ? 'النص الإنجليزي:' : 'English Label:'}
                                  </span>
                                  <input
                                    type="text"
                                    value={item.label_en}
                                    onChange={(e) => updateControl(item.id, { label_en: e.target.value })}
                                    className="mt-0.5 h-7 w-full rounded-lg border border-white/10 bg-black/40 px-2 text-[11px] text-white outline-none focus:border-[#3b82f6]"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BACKUP & DATA SYNC */}
              {activeTab === 'backup' && (
                <div className="flex flex-1 flex-col overflow-y-auto p-4 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-2">
                      <Download className="h-4 w-4 text-[#3b82f6]" />
                      <span>{isAr ? 'تصدير بيانات الكتالوج بالكامل (JSON)' : 'Export Full Catalog Data'}</span>
                    </h4>
                    <p className="text-[11px] text-white/60 mb-3">
                      {isAr
                        ? 'يمكنك نسخ أو تنزيل ملف JSON يحتوي على كامل المنتجات والعروض وإعدادات الأزرار والعملة لربطها بالخادم أو حفظ نسخة احتياطية.'
                        : 'Export complete JSON bundle of products, offers, controls, and currency settings.'}
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCopyJSON}
                        className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 text-xs font-semibold text-white hover:bg-white/20 active:scale-95 transition-all"
                      >
                        {copiedJSON ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedJSON ? (isAr ? 'تم النسخ للحافظة!' : 'Copied!') : (isAr ? 'نسخ نص JSON' : 'Copy JSON')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadJSON}
                        className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-[#004ad7] text-xs font-semibold text-white hover:bg-[#004ad7]/90 active:scale-95 transition-all shadow-sm"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>{isAr ? 'تنزيل ملف .json' : 'Download .json'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Import JSON */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-2">
                      <Upload className="h-4 w-4 text-[#3b82f6]" />
                      <span>{isAr ? 'استيراد واستعادة البيانات' : 'Import JSON Data'}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setImportModalOpen(true)}
                      className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-black/30 text-xs font-semibold text-white hover:bg-white/10 transition-all"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>{isAr ? 'لصق واستيراد كود JSON' : 'Paste & Import JSON'}</span>
                    </button>
                  </div>

                  {/* Reset Catalog */}
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-4">
                    <h4 className="text-xs font-bold text-red-400 flex items-center gap-2 mb-1">
                      <RotateCcw className="h-4 w-4" />
                      <span>{isAr ? 'استعادة الكتالوج الافتراضي الأصلي' : 'Restore Default Catalog'}</span>
                    </h4>
                    <p className="text-[11px] text-white/50 mb-3">
                      {isAr
                        ? 'يعيد المنتجات إلى قائمة المعروضات الافتراضية المصممة لدار ڤانت.'
                        : 'Resets products catalog back to factory luxury mock collection.'}
                    </p>
                    <button
                      type="button"
                      onClick={resetProductsToDefault}
                      className="flex h-8 items-center gap-1.5 rounded-lg bg-red-600/80 px-3 text-xs font-semibold text-white hover:bg-red-600 transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>{isAr ? 'إعادة ضبط الكتالوج' : 'Reset Products'}</span>
                    </button>
                  </div>

                  {/* Security: PIN Change */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-2">
                      <KeyRound className="h-4 w-4 text-[#3b82f6]" />
                      <span>{isAr ? 'تغيير رمز PIN للأدمن' : 'Change Security PIN'}</span>
                    </h4>

                    {!showPinChange ? (
                      <button
                        type="button"
                        onClick={() => setShowPinChange(true)}
                        className="text-xs text-[#3b82f6] hover:underline"
                      >
                        {isAr ? 'تعديل رمز المرور الحالي' : 'Edit admin PIN'}
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="password"
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          placeholder={isAr ? 'الرمز الجديد (4 أرقام أو أكثر)' : 'New PIN (4+ digits)'}
                          maxLength={12}
                          className="h-9 w-full rounded-xl border border-white/15 bg-black/40 px-3 text-xs text-white outline-none focus:border-[#3b82f6]"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleSavePin}
                            className="rounded-lg bg-[#004ad7] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#004ad7]/90"
                          >
                            {pinSuccess ? (isAr ? 'تم الحفظ!' : 'Saved!') : (isAr ? 'حفظ الرمز' : 'Save PIN')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowPinChange(false)}
                            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/70"
                          >
                            {isAr ? 'إلغاء' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Import Modal */}
              {importModalOpen && (
                <div className="absolute inset-0 z-20 flex flex-col bg-[#0f1117] p-5 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                    <h4 className="text-sm font-bold text-white">{isAr ? 'استيراد بيانات JSON' : 'Import JSON Bundle'}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        setImportModalOpen(false);
                        setImportError(null);
                      }}
                      className="text-white/60 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder={isAr ? 'الصق كود JSON هنا...' : 'Paste JSON bundle here...'}
                    className="flex-1 w-full rounded-xl border border-white/15 bg-black/40 p-3 font-mono text-xs text-white outline-none focus:border-[#3b82f6]"
                  />
                  {importError && <p className="mt-2 text-xs text-red-400">{importError}</p>}
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={handleImportSubmit}
                      className="flex-1 h-10 rounded-xl bg-[#004ad7] text-xs font-semibold text-white hover:bg-[#004ad7]/90"
                    >
                      {isAr ? 'تطبيق البيانات فوراً' : 'Apply Data'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImportModalOpen(false);
                        setImportError(null);
                      }}
                      className="h-10 rounded-xl bg-white/10 px-4 text-xs text-white/80"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
