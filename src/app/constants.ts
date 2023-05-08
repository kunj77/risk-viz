import { Header } from "./typings";

export const columnData: Header[] = [
    {
      displayTitle: "Asset Name",
      selector: "Asset Name",
      isSortable: true
    },
    {
      displayTitle: "Business Category",
      selector: "Business Category",
      isSortable: true
    },
    {
      displayTitle: "Risk Rating",
      selector: "Risk Rating",
      isSortable: true
    },
    {
      displayTitle: "Risk Factors",
      selector: "Risk Factors",
      isJson: true,
      class: 'hide-overflow'
    }
  ];

export const headers = ["Asset Name", "Lat", "Long", "Business Category", "Risk Rating", "Risk Factors", "Year"];
