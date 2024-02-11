const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadFile(url, nombreArchivo) {
  const nombreCompleto = `${nombreArchivo}.torrent`;
  const rutaDescarga = path.join(__dirname, '../files/', nombreCompleto);

  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(rutaDescarga);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log(`Descarga de ${nombreCompleto} completada.`);
  } catch (error) {
    if (error.response && error.response.status === 500) {
        console.error(`Error 500: No se pudo descargar el archivo, omitiendo.`);
    } else {
        console.error(`Ocurrió un error al descargar el archivo: ${error.message}`);
    }
    
    throw error;
  }
}

module.exports = downloadFile;