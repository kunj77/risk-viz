"use client";

import React, {Suspense} from "react";
import Image from 'next/image';
import AnalysisIcon from "../icons/AnalysisIcon.png";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import { setTableData } from '../store/tableDataSlice';
import { columnData, headers } from "../constants";

const MapboxMap = React.lazy(() => import('./MapboxMap'));
const Table = React.lazy(() => import('./Table/Table'));
const LineChart = React.lazy(() => import('./LineChart'));

export default function Dashboard() {
const dispatch = useAppDispatch();
const tableData = useAppSelector((state) => state.table.tableData);

React.useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch('/api/sheet');
      const response = await res.json();
      const data = response.rowData;
  
      const rows: any[] = [];
      data.forEach((row: any[]) => {
        let rowData: any = {};
        row.forEach((element, index) => {
          rowData[headers[index]] = element;
        });
        rows.push(rowData);
      });
      dispatch(setTableData(rows));
    } catch (error) {
      console.error(error);
    }
  };
  fetchData();
}, [dispatch]);

  return (
    <div>
      {tableData.length > 0 && <div>
        <div className="title">
          <div>
          <span>Risk analysis dashboard </span>
          <Image src={AnalysisIcon} alt={"analysis"} width={15} height={10}/>
          </div>
        </div>
        <Suspense fallback={<LoadingDashboard />}>
          <MapboxMap />
          <Table columnData={columnData}/>
          <LineChart />
      </Suspense>
      </div>
      }
    </div>
  );
}

const LoadingDashboard = () => {
  return (
    <>
      <div className="loading-map"></div>
      <div className="loading-table"></div>
      <div className="loading-chart"></div>
    </>
  )
}
