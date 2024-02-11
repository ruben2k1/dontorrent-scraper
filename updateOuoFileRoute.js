const mysql = require('mysql2/promise');
const axios = require('axios');

const pool = mysql.createPool({
  host: 'localhost',
  database: 'axtorrent',
  user: 'root',
  password: 'EC5B09B113AC14D6FF0481665B469AA560CE662E7E87BF57C344FC4E03844B8C',
  port: 3307,
  rowsAsArray: false
})

async function updateOuoFileRoutes(SECRET_KEY) {
    try {
        const [ rows ] = await pool.execute('SELECT ID, INT_FILE_ROUTE FROM episodes WHERE ID>79817');

        for (const row of rows) {
            const intFileRoute = row.INT_FILE_ROUTE;
            const apiUrl = `http://ouo.io/api/${SECRET_KEY}=https://axtorrent.com/` + intFileRoute;

            try {
                const response = await axios.get(apiUrl);

                const ouoResult = response.data;

                const updateSql = 'UPDATE episodes SET OUO_FILE_ROUTE = ? WHERE ID = ?';
                await pool.execute(updateSql, [ouoResult, row.ID]);

                console.log(`Se ha añadido un enlace OUO para la fila con ID ${row.ID}`);
            } catch (error) {
                console.error(`Error en la solicitud a la API para ID ${row.ID}:`, error.message);
            }
        }

        console.log('Se han añadido todos los enlaces OUO con éxito');
    } catch (error) {
        console.error('Error al obtener datos de la base de datos:', error.message);
    } finally {
        pool.end();
    }
}

updateOuoFileRoutes();