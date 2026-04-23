export const ui = {
  en: {
    'nav.products': 'Products',
    'nav.oem': 'OEM',
    'nav.applications': 'Applications',
    'nav.manufacturing': 'Manufacturing',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'cta.requestSample': 'Request a Sample',
    'cta.downloadCatalog': 'Download Catalog',
    'cta.viewAllProducts': 'View all products',
    'cta.startOemProject': 'Start an OEM project',
    'cta.sendInquiry': 'Send Inquiry',
    'cta.tourFacility': 'Tour our facility',
    'cta.aboutSentech': 'About SEN TECH',
    'rfq.title': 'Tell us what you need to measure.',
    'rfq.subtitle': 'Send a part number, an application brief, or a target spec. Our engineering team will reply within one business day.',
    'rfq.field.name': 'Name',
    'rfq.field.company': 'Company',
    'rfq.field.country': 'Country',
    'rfq.field.email': 'Email',
    'rfq.field.product': 'Product interest',
    'rfq.field.quantity': 'Estimated annual quantity',
    'rfq.field.message': 'Message',
    'rfq.success.title': 'Thanks — we received your inquiry.',
    'rfq.success.body': 'A SEN TECH engineer will reply within one business day.',
    'rfq.success.again': 'Send another',
    'lang.switchTo': 'Switch language',
    'lang.zh': '繁中',
    'lang.en': 'EN',
    'aria.openMenu': 'Open menu',
    'aria.closeMenu': 'Close menu',
    'aria.openRfq': 'Open RFQ form',
  },
  'zh-TW': {
    'nav.products': '產品',
    'nav.oem': 'OEM 服務',
    'nav.applications': '應用領域',
    'nav.manufacturing': '製造能力',
    'nav.about': '關於我們',
    'nav.contact': '聯絡我們',
    'cta.requestSample': '索取樣品',
    'cta.downloadCatalog': '下載產品型錄',
    'cta.viewAllProducts': '查看全部產品',
    'cta.startOemProject': '啟動 OEM 專案',
    'cta.sendInquiry': '送出詢價',
    'cta.tourFacility': '參觀廠區',
    'cta.aboutSentech': '關於業達',
    'rfq.title': '告訴我們您要測量的目標',
    'rfq.subtitle': '請提供料號、應用情境或規格目標，業達工程團隊將於一個工作天內回覆。',
    'rfq.field.name': '姓名',
    'rfq.field.company': '公司',
    'rfq.field.country': '國家',
    'rfq.field.email': '電子郵件',
    'rfq.field.product': '產品需求',
    'rfq.field.quantity': '預估年用量',
    'rfq.field.message': '訊息內容',
    'rfq.success.title': '感謝您的詢問，我們已收到。',
    'rfq.success.body': '業達工程師將於一個工作天內回覆您。',
    'rfq.success.again': '再送出一筆',
    'lang.switchTo': '切換語言',
    'lang.zh': '繁中',
    'lang.en': 'EN',
    'aria.openMenu': '開啟選單',
    'aria.closeMenu': '關閉選單',
    'aria.openRfq': '開啟詢價表單',
  },
} as const;

export type Locale = keyof typeof ui;
export type UiKey = keyof typeof ui.en;

export function t(locale: Locale, key: UiKey): string {
  return ui[locale][key] ?? ui.en[key] ?? key;
}

export function localizedPath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'en') return clean;
  return `/zh-tw${clean === '/' ? '' : clean}`;
}

export function stripLocaleFromPath(path: string): string {
  return path.replace(/^\/zh-tw(?=\/|$)/, '') || '/';
}
