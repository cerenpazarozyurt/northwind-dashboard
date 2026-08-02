export function calcLineTotal(
  unitPrice: number,
  quantity: number,
  discount: number
) {
  return unitPrice * quantity * (1 - discount);
}

export function formatMoney(value: number) {
  return `$${value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDiscount(discount: number) {
  return `%${Math.round(discount * 100)}`;
}
