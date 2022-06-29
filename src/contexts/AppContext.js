import { createContext, useEffect, useState } from "react";
import flagsmith from "flagsmith";
import { convertDateToMMDDYY } from "../utils/functions";

const AppContext = createContext();

function AppProvider({ children }) {
  const today = new Date();
  const [companies, setCompanies] = useState(null);
  const [markets, setMarkets] = useState(null);
  const [showAccountingView, setShowAccountingView] = useState(false);
  const [showAdminBrands, setShowAdminBrands] = useState(false);
  const defaultFilterOptions = {
    company: {
      selected: [],
      selectedOptions: [],
    },
    date: {
      dateRange: "year_to_date",
      from: convertDateToMMDDYY(new Date(today.getFullYear(), 0, 1)),
      to: convertDateToMMDDYY(today),
      compare: false,
      compFrom: convertDateToMMDDYY(new Date(today.getFullYear(), 0, 1)),
      compTo: convertDateToMMDDYY(today),
      viewMode: "day",
    },
    market: {
      selected: [],
      selectedOptions: [],
    },
    showReturns: false,
  };
  const [filterOptions, setFilterOptions] = useState(defaultFilterOptions);

  useEffect(() => {
    flagsmith.init({
      environmentID: process.env.REACT_APP_FLAGSMITH_ENVID,
      cacheFlags: true,
      enableAnalytics: true,
      onChange: (oldFlags, params) => {
        setShowAccountingView(flagsmith.hasFeature("accounting_view"));
        setShowAdminBrands(flagsmith.hasFeature("admin_brands"));
      },
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        companies,
        markets,
        defaultFilterOptions,
        filterOptions,
        features: {
          showAccountingView,
          showAdminBrands,
        },
        setCompanies,
        setMarkets,
        setFilterOptions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };
