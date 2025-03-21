import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse';

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function tryConvertToNumber(value: any): any {
  if (typeof value === 'string' && !isNaN(Number(value))) {
    return Number(value);
  }
  return value;
}

ipcMain.handle('load-csv', async () => {
  if (!mainWindow) {
    return null;
  }

  const { filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'CSV Files', extensions: ['csv'] }],
  });

  if (filePaths && filePaths.length > 0) {
    const filePath = filePaths[0];

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Using csv-parse to handle CSV parsing
      return new Promise((resolve, reject) => {
        parse(fileContent, {
          columns: true, // Use the first row as headers
          skipEmptyLines: true, // Skip empty lines
        }, (err, records: any[]) => { // Add explicit type to records
          if (err) {
            reject(err);
          } else {
            // Manually convert string values to numbers where possible
            const transformedRecords = records.map(record => {
              const transformedRecord: { [key: string]: any } = {};
              for (const key in record) {
                if (record.hasOwnProperty(key)) {
                  transformedRecord[key] = tryConvertToNumber(record[key]);
                }
              }
              return transformedRecord;
            });
            resolve(transformedRecords);
          }
        });
      });

    } catch (error: any) { // Explicitly type the error as any or Error
        console.error('Error loading or parsing CSV:', error);
        return { error: error.message };
    }
  }
  return null;
});