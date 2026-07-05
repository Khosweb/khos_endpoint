import { trackerPool } from './db.js';
async function test() {
    try {
        const [rows] = await trackerPool.query("SELECT * FROM visit_tracking WHERE visit_date >= '2026-07-04' LIMIT 5");
        console.log("visit_tracking today sample:", rows);
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
test();
