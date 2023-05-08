import React, { useState } from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

import { SortDirection, Header } from "../../typings";

import {useAppSelector} from "../../store/hooks";

type TableProps = {
  columnData: Header[];
};

const Table: React.FC<TableProps> = (props) => {
  const {columnData} = props;

  const tableData = useAppSelector((state) => state.table.tableData);
  const selectedLocation = useAppSelector((state) => state.table.selectedLocation);

  const [rowData, setRowData] = useState(tableData);
  const [colData, setColData] = useState(columnData);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({})
  const filteredRows = filterRows(rowData, filters)
  const calculatedRows = filteredRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };    

  function filterRows(rows: object[], filters: {}) {
    return rows.filter(row => {
      return Object.keys(filters).every(selector => {
          return (row[selector as keyof typeof row] as string).toLowerCase().includes(
            (filters[selector as keyof typeof filters] as string).toLowerCase())
      })
    })
  }

  const handleSearch = (value: string, selector: string) => {
    setCurrentPage(1)
  
    if (value) {
      setFilters(prevFilters => ({
        ...prevFilters,
        [selector]: value,
      }))
    } else {
      setFilters(prevFilters => {
        const updatedFilters = { ...prevFilters }
        delete updatedFilters[selector as keyof typeof updatedFilters]
  
        return updatedFilters
      })
    }
    filterRows(calculatedRows, filters);
  }

  function onSortDirectionChange(colIndex: number) {
    const columnToSort = colData[colIndex];
    const sortByProperty = columnToSort.selector;
    if (columnToSort && columnToSort.isSortable) {
      if (columnToSort.sortDirection === SortDirection.ASC) {
        const updatedRowData = [...rowData].sort((a, b) => 
          -1 * (a[sortByProperty as keyof typeof a] as string).localeCompare(b[sortByProperty as keyof typeof b])
        );
        setRowData(updatedRowData);
        const updatedColData = colData;
        updatedColData[colIndex].sortDirection = SortDirection.DSC;
        setColData(updatedColData);
      } else {
        const updatedRowData = [...rowData].sort((a, b) =>
          (a[sortByProperty as keyof typeof a] as string).localeCompare(b[sortByProperty as keyof typeof b])
        );
        setRowData(updatedRowData);
        const updatedColData = colData;
        updatedColData[colIndex].sortDirection = SortDirection.ASC;
        setColData(updatedColData);
      }
    }
  }

  React.useEffect(() => {
    selectedLocation[1] && selectedLocation[0] && setFilters(prevFilters => ({
      ...prevFilters,
      ['Lat']: selectedLocation[1] + "",
      ['Long']: selectedLocation[0] + ""
    }))
  },[selectedLocation])


  return (
    <div className="table-container">
      <table>
          <thead>
            <TableHeader
              headerData={colData}
              onClickHandler={onSortDirectionChange}
              filters={filters}
              handleSearch={handleSearch}
            />
          </thead>
        {calculatedRows && (
          <TableBody
            columnData={colData}
            rowData={calculatedRows}
          />
        )}
      </table>
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
          ⏮️ First
        </button>
        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
          ⬅️ Prev
        </button>
        <button disabled={currentPage === (totalPages)} onClick={() => handlePageChange(currentPage + 1)}>
          ➡️ Next
        </button>
        <button disabled={currentPage === (totalPages)} onClick={() => handlePageChange(totalPages)}>
          ⏭️ Last
        </button>
      </div>
    </div>
  );
};

export default Table;
