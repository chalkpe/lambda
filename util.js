const $ = require('./tokens');

let input = (i) => i.startsWith($.LAMBDA) ? i : ($.LAMBDA + i);
let enclose = (...variables) => $.OPEN + variables.join($.SPACE) + $.CLOSE;
let abstract = (i, ...variables) => input(i) + $.DOT + (variables.length > 1 ? enclose(...variables) : variables[0]);

let isEnclosed = (braces, stack = []) => [...braces].every(b => {
    switch(b){
        default: return true;
        case $.OPEN: return stack.push(b);
        case $.CLOSE: return stack.pop() === $.OPEN;
    }
}) && !stack.length;

module.exports = {
    input,
    enclose,
    abstract,
    isEnclosed
};
