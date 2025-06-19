import express from "express"
import cors from 'cors';
import PostPrintController from "./controllers/printController.js"
import { printTestLabel } from "./utils/PrintLabel.js";
import os from 'os';

const app = express();
const PORT = 3000;
export const PRINTER_SHARE_NAME = 'ZDesigner';

app.use(express.json());
app.use(cors());

app.post('/print', PostPrintController);


app.listen(PORT, () => {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                addresses.push(iface.address);
            }
        }
    }
    console.log('======================================');
    console.log(`Server running on the following IPs:`);
    addresses.forEach(ip => {
        console.log(`  http://${ip}:${PORT}`);
    });
    console.log('======================================');
    console.log(`Asegúrate de que la impresora Zebra esté compartida como "${PRINTER_SHARE_NAME}".`);
    printTestLabel();
});