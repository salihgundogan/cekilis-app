import * as XLSX from 'xlsx';

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        // Parse the excel file
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        // Using header: 1 to get array of arrays (rows)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
        
        const validParticipants = [];
        
        // Iterate over rows. We assume:
        // Index 0 -> Column A (Numbers)
        // Index 1 -> Column B (Names)
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          // We only care about Column B (index 1) having a valid string/value
          if (row && row.length >= 2) {
            const name = row[1];
            if (name !== null && name !== undefined && String(name).trim() !== '') {
              validParticipants.push(String(name).trim());
            }
          }
        }
        
        resolve(validParticipants);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    // Read as ArrayBuffer for xlsx
    reader.readAsArrayBuffer(file);
  });
};
