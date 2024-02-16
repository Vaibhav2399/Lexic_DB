import mysql from 'mysql2';

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getResults(){
    const [rows] = await pool.query("SELECT * FROM sciences_cognitives")
    return rows
}

export async function getResult(term){
    const [rows] = await pool.query(`
    SELECT * 
    FROM sciences_cognitives
    WHERE \`VEDETTE FRANÇAISE\` LIKE ?`, [term]);
    return rows[0];
}

// const notes = await getResult(`%biais de statu quo%`);
// console.log(notes);
