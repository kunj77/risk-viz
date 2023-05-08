import { RiskData } from '../typings';

export function aggregateRiskRatings(
    assets: RiskData[],
    filter: { lat?: string; long?: string; asset?: string; category?: string }
  ): { aggregateRatingsByYear: {[year: number]: number}, "factorsByYear": {[year: number]: {}} } {
    const filteredAssets = assets.filter((asset) => {
      if (filter.lat && filter.long) {
        return asset.Lat === filter.lat && asset.Long === filter.long;
      }
      if (filter.asset) {
        return asset["Asset Name"] === filter.asset;
      }
      if (filter.category) {
        return asset["Business Category"] === filter.category;
      }
      return true;
    });
  
    const factorsByYear: { [year: string]: { [riskFactor: string]: number } } = {};

    filteredAssets.forEach((asset) => {
      if (!factorsByYear[asset.Year]) {
        factorsByYear[asset.Year] = {};
      }
      const riskFactors = JSON.parse(asset["Risk Factors"]);
      Object.keys(riskFactors).forEach((riskFactor) => {
        if (!factorsByYear[asset.Year][riskFactor]) {
          factorsByYear[asset.Year][riskFactor] = 0;
        }
        factorsByYear[asset.Year][riskFactor] += riskFactors[riskFactor];
      });
    });
    const ratingsByYear: { [year: string]: number[] } = {};
    
    filteredAssets.forEach((asset) => {
      if (!ratingsByYear[asset.Year]) {
        ratingsByYear[asset.Year] = [];
      }
      ratingsByYear[asset.Year].push(parseFloat(asset["Risk Rating"]));
    });
  
    const aggregateRatingsByYear: { [year: number]: number } = {};
    Object.keys(ratingsByYear).forEach((year) => {
      const ratings = ratingsByYear[parseInt(year)];
      const sum = ratings.reduce((acc, val) => acc + val, 0);
      const average = sum / ratings.length;
      aggregateRatingsByYear[parseInt(year)] = average;
    });
  
    return {"aggregateRatingsByYear": aggregateRatingsByYear, "factorsByYear": factorsByYear};
  }