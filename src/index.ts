import * as fs from 'fs';
import * as path from 'path';

import { Lexer } from './lexer';
import { Parser } from './parser';

const args = process.argv.slice(2);


if (args.length === 0) {
    console.error('Please provide a file path as an argument.');
    process.exit(1);
}

const filePath = path.resolve(args[0]);

if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

if (!filePath.endsWith('.nv')) {
    console.error('Invalid file type. Please provide a .nv file.');
    process.exit(1);
}

const sourceCode = fs.readFileSync(filePath, 'utf-8');
const lexer = new Lexer(sourceCode);
const parser = new Parser(lexer);

const ast = parser.parse();

let token 
do {
    token = lexer.getNextToken();
    console.log(token);
} while (token.type !== 'EOF');

console.log('Runnig NV code:', filePath);
console.log('----------');
console.log(JSON.stringify(ast, null, 2));
console.log(sourceCode);