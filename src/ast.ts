export type Expr = NumberLiteral | StringLiteral | Variable | BinaryExpr

export interface NumberLiteral {
  type: "NumberLiteral"
  value: number
}

export interface StringLiteral {
  type: "StringLiteral"
  value: string
}

export interface Variable {
  type: "Variable"
  name: string
}

export interface BinaryExpr {
  type: "BinaryExpr"
  left: Expr
  operator: string
  right: Expr
}

export type Stmt = VarDecl | PrintStmt

export interface VarDecl {
  type: "VarDecl"
  name: string
  value: Expr
}

export interface PrintStmt {
  type: "PrintStmt"
  expr: Expr
}