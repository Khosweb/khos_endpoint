import { verifyUserLogin } from './auth.js';

async function test() {
    try {
        console.log('Testing verifyUserLogin...');
        const result = await verifyUserLogin('test', 'test');
        console.log('Result:', result);
    } catch (err) {
        console.error('Unhandled script error:', err);
    }
    process.exit(0);
}

test();
