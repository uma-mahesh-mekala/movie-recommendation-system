import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import getRecommendations from '../application/recommendations.js';

/**
 * Runs the terminal prompt that accepts movie preferences until the user exits.
 */
async function startInteractiveMode(): Promise<void> {
    const rl = readline.createInterface({
        input: stdin,
        output: stdout
    });

    console.log('\n🎬 Movie Recommendation System');
    console.log('Type "exit" or "quit" to close the interactive mode\n');

    while (true) {
        const question = await rl.question('What kind of movies do you like?\n>');
        const trimmed = question.trim();

        if (!trimmed) {
            continue;
        }

        if (trimmed === 'exit' || trimmed === 'quit') {
            break;
        }

        try {
            await getRecommendations(trimmed);
        } catch (error) {
            console.log('There is an error getting recommendations, please try again after sometime');
            continue;
        }
    }

    rl.close();
    console.log('Good Bye!');
}

export default startInteractiveMode;