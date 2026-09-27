# Movie Recommendation System

A TypeScript command-line movie recommendation system. It stores movie descriptions in ChromaDB, uses Gemini embeddings for semantic search, and asks Gemini to explain the closest matches.

## How It Works

1. `movies.json` provides the movie titles and descriptions.
2. `create-collection` creates a ChromaDB collection named `movies` and adds the movie data.
3. The recommendation command searches that collection using the user's natural-language query.
4. The closest movies are sent to Gemini, which produces the final response.

## Prerequisites

- Node.js 20.6 or newer
- npm
- A Google Gemini API key
- A ChromaDB server running on `localhost:8000`

The Node.js version is important because the npm scripts use Node's `--env-file` option.

## Setup

From this directory:

```bash
npm install
```

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_google_api_key
```

Do not commit `.env` or expose the API key in source control.

### Start ChromaDB

Use one of the following approaches.

With Docker:

```bash
docker run --rm -p 8000:8000 chromadb/chroma
```

Or, with the ChromaDB Python package installed:

```bash
chroma run --host 0.0.0.0 --port 8000
```

Keep the ChromaDB process running while using the application.

## Development Commands

Create the ChromaDB collection and index the movies:

```bash
npm run dev -- create-collection
```

List available ChromaDB collections:

```bash
npm run chroma
```

Get a specific collection:

```bash
npm run dev -- get-collection movies
```

Delete a collection:

```bash
npm run dev -- delete-collection movies
```

Start the interactive recommendation mode:

```bash
npm run dev -- recommendations
```

Type a movie preference such as `science fiction movies about artificial intelligence`. Enter `exit` or `quit` to close the interactive mode.

Display the available CLI commands:

```bash
npm run dev -- help
```

## Build and Run

Compile the TypeScript source:

```bash
npm run build
```

Run the compiled CLI:

```bash
npm start -- recommendations
```

The build copies `src/movies.json` into `dist` so the compiled collection command can still load the movie data.

## Optional Embedding Generation

The following command generates `moviesEmbeddings.json` using Gemini directly:

```bash
npm run generate
```

This is an optional standalone workflow. The normal recommendation flow uses ChromaDB's Gemini embedding function and does not require this file.

## Project Structure

```text
src/
  application/       Application use cases
  domain/            Shared domain types
  infrastructure/    Gemini, ChromaDB, and JSON file integrations
  presentation/      Interactive terminal interface
  index.ts           CLI entry point
  generateEmbeddings.ts
  movies.json        Movie input data
```

## Troubleshooting

### Cannot connect to ChromaDB

Confirm that ChromaDB is running and listening on port `8000`:

```bash
npm run chroma
```

If the command cannot connect, start ChromaDB and run it again.

### Collection does not exist

Create it before starting recommendations:

```bash
npm run dev -- create-collection
```

### Gemini authentication errors

Check that `.env` exists in the project root and contains a valid `GOOGLE_API_KEY`. Restart the command after changing the file.

### Duplicate collection data

`create-collection` uses `getOrCreateCollection` and then adds the movies. If you run it repeatedly, existing IDs may already be present. Delete and recreate the collection when rebuilding the index:

```bash
npm run dev -- delete-collection movies
npm run dev -- create-collection
```

## Testing

There is currently no automated test suite. The TypeScript project can be checked and compiled with:

```bash
npm run build
```
