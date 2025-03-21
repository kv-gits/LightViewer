import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  loadCSV: () => ipcRenderer.invoke('load-csv') as Promise<CSVData[] | CSVError | null>,
});