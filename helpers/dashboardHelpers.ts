//Toplam Ciro Hesaplama
export function calculateTotalRevenue(rawData: any[] | undefined) {
  if (!rawData) return 0;
  return rawData.reduce((acc, order) => {
    const orderTotal = order.order_details?.reduce((sum: number, item: any) => {
      const price = item.unit_price || 0;
      const qty = item.quantity || 0;
      const discount = item.discount || 0;
      return sum + price * qty * (1 - discount);
    }, 0) || 0;
    return acc + orderTotal;
  }, 0);
}

//Toplam Müşteri Sayısı Hesaplama
export function calculateTotalCustomers(rawData: any[] | undefined) {
  if (!rawData) return 0;
  const uniqueCustomers = new Set();
  rawData.forEach((order) => {
    if (order.customer_id) {
      uniqueCustomers.add(order.customer_id);
    }
  });
  return uniqueCustomers.size;
}

//Aktif Ürün Sayısı Hesaplama
export function calculateTotalProducts(rawData: any[] | undefined) {
  if (!rawData) return 0;
  const uniqueProducts = new Set();
  rawData.forEach((order) => {
    order.order_details?.forEach((item: any) => {
      if (item.product_id) {
        uniqueProducts.add(item.product_id);
      }
    });
  });
  return uniqueProducts.size;
}

//Aylık Ciro Dizi Dağılımı Hesaplama
export function calculateMonthlyRevenue(rawData: any[] | undefined) {
  const monthlyRevenue = Array(12).fill(0);
  if (!rawData) return monthlyRevenue;

  rawData.forEach((order) => {
    const monthIndex = new Date(order.order_date).getMonth();
    const orderTotal = order.order_details?.reduce((sum: number, item: any) => {
      const price = item.unit_price || 0;
      const qty = item.quantity || 0;
      const discount = item.discount || 0;
      return sum + price * qty * (1 - discount);
    }, 0) || 0;

    monthlyRevenue[monthIndex] += orderTotal;
  });

  return monthlyRevenue;
}

//Ülkelere Göre Satış (Pie Chart Verisi) Hesaplama
export function calculatePieData(rawData: any[] | undefined) {
  if (!rawData) return [];
  const countrySales: Record<string, number> = {};

  rawData.forEach((order) => {
    const country = order.ship_country;
    if (country) {
      countrySales[country] = (countrySales[country] || 0) + 1;
    }
  });

  return Object.entries(countrySales)
    .map(([countryName, count]) => ({
      name: countryName,
      y: count as number,
    }))
    .sort((a, b) => b.y - a.y)
    .slice(0, 5);
}