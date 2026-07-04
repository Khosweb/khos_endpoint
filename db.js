import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Pool for HOSxP (Read-Only)
export const hosxpPool = mysql.createPool({
    host: process.env.HOSXP_HOST || process.env.DB_HOST,
    user: process.env.HOSXP_USER || process.env.DB_USER,
    password: process.env.HOSXP_PASS || process.env.DB_PASSWORD,
    database: process.env.HOSXP_DB || process.env.DB_NAME,
    port: process.env.HOSXP_PORT || process.env.DB_PORT || 3306,
    charset: 'tis620',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    connectTimeout: 20000,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
});

// Pool for Internal Tracking DB
export const trackerPool = mysql.createPool({
    host: process.env.TRACKER_HOST || process.env.DB_HOST,
    user: process.env.TRACKER_USER || process.env.DB_USER,
    password: process.env.TRACKER_PASS || process.env.DB_PASSWORD,
    database: process.env.TRACKER_DB || process.env.DB_NAME,
    port: process.env.TRACKER_PORT || process.env.DB_PORT || 3306,
    charset: process.env.TRACKER_CHARSET || 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    connectTimeout: 20000,
    maxIdle: 10,
    idleTimeout: 60000
});

// Force UTF-8 encoding on every new connection for the tracking database
// This prevents the HOSxP server's default tis620 from corrupting our tracking data
trackerPool.on('connection', (connection) => {
    connection.query('SET NAMES utf8mb4');
});

// Helper to check connections
export async function checkConnections() {
    try {
        const hosxpConn = await hosxpPool.getConnection();
        console.log('✅ Connected to HOSxP Database');
        hosxpConn.release();

        const trackerConn = await trackerPool.getConnection();
        console.log('✅ Connected to Internal Tracker Database');
        trackerConn.release();
    } catch (error) {
        console.error('❌ Database Connection Error:', error);
        // We don't exit here because the internal DB might not exist yet
    }
}
