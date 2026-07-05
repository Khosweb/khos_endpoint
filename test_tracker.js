import { trackerPool } from './db.js';
async function test() {
    try {
        const [rows] = await trackerPool.query("SELECT * FROM visit_tracking LIMIT 5");
        console.log("visit_tracking sample:", rows);
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
test();
