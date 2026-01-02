/**
 * 解析字串為純數字，移除貨幣符號與逗號
 */
export const parseCurrency = (val: any): number => {
  if (typeof val === 'number') return val;
  const cleaned = String(val || 0).replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

/**
 * 根據總金額與分帳類型計算分配比例 (A, B)
 */
export const calculateSplit = (total: number, type: 'equal' | 'manual', manualA?: number) => {
  if (type === 'equal') {
    const a = Math.round(total / 2);
    const b = total - a;
    return { a, b };
  }
  const a = manualA ?? 0;
  const b = total - a;
  return { a, b };
};

/**
 * 安全 URL 檢查：確保連結僅限於 http, https 或 tel, 並過濾 javascript: 注入
 */
export const sanitizeUrl = (url: string | undefined): string => {
  if (!url) return '#';
  const trimmedUrl = url.trim();
  if (trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('tel:') || trimmedUrl.startsWith('mailto:')) {
    return trimmedUrl;
  }
  console.warn(`Blocked suspicious URL: ${trimmedUrl}`);
  return '#';
};
