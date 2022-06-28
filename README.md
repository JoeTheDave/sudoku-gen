# Sudoku Gen

## Local Setup

```sh
npm install
npm run dev

// runs at http://localhost:3046
```

## Todo

- [ ] Bug: New sudoku puzzle not rendering when clicking on a new puzzle difficulty option. The URL changes, and the difficulty label changes, but the new puzzle does not render.
- [ ] Several untested functions in ~/app/lib/sudokuData.ts - was crunching through logic without care for clean code. These functions need to be optimized, clean up, and tested.
- [ ] I haven't yet solved the problem of actual puzzel creation. When trying to generate a puzzle that one solver can solve but a lesser solver can't solve, I still end up with puzzels that have way too many numbers populated. An extreme puzzle shouldn't have 30+ numbers.
