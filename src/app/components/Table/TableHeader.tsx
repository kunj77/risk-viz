import { Header, SortDirection } from "../../typings";
import SortingDown from "../../icons/SortingDown.png";
import SortingUp from "../../icons/SortingUp.png";
import SortingNeutral from "../../icons/SortingNeutral.png";
import Image from 'next/image';

type TableHeaderProps = {
  headerData: Header[];
  onClickHandler: any;
  filters: {};
  handleSearch: Function;
};

function getIconToShow(sortDirection: SortDirection | undefined) {
  return sortDirection === undefined
    ? SortingNeutral
    : sortDirection === SortDirection.ASC
    ? SortingDown
    : SortingUp;
}

const TableHeader: React.FC<TableHeaderProps> = (props) => {
    const {headerData, onClickHandler, filters, handleSearch} = props;
  return (
    <tr>
        {(headerData.map((headerRow, index) => (
          <th key={`header-row-${index}`}>
            <div className="clickable-header" onClick={() => onClickHandler(index)}>
            {headerRow.displayTitle}
            {headerRow.isSortable && (
                <Image src={getIconToShow(headerRow.sortDirection)} alt={"sort"} width={15} height={10}/>
            )}
            </div>
            <input
                key={`${headerRow.selector}-search`}
                type="search"
                placeholder={`Search ${headerRow.displayTitle}`}
                value={filters[headerRow.selector as keyof typeof filters]}
                onChange={event => handleSearch(event.target.value, headerRow.selector)}
          />
          </th>
        ))
      )}
    </tr>
  );
};

export default TableHeader;
