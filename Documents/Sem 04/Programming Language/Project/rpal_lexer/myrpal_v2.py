import sys
from lexer import Lexer
from parser import Parser

if __name__ == "__main__":
    args = sys.argv
    filename = args[1]
    show_ast = "-ast" in args

    with open(filename, "r") as file:
        code = file.read()

    lexer = Lexer(code)
    tokens = lexer.tokenize()

    parser = Parser(tokens)
    ast = parser.parse_E()  # Start parsing from E rule

    if show_ast:
        ast.print_ast()
    else:
        print("AST created, continue to ST or CSE...")
