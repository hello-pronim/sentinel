import { createContext, useEffect, useState } from "react";

import { getCompanies } from "../services/CompanyService";
import { getMarkets } from "../services/MarketService";
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
      dateRange: "last_30_days",
      from: convertDateToMMDDYY(getPastDate(new Date(), 29)),
      to: convertDateToMMDDYY(new Date()),
      compare: false,
      viewMode: "month",
    },
    market: {
      selected: [],
      selectedOptions: [],
    },
  };
  const [filterOptions, setFilterOptions] = useState(defaultFilterOptions);

  const retrieveCompaniesData = async () => {
    const response = await getCompanies()
      .then((data) => data)
      .catch((err) => err);
    setCompanies(response);
  };

  const retrieveMarketsData = async () => {
    const response = await getMarkets()
      .then((data) => data)
      .catch((err) => err);
    setMarkets(response);
  };

  useEffect(() => {
    retrieveCompaniesData();
    retrieveMarketsData();
  }, []);

  useEffect(() => {}, [filterOptions]);

  return (
    <AppContext.Provider
      value={{
        companies,
        markets,
        filterOptions,
        setFilterOptions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };
