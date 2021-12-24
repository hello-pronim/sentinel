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
        label: "BryBelly",
        values: [
          2115, 1562, 1584, 1892, 1087, 2223, 2966, 2448, 2905, 3838, 2917,
          3327,
        ],
      },
      {
        label: "Blooming Bath",
        values: [
          958, 724, 629, 883, 915, 1214, 1476, 1212, 1554, 2128, 466, 1827,
        ],
      },
      {
        label: "NaturSutten",
        values: [
          1214, 883, 1212, 2128, 1554, 958, 724, 915, 1827, 629, 1476, 1466,
        ],
      },
    ],
  },

  brands: [
    {
      id: 1,
      brand: "BryBelly",
      revenue: 25000000,
      comparisonRevenue: 19000000,
      revenueChange: 14,
    },
    {
      id: 2,
      brand: "Blooming Bath",
      revenue: 7000000,
      comparisonRevenue: 5000000,
      revenueChange: 6,
    },
    {
      id: 3,
      brand: "NaturSutten",
      revenue: 600000,
      comparisonRevenue: 300000,
      revenueChange: 30,
    },
  ],

  categories: [
    { id: 1, name: "Baby" },
    { id: 2, name: "Novelty" },
    { id: 3, name: "Pet" },
    { id: 4, name: "Outdoor" },
  ],
  companies: [
    {
      category_name: "Baby",
      company_category_id: 1,
      id: 2,
      name: "Blooming Bath",
      nickname: "Blooming Bath",
    },
    {
      category_name: "Baby",
      company_category_id: 1,
      id: 4,
      name: "Natursutten",
      nickname: "Natursutten",
    },
    {
      category_name: "Baby",
      company_category_id: 1,
      id: 6,
      name: "Mimijumi",
      nickname: "Mimijumi",
    },
    {
      category_name: "Novelty",
      company_category_id: 2,
      id: 1,
      name: "Brybelly",
      nickname: "Brybelly",
    },
    {
      category_name: "Pet",
      company_category_id: 3,
      id: 3,
      name: "Downtown Pet Supply",
      nickname: "DTPS",
    },
    {
      category_name: "Outdoor",
      company_category_id: 4,
      id: 5,
      name: "Hyke & Byke",
      nickname: "Hyke & Byke",
    },
  ],
};

export default data;
