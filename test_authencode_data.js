import { hosxpPool } from './db.js';
async function test() {
    try {
        const [rows] = await hosxpPool.query("SELECT * FROM authencode LIMIT 3");
        console.log(rows);
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
test();
