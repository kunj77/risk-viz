export type TableState = {
    rowData: any[];
    colData: Header[];
    selectedRows: number[];
  };

  export type RiskData = {
    "Asset Name": string;
    "Lat": string;
    "Long": string;
    "Business Category": string;
    "Risk Rating": string;
    "Risk Factors": string;
    "Year": string;
}
  
  export enum SortDirection {
    "ASC",
    "DSC"
  }
  
  export type Header = {
    displayTitle: string;
    selector: string;
    isSortable?: boolean;
    sortDirection?: SortDirection;
    isJson?: boolean;
    class?: string;
  };
  