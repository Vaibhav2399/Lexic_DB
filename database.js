import mysql from 'mysql2';

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getResults() {
    try {
        const [tableRows] = await pool.query("SHOW TABLES");
        const tables = tableRows.map(row => Object.values(row)[0]);

        const allRows = await Promise.all(
            tables.map(async tableName => {
                const [rows] = await pool.query(`SELECT * FROM ${tableName}`);
                return rows;
            })
        );

        const combinedRows = allRows.flat();

        const words = combinedRows.map(item => item.VEDETTE_FRANÇAISE);
        const sortedWords = words.sort((a, b) => a.localeCompare(b));
        const sortedRows = sortedWords.map(word => combinedRows.find(item => item.VEDETTE_FRANÇAISE === word));

        return sortedRows;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

// export async function getResults(tableName) {
//     try {
//         const [rows] = await pool.query(`SELECT * FROM ${tableName}`);
//         const words = rows.map(item => item.VEDETTE_FRANÇAISE);
//         const sortedWords = words.sort((a, b) => a.localeCompare(b));
//         const sortedRows = sortedWords.map(word => rows.find(item => item.VEDETTE_FRANÇAISE === word));
//         return sortedRows;
//     } catch (error) {
//         console.error(`Error fetching data for table ${tableName}:`, error);
//         throw error;
//     }
// }



export async function getResult(term) {
    try {
        const [tableRows] = await pool.query("SHOW TABLES");
        const tables = tableRows.map(row => Object.values(row)[0]);

        const results = await Promise.all(
            tables.map(async tableName => {
                const [rows] = await pool.query(`
                    SELECT * 
                    FROM ${tableName}
                    WHERE \`VEDETTE_FRANÇAISE\` LIKE ?`, [term]);
                return rows[0];
            })
        );

        const filteredResults = results.filter(result => result);
        // console.log("HIio : ", filteredResults[0]);
        return filteredResults[0];
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export async function getRelatedWords(inputValue) {
    try {
      const [tableRows] = await pool.query("SHOW TABLES");
      const tables = tableRows.map(row => Object.values(row)[0]);
      const results = await Promise.all(
        tables.map(async tableName => {
          const [rows] = await pool.query(`
            SELECT \`VEDETTE_FRANÇAISE\`
            FROM ${tableName}
            WHERE \`VEDETTE_FRANÇAISE\` LIKE ?`, [`%${inputValue}%`]);
          return rows.map(row => row.VEDETTE_FRANÇAISE);
        })
      );
  
      const relatedWords = results.flat().filter(word => word);
      const uniqueRelatedWords = [...new Set(relatedWords)];
      return uniqueRelatedWords;
    } catch (error) {
      console.error("Error fetching related words:", error);
      throw error;
    }
  }
  
