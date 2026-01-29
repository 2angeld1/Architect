/**
 * Formats a number as a currency string.
 * @param amount - The numerical amount to format.
 * @param currency - The currency code (e.g., 'USD', 'MXN'). Defaults to 'USD'.
 * @param locale - The locale to use for formatting. Defaults to 'en-US'.
 * @returns A formatted currency string.
 */
export const formatPrice = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats an area value with its unit.
 * @param area - The area value.
 * @param unit - The unit of measurement. Defaults to 'm²'.
 * @returns A formatted area string.
 */
export const formatArea = (area: number, unit: string = 'm²'): string => {
  return `${area} ${unit}`;
};
