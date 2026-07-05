import { hosxpPool } from './db.js';
async function test() {
    try {
        const [rows] = await hosxpPool.query("SELECT * FROM patient WHERE cid = '-' OR fname REGEXP '^[0-9]+$' LIMIT 5");
        console.log("bad patients:", rows);
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
test();
