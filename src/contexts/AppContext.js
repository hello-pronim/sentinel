import { createContext, useState } from "react";
import { convertDateToMMDDYY, getPastDate } from "../utils/functions";

const AppContext = createContext();

function AppProvider({ children }) {
  const today = new Date();
  const [companies, setCompanies] = useState(null);
  const [markets, setMarkets] = useState(null);
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

  return (
    <AppContext.Provider
      value={{
        companies,
        markets,
        defaultFilterOptions,
        filterOptions,
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
