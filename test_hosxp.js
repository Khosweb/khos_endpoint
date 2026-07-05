import { getHosxpVisits } from './dataService.js';
import { hosxpPool } from './db.js';
async function test() {
    try {
        const data = await getHosxpVisits('2026-07-05');
        if (data.length > 0) {
            console.log(data[0]);
        } else {
            const [rows] = await hosxpPool.query("SELECT * FROM vn_stat LIMIT 1");
            console.log("vn_stat sample:", rows[0]);
            const [rows2] = await hosxpPool.query("SELECT * FROM patient WHERE hn = ?", [rows[0].hn]);
            console.log("patient sample:", rows2[0]);
        }
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
test();
