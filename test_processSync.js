import { getHosxpVisits, saveTrackingResults } from './dataService.js';
import { processCrossCheck } from './crossCheckLogic.js';

async function test() {
    try {
        const visit_date = '2026-07-04';
        const hosxpData = await getHosxpVisits(visit_date);
        const excelData = []; // empty for test
        const processedData = processCrossCheck(hosxpData, excelData);
        await saveTrackingResults(processedData);
        console.log("Success!");
    } catch(e) {
        console.error("Error:", e.message);
    } finally {
        process.exit();
    }
}
test();
