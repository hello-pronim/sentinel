const estimatedSalesChangeData = {
  label: "Estimated Gross Sales for April",
  data: { revenue: 5871138.214283597, revenueChange: -0.131 },
};
const mtdSalesChangeData = {
  label: "MTD Total Gross Sales",
  data: {
    revenue: 4109796.7499985173,
    revenueChange: -0.131,
    changeSeries: [
      {
        date: "2022-04-01",
        sales_change: -24608.609999997658,
      },
      {
        date: "2022-04-02",
        sales_change: 1683.5499999978056,
      },
      {
        date: "2022-04-03",
        sales_change: 20670.08999999924,
      },
      {
        date: "2022-04-04",
        sales_change: 47022.2299999994,
      },
      {
        date: "2022-04-05",
        sales_change: -13038.759999995993,
      },
      {
        date: "2022-04-06",
        sales_change: -2168.809999998659,
      },
      {
        date: "2022-04-07",
        sales_change: -2572.859999998589,
      },
      {
        date: "2022-04-08",
        sales_change: -360.0600000002887,
      },
      {
        date: "2022-04-09",
        sales_change: -4987.069999998901,
      },
      {
        date: "2022-04-10",
        sales_change: 11421.010000000417,
      },
      {
        date: "2022-04-11",
        sales_change: 6234.970000002795,
      },
      {
        date: "2022-04-12",
        sales_change: -11285.770000001474,
      },
      {
        date: "2022-04-13",
        sales_change: -18269.86999999665,
      },
      {
        date: "2022-04-14",
        sales_change: 268.53000000087195,
      },
      {
        date: "2022-04-15",
        sales_change: -30765.639999999607,
      },
      {
        date: "2022-04-16",
        sales_change: -34796.80000000185,
      },
      {
        date: "2022-04-17",
        sales_change: -33263.39999999819,
      },
      {
        date: "2022-04-18",
        sales_change: 13466.309999999561,
      },
      {
        date: "2022-04-19",
        sales_change: -17131.029999998864,
      },
      {
        date: "2022-04-20",
        sales_change: -34519.19000000169,
      },
      {
        date: "2022-04-21",
        sales_change: -147868.88999999745,
      },
    ],
  },
};
const salesChanges = [
  {
    id: 0,
    label: "Gross Sales 1 Week",
    data: { revenue: 1388901.649999834, revenueChange: -0.0811 },
  },
  {
    id: 1,
    label: "Gross Sales 1 Month",
    data: { revenue: 6435775.769998869, revenueChange: -0.1056 },
  },
  {
    id: 2,
    label: "Gross Sales 3 Months",
    data: { revenue: 20046404.850086108, revenueChange: -0.1218 },
  },
  {
    id: 3,
    label: "Gross Sales 6 Months",
    data: { revenue: 45916716.77016907, revenueChange: 0.1824 },
  },
  {
    id: 4,
    label: "Gross Sales 1 Year",
    data: { revenue: 85817534.95887892, revenueChange: 0.0654 },
  },
  {
    id: 5,
    label: "Year to Date",
    data: { revenue: 24601046.030115806, revenueChange: 0.0271 },
  },
];

export { estimatedSalesChangeData, mtdSalesChangeData, salesChanges };
