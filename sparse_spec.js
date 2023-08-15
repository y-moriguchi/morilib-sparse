/**
 * Morilib Sparse
 *
 * Copyright (c) 2023 Yuichiro MORIGUCHI
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 **/
/*
 * This test case is described for Jasmine.
 */
describe("sparse", function() {
    const S = Sparse();

    function ok(actual, expected) {
        expect(actual).toEqual(expected);
    }

    function oka(actual, val, defaultValue, length) {
        expect(actual.sparse()).toEqual(val);
        expect(actual.defaultValue()).toEqual(defaultValue);
        expect(actual.length()).toEqual(length);
    }

    function oknum(actual, expected) {
        expect(actual).toBeCloseTo(expected, 6);
    }

    beforeEach(function() {
    });

    describe("testing sparse", function() {
        it("simple", () => {
            oka(S.sparse({ 1: 2, 2: 3 }, 1, 10).map(v => v + 1), { 1: 3, 2: 4 }, 2, 10);
            ok(S.sparse({ 0: 2, 2: 3 }, 1, 10).reduce((accum, v) => accum + v), 13);
            ok(S.sparse({ 0: 2, 2: 3 }, 1, 10).reduce((accum, v) => accum + v, 10), 23);
            ok(S.sparse({ 0: 2, 2: 3 }, 1, 5).reduceRight((accum, v) => accum - v), 1-1-3-1-2);
            ok(S.sparse({ 0: 2, 2: 3 }, 1, 5).reduceRight((accum, v) => accum - v, 10), 10-1-1-3-1-2);
            ok(S.sparse({ 0: 2, 2: 3 }, 1, 10).sum(), 13);
            oka(S.sparse({ 1: 2 }, 1, 5).reverse(), { 3: 2 }, 1, 5);
            oka(S.sparse({ 1: 2, 3: 4 }, 1, 10).slice(), { 1: 2, 3: 4 }, 1, 10);
            oka(S.sparse({ 1: 2, 3: 4 }, 1, 10).slice(3), { 0: 4 }, 1, 7);
            oka(S.sparse({ 1: 2, 7: 4, 8: 2, 9: 4 }, 1, 10).slice(7), { 1: 2 }, 4, 3);
            oka(S.sparse({ 1: 2, 7: 4, 8: 2, 9: 4 }, 1, 10).slice(-3), { 1: 2 }, 4, 3);
            oka(S.sparse({ 1: 2, 7: 4, 8: 4, 9: 4 }, 1, 10).slice(6, 9), { 0: 1 }, 4, 3);
            oka(S.sparse({ 1: 2, 3: 4 }, 1, 10).slice(2, -2), { 1: 4 }, 1, 6);
            oka(S.sparse({ 1: 2, 3: 4, 5: 0 }, 1, 10).filter(x => x <= 2), { 1: 2, 4: 0 }, 1, 9);
            oka(S.sparse({ 1: 2, 3: 4, 5: 4 }, 1, 10).filter(x => x > 1), { 0: 2 }, 4, 3);
            ok(S.sparse({ 0: 2, 2: 3 }, 1, 10).every(a => a > 0), true);
            ok(S.sparse({ 0: 2, 2: 3 }, 1, 10).every(a => a <= 2), false);
            ok(S.sparse({ 0: 2, 2: 3 }, 4, 10).every(a => a <= 3), false);
            ok(S.sparse({ 0: 2, 2: 3 }, 1, 10).some(a => a > 2), true);
            ok(S.sparse({ 0: 2, 2: 3 }, 1, 10).some(a => a <= 2), true);
            ok(S.sparse({ 0: 2, 2: 3 }, 1, 10).some(a => a > 3), false);
            ok(S.sparse({ 0: 2, 2: 3 }, 1, 10).indexOf(2), 0);
            ok(S.sparse({ 1: 2, 3: 3 }, 1, 10).indexOf(2), 1);
            ok(S.sparse({ 1: 2, 3: 3 }, 1, 10).indexOf(3), 3);
            ok(S.sparse({ 1: 2, 2: 3 }, 1, 10).indexOf(1), 0);
            ok(S.sparse({ 0: 2, 1: 3 }, 1, 10).indexOf(1), 2);
            ok(S.sparse({ 0: 2, 1: 3 }, 1, 10).indexOf(0), -1);
            ok(S.sparse({ 0: 2, 2: 3 }, 1, 5).toArray(), [2, 1, 3, 1, 1]);
            oka(S.map((x, y) => x + y, S.sparse({ 1: 2, 11: 3 }, 0, 20), S.sparse({ 2: 2, 11: 4, 12: 2 }, 0, 15)), { 1: 2, 2: 2, 11: 7, 12: 2 }, 0, 20);
            oka(S.map((x, y) => x + y, S.sparse({ 1: 2, 11: 3 }, 2, 20), S.sparse({ 2: 2, 11: 4, 12: 2 }, 3, 15)), { 1: 5, 2: 4, 11: 7, 12: 4 }, 5, 20);
            oka(S.toSparse([1, 1, 1, 2, 1]), { 3: 2 }, 1, 5);
            oka(S.toSparse("aaaba"), { 3: "b" }, "a", 5);
            oka(S.toSparse(""), {}, null, 0);
        });
    });
});

