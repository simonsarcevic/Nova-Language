import { Stmt, Expr } from "./ast"

export class Interpreter {
  private env: Record<string, number> = {}

  public run(statements: Stmt[]) {
    for (const stmt of statements) {
      this.execute(stmt)
    }
  }

  private execute(stmt: Stmt) {
    switch (stmt.type) {
      case "VarDecl":
        this.env[stmt.name] = this.evaluate(stmt.value)
        break
      case "PrintStmt":
        console.log(this.evaluate(stmt.expr))
        break
      default:
        throw new Error(`Unknown statement type: ${(stmt as any).type}`)
    }
  }

  private evaluate(expr: Expr): number {
    switch (expr.type) {
      case "NumberLiteral":
        return expr.value
      case "Variable":
        if (!(expr.name in this.env)) throw new Error(`Undefined variable: ${expr.name}`)
        return this.env[expr.name]
      case "BinaryExpr":
        const left = this.evaluate(expr.left)
        const right = this.evaluate(expr.right)
        switch (expr.operator) {
          case "+": return left + right
          case "-": return left - right
          default:
            throw new Error(`Unknown operator: ${expr.operator}`)
        }
      default:
        throw new Error(`Unknown expression type: ${(expr as any).type}`)
    }
  }
}