const expect = require('chai').expect;

describe('lambda', function(){
    describe('app.js', function(){
        const app = require('./app');

        it('(E)', function(){
            expect(app(`(S)`)).to.equal(`S`);
            expect(app(`(λx.x)`)).to.equal(`λx.x`);
        });

        it('(E₁ E₂)', function(){
            expect(app(`(λx.x λx.x)`)).to.deep.equal([`(λx.x)`, `λx.x`]);
            expect(app(`(S I (K K))`)).to.deep.equal([`(S I)`, `(K K)`]);
            expect(app(`(S (K I) K)`)).to.deep.equal([`(S (K I))`, `K`]);
            expect(app(`(S (S (K K) I) (S (K K) (S (K K) (K I))))`)).to.deep.equal([`(S (S (K K) I))`, `(S (K K) (S (K K) (K I)))`])
        });
    });

    describe('t.js', function(){
        const T = require('./t');

        it('1. T[x] => x', function(){
            expect(T(`x`)).to.equal('x');
            expect(T(`y`)).to.equal('y');
            expect(T(`S`)).to.equal('S');
            expect(T(`K`)).to.equal('K');
        });

        it('2. T[(E₁ E₂)] => (T[E₁] T[E₂])', function(){
            expect(T(`(λx.x λx.x)`)).to.equal('(I I)');
            expect(T(`(K (K λx.x))`)).to.equal('(K (K I))');
        });

        it('3. T[λx.E] => (K T[E]) (if x does not occur free in E)', function(){
            expect(T(`λy.S`)).to.equal('(K S)');
            expect(T(`λy.x`)).to.equal('(K x)');
            expect(T(`λx.y`)).to.equal('(K y)');
            expect(T(`λy.y`)).to.not.equal('(K y)');
        });

        it('4. T[λx.x] => I', function(){
            expect(T(`λx.x`)).to.equal('I');
            expect(T(`λy.y`)).to.equal('I');
            expect(T(`λa.a`)).to.equal('I');
        });

        it('5. T[λx.λy.E] => T[λx.T[λy.E]] (if x occurs free in E)', function(){
            expect(T(`λx.λy.x`)).to.equal('(S (K K) I)');
            expect(T(`λx.λx.x`)).to.equal('(K I)');
            expect(T(`λy.λy.y`)).to.equal('(K I)');
            expect(T(`λy.λx.x`)).to.equal('(K I)');
        });

        it('6. T[λx.(E₁ E₂)] => (S T[λx.E₁] T[λx.E₂]) (if x occurs free in E₁ or E₂)', function(){
            expect(T(`λx.(S x)`)).to.equal('(S (K S) I)');
            expect(T(`λx.λy.(y x)`)).to.equal('(S (K (S I)) (S (K K) I))');
        });
    });
});
