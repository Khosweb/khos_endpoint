import { hosxpPool } from './db.js';

async function test() {
    try {
        console.log('Querying hosxpPool...');
        const [rows] = await hosxpPool.query('SELECT * FROM opduser LIMIT 1');
        console.log('Rows:', rows);
    } catch (err) {
        console.error('Caught error:');
        console.error('Type:', typeof err);
        console.error('Keys:', Object.keys(err));
        console.error('Message:', err.message);
        console.error('Full Error:', err);
    }
    process.exit(0);
}

test();
