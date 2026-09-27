import { createCollection, deleteCollection, getCollection, listCollections } from './application/collections.js';
import startInteractiveMode from './presentation/interactiveMode.js';

/**
 * Parses the CLI command and dispatches it to the corresponding application
 * service.
 */
async function main() {

    const command = process.argv[2];
    switch (command) {
        case 'create-collection':
            await createCollection();
            break;
        case 'list-collections':
            const collections = await listCollections();
            console.log(collections)
            break;
        case 'get-collection':
            const collectionName = process.argv[3];
            if (!collectionName) {
                console.log("Please provide a collection name");
                return;
            }
            const collection = await getCollection(collectionName);
            console.log(collection);
            break;
        case 'delete-collection':
            const collectionNameToDelete = process.argv[3];
            if (!collectionNameToDelete) {
                console.log("Please provide a collection name");
                return;
            }
            await deleteCollection(collectionNameToDelete);
            break;
        case 'recommendations':
            await startInteractiveMode();
            break;
        case 'help':
            console.log(`
Please provide one of the following options when running the CLI
- create-collection: Create a new movies collection
- list-collections: Return all the collections available in the chromadb instance
- get-collection <collection_name>: return the chromaDB collection for the specified collection name
- delete-collection <collection_name>: deletes a chromaDB collection with specified name
- recommendations: To start an interactive interface for movie recommendation system
                `)
        default:
            console.log(`Invalid command: Please pass help option when you run the npm script to know all available options`)
    }
}

main()