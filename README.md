# Morilib Sparse

## Introduction

Morilib Sparse is a library which treats sparse array.  
Sparse array is compact compared to usual (dense) array and some methods are optimized for sparse array.

Sparse array has default value, length and some non-default values.

## How To Use

```javascript
const S = Sparse();
```

## Examples

Creates a sparse array whose default value is 1, length is 20 and value at index 2 is 2.

```javascript
const sarray1 = S.sparse({ 2: 2 }, 1, 20);
```

Doubles all element of this sprase array.

```javascript
// default value is 2, length is 20 and value at index 2 is 4.
const sarray2 = sarray1.map(x => x + x);
```

Converts the sparse array to usual dense array.

```javascript
// [2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
const array1 = sarray2.toArray();
```

Adds 2 sparse arrays.

```javascript
// equals to S.sparse({ 1: 5, 2: 4, 11: 7, 12: 4 }, 5, 20)
const sarray3 = S.map((x, y) => x + y, S.sparse({ 1: 2, 11: 3 }, 2, 20), S.sparse({ 2: 2, 11: 4, 12: 2 }, 3, 15));
```

Converts Usual dense array to sparse array.

```javascript
// equals to S.sparse({ 3: "b" }, "a", 5)
const sarray4 = S.toSparse("aaaba");
```

