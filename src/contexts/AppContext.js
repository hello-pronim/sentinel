import { createContext, useEffect, useState } from "react";

import { getCompanies } from "../services/CompanyService";
import { getMarkets } from "../services/MarketService";

const AppContext = createContext();

function AppProvider({ children }) {
  const [companies, setCompanies] = useState([]);
  const [markets, setMarkets] = useState([]);

  const retrieveCompaniesData = async () => {
    const response = await getCompanies()
      .then((data) => data)
      .catch((err) => err);
    console.log("companies", response);
    setCompanies(response);
  };

  const retrieveMarketsData = async () => {
    const response = await getMarkets()
      .then((data) => data)
      .catch((err) => err);
    console.log("markets", response);
    setMarkets(response);
  };

  useEffect(() => {
    retrieveCompaniesData();
    retrieveMarketsData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        companies,
        markets,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };
