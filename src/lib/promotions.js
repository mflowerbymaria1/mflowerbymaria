/**
 * Promotions and discounts helper
 */

/**
 * Calculates the Cyber Monday 3x2 discount.
 * Rule: For every 3 individual items (units) in the cart, the cheapest one of each triplet is free.
 * The most expensive items are charged, and the cheapest in each group of 3 is discounted 100%.
 *
 * @param {Array} items - Cart items with { price, quantity }
 * @param {boolean} isWholesale - If wholesale session is active, promo is disabled
 * @returns {Object} { discount: number, freeItemsCount: number, qualifyingCount: number, neededForNext: number }
 */
export function calculate3x2Discount(items = [], isWholesale = false) {
  if (isWholesale || !items || !Array.isArray(items) || items.length === 0) {
    return { discount: 0, freeItemsCount: 0, qualifyingCount: 0, neededForNext: 3 };
  }

  // Flatten all items into individual units with their numeric price
  const unitPrices = [];
  for (const item of items) {
    if (!item) continue;
    const priceStr = item.price != null ? String(item.price) : "0";
    const numericPrice = parseFloat(priceStr.replace(/\./g, '').replace(/,/g, '.')) || 0;
    const qty = parseInt(item.quantity, 10) || 1;
    for (let i = 0; i < qty; i++) {
      unitPrices.push(numericPrice);
    }
  }

  const totalUnits = unitPrices.length;
  if (totalUnits < 3) {
    return {
      discount: 0,
      freeItemsCount: 0,
      qualifyingCount: totalUnits,
      neededForNext: 3 - totalUnits
    };
  }

  // Sort descending: most expensive first
  unitPrices.sort((a, b) => b - a);

  let discount = 0;
  let freeItemsCount = 0;

  // Every 3rd item (index 2, 5, 8...) in the descending list is free!
  for (let i = 2; i < totalUnits; i += 3) {
    discount += unitPrices[i];
    freeItemsCount += 1;
  }

  const remainder = totalUnits % 3;
  const neededForNext = remainder === 0 ? 3 : 3 - remainder;

  return {
    discount,
    freeItemsCount,
    qualifyingCount: totalUnits,
    neededForNext
  };
}
