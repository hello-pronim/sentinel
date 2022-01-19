import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Divider as MuiDivider, Grid, Typography } from "@mui/material";
import { spacing } from "@mui/system";

import { AppContext } from "../../../contexts/AppContext";

import { getSales, getSalesData } from "../../../services/SalesService";
import SalesTable from "../../sections/Sales/SalesTable";
import BrandSalesTable from "../../sections/Sales/BrandSalesTable";
import async from "../../../components/Async";
import data from "./data";

const SalesChart = async(() => import("../../sections/Sales/SalesChart"));
const Divider = styled(MuiDivider)(spacing);

const Sales = () => {
  const { companies, filterOptions } = useContext(AppContext);
  const { salesChartData, brands, products } = data;
  const [chartTitle, setChartTitle] = useState("All companies");
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  useEffect(() => {
    const selectedCompanyIds = filterOptions.company.selectedOptions.map(
      (item) => item.option.id
    );
    const selectedMarketIds = filterOptions.market.selectedOptions.map(
      (item) => item.option.id
    );
    const selectedCompanyList = filterOptions.company.selectedOptions.map(
      (item) => item.option
    );

    setSelectedCompanies(selectedCompanyList);

    getSales({
      companyIds: JSON.stringify(selectedCompanyIds),
      marketIds: JSON.stringify(selectedMarketIds),
    }).then((res) => {
      console.log(res);
    });
    //TODO: Use the router URL params above here. Hopefully that will make it easy and keep everything consistent

    //call to get the table data
    getSalesData({
      //use router URL params here too.
    }).then((res) => {
      console.log(res);
    });

    if (companies) {
      const companyCategories = Object.keys(companies);
      const allCompanies = [];

      companyCategories.forEach((category) => {
        companies[category].forEach((company) => allCompanies.push(company));
      });

      if (selectedCompanyIds.length === allCompanies.length)
        setChartTitle("All companies");
      else if (selectedCompanyIds.length === 1) {
        const selectedCompany = allCompanies.find(
          (company) => company.id === selectedCompanyIds[0]
        );
        setChartTitle(selectedCompany.name);
      } else setChartTitle("Multi companies");
    }
    // .catch((err) => signOut());
  }, [filterOptions, companies]);

  return (
    <React.Fragment>
      <Helmet title="Sales" />

      <Grid justifyContent="space-between" container spacing={10}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            Sales
          </Typography>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <SalesChart
            title={chartTitle}
            description="Total: $123,456,789.11"
            data={salesChartData}
          />
        </Grid>
        <Grid item xs={12}>
          {selectedCompanies.length !== 1 ? (
            <SalesTable
              data={brands.filter((brand) =>
                selectedCompanies.some((comp) => comp.name === brand.brand)
              )}
            />
          ) : (
            <BrandSalesTable
              brand={selectedCompanies[0].name}
              data={products}
            />
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Sales;
