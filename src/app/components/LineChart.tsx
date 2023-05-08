import React, { useRef, useEffect, useState } from 'react';
import {useAppSelector} from "../store/hooks";
import { aggregateRiskRatings } from '../utils/chart';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  TooltipItem,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart() {
    const chartRef = useRef(null);
    const tableData = useAppSelector((state) => state.table.tableData);
    const selectedLocation = useAppSelector((state) => state.table.selectedLocation);

    const selectRef = useRef(null);

    const assetNames = [...new Set(tableData.map(data => data['Asset Name']))].sort();
    const businessCategories = [...new Set(tableData.map(data => data['Business Category']))].sort();
    const locations = [...new Set(tableData.map(data => [data['Long'], data['Lat']]))];
    const uniqueLocations = [...new Set(locations.map(location => JSON.stringify(location)))].map(location => JSON.parse(location));

    const [selectedLocationValue, setSelectedLocationValue] = useState(uniqueLocations[0]);

    useEffect(() => {
      if (selectedLocation.length === 2) {

        const foundLocation = uniqueLocations.find(location => {
          return location[0] === (selectedLocation[0] as number).toString() && location[1] === (selectedLocation[1] as number).toString();
        });
        setSelectedLocationValue(foundLocation);
      }

    }, [selectedLocation]);

    useEffect(() => {
      if (selectedLocationValue.length === 2) {
        updateLocation(selectedLocationValue);
      }
    }, [selectedLocationValue])
  
    const riskDataByAsset = aggregateRiskRatings(tableData, {asset: assetNames[0]});
    const riskDataByBusiness = aggregateRiskRatings(tableData, {category: businessCategories[0]});
    const riskDataByLocation = aggregateRiskRatings(tableData, {long: uniqueLocations[0][0], lat: uniqueLocations[0][1]});

    const years = [...new Set(tableData.map(data => data['Year']))].sort();

    const consolidatedChartDataByAsset = years.map(year => {return riskDataByAsset.aggregateRatingsByYear[parseInt(year)] || 0});
    const consolidatedChartDataByBusiness = years.map(year => {return riskDataByBusiness.aggregateRatingsByYear[parseInt(year)] || 0});
    const consolidatedChartDataByLocation = years.map(year => {return riskDataByLocation.aggregateRatingsByYear[parseInt(year)] || 0});

    const chartDataForAsset = {
      labels: years,
      datasets: [
        {
          label: 'Risk over asset',
          data: consolidatedChartDataByAsset,
          custom: riskDataByAsset.factorsByYear,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Risk over business',
            data: consolidatedChartDataByBusiness,
            custom: riskDataByBusiness.factorsByYear,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            label: 'Risk over location',
            data: consolidatedChartDataByLocation,
            custom: riskDataByLocation.factorsByYear,
            borderColor: 'rgb(255,165,0)',
            backgroundColor: 'rgba(255,165,0, 0.5)',
        },
      ],
    };

    const onAssetNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const asset = event.target.value;
        const riskDataByAsset = aggregateRiskRatings(tableData, {asset: asset});
        const consolidatedChartDataByAsset = years.map(year => {return riskDataByAsset.aggregateRatingsByYear[parseInt(year)] || 0});

        const dataset = {
            label: 'Risk over asset',
            data: consolidatedChartDataByAsset,
            custom: riskDataByAsset.factorsByYear,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          };
        if (chartRef && chartRef.current) {
          (chartRef.current as ChartJS).data.datasets.splice(0, 1, dataset);
          (chartRef.current as ChartJS).update();
        }
      };

      const onBusinessCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const businessCategory = event.target.value;
        const riskDataByBusiness = aggregateRiskRatings(tableData, {category: businessCategory});
        const consolidatedChartDataByBusiness = years.map(year => {return riskDataByBusiness.aggregateRatingsByYear[parseInt(year)] || 0});
        const dataset = {
            label: 'Risk over business',
            data: consolidatedChartDataByBusiness,
            custom: riskDataByBusiness.factorsByYear,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          };
          if (chartRef && chartRef.current) {
            (chartRef.current as ChartJS).data.datasets.splice(1, 1, dataset);
            (chartRef.current as ChartJS).update();
          }
      };

      const onLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLocationValue(uniqueLocations[event.target.selectedIndex]);
      };

      const updateLocation = (location: [string, string]) => {
        const riskDataByLocation = aggregateRiskRatings(tableData, {long: location[0], lat: location[1]});
        const consolidatedChartDataByLocation = years.map(year => {return riskDataByLocation.aggregateRatingsByYear[parseInt(year)] || 0});
  
        const dataset = {
            label: 'Risk over location',
            data: consolidatedChartDataByLocation,
            custom: riskDataByLocation.factorsByYear,
            borderColor: 'rgb(255,165,0)',
            backgroundColor: 'rgba(255,165,0, 0.5)',
        };
        if (chartRef && chartRef.current) {
          (chartRef.current as ChartJS).data.datasets.splice(2, 1, dataset);
          (chartRef.current as ChartJS).update();
        }
      };

      const options = {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              afterBody: function(context: TooltipItem<any>[]) {
                const riskFactors = context[0].dataset.custom[context[0].label];
                let riskFactorsStringified = ["Risk Factors:"];
                for (const [key, value] of Object.entries(riskFactors)) {
                    riskFactorsStringified.push(`${key}: ${parseFloat(value as string).toFixed(3)}`);
                }
                return riskFactorsStringified;
              }
            }
          },
          title: {
            display: true,
            text: "Risk Rating over Time"
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };
  return (
  <div className='chart-container'>
    <div className='select-container'>
    <select onChange={onAssetNameChange}>
     {
       assetNames.map((asset, index) => {
         return <option key={`asset${index}`} value={asset}>{asset}</option>
       })
     }
    </select>

    <select onChange={onBusinessCategoryChange}>
     {
       businessCategories.map((businessCategory, index) => {
         return <option key={`businessCategory${index}`} value={businessCategory}>{businessCategory}</option>
       })
     }
    </select>

    <select ref={selectRef} value={selectedLocationValue} onChange={onLocationChange}>
     {
       uniqueLocations.map((location, index) => {
         return <option key={`location${index}`} value={location}>{location[0]}, {location[1]}</option>
       })
     }
    </select>
    </div>
    <Line ref={chartRef} options={options} data={chartDataForAsset} />
  </div>)
}
