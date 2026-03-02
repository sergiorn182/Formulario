const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Error de conexión:');
        console.error({
            message: err.message,
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState
        });
    } else {
        console.log('✅ Conexión exitosa a la base de datos');
        connection.query('SHOW TABLES', (err, results) => {
            if (err) {
                console.error('Error en consulta:', err);
            } else {
                console.log('Tablas existentes:', results);
            }
            connection.end();
        });
    }
});
