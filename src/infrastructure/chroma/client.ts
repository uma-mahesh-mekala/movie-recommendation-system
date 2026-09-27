import { ChromaClient } from 'chromadb';

const chromaClient = new ChromaClient({
    host: 'localhost',
    port: 8000
});

export default chromaClient;