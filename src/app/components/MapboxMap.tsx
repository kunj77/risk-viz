import * as React from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; 
import {useAppDispatch, useAppSelector} from "../store/hooks";
import { setSelectedLocation } from '../store/tableDataSlice';
import keys from '../mapboxmapKeys.json';
let currentMarkers: mapboxgl.Marker[] = [];


export default function MapboxMap() {
  const [map, setMap] = React.useState<mapboxgl.Map>();
  const tableData = useAppSelector((state) => state.table.tableData);

  const dispatch = useAppDispatch();

  // React ref to store a reference to the DOM node that will be used
  // as a required parameter `container` when initializing the mapbox-gl
  // will contain `null` by default
    const mapNode = React.useRef(null);

    const years = [...new Set(tableData.map(data => data['Year']))].sort();

    const setBoundsForMap = (mapboxMap: mapboxgl.Map) => {
      const coordinates: mapboxgl.LngLatLike[] = [];
  
      tableData.map((data) => {
        coordinates.push([data['Long'], data['Lat']]);
      });
  
  
      var bounds = coordinates.reduce(function(bounds, coord) {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
  
      mapboxMap.fitBounds(bounds, {
        padding: 40
      });
    };

    const setMarkers = (mapboxMap: mapboxgl.Map, yearSelected: string) => {
      tableData.map((data) => {
        if(data['Year'] === yearSelected) {
          const riskValue = data['Risk Rating'];
          const color = riskValue < 0.1 ? "#FFFF00" : 
             (riskValue > 0.1 && riskValue <= 0.5 ? "#FFA500" : "#FF0000" );
    
             const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h3>Asset Name:</h3> ${data['Asset Name']} <br /> <h3>Business Category:</h3> ${data['Business Category']}` 
              );
          const marker = new mapboxgl.Marker({
            color: color
          })
          .setLngLat([data['Long'], data['Lat']])
          .setPopup(popup)
          .addTo(mapboxMap);
    
          marker.getElement().addEventListener('mouseenter', function() {
            const currentTooltip = marker.getPopup();
            currentTooltip.addTo(mapboxMap);
          });

          marker.getElement().addEventListener('mouseleave', function() {
            popup.remove();
          });

          marker.getElement().addEventListener('click', function() {
            const markerLocation = marker.getLngLat();
            dispatch(setSelectedLocation([markerLocation.lng, markerLocation.lat]));
          });
          currentMarkers.push(marker);
        }
      });
  
      setBoundsForMap(mapboxMap);
    }

  React.useEffect(() => {
    const node = mapNode.current;
        // if the window object is not found, that means
        // the component is rendered on the server
        // or the dom node is not initialized, then return early
    if (typeof window === "undefined" || node === null) return;

        // otherwise, create a map instance
    const mapboxMap = new mapboxgl.Map({
      container: node,
            accessToken: keys.accessToken,
            style: "mapbox://styles/mapbox/streets-v9",
      center: [tableData[0]['Long'], tableData[0]['Lat']],
      zoom: 5
    });

    mapboxMap.addControl(new mapboxgl.NavigationControl());
    setMap(mapboxMap);
    setMarkers(mapboxMap, years[0]);

    return () => {
      mapboxMap.remove();
    };
  }, []);


  const onYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = event.target.value;
    currentMarkers.forEach((marker) => marker.remove());
    currentMarkers = [];

    setMarkers(map!, year);
  };

   return (
   <div className="mapContainer">
    <div ref={mapNode} className="map" />
    <select onChange={onYearChange}>
     {
       years.map((year, index) => {
         return <option key={`year${index}`} value={year}>{year}</option>
       })
     }
    </select>
    </div>);
}