/** A movie that can be indexed for semantic search. */
export interface Movie {
    title: string,
    description: string
}

/** A movie together with its generated embedding vector. */
export interface MovieEmbedding {
    title: string,
    description: string,
    embedding: number[]
}

/** A movie returned by a ChromaDB similarity search. */
export interface MovieRecommendation {
    rank: number,
    id: string | null,
    title: string | null,
    description: string | null,
    distance: number | null
}