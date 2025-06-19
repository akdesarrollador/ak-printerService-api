import { printLabel } from "../utils/PrintLabel.js";


const PostPrintController = (req, res) => {
    console.log('--- Nueva petición /print recibida ---');
    const { codigo } = req.body;
    if (!codigo) {
        console.log('No se recibió el campo "codigo"');
        return res.status(400).send('No code provided');
    }

    const zpl = `^XA
^FO50,50^A0N,50,50^FD${codigo}^FS
^XZ`;

    console.log('ZPL generado:', zpl);

    printLabel(zpl, 'temp.zpl', (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('Label sent to printer');
    });
}

export default PostPrintController