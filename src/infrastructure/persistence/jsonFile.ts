import { readFileSync, writeFileSync } from 'node:fs';

/**
 * Reads and parses JSON from a file.
 *
 * If the file cannot be read or parsed, the error is logged and an empty
 * array is returned to preserve the batch workflow's existing behavior.
 */
async function loadData<T>(fileName: string): Promise<T> {
    let data = [];
    try {
        const fileContents = readFileSync(fileName, 'utf8');
        data = JSON.parse(fileContents);
    } catch (error) {
        console.log(`Reading file ${fileName} failed with error ${error}`);
    }
    return data as T;
}

/**
 * Serializes data as JSON and writes it to a file.
 */
async function saveData<T>(fileName: string, data: T): Promise<void> {
    try {
        writeFileSync(fileName, JSON.stringify(data));
    } catch (error) {
        console.log(`Writing to file ${fileName} failed with error ${error}`);
    }
}

export {
    loadData,
    saveData
};