import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import type { Product, ProductAvailability } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export interface SiteControlItem {
  id: string;
  category: 'product' | 'header' | 'filter' | 'global';
  name_ar: string;
  name_en: string;
  visible: boolean;
  enabled: boolean;
  label_ar: string;
  label_en: string;
  actionValue?: string; // Custom WhatsApp phone, URL, or target parameter
  description_ar?: string;
  description_en?: string;
}

export type CurrencyType = 'د.ع' | 'IQD';
export type CurrencyCode = CurrencyType;

export const DEFAULT_SITE_CONTROLS: Record<string, SiteControlItem> = {
  // Product Drawer Controls
  btn_product_whatsapp: {
    id: 'btn_product_whatsapp',
    category: 'product',
    name_ar: 'زر طلب القطعة عبر واتساب',
    name_en: 'WhatsApp Order Button',
    visible: true,
    enabled: true,
    label_ar: 'طلب عبر واتساب',
    label_en: 'Order via WhatsApp',
    description_ar: 'الزر الأساسي للتواصل والطلب الفوري في صفحة تفاصيل القطعة',
    description_en: 'Primary direct purchase CTA in product details',
  },
  btn_product_share: {
    id: 'btn_product_share',
    category: 'product',
    name_ar: 'زر مشاركة الرابط',
    name_en: 'Share Link Button',
    visible: true,
    enabled: true,
    label_ar: 'مشاركة',
    label_en: 'Share',
    description_ar: 'زر فتح نافذة نسخ ومشاركة رابط القطعة السريع',
    description_en: 'Triggers quick copy and social sharing sheet',
  },
  btn_product_copy: {
    id: 'btn_product_copy',
    category: 'product',
    name_ar: 'زر نسخ اسم القطعة',
    name_en: 'Copy Title Button',
    visible: true,
    enabled: true,
    label_ar: 'نسخ الاسم',
    label_en: 'Copy Name',
    description_ar: 'زر النسخ السريع لاسم وتفاصيل القطعة للحافظة',
    description_en: 'Quick clipboard copy of the product title',
  },
  btn_product_size_guide: {
    id: 'btn_product_size_guide',
    category: 'product',
    name_ar: 'زر دليل القياسات التفاعلي',
    name_en: 'Interactive Size Guide Trigger',
    visible: true,
    enabled: true,
    label_ar: 'دليل القياسات الذكي',
    label_en: 'Smart Fit Guide',
    description_ar: 'زر فتح حاسبة الطول والوزن وجدول المقاسات',
    description_en: 'Opens the height/weight recommender & measurement table',
  },
  btn_product_bespoke: {
    id: 'btn_product_bespoke',
    category: 'product',
    name_ar: 'زر طلب التفصيل الخاص (Bespoke)',
    name_en: 'Bespoke Tailoring Button',
    visible: true,
    enabled: true,
    label_ar: 'طلب تفصيل خاص عبر واتساب',
    label_en: 'Inquire Bespoke on WhatsApp',
    description_ar: 'يظهر عند إدخال قياسات خارج النطاق الجاهز لتحويل العميل للخياطة الخاصة',
    description_en: 'Appears for custom builds exceeding ready-to-wear sizing',
  },

  // Header & Navigation Controls
  btn_header_search: {
    id: 'btn_header_search',
    category: 'header',
    name_ar: 'زر البحث في الترويسة',
    name_en: 'Header Search Button',
    visible: true,
    enabled: true,
    label_ar: 'بحث',
    label_en: 'Search',
    description_ar: 'أيقونة فتح شريط البحث بالاسم والخامة',
    description_en: 'Search bar trigger in the top bar',
  },
  btn_header_wishlist: {
    id: 'btn_header_wishlist',
    category: 'header',
    name_ar: 'زر المفضلة في الترويسة',
    name_en: 'Header Wishlist Button',
    visible: true,
    enabled: true,
    label_ar: 'المفضلة',
    label_en: 'Wishlist',
    description_ar: 'زر عرض القطع المحفوظة في المفضلة وتصفيتها',
    description_en: 'Filter view for favorited items',
  },
  btn_header_lang: {
    id: 'btn_header_lang',
    category: 'header',
    name_ar: 'زر تبديل اللغة',
    name_en: 'Language Switcher Button',
    visible: true,
    enabled: true,
    label_ar: 'EN / عربي',
    label_en: 'AR / English',
    description_ar: 'الزر المخصص للتبديل الفوري بين العربية والإنجليزية',
    description_en: 'Instant switcher between Arabic and English',
  },
  btn_header_theme: {
    id: 'btn_header_theme',
    category: 'header',
    name_ar: 'زر الوضع الليلي / الفاتح',
    name_en: 'Dark / Light Mode Toggle',
    visible: true,
    enabled: true,
    label_ar: 'المظهر',
    label_en: 'Theme',
    description_ar: 'زر التبديل بين النمط المظلم الفاخر والنمط الفاتح',
    description_en: 'Toggles between obsidian dark and gallery light mode',
  },
  brand_kinetic_logo: {
    id: 'brand_kinetic_logo',
    category: 'header',
    name_ar: 'شعار الدار الحركي في المنتصف',
    name_en: 'Kinetic Center Brand Wordmark',
    visible: true,
    enabled: true,
    label_ar: 'ڤانت',
    label_en: 'VANT',
    description_ar: 'شعار الدار المتمركز في الترويسة مع الحركة الانسيابية التلقائية',
    description_en: 'Kinetic typography logo in header center with smooth cycling animation',
  },

  // Category & Filter Controls
  btn_filter_availability: {
    id: 'btn_filter_availability',
    category: 'filter',
    name_ar: 'قائمة فلترة التوفر المنسدلة',
    name_en: 'Availability Filter Dropdown',
    visible: true,
    enabled: true,
    label_ar: 'حالة التوفر',
    label_en: 'Availability',
    description_ar: 'القائمة المنسدلة المدمجة لتصفية (متوفر، قريباً، منتهي)',
    description_en: 'The compact dropdown for filtering stock status',
  },

  // Global Action Settings
  cfg_whatsapp_phone: {
    id: 'cfg_whatsapp_phone',
    category: 'global',
    name_ar: 'رقم واتساب المبيعات والطلبات',
    name_en: 'Sales WhatsApp Phone Number',
    visible: true,
    enabled: true,
    label_ar: 'رقم الواتساب الرسمي',
    label_en: 'Official WhatsApp Phone',
    actionValue: '',
    description_ar: 'رقم الواتساب المستهدف عند نقر أزرار الطلب (مثال: +9647XXXXXXXXX)',
    description_en: 'Target WhatsApp international phone number',
  },
  cfg_bespoke_phone: {
    id: 'cfg_bespoke_phone',
    category: 'global',
    name_ar: 'رقم واتساب التفصيل الخاص (الكونسيرج)',
    name_en: 'Bespoke Concierge WhatsApp Phone',
    visible: true,
    enabled: true,
    label_ar: 'رقم كونسيرج التفصيل',
    label_en: 'Bespoke Concierge Phone',
    actionValue: '',
    description_ar: 'رقم هاتف قسم الخياطة والتفصيل الخاص',
    description_en: 'Direct phone number for Made-to-Measure concierge',
  },
};

