const $ = require('./tokens');
const util = require('./util');

function app(term){
    if(!util.isEnclosed(term)) throw new Error('Invalid parentheses!');
    if(!term.startsWith($.OPEN) || !term.endsWith($.CLOSE)) throw new Error('Not an application!');

    let stack = [''];
    term = term.slice(1, -1);

    for(let i = 0; i < term.length; i++){
        let c = term[i];
        switch(c){
            default:
                stack[0] += c;
                break;

            case $.OPEN:
                let j = 0, level = 0;
                while(i + j < term.length){
                    let cc = term[i + j++];

                    if(cc === $.OPEN) level++;
                    if(cc === $.CLOSE) level--;
                    if(!level) break;
                }

                stack[0] += term.substr(i, j); i += j;
                // fall through

            case $.SPACE:
                stack.unshift('');
                break;
        }
    }

    let top = stack.shift();
    if(top) stack.unshift(top);

    let [b, ...a] = stack;
    return a.length ? [util.enclose(...a.reverse()), b] : b;
}

module.exports = app;
