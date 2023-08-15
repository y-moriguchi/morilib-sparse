/**
 * Morilib Sparse
 *
 * Copyright (c) 2023 Yuichiro MORIGUCHI
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 **/
function Sparse() {
    const undef = void 0;

    function error(msg) {
        throw new Error(msg);
    }

    const getIndex = index => Number.parseInt(index);
    const makeIndex = index => index.toString();
    const cat = (...args) => args.length > 0 ? args[0].concat(cat(...args.slice(1))) : [];
    const objectLength = a => Object.keys(a).length;

    function mapObject1(anObject, f, fkey) {
        const result = {};
        const fk = fkey ?? (v => v);

        for(const [key, value] of Object.entries(anObject)) {
            result[fk(key)] = f(value);
        }
        return result;
    }

    function filterObject1Key(anObject, pred) {
        const result = {};

        for(const [key, value] of Object.entries(anObject)) {
            if(pred(Number.parseInt(key))) {
                result[key] = value;
            }
        }
        return result;
    }

    function mapObject(f, ...args) {
        const cmp = (v, w) => {
            const spv = v.split(",");
            const spw = w.split(",");
            const v1 = spv[0] - spw[0];
            const v2 = spv[1] - spw[1];

            return v1 !== 0 ? v1 : v2;
        };

        const argsKey = args.map((v, i) => mapObject1(v.sparse(), w => w, k => k + "," + i));
        const catKeys = cat(argsKey.map(v => Object.keys(v))).flat().slice().sort(cmp);
        const result = {};
        let applyArgs = [], nowArg = -1;

        function apply1() {
            applyArgs.length = args.length;
            for(let i = 0; i < args.length; i++) {
                if(applyArgs[i] === undef) {
                    applyArgs[i] = args[i].defaultValue();
                }
            }
            result[nowArg] = f(...applyArgs);
            applyArgs = [];
        }

        for(let i = 0; i < catKeys.length; i++) {
            const sp = catKeys[i].split(",").map(v => Number.parseInt(v));

            if(nowArg < 0) {
                nowArg = sp[0];
            } else if(sp[0] !== nowArg) {
                apply1();
                nowArg = sp[0];
            }
            applyArgs[sp[1]] = args[sp[1]].at(sp[0]);
        }
        apply1();
        return result;
    }

    function toSparse(anArray) {
        const arr = Array.from(anArray);
        const map = new Map();

        if(anArray.length === 0) {
            return sparse({}, null, 0);
        }

        arr.forEach(v => {
            if(map.get(v) === undef) {
                map.set(v, 0);
            }
            map.set(v, map.get(v) + 1);
        });

        const defVal = Array.from(map.entries()).sort((v, w) => w[1] - v[1])[0][0];
        const result = {};

        arr.forEach((v, i) => {
            if(defVal !== v) {
                result[makeIndex(i)] = v;
            }
        });
        return sparse(result, defVal, arr.length);
    }

    function sparse(value, defaultValue, length) {
        const val = value;
        const defVal = defaultValue;
        const len = length;

        function normalize(valNew, lenNew) {
            const normalize1 = valNew => toSparse(valNew.toArray());

            if(objectLength(valNew) > lenNew - objectLength(valNew)) {
                return normalize1(sparse(valNew, defVal, lenNew));
            } else {
                return sparse(valNew, defVal, lenNew);
            }
        }

        const at = i => i < 0 || i >= len ? undef : (val[i] ?? defVal);

        function reduceObject(f, init) {
            let result = init;

            if(length === 0 && init === undef) {
                error("Initial value required");
            } else {
                for(let i = 0; i < length; i++) {
                    result = result === undef ? at(i) : f(result, at(i));
                }
            }
            return result;
        }

        function reduceRightObject(f, init) {
            let result = init;

            if(length === 0 && init === undef) {
                error("Initial value required");
            } else {
                for(let i = length - 1; i >= 0; i--) {
                    result = result === undef ? at(i) : f(result, at(i));
                }
            }
            return result;
        }

        function sumObject() {
            const valValues = Object.values(val);
            let sum = 0;

            for(const vals of valValues) {
                sum += vals;
            }
            sum += defVal * (len - valValues.length);
            return sum;
        }

        function reverse() {
            const valNew = mapObject1(val, v => v, k => len - Number.parseInt(k) - 1);

            return sparse(valNew, defVal, len);
        }

        function slice(start, end) {
            const start0 = start ?? 0;
            const start1 = start0 >= 0 ? start0 : len + start0;
            const end0 = end ?? len
            const end1 = end0 >= 0 ? end0 : len + end0;

            if(start1 >= len || end1 <= start1) {
                return sparse({}, defVal, 0);
            } else {
                const valNew = mapObject1(filterObject1Key(val, k => k >= start1 && k < end1), v => v, k => k - start1)
                const lenNew = Math.min(end1, len) - start1;

                return normalize(valNew, lenNew);
            }
        }

        function filter(pred) {
            if(pred(defVal)) {
                const valNew = {};
                let lenNew = len, offset = 0;

                for(const [k, v] of Object.entries(val)) {
                    if(pred(v)) {
                        valNew[Number.parseInt(k) - offset] = v;
                    } else {
                        lenNew--;
                        offset++;
                    }
                }
                return normalize(valNew, lenNew);
            } else {
                const dense = [];

                for(const v of Object.values(val)) {
                    if(pred(v)) {
                        dense.push(v);
                    }
                }
                return toSparse(dense);
            }
        }

        function every(pred) {
            if(pred(defVal)) {
                for(const v of Object.values(val)) {
                    if(!pred(v)) {
                        return false;
                    }
                }
                return true;
            } else {
                return false;
            }
        }

        function some(pred) {
            if(pred(defVal)) {
                return true;
            } else {
                for(const v of Object.values(val)) {
                    if(pred(v)) {
                        return true;
                    }
                }
                return false;
            }
        }

        function indexOf(dest) {
            const keys = Object.keys(val).sort((v, w) => v - w);

            for(let i = 0, j = 0; i < len;) {
                if(val[i] !== undef) {
                    if(dest === val[i]) {
                        return i;
                    } else {
                        i++;
                    }
                } else {
                    if(dest === defVal) {
                        return i;
                    } else {
                        i = Number.parseInt(keys[j]);
                        j++;
                    }
                }
            }
            return -1;
        }

        function toArray() {
            const result = [];

            for(let i = 0; i < len; i++) {
                result.push(at(i));
            }
            return result;
        }

        const me = {
            defaultValue: () => defVal,
            length: () => len,
            sparse: () => Object.fromEntries(Object.entries(val)),
            at: at,
            map: f => sparse(mapObject1(val, f), f(defVal), len),
            reduce: (f, init) => reduceObject(f, init),
            reduceRight: (f, init) => reduceRightObject(f, init),
            sum: () => sumObject(),
            reverse: () => reverse(),
            slice: slice,
            filter: filter,
            every: every,
            some: some,
            indexOf: indexOf,
            toArray: toArray
        };
        return me;
    }

    const me = {
        sparse: sparse,
        map: (f, ...args) => sparse(mapObject(f, ...args), f(...args.map(v => v.defaultValue())), Math.max(...args.map(v => v.length()))),
        toSparse: toSparse
    };

    return me;
}

