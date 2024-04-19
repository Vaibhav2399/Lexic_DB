import mysql from 'mysql2';
import dotenv from 'dotenv'
dotenv.config()
import { getTableNames, getRowsFromTables, searchRowsInTables, searchColumnInTables } from './crudUtils.js';

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


// Returns an array of all the rows sorted by French Terms.
export async function getAllWords() {
    try {
        const tables = await getTableNames(pool);
        const rows = await getRowsFromTables(pool, tables);

        const combinedRows = rows.flat();

        const words = combinedRows.map(item => item.VEDETTE_FRANÇAISE);
        const sortedWords = words.sort((a, b) => a.localeCompare(b));
        const sortedRows = sortedWords.map(word => combinedRows.find(item => item.VEDETTE_FRANÇAISE === word));

        return sortedRows;
    } catch (error) {
        console.error("Error fetching all the words:", error);
        throw error;
    }
}

export async function getTermDetails(term) {
    try {
        const tables = await getTableNames(pool);
        const results = await searchRowsInTables(pool, tables, term);
        return results[0];
    } catch (error) {
        console.error("Error fetching term details:", error);
        throw error;
    }
}

export async function getRelatedTerms(term) {
    try {
        const tables = await getTableNames(pool);
        const results = await Promise.all(
            tables.map(async () => {
                const frenchRows = await searchColumnInTables(pool, tables, 'VEDETTE_FRANÇAISE', term);
                const englishRows = await searchColumnInTables(pool, tables, 'VEDETTE_ANGLAISE', term);

                const frenchWords = frenchRows.map(row => row.VEDETTE_FRANÇAISE);
                const englishWords = englishRows.map(row => row.VEDETTE_ANGLAISE);
                return [...frenchWords, ...englishWords];
            })
        );

        const relatedWords = new Set(results.flat().filter(word => word));
        return [...relatedWords];
    } catch (error) {
        console.error("Error fetching related words:", error);
        throw error;
    }
}