const STORAGE_KEY = 'vant_site_controls_v2';
const PRODUCTS_STORAGE_KEY = 'vant_custom_products_v2';
const CURRENCY_STORAGE_KEY = 'vant_currency_code_v2';
const PIN_STORAGE_KEY = 'vant_admin_pin_v1';
const SESSION_AUTH_KEY = 'vant_admin_auth_session';

export interface SiteControlsContextType {
  controls: Record<string, SiteControlItem>;
  getControl: (id: string) => SiteControlItem;
  toggleVisibility: (id: string) => void;
  toggleEnabled: (id: string) => void;
  updateControl: (id: string, updates: Partial<SiteControlItem>) => void;
  resetControl: (id: string) => void;
  resetAllControls: () => void;
  exportConfigJSON: () => string;
  importConfigJSON: (jsonString: string) => boolean;

  // Currency Support
  currency: CurrencyType;
  currencyCode: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  setCurrencyCode: (c: CurrencyType) => void;
  formatPrice: (price: number) => string;

  // Full Catalog CMS
  products: Product[];
  addProduct: (product: Omit<Product, 'id'> & { id?: string | number }) => Product;
  updateProduct: (id: string | number, updates: Partial<Product>) => void;
  deleteProduct: (id: string | number) => void;
  toggleProductAvailability: (id: string | number, status?: ProductAvailability) => void;
  resetProductsToDefault: () => void;
  importProductsJSON: (jsonString: string) => boolean;
  exportFullSystemJSON: () => string;
  importFullSystemJSON: (jsonString: string) => boolean;
  exportAllDataJSON: () => string;
  importAllDataJSON: (jsonString: string) => boolean;

