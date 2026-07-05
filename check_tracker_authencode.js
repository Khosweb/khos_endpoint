import { trackerPool } from './db.js';
async function test() {
    try {
        const [rows] = await trackerPool.query("DESCRIBE authencode");
        console.log("tracker authencode schema:", rows);
        const [data] = await trackerPool.query("SELECT * FROM authencode LIMIT 1");
        console.log("tracker authencode data:", data);
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
test();
