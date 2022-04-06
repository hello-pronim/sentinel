const mockBrandsMAPTableData = {
  data: {
    body: {
      data: [
        {
          company_id: 1,
          comparison_map: 0.85,
          id: 1,
          name: "Blooming Bath",
          MAP: 0.89,
          map_change: 0.09,
        },
        {
          company_id: 2,
          comparison_map: 0.56,
          id: 2,
          name: "DTPS",
          MAP: 0.5,
          map_change: 0.06,
        },
        {
          company_id: 3,
          comparison_map: 0.99,
          id: 3,
          name: "Brybelly",
          MAP: 0.99,
          map_change: 0,
        },
      ],
    },
  },
};

const mockCurrentViolationsTableData = {
  data: {
    body: {
      data: [
        {
          company_id: 1,
          id: 1,
          name: "Product 1",
          current_price: 30.99,
          map_price: 32.0,
          price_diff: 0.01,
        },
        {
          company_id: 2,
          id: 2,
          name: "Product 2",
          current_price: 19.99,
          map_price: 25.99,
          price_diff: 0.06,
        },
        {
          company_id: 3,
          id: 3,
          name: "Product 3",
          current_price: 23.99,
          map_price: 31.0,
          price_diff: 0.1,
        },
      ],
    },
  },
};

export { mockBrandsMAPTableData, mockCurrentViolationsTableData };
