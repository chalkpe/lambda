const chalk = require('chalk');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'T> '
});

const T = require('./t');
function theT(term){
    let result = T(term, theT);
    console.log(`T[${chalk.bold.red(term)}]`, '=>', chalk.bold.green(result));
    return result;
}

rl.on('line', line => {
    let result = theT(line);

    console.log(chalk.bold.cyan(result));
    console.log();

    rl.prompt();
});

rl.prompt();
