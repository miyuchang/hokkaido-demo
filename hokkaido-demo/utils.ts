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
