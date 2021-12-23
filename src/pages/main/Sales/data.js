const data = {
  salesChartData: {
    xLabels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    data: [
      {
        label: "Sales ($)",
        values: [
          2115, 1562, 1584, 1892, 1487, 2223, 2966, 2448, 2905, 3838, 2917,
          3327,
        ],
      },
      {
        label: "Orders",
        values: [
          958, 724, 629, 883, 915, 1214, 1476, 1212, 1554, 2128, 1466, 1827,
        ],
      },
    ],
  },

  brands: [
    {
      id: 1,
      brand: "BryBelly",
      revenue: "25000000",
      comparisonRevenue: "19000000",
      revenueChange: "14",
    },
    {
      id: 2,
      brand: "Blooming Bath",
      revenue: "7000000",
      comparisonRevenue: "5000000",
      revenueChange: "6",
    },
    {
      id: 3,
      brand: "NaturSutten",
      revenue: "600000",
      comparisonRevenue: "300000",
      revenueChange: "30",
    },
  ],
};

export default data;