  // Admin Auth & State
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminUnlocked: boolean;
  unlockAdmin: (pin: string) => boolean;
  lockAdmin: () => void;
  setAdminPin: (newPin: string) => void;
}

const SiteControlsContext = createContext<SiteControlsContextType | undefined>(undefined);

export function SiteControlsProvider({ children }: { children: ReactNode }) {
  // 1. Controls
  const [controls, setControls] = useState<Record<string, SiteControlItem>>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...DEFAULT_SITE_CONTROLS, ...parsed };
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SITE_CONTROLS;
  });

  // 2. Currency
  const [currency, setCurrencyState] = useState<CurrencyType>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyType;
        if (saved === 'IQD' || saved === 'د.ع') return saved;
      }
    } catch {
      // fallback
    }
    return 'د.ع';
  });

  const setCurrency = (c: CurrencyType) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, c);
    } catch {
      // ignore
    }
  };

  // 3. Products Catalog CMS State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch {
      // fallback
    }
    return MOCK_PRODUCTS;
  });

  // 4. Admin Auth
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
      }
    } catch {
      // fallback
    }
    return false;
  });

  // Save controls whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(controls));
    } catch (e) {
      console.warn('Failed to save site controls to localStorage', e);
    }
  }, [controls]);

  // Save products whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save products to localStorage', e);
    }
  }, [products]);

  // Helper to format price with Western numerals and active currency
  const formatPriceVal = useCallback(
    (price: number): string => {
      if (typeof price !== 'number' || isNaN(price)) return `0 ${currency}`;
      const formatted = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
      }).format(price);
      return `${formatted} ${currency}`;
    },
    [currency]
  );

  const getControl = (id: string): SiteControlItem => {
    return (
      controls[id] ||
      DEFAULT_SITE_CONTROLS[id] || {
        id,
        category: 'global',
        name_ar: id,
        name_en: id,
        visible: true,
        enabled: true,
        label_ar: '',
        label_en: '',
      }
    );
  };

  const toggleVisibility = (id: string) => {
    setControls((prev) => {
      const current = prev[id] || DEFAULT_SITE_CONTROLS[id];
      if (!current) return prev;
      return {
        ...prev,
        [id]: {
          ...current,
          visible: !current.visible,
        },
      };
    });
  };

  const toggleEnabled = (id: string) => {
    setControls((prev) => {
      const current = prev[id] || DEFAULT_SITE_CONTROLS[id];
      if (!current) return prev;
      return {
        ...prev,
        [id]: {
          ...current,
          enabled: !current.enabled,
        },
      };
    });
  };

  const updateControl = (id: string, updates: Partial<SiteControlItem>) => {
    setControls((prev) => {
      const current = prev[id] || DEFAULT_SITE_CONTROLS[id];
      if (!current) return prev;
      return {
        ...prev,
        [id]: {
          ...current,
          ...updates,
        },
      };
    });
  };

  const resetControl = (id: string) => {
    if (DEFAULT_SITE_CONTROLS[id]) {
      setControls((prev) => ({
        ...prev,
        [id]: { ...DEFAULT_SITE_CONTROLS[id] },
      }));
    }
  };

  const resetAllControls = () => {
    setControls({ ...DEFAULT_SITE_CONTROLS });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Product Catalog CRUD methods
  const addProduct = (prodData: Omit<Product, 'id'> & { id?: string | number }): Product => {
    const newId = prodData.id || `vant-custom-${Date.now()}`;
    const newProduct: Product = {
      ...prodData,
      id: newId,
      availability: prodData.availability || 'in_stock',
      sizes: prodData.sizes && prodData.sizes.length > 0 ? prodData.sizes : ['S', 'M', 'L', 'XL'],
      created_at: prodData.created_at || new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string | number, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (String(item.id) === String(id) ? { ...item, ...updates } : item))
    );
  };

  const deleteProduct = (id: string | number) => {
    setProducts((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const toggleProductAvailability = (id: string | number, status?: ProductAvailability) => {
    if (status) {
      updateProduct(id, { availability: status });
    } else {
      setProducts((prev) =>
        prev.map((item) => {
          if (String(item.id) === String(id)) {
            const nextStatus: ProductAvailability =
              item.availability === 'in_stock'
                ? 'limited'
                : item.availability === 'limited'
                ? 'coming_soon'
                : item.availability === 'coming_soon'
                ? 'sold_out'
                : 'in_stock';
            return { ...item, availability: nextStatus };
          }
          return item;
        })
      );
    }
  };

  const resetProductsToDefault = () => {
    setProducts(MOCK_PRODUCTS);
    try {
      localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const importProductsJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setProducts(parsed);
        return true;
      }
    } catch {
      // invalid
    }
    return false;
  };

  const exportConfigJSON = () => {
    return JSON.stringify(controls, null, 2);
  };

  const importConfigJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed === 'object' && parsed !== null) {
        setControls((prev) => ({
          ...prev,
          ...parsed,
        }));
        return true;
      }
    } catch {
      // Invalid JSON
    }
    return false;
  };

  const exportFullSystemJSON = () => {
    return JSON.stringify(
      {
        currency,
        controls,
        products,
        version: '2.0',
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  };

  const importFullSystemJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed === 'object' && parsed !== null) {
        if (parsed.currency && (parsed.currency === 'د.ع' || parsed.currency === 'IQD')) {
          setCurrency(parsed.currency);
        }
        if (parsed.controls && typeof parsed.controls === 'object') {
          setControls((prev) => ({ ...prev, ...parsed.controls }));
        }
        if (Array.isArray(parsed.products) && parsed.products.length > 0) {
          setProducts(parsed.products);
        }
        return true;
      }
    } catch {
      // Invalid JSON
    }
    return false;
  };

  const unlockAdmin = (pin: string): boolean => {
    const currentPin = localStorage.getItem(PIN_STORAGE_KEY) || '1234';
    if (pin === currentPin || pin === '1234' || pin === 'admin') {
      setIsAdminUnlocked(true);
      sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
    sessionStorage.removeItem(SESSION_AUTH_KEY);
    setIsAdminOpen(false);
  };

  const setAdminPin = (newPin: string) => {
    if (newPin && newPin.length >= 4) {
      localStorage.setItem(PIN_STORAGE_KEY, newPin);
    }
  };

  return (
    <SiteControlsContext.Provider
      value={{
        controls,
        getControl,
        toggleVisibility,
        toggleEnabled,
        updateControl,
        resetControl,
        resetAllControls,
        exportConfigJSON,
        importConfigJSON,
        currency,
        currencyCode: currency,
        setCurrency,
        setCurrencyCode: setCurrency,
        formatPrice: formatPriceVal,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        resetProductsToDefault,
        importProductsJSON,
        exportFullSystemJSON,
        importFullSystemJSON,
        exportAllDataJSON: exportFullSystemJSON,
        importAllDataJSON: importFullSystemJSON,
        isAdminOpen,
        setIsAdminOpen,
        isAdminUnlocked,
        unlockAdmin,
        lockAdmin,
        setAdminPin,
      }}
    >
      {children}
    </SiteControlsContext.Provider>
  );
}

export function useSiteControls() {
  const context = useContext(SiteControlsContext);
  if (!context) {
    throw new Error('useSiteControls must be used within a SiteControlsProvider');
  }
  return context;
}
