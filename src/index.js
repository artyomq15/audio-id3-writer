const ID3Writer = require('browser-id3-writer');
const chalk = require('chalk');
const fs = require('fs');

const INPUT_FOLDER = './input/';
const OUTPUT_FOLDER = './output/';

const FEATURE_DIVIDER = ' x ';

logSuccess('Read folder');

fs.readdir(INPUT_FOLDER, (err, files) => {

    logDivider();

    if (err) {
        logError('Error while read folder: ', err);
    }

    logSuccess('Read folder success. ' + files.length + ' files.');

    files.forEach((file, index) => {
        logDivider();
        logInfo('Process file start №' + index + '.');

        processFile(file);

        logInfo('Process file end №' + index + '.');
    });
});

function processFile(name) {
    console.log(chalk.bgWhite.black(name));

    const { title, author } = parseName(name);

    const songBuffer = fs.readFileSync(INPUT_FOLDER + name);

    const writer = new ID3Writer(songBuffer);
    writer
        .setFrame('TIT2', title)
        .setFrame('TPE1', [author])

    writer.addTag();

    const taggedSongBuffer = Buffer.from(writer.arrayBuffer);
    fs.writeFileSync(OUTPUT_FOLDER + name, taggedSongBuffer);
}

function parseName(name) {
    // author - title.mp3
    const regexp = /(.+) - (.+)(\.mp3)/;

    const result = name.match(regexp);

    return {
        title: result[2],
        author: result[1]
    };
}

function logDivider() {
    console.log(chalk.bgBlue.yellow('---------'));
}

function logSuccess(message) {
    console.log(chalk.green(message));
}

function logError(message, err) {
    console.log(chalk.red(message), err);
}

function logInfo(message) {
    console.log(chalk.yellow(message));
}
