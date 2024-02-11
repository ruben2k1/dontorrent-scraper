async function updateTimestamps() {
  try {
    const [rows] = await pool.execute('SELECT ID FROM episodes');

    for (const row of rows) {
      const updateSql = 'UPDATE episodes SET DATE=CURRENT_TIMESTAMP() WHERE ID = ?';
      await pool.execute(updateSql, [row.ID]);
      console.log(`Se ha actualizado la marca de tiempo para la fila con ID ${row.ID}`);
    }

    console.log('Se han actualizado las marcas de tiempo con éxito.');
  } catch (error) {
    console.error('Error al actualizar las marcas de tiempo:', error.message);
  } finally {
    await pool.end();
  }
}

(async () => {
  const mysql = require('mysql2/promise');

  const pool = mysql.createPool({
    host: 'localhost',
    database: 'axtorrent',
    user: 'root',
    password: 'EC5B09B113AC14D6FF0481665B469AA560CE662E7E87BF57C344FC4E03844B8C',
    port: 3307,
    rowsAsArray: false
  })

  await updateTimestamps();
})();