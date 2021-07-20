# TypeScript project

This is a TypeScript project that references a TypeScript custom library.

## Steps for creating the project

Run the following commands:

```bash
$ npm init --yes
$ npm i typescript
$ tsc --init
$ npm i ts-node
$ npm i ts-node-dev --save-dev
```

Add the following changes to the `tsconfig.json` file:

```JSON
{
  "sourceMap": true,
  "outDir": "./dist",
  "rootDir": "./src",
}
```

Add the following changes to the `package.json` file:

```JSON
{
  "scripts": {
    "start": "ts-node src/index.ts",
    "dev": "ts-node-dev --poll src/index.ts",
  },
}
```