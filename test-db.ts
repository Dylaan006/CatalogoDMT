import 'dotenv/config';
import { getProducts } from './lib/data';

async function main() {
    console.log('Fetching products...');
    try {
        const products = await getProducts();
        console.log('Products:', products);
    } catch (e) {
        console.error('Error:', e);
    }
}

main();
