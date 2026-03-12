import * as XLSX from 'xlsx';
import type { ExpenseRecord } from './ollamaAgent';

export interface ReportMeta {
  companyName: string;
  employeeName: string;
  designation: string;
}

export function exportToExcel(data: ExpenseRecord[], meta: ReportMeta) {
  const activeData = data.filter(item => item.category !== 'excluded');

  const aoa: any[][] = [
    ['Company Name:', meta.companyName || 'N/A'],
    ['Employee Name:', meta.employeeName || 'N/A'],
    ['Designation:', meta.designation || 'N/A'],
    [],
    ['Date', 'Client', 'Expense Line Item', 'Air Travel', 'Cab/Taxi', 'Hotel', 'Food & Beverages', 'Miscellaneous', 'Total Amount']
  ];

  let sumAir = 0, sumCab = 0, sumHotel = 0, sumFood = 0, sumMisc = 0, grandTotal = 0;

  activeData.forEach(item => {
    const air = item.category === 'air_travel' ? item.amount : 0;
    const cab = item.category === 'cab_taxi' ? item.amount : 0;
    const hotel = item.category === 'hotel' ? item.amount : 0;
    const food = item.category === 'food_beverage' ? item.amount : 0;
    const misc = item.category === 'misc' ? item.amount : 0;
    
    sumAir += air;
    sumCab += cab;
    sumHotel += hotel;
    sumFood += food;
    sumMisc += misc;
    grandTotal += item.amount;

    aoa.push([
      item.date,
      item.client_name || '',
      item.line_item,
      air || null,
      cab || null,
      hotel || null,
      food || null,
      misc || null,
      item.amount
    ]);
  });

  // Append Totals Row
  aoa.push([]);
  aoa.push([
    'TOTAL CLAIMS',
    '',
    '',
    sumAir || null,
    sumCab || null,
    sumHotel || null,
    sumFood || null,
    sumMisc || null,
    grandTotal
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  
  // Bold headers and totals could be done here if needed, but aoa works natively for raw data.
  const colWidths = [
    { wch: 15 }, // Date / Labels
    { wch: 25 }, // Client
    { wch: 40 }, // Line Item
    { wch: 12 }, // Air
    { wch: 12 }, // Cab
    { wch: 12 }, // Hotel
    { wch: 18 }, // Food
    { wch: 15 }, // Misc
    { wch: 15 }  // Total Amount
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
  
  XLSX.writeFile(workbook, `Business_Expenses_${new Date().toISOString().split('T')[0]}.xlsx`);
}
