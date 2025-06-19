import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { PRINTER_SHARE_NAME } from '../index.js'; // Importar el nombre compartido de la impresora

const __dirname = path.resolve();

export const printLabel = (zpl, tempFileName, callback) => {
    
    const tempFile = path.join(__dirname, tempFileName);
    try {
        fs.writeFileSync(tempFile, zpl);
        console.log(`Archivo temporal creado: ${tempFile}`);
    } catch (err) {
        console.error('Error al crear archivo temporal:', err);
        return callback('Error writing temp file');
    }

    // Usar el recurso compartido de la impresora
    const printCmd = `COPY /B "${tempFile}" "\\\\localhost\\${PRINTER_SHARE_NAME}"`;

    console.log(`Ejecutando comando: ${printCmd}`);

    exec(printCmd, (error, stdout, stderr) => {
        try {
            fs.unlinkSync(tempFile);
            console.log('Archivo temporal eliminado');
        } catch (err) {
            console.error('Error al eliminar archivo temporal:', err);
        }

        if (error) {
            console.error('Error al imprimir:', error);
            console.error('STDERR:', stderr);
            return callback('Error printing label');
        }
        console.log('Impresión enviada correctamente');
        console.log('STDOUT:', stdout);
        callback(null);
    });
}

export const printTestLabel = () =>{
    // Prueba con un ZPL diferente y simple
    const testZpl = `^XA
^FO10,200^A0N,40,40^FDPrueba de impresión^FS
^XZ`;
    console.log('Enviando impresión de prueba al iniciar el servidor...');
    printLabel(testZpl, 'test_temp.zpl', (err) => {
        if (err) {
            console.error('Error al imprimir la etiqueta de prueba:', err);
        } else {
            console.log('Etiqueta de prueba enviada correctamente');
        }
    });
}