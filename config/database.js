import mysql from 'mysql2/promise';
import 'dotenv/config';

let pool = null;

async function connectDB() {
    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        console.log('✅ MySQL conectado');
    } catch (error) {
        console.error('❌ Error MySQL:', error);
    }
}

function getPool() {
    if (!pool) {
        throw new Error('Base de datos no inicializada');
    }
    return pool;
}

async function query(sql, params = []) {
    const poolInstance = getPool();
    const [rows] = await poolInstance.execute(sql, params);
    return rows;
}

async function closeDB() {
    if (pool) {
        await pool.end();
        console.log('🔒 MySQL cerrado');
    }
}

export { connectDB, getPool, query, closeDB };
export default { connectDB, getPool, query, closeDB };

// ✅ CONEXIÓN AUTOMÁTICA AL IMPORTAR EL MÓDULO
(async () => {
    try {
        await connectDB();
        console.log('✅ Conexión automática exitosa');
    } catch (error) {
        console.error('❌ Error en conexión automática:', error);
    }
})();
