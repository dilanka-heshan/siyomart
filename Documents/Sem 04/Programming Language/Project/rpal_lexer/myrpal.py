# myrpal.py
import sys
from lexer import Lexer


if __name__ == "__main__":
    filename = sys.argv[1]
    with open(filename, "r") as file:
        code = file.read()

    lexer = Lexer(code)
    tokens = lexer.tokenize()
    for token in tokens:
        print(token)
