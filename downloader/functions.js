const mysql = require('mysql2/promise');
const downloadFile = require('./downloadFile');

const pool = mysql.createPool({
    host: 'localhost',
    database: 'axtorrent',
    user: 'root',
    password: 'EC5B09B113AC14D6FF0481665B469AA560CE662E7E87BF57C344FC4E03844B8C',
    port: 3307,
    rowsAsArray: false
})

async function getAllEpisodes() {
    const results = await pool.query("SELECT * FROM episodes");

    return results[0];
}

async function updateInFileRouteEpisodes(valor, ID) {
    const query = `
        UPDATE episodes
        SET INT_FILE_ROUTE = ?
        WHERE ID = ?
    `;

    const results = await pool.query(query, [valor, ID]);

    return results;
}

(async () => {
    const episodes = await getAllEpisodes();

    for (const episode of episodes) {
        try {
            await downloadFile(episode.EXT_FILE_ROUTE, episode.ID);
            await updateInFileRouteEpisodes("public/files/" + episode.ID + ".torrent", episode.ID);
        } catch (error) {
            console.error(`Ocurrió un error al procesar el episodio ${episode.ID}: ${error.message}`);
            
            await updateInFileRouteEpisodes(null, episode.ID);
        }
    }
})();