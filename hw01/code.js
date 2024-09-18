const fs = require('fs');
const path = require('path');

class UniqueInt {
    constructor() {
        this.seen = new Array(2047).fill(false);
        this.minInt = -1023;
    }

    processFile(inputFilePath, outputFilePath) {
        this.seen = new Array(2047).fill(false);
        try {
            const uniqueNumbers = this.readUniqueIntegers(inputFilePath);
            this.writeUniqueIntegers(uniqueNumbers, outputFilePath);
            console.log(`Processed ${path.basename(inputFilePath)} successfully.`);
        } catch (error) {
            console.log(`Error processing ${path.basename(inputFilePath)}: ${error}`);
        }
    }

    readUniqueIntegers(inputFilePath) {
        const uniqueNumbers = [];
        const fileContent = fs.readFileSync(inputFilePath, 'utf8');
        const lines = fileContent.split('\n');

        for (const line of lines) {
            const strippedLine = line.trim();
            if (strippedLine && this.isValidIntegerLine(strippedLine)) {
                const number = parseInt(strippedLine);
                if (number >= -1023 && number <= 1023) {
                    if (!this.seen[number - this.minInt]) {
                        this.seen[number - this.minInt] = true;
                        uniqueNumbers.push(number);
                    }
                } else {
                    console.log(`Number out of range: ${number}. Skipping...`);
                }
            }
        }

        return this.sortUniqueNumbers(uniqueNumbers);
    }

    isValidIntegerLine(line) {
        return !isNaN(parseInt(line));
    }

    sortUniqueNumbers(numbers) {
        return numbers.sort((a, b) => a - b);
    }

    writeUniqueIntegers(uniqueNumbers, outputFilePath) {
        fs.writeFileSync(outputFilePath, uniqueNumbers.join('\n'));
    }
}

// Main execution
const inputFolder = 'C:\\Users\\RAISSA\\Desktop\\DataSA\\hw01\\sample-inputs';
const outputFolder = 'C:\\Users\\RAISSA\\Desktop\\DataSA\\hw01\\sample-outputs';

const uniqueIntProcessor = new UniqueInt();

try {
    const files = fs.readdirSync(inputFolder);
    for (const filename of files) {
        if (filename.endsWith('.txt')) {
            const inputPath = path.join(inputFolder, filename);
            const outputFilename = path.parse(filename).name + '_results.txt';
            const outputPath = path.join(outputFolder, outputFilename);

            const startTime = Date.now();
            uniqueIntProcessor.processFile(inputPath, outputPath);
            const endTime = Date.now();

            console.log(`Processed ${filename} in ${(endTime - startTime) / 1000} seconds`);
        }
    }
} catch (error) {
    console.log(`Error reading input folder: ${error}`);
}