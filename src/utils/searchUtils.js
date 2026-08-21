/**
 * Smart Search Matching Algorithm
 * Supports searching by:
 * - Product Title, Brand, Category, Description
 * - Exact Price (e.g., 50, 99, 149, 199, 299)
 * - Budget queries: "under 100", "under 200", "below 300", "less than 500", "under 50"
 * - Price ranges: "50-100", "100 to 300", "200-500"
 */

export const matchSearchQuery = (product, rawQuery) => {
  if (!rawQuery || !rawQuery.trim()) return true;

  const query = rawQuery.trim().toLowerCase();
  const title = (product.name || "").toLowerCase();
  const brand = (product.brand || "").toLowerCase();
  const category = (product.category || "").toLowerCase();
  const desc = (product.desc || "").toLowerCase();
  const price = Number(product.price || 0);

  // 1. Direct text match in title, brand, category, or description
  if (
    title.includes(query) ||
    brand.includes(query) ||
    category.includes(query) ||
    desc.includes(query)
  ) {
    return true;
  }

  // 2. Exact string match on price
  if (price.toString().includes(query)) {
    return true;
  }

  // 3. Price Range Match: "under X", "below X", "less than X", "< X"
  const underMatch = query.match(/(?:under|below|less than|less|min|max|<|<=)\s*₹?\s*(\d+)/i);
  if (underMatch && underMatch[1]) {
    const targetPrice = parseInt(underMatch[1], 10);
    if (!isNaN(targetPrice)) {
      // Check if title/brand/desc matches rest of text if query has words
      const textWithoutPrice = query.replace(/(?:under|below|less than|less|min|max|<|<=)\s*₹?\s*\d+/gi, "").trim();
      const textMatch = !textWithoutPrice || title.includes(textWithoutPrice) || brand.includes(textWithoutPrice) || category.includes(textWithoutPrice) || desc.includes(textWithoutPrice);
      return price <= targetPrice && textMatch;
    }
  }

  // 4. Price Between Range: "50-100", "100 to 300", "50 100"
  const rangeMatch = query.match(/(\d+)\s*(?:to|-|and)\s*(\d+)/i);
  if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
    const minP = parseInt(rangeMatch[1], 10);
    const maxP = parseInt(rangeMatch[2], 10);
    if (!isNaN(minP) && !isNaN(maxP)) {
      return price >= Math.min(minP, maxP) && price <= Math.max(minP, maxP);
    }
  }

  // 5. Single Number Query (e.g., "50", "100", "200", "300", "500")
  const singleNumber = query.replace(/[^0-9]/g, "");
  if (singleNumber && singleNumber.length >= 2 && singleNumber.length <= 6) {
    const numPrice = parseInt(singleNumber, 10);
    // If the entire query is just numbers or "rs 100" / "100 rs" / "₹100"
    const isPurePriceQuery = /^(?:rs|inr|₹)?\s*\d+\s*(?:rs|inr|₹)?$/i.test(query);
    if (isPurePriceQuery) {
      // Match products where price <= numPrice OR price within 30% margin
      return price <= numPrice || Math.abs(price - numPrice) <= numPrice * 0.3;
    }
  }

  // 6. Multi-word search (all words match title, brand, or desc)
  const tokens = query.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    const allTokensMatch = tokens.every((token) =>
      title.includes(token) ||
      brand.includes(token) ||
      category.includes(token) ||
      desc.includes(token) ||
      price.toString().includes(token)
    );
    if (allTokensMatch) return true;
  }

  return false;
};
