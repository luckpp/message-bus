# Template TypeScript library

This is a TypeScript library that can be referenced and used by both TypeScript and JavaScript projects.

## Steps for creating the library

Run the following commands:

```bash
$ npm init --yes
$ npm i typescript --save-dev
$ tsc --init
$ npm i del-cli # required for clean script
```

Add the following changes to the `tsconfig.json` file:

```JSON
{
  "declaration": true,
  "outDir": "./buildjs"
}
```

Add the following changes to the `package.json` file:

```JSON
{
  "main": "./buildjs/index.js",
  "types": "./buildjs/index.d.ts",
  "files": [
    "buildjs/**/*"
  ],
  "scripts": {
    "clean": "del-cli ./buildjs/*",
    "build": "npm run clean && tsc",
    "build-version": "npm version patch && npm run build"
  },
}
```
