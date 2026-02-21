import { Lexer, TokenType, Token } from "./lexer"
import { Stmt, Expr, PrintStmt, VarDecl } from "./ast"

export class Parser {
  private currentToken: Token

  constructor(private lexer: Lexer) {
    this.currentToken = this.lexer.getNextToken()
  }

  private eat(type: TokenType) {
    if (this.currentToken.type === type) {
      this.currentToken = this.lexer.getNextToken()
    } else {
      throw new Error(`Unexpected token: ${this.currentToken.type}, expected ${type}`)
    }
  }

  public parse(): Stmt[] {
    const statements: Stmt[] = []

    while (this.currentToken.type !== TokenType.EOF) {
      if (this.currentToken.type === TokenType.INT) {
        statements.push(this.varDecl())
      } else if (this.currentToken.type === TokenType.PRINT) {
        statements.push(this.printStmt())
      } else if (this.currentToken.type === TokenType.NEWLINE) {
        this.eat(TokenType.NEWLINE)
      } else {
        throw new Error(`Unexpected token at top level: ${this.currentToken.type}`)
      }
    }

    return statements
  }

  private varDecl(): VarDecl {
    this.eat(TokenType.INT)
    if (this.currentToken.type !== TokenType.IDENTFIER) {
      throw new Error("Expected identifier after int")
    }
    const name = this.currentToken.value!
    this.eat(TokenType.IDENTFIER)
    this.eat(TokenType.EQUAL)
    const value = this.expr()
    if ([TokenType.NEWLINE].includes(this.currentToken.type)) {
        this.eat(TokenType.NEWLINE)
    }
    return { type: "VarDecl", name, value }
  }

  private printStmt(): PrintStmt {
    this.eat(TokenType.PRINT)
    this.eat(TokenType.LPAREN)
    const expr = this.expr()
    this.eat(TokenType.RPAREN)
    if (this.currentToken.type === TokenType.NEWLINE) this.eat(TokenType.NEWLINE)
    return { type: "PrintStmt", expr }
  }

  private expr(): Expr {
    let left: Expr

    if (this.currentToken.type === TokenType.NUMBER) {
        left = { type: "NumberLiteral", value: parseInt(this.currentToken.value!) }
        this.eat(TokenType.NUMBER)
    } else if (this.currentToken.type === TokenType.IDENTFIER) {
        left = { type: "Variable", name: this.currentToken.value! }
        this.eat(TokenType.IDENTFIER)
    } else {
        throw new Error(`Unexpected token in expression: ${this.currentToken.type}`)
    }

    const tokType = this.currentToken.type as TokenType
    if (tokType === TokenType.PLUS || tokType === TokenType.MINUS) {
        const operator = tokType === TokenType.PLUS ? "+" : "-"
        this.eat(tokType)
        const right = this.expr()
        return { type: "BinaryExpr", left, operator, right }
    }

    return left
 }
}