import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    database: 'axtorrent',
    user: 'root',
    password: 'EC5B09B113AC14D6FF0481665B469AA560CE662E7E87BF57C344FC4E03844B8C',
    port: 3307,
    rowsAsArray: false
})

async function insertFile(title, description, type, format, ext_img_route, user_id) {
    const results = await pool.query(
        `INSERT INTO FILES (TITLE, DESCRIPTION, TYPE, 
        FORMAT, EXT_IMG_ROUTE, USER_ID) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description, type, format, ext_img_route, user_id]
    );

    return results;
}

async function getLastIdFiles() {
    const results = await pool.query('SELECT MAX(ID) AS MAX FROM FILES');
    
    return results[0][0].MAX;
}

async function insertEpisodes(episode, ext_file_route, date, file_id) {
    const insertEpisodes = pool.query(
        `INSERT INTO EPISODES (EPISODE, EXT_FILE_ROUTE,
        DATE, FILE_ID) VALUES (?, ?, ?, ?)`,
        [episode, ext_file_route, date, file_id]
    );

    return insertEpisodes;
}

async function insertMovies(title, description, type, genre, format, director, cast, ext_img_route, user_id) {
    const results = await pool.query(
        `INSERT INTO FILES (TITLE, DESCRIPTION, TYPE, 
        GENRE, FORMAT, DIRECTOR, CAST, EXT_IMG_ROUTE, USER_ID) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, type, genre, format, director, cast, ext_img_route, user_id]
    );

    return results;
}

async function insertEpisodesMovies(ext_file_route, date, file_id) {
    const insertEpisodes = pool.query(
        `INSERT INTO EPISODES (EXT_FILE_ROUTE,
        DATE, FILE_ID) VALUES (?, ?, ?)`,
        [ext_file_route, date, file_id]
    );

    return insertEpisodes;
}

async function insertMusic(title, type, genre, ext_img_route, user_id) {
    const results = await pool.query(
        `INSERT INTO FILES (TITLE, TYPE, 
        GENRE, EXT_IMG_ROUTE, USER_ID) 
        VALUES (?, ?, ?, ?, ?)`,
        [title, type, genre, ext_img_route, user_id]
    );

    return results;
}

async function insertEpisodesMusic(ext_file_route, date, file_id) {
    const insertEpisodes = pool.query(
        `INSERT INTO EPISODES (EXT_FILE_ROUTE,
        DATE, FILE_ID) VALUES (?, ?, ?)`,
        [ext_file_route, date, file_id]
    );

    return insertEpisodes;
}

async function insertGames(title, type, format, ext_img_route, user_id) {
    const results = await pool.query(
        `INSERT INTO FILES (TITLE, TYPE, 
        GENRE, EXT_IMG_ROUTE, USER_ID) 
        VALUES (?, ?, ?, ?, ?)`,
        [title, type, format, ext_img_route, user_id]
    );

    return results;
}

async function insertEpisodesGames(ext_file_route, file_id) {
    const insertEpisodes = pool.query(
        `INSERT INTO EPISODES (EXT_FILE_ROUTE, FILE_ID) VALUES (?, ?)`,
        [ext_file_route, file_id]
    );

    return insertEpisodes;
}

export {
    pool,
    insertFile,
    insertEpisodes,
    getLastIdFiles,
    insertMovies,
    insertEpisodesMovies,
    insertMusic,
    insertEpisodesMusic,
    insertGames,
    insertEpisodesGames
};