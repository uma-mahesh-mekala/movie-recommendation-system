import { MovieRecommendation } from '../domain/types.js';
import aiClient from '../infrastructure/ai/client.js';
import chromaClient from '../infrastructure/chroma/client.js';

const systemInstruction = `
      You are a movie recommendation assistant.

      Your job is to recommend movies based only on the
      movies provided to you by the application.

      Rules:
      1. Never invent a movie that is not in the provided list.
      2. Consider the user's preferences carefully.
      3. Use the movie descriptions to determine relevance.
      4. Prefer movies that closely match the user's request.
      5. Explain briefly why each recommendation matches.
      6. Do not mention ChromaDB, embeddings, vectors, or
         semantic distance unless explicitly asked.
      7. If none of the provided movies are a good match,
         clearly say that no strong match was found.
      10. Give me 5 movies which are closest match
    `;

/**
 * Sends the user's query and Chroma candidates to Gemini for a natural-language
 * recommendation response.
 */
async function askAI(userQuery: string, movieRecommendations: MovieRecommendation[]) {
    const movieContext = movieRecommendations.map((movie, index) =>
        `Movie ${index + 1} Title: ${movie.title} Description: ${movie.description} Semantic Distance: ${movie.distance}`
    ).join('\n');

    return aiClient.interactions.create({
        model: 'gemini-2.5-flash-lite',
        system_instruction: systemInstruction,
        input: `User Query: ${userQuery} Candidate Movies: ${movieContext}`
    });
}

/**
 * Finds movies relevant to a user query and prints Gemini's recommendation
 * response to the terminal.
 */
async function getRecommendations(userQuery: string): Promise<void> {
    const collection = await chromaClient.getCollection({
        name: 'movies'
    });

    const results = await collection.query({
        queryTexts: [userQuery],
        nResults: 10
    });

    const movieRecommendations = results.ids[0].map((id, index) => ({
        rank: index + 1,
        id,
        title: results.metadatas[0][index]!.title,
        description: results.metadatas[0][index]!.description,
        distance: results.distances[0][index]
    }));

    const response = await askAI(userQuery, movieRecommendations as MovieRecommendation[]);
    console.log(response.output_text);
}

export default getRecommendations;