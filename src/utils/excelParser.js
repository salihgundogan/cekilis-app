import * as XLSX from 'xlsx';

const capitalizeName = (str) => {
  if (!str) return '';
  return str.split(' ').map(word => {
    if (word.length === 0) return '';
    return word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR');
  }).join(' ');
};

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
        const seenNames = new Set(); // Mükerrer kayıtları engellemek için Set
        
        // Iterate over rows. We assume:
        // Index 0 -> Column A (Numbers)
        // Index 1 -> Column B (Names)
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          // We only care about Column B (index 1) having a valid string/value
          if (row && row.length >= 2) {
            const id = row[0];
            const name = row[1];
            if (name !== null && name !== undefined && String(name).trim() !== '') {
              const capitalizedName = capitalizeName(String(name).trim());
              
              // İsim daha önce eklenmediyse listeye ekle
              if (!seenNames.has(capitalizedName)) {
                seenNames.add(capitalizedName);
                validParticipants.push({
                  id: id !== null && id !== undefined ? String(id).trim() : '?',
                  name: capitalizedName
                });
              }
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

export const parsePrizeExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
        
        const validPrizes = [];
        
        // Iterate over rows. We assume:
        // Index 0 -> Column A (Prizes)
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && row.length >= 1) {
            const prize = row[0];
            if (prize !== null && prize !== undefined && String(prize).trim() !== '') {
              validPrizes.push(capitalizeName(String(prize).trim()));
            }
          }
        }
        
        resolve(validPrizes);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};
