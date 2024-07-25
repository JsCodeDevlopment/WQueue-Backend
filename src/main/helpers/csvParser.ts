import csv from 'csv-parser';
import fs from 'fs';

export const parseCSV = (filePath: string): Promise<Array<{ name: string; phone: string }>> => {
  const results: Array<{ name: string; phone: string }> = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};