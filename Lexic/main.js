const mysql = require('mysql2/promise'); // Import promise-based version

async function createConnection() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'root@1234',
      database: 'termes',
    });

    console.log('Connected to MySQL database');
    return connection;
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    throw error;
  }
}

async function searchDatabase(searchTerm) {
  let connection;
  try {
    connection = await createConnection();

    const tableName = 'sciences_cognitives';
    const columnName = 'VEDETTE FRANÇAISE';

  
    const query = `SELECT * FROM ${tableName} WHERE \`${columnName}\` LIKE ?`;
    console.log('Executing SQL query:', query);
    const [results] = await connection.query(query, [`%${searchTerm}%`]);

    

    console.log('Results for:', searchTerm);
    console.table(results);

    // Update the result container in the HTML
    updateResultContainer(results);
  } catch (error) {
    console.error('Error creating or executing database connection:', error);
  } finally {
    // Close the connection when done
    if (connection) {
      await connection.end();
    }
  }
}

function updateResultContainer(results) {
  const resultContainer = document.getElementById('search-results');

  // Clear previous results
  resultContainer.innerHTML = '';

  results.forEach(result => {
    const resultItem = document.createElement('div');
    resultItem.textContent = result['VEDETTE FRANÇAISE']; 
    resultContainer.appendChild(resultItem);
  });
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    const searchTerm = document.querySelector('.search-input').value;
    console.log('Searching :', searchTerm);
    searchDatabase(searchTerm);
  }
}