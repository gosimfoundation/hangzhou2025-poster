import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export function getSpeakers() {
  const csvPath = path.join(process.cwd(), 'embodied_new.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  
  const result = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => {
      // Remove BOM and clean header names
      return header.replace(/^\uFEFF/, '').trim();
    }
  });
  
  // Transform and clean the data
  const speakers = result.data.map((row, index) => ({
    id: index + 1,
    name: row.Name || '',
    title: row.Title || '',
    abstract: row.Abstract || ''
  }));
  
  // Filter out any empty entries
  return speakers.filter(speaker => speaker.name && speaker.title);
}