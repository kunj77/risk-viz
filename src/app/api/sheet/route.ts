import { GoogleSpreadsheet } from 'google-spreadsheet';
import credentials from '../../../../gsheetsKey.json';

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const doc = new GoogleSpreadsheet('1G8ttvBJ4z4_Piukipdmo54Wp0eZuvWSCQQYZWigpZ6s');

  // Authenticate with Google Sheets API
  await doc.useServiceAccountAuth({
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  });

  // Load the sheet
  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0]; // use the first sheet

  // Get the rows from the sheet
  const rows = await sheet.getRows();
  const rowData = rows.map((row) => row._rawData);
  // Return the rows as JSON
  return NextResponse.json({ rowData });
  // return new Response(JSON.stringify(rowData));
}