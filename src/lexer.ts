export enum TokenType {
    INT = 'INT',
    STRING = 'STRING',
    PRINT = 'PRINT',

    IDENTFIER = 'IDENTIFIER',
    NUMBER = 'NUMBER',
    STRING_LITERAL = 'STRING_LITERAL',

    PLUS = 'PLUS',
    MINUS = 'MINUS',
    STAR = 'STAR',
    SLASH = 'SLASH',
    EQUAL = 'EQUAL',

    LPAREN = 'LPAREN',
    RPAREN = 'RPAREN',
    LBRACE = 'LBRACE',
    RBRACE = 'RBRACE',

    NEWLINE = 'NEWLINE',
    EOF = 'EOF',
}

export interface Token {
    type: TokenType;
    value?: string;
}

export class Lexer {
    private pos = 0;
    private currentChar: string | null;

    constructor(private input: string) {
        this.currentChar = this.input[this.pos] || null;
    }

    private advance() {
        this.pos++;
        this.currentChar = this.pos < this.input.length
            ? this.input[this.pos]
            : null;
    }

    private skipWhitespace() {
        while (this.currentChar === " " || this.currentChar === "\t") {
            this.advance();
        }
    }

    private number(): Token {
        let result = '';
        while (this.currentChar && /[0-9]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return { type: TokenType.NUMBER, value: result };
    }

    private identifier(): Token {
        let result = '';
        while (this.currentChar && /[a-zA-Z_]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }

        if (result === 'int') return { type: TokenType.INT };
        if (result === 'string') return { type: TokenType.STRING };
        if (result === 'print') return { type: TokenType.PRINT };

        return { type: TokenType.IDENTFIER, value: result };
    }

    public getNextToken(): Token {
        while (this.currentChar) {
            if (this.currentChar === '\r') {
                this.advance()
                continue
            }
            
            if (this.currentChar === " " || this.currentChar === "\t") {
                this.skipWhitespace()
                continue
            }

            if (this.currentChar === "\n") {
                this.advance()
                return { type: TokenType.NEWLINE }
            }
        
            if (/[0-9]/.test(this.currentChar)) {
                return this.number()
            }

            if (/[a-zA-Z_]/.test(this.currentChar)) {
                return this.identifier()
            }

            if (this.currentChar === "+") {
                this.advance()
                return { type: TokenType.PLUS }
            }

            if (this.currentChar === "-") {
                this.advance()
                return { type: TokenType.MINUS }
            }

            if (this.currentChar === "*") {
                this.advance()
                return { type: TokenType.STAR }
            }

            if (this.currentChar === "/") {
                this.advance()
                return { type: TokenType.SLASH }
            }

            if (this.currentChar === "=") {
                this.advance()
                return { type: TokenType.EQUAL }
            }

            if (this.currentChar === "(") {
                this.advance()
                return { type: TokenType.LPAREN }
            }

            if (this.currentChar === ")") {
                this.advance()
                return { type: TokenType.RPAREN }
            }

            throw new Error(`Unknown character: ${this.currentChar}`)
        }

        return { type: TokenType.EOF }
    }
}