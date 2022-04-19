import React, { useCallback, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import { Grid } from "@mui/material";

import { AuthContext } from "../../../../contexts/CognitoContext";

import {
  getMAPOveralls,
  getBrandsMAPData,
} from "../../../../services/MAPService";
import OverallMAPs from "./OverallMAPs";
import BrandsMAPTable from "./BrandsMAPTable";
import ProductsMAPTable from "./ProductsMAPTable";

const MAP = () => {
  const queryParamsString = window.location.search;
  const { isInitialized, isAuthenticated, initialize } =
    useContext(AuthContext);
  const [currentOverall, setCurrentOverall] = useState(0);
  const [previousOverall, setPreviousOverall] = useState(0);
  const [loadingMAPOverall, setLoadingMAPOverall] = useState(false);
  const [brandsMAPData, setBrandsMAPData] = useState(null);
  const [loadingBrandsMAPData, setLoadingBrandsMAPData] = useState(false);

  const initializeMAPData = useCallback(() => {
    //call to get the MAP overall data
    setLoadingMAPOverall(true);
    getMAPOveralls(queryParamsString).then((res) => {
      const {
        data: {
          body: {
            data: { stats },
          },
        },
      } = res;

      setLoadingMAPOverall(false);
      if (stats) {
        setCurrentOverall(parseFloat(stats.current_map));
        setPreviousOverall(parseFloat(stats.comparison_map));
      }
    });

    //call to get the brands' MAP data
    setLoadingBrandsMAPData(true);
    getBrandsMAPData(queryParamsString).then((res) => {
      const {
        data: {
          body: {
            data: { brands },
          },
        },
      } = res;

      setLoadingBrandsMAPData(false);
      if (brands) {
        const tableData = brands.map((item) => ({
          name: item.name,
          MAP: item.current_map,
          comparisonMAP: item.comparison_map,
          mapChange: item.change,
          companyId: item?.company_id,
        }));

        setBrandsMAPData(tableData);
      }
    });
  }, [queryParamsString]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      initializeMAPData();
    }
  }, [isAuthenticated, isInitialized, initializeMAPData]);

  return (
    <React.Fragment>
      <Helmet title="MAP" />

      <Grid container spacing={8}>
        <Grid item xs={12}>
          <OverallMAPs
            current={currentOverall}
            previous={previousOverall}
            loading={loadingMAPOverall}
          />
        </Grid>
        <Grid item xs={12}>
          <BrandsMAPTable
            title="Brands"
            data={brandsMAPData}
            loading={loadingBrandsMAPData}
          />
        </Grid>
        <Grid item xs={12}>
          <ProductsMAPTable />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default MAP;
