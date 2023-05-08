This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This app integrates map, table and chart elements to give the user an overview of visualize the changes in risk levels over time for a given location, Asset or Business Category. It fetches the initial data from google sheets. The map highlights the relative risk levels in various geographical locations. The data table shows information on climate risk. The line graph shows the risk levels over time for a given location, Asset or Business Category.

User is presented data via tooltips, filters, expandable rows as well as dropdowns. Users can also select a location on map and view corresponding data on table and line chart.
