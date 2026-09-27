import { join } from 'node:path';
import { GoogleGeminiEmbeddingFunction } from '@chroma-core/google-gemini';
import { Movie } from '../../domain/types.js';
import { loadData } from '../persistence/jsonFile.js';
import chromaClient from './client.js';

const moviesFilePath = join(import.meta.dirname, '../../movies.json');

const embedder = new GoogleGeminiEmbeddingFunction({
    apiKey: process.env.GOOGLE_API_KEY,
    modelName: 'gemini-embedding-2'
});

/**
 * Creates the movies collection if needed and adds the contents of movies.json
 * with generated IDs and searchable metadata.
 */
async function createCollection(): Promise<void> {
    const collection = await chromaClient.getOrCreateCollection({
        name: 'movies',
        embeddingFunction: embedder
    });
    const movies = await loadData<Movie[]>(moviesFilePath);
    const ids = movies.map((_movie, index) => `movie_${index + 1}`);
    const documents = movies.map((movie) => `Title: ${movie.title} Description: ${movie.description}`);
    const metadatas = movies.map((movie) => ({
        title: movie.title,
        description: movie.description
    }));

    await collection.add({
        ids,
        documents,
        metadatas
    });
}

/**
 * Returns all collections currently available in the ChromaDB server.
 */
async function listCollections() {
    return chromaClient.listCollections();
}

/**
 * Gets a ChromaDB collection by name without creating it.
 */
async function getCollection(collectionName: string) {
    return chromaClient.getCollection({
        name: collectionName
    });
}

/**
 * Deletes a ChromaDB collection by name.
 */
async function deleteCollection(collectionName: string) {
    return chromaClient.deleteCollection({
        name: collectionName
    });
}

export {
    createCollection,
    listCollections,
    getCollection,
    deleteCollection
};