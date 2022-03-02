import { createContext, useState } from "react";
import { convertDateToMMDDYY, getPastDate } from "../utils/functions";

const AppContext = createContext();

function AppProvider({ children }) {
  const [companies, setCompanies] = useState(null);
  const [markets, setMarkets] = useState(null);
  const defaultFilterOptions = {
    company: {
      selected: [],
      selectedOptions: [],
    },
    date: {
      dateRange: "this_year",
      from: convertDateToMMDDYY(getPastDate(new Date(), 29)),
      to: convertDateToMMDDYY(new Date()),
      compare: false,
      compFrom: convertDateToMMDDYY(getPastDate(new Date(), 29)),
      compTo: convertDateToMMDDYY(new Date()),
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
