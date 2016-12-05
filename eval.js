const $ = require('./tokens');
const util = require('./util');

let S = x => y => z => x(z)(y(z));
let K = x => y => x;
let I = S(K)(K);

function parseApplication(ski){
    if(!util.isEnclosed(ski)) throw new EvalError('Invalid parentheses');
    if(!ski.startsWith($.OPEN) || !ski.endsWith($.CLOSE)) throw new EvalError('Not an application');

    ski = ski.slice(1, -1);
    let [stack, term] = [[], [...ski]];

    for(let i = 0; i < term.length; i++){
        let x = term[i];
        switch(x){
            case $.SPACE: break;
            case $.S: stack.push(S); break;
            case $.K: stack.push(K); break;
            case $.I: stack.push(I); break;

            case $.OPEN:
                let j = 0, level = 0;
                while(i + j < term.length){
                    let cc = term[i + j++];

                    if(cc === $.OPEN) level++;
                    if(cc === $.CLOSE) level--;
                    if(!level) break;
                }

                stack.push(parseApplication(ski.substr(i, j)));
                i += j; break;
        }
    }

    return stack;
}

module.exports = {
    parseApplication
};

let xyz_x = parseApplication(`(S (K K) (S (K K) I))`);
console.log(xyz_x);
