import { hosxpPool } from './db.js';

async function check() {
    try {
        const [rows] = await hosxpPool.query("DESCRIBE authencode");
        console.log(rows);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
check();
