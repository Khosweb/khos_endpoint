import { trackerPool } from './db.js';
async function test() {
    try {
        const [rows] = await trackerPool.query("SELECT * FROM visit_tracking WHERE vn = '690705182529'");
        console.log("visit_tracking for vn:", rows);
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
test();
