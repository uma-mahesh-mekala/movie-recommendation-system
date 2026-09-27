import { join } from 'node:path';
import { Movie, MovieEmbedding } from '../domain/types.js';
import aiClient from '../infrastructure/ai/client.js';
import { loadData, saveData } from '../infrastructure/persistence/jsonFile.js';

const dataDirectory = import.meta.dirname;

/**
 * Creates a Gemini embedding for a piece of text.
 *
 * An empty array is returned when the embedding request fails. The error is
 * logged so the batch generation can continue with the remaining movies.
 */
async function generateEmbeddings(data: string): Promise<number[]> {
    console.log('Embedding started');

    let embedding: number[] = [];
    try {
        const response = await aiClient.models.embedContent({
            model: 'gemini-embedding-2',
            contents: data
        });

        embedding = response.embeddings?.[0].values as number[];
    } catch (error) {
        console.log(`generating embeddings failed with error ${error}`);
    }

    console.log('Embedding ended');
    return embedding;
}

/**
 * Generates embeddings for every movie in movies.json and writes them to
 * moviesEmbeddings.json.
 */
async function generateAndSaveEmbeddings(): Promise<void> {
    const moviesFilePath = join(dataDirectory, '../movies.json');
    const moviesEmbeddingsFilePath = join(dataDirectory, '../moviesEmbeddings.json');

    const movies = await loadData<Movie[]>(moviesFilePath);
    console.log(movies);
    const movieEmbeddingsToSave: MovieEmbedding[] = [];

    for (const movie of movies) {
        const movieEmbedding = await generateEmbeddings(movie.description);
        movieEmbeddingsToSave.push({
            title: movie.title,
            description: movie.description,
            embedding: movieEmbedding
        });
    }

    await saveData(moviesEmbeddingsFilePath, movieEmbeddingsToSave);
}

export {
    generateEmbeddings,
    generateAndSaveEmbeddings
};