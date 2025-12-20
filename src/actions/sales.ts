"use server";

type SellingGrowth = {
  month: string;
  income: number;
};

export async function getSellingGrowthDummyData() {
  const data: SellingGrowth[] = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now);
    date.setMonth(now.getMonth() - (12 - (i + 1)));
    date.setDate(1);

    const trend = Math.floor(Math.random() * 10);
    const income = trend * 10000000;

    data.push({
      month: date.toLocaleString("fa-IR", {
        month: "long",
      }),
      income: income,
    });
  }

  return data;
}
