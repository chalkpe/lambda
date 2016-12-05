const $ = require('./tokens');
const util = require('./util');
const app = require('./app');

// 1. T[x] => x
// 2. T[(E₁ E₂)] => (T[E₁] T[E₂])
// 3. T[λx.E] => (K T[E]) (if x does not occur free in E)
// 4. T[λx.x] => I
// 5. T[λx.λy.E] => T[λx.T[λy.E]] (if x occurs free in E)
// 6. T[λx.(E₁ E₂)] => (S T[λx.E₁] T[λx.E₂]) (if x occurs free in E₁ or E₂)

function T(term){
    if(!term) return '';
    if(!util.isEnclosed(term)) throw new EvalError('Invalid braces!');

    if(term.length === 1) return term; //1
    switch(term[0]){
        case $.LAMBDA:
            let [head, ...body] = term.split($.DOT);
            let [variable, lambda] = [head.slice(1), body.join($.DOT)];

            if(variable === lambda) return $.I; //4

            if(lambda.startsWith($.LAMBDA)){
                if(!lambda.includes(variable)) return util.enclose($.K, T(lambda)); //3
                return T(util.abstract(variable, T(lambda))); //5
            }

            if(lambda.startsWith($.OPEN)){
                let a = app(lambda);
                if(!Array.isArray(a)) return T(util.abstract(variable, a)); //*: T[λx.(E)] = T[λx.E]
                if(a.every(e => !e.includes(variable))) return util.enclose($.K, T(lambda)); //3
                return util.enclose($.S, T(util.abstract(variable, a[0])), T(util.abstract(variable, a[1]))); //6
            }

            return util.enclose($.K, T(lambda)); //3

        case $.OPEN:
            let a = app(term);
            if(!Array.isArray(a)) return T(a); //*: T[(E)] = T[E]
            return util.enclose(T(a[0]), T(a[1])); //2
    }
}

module.exports = T;
