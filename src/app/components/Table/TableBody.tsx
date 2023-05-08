import { useState } from "react";
import { Header } from "../../typings";

type TableBodyProps = {
  columnData: Header[];
  rowData: object[];
};

const TableBody: React.FC<TableBodyProps> = (props) => {
    const {columnData, rowData} = props;

    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const toggleExpandedRow = (rowIndex: number) => {
        let updatedRows = [...expandedRows];
        if (updatedRows.includes(rowIndex)) {
          const index = updatedRows.indexOf(rowIndex);
          updatedRows.splice(index, 1);
        } else {
          updatedRows.push(rowIndex);
        }
        setExpandedRows(updatedRows);
      }

const getClasses = (colData: Header, rowIndex: number) => {
    let computedClasses = colData.class ? colData.class : "";
    computedClasses += expandedRows.includes(rowIndex) ? ' expand' : '';
    return computedClasses;
}

const getDataAsString = (data: string) => {
    let stringData = '';
    for (const [key, value] of Object.entries(JSON.parse(data))) {
        stringData += `${key}: ${parseFloat(value as string).toFixed(3)}, `;
    }
    return stringData.slice(0,-2);
}

  return (
    <tbody>
      {rowData.map((row, index: number) => (
        <tr key={`data-row-${index}`} onClick={() => toggleExpandedRow(index)}>
            {columnData.map((col, colIndex) => (
                <td key={`data-${index}-${colIndex}`} className={getClasses(col, index)}>
                  {col.isJson ? getDataAsString(row[col.selector as keyof typeof row]) : row[col.selector as keyof typeof row]}
                </td>))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
