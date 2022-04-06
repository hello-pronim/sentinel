import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import { Grid } from "@mui/material";

import { getBrandsMAPData } from "../../../../services/MAPService";
import OverallMAPs from "./OverallMAPs";
import BrandsMAPTable from "./BrandsMAPTable";
import ProductsMAPTable from "./ProductsMAPTable";

const MAP = () => {
  const queryParamsString = window.location.search;
  const [currentOverall, setCurrentOverall] = useState(0.2);
  const [previousOverall, setPreviousOverall] = useState(0.3);
  const [brandsMAPData, setBrandsMAPData] = useState(null);
  const [loadingBrandsMAPData, setLoadingBrandsMAPData] = useState(false);

  useEffect(() => {
    //call to get the table data
    setLoadingBrandsMAPData(true);
    getBrandsMAPData(queryParamsString).then((res) => {
      console.log(res);
      const { data } = res.data.body;

      setLoadingBrandsMAPData(false);
      if (data) {
        const tableData = data.map((item) => ({
          name: item.name,
          MAP: item.MAP,
          comparisonMAP: item.comparison_map,
          mapChange: item.map_change,
          companyId: item?.company_id,
        }));

        setBrandsMAPData(tableData);
      }
    });
  }, [queryParamsString]);

  return (
    <React.Fragment>
      <Helmet title="MAP" />

      <Grid container spacing={8}>
        <Grid item xs={12}>
          <OverallMAPs current={currentOverall} previous={previousOverall} />
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
