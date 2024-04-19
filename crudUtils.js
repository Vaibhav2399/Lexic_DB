
// Fetching all the table names
export async function getTableNames(pool) {
    const [tableRows] = await pool.query("SHOW TABLES");
    return tableRows.map(row => Object.values(row)[0]);
}

export async function getRowsFromTables(pool, tables) {
    const results = await Promise.all(
        tables.map(async tableName => {
            const [rows] = await pool.query(`SELECT * FROM ${tableName} ORDER BY VEDETTE_FRANÇAISE`);
            return rows;
        })
    );
    return results;
}

export async function searchRowsInTables(pool, tables, term) {
    const results = await Promise.all(
        tables.map(async tableName => {
            const [rows] = await pool.query(`
                SELECT * 
                FROM ${tableName}
                WHERE \`VEDETTE_FRANÇAISE\` LIKE ? OR \`VEDETTE_ANGLAISE\` LIKE ?`, [term, term]);
            return rows[0];
        })
    );
    return results.filter(result => result); // Filter out any undefined results
}

export async function searchColumnInTables(pool, tables, columnName, term) {
    const results = await Promise.all(
        tables.map(async tableName => {
            const [rows] = await pool.query(`
                SELECT ?? 
                FROM ${tableName}
                WHERE ?? LIKE ?`, [columnName, columnName, `%${term}%`]);
            return rows;
        })
    );
    return results.flat(); // Flatten the array of arrays into a single array
}