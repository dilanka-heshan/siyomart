from enum import Enum, auto
import re

class TokenType(Enum):
    IDENTIFIER = auto()
    INTEGER = auto()
    STRING = auto()
    OPERATOR = auto()
    KEYWORD = auto()
    SYMBOL = auto()
    EOF = auto()

KEYWORDS = {
    "let", "in", "fn", "where", "rec", "aug",
    "or", "not", "gr", "ge", "ls", "le",
    "eq", "ne", "true", "false", "nil", "dummy"
}

SYMBOLS = {'(', ')', ';', ','}

# OPERATORS = {'+', '-', '*', '/', '=', '&', '|', '<', '>', '@','.',':','~','$','!','#','%',' ','[]',']','{','"',' ','?',}
OPERATORS = {'+', '-', '*', '/', '=', '&', '|', '<', '>', '@', '.', ':', '~', '$', '!', '#', '%', '^', '_', '[', ']', '{', '}', '"', '`', '?'}

ESCAPE_SEQUENCES = {
    't': '\t',
    'n': '\n',
    '\\': '\\',
    '\'': '\''
}


class Token:
    def __init__(self, type_, value, line=0):
        self.type = type_
        self.value = value
        self.line = line

    def __repr__(self):
        return f"<{self.type.name}:{self.value}>"

import re

class Lexer:
    def __init__(self, source):
        self.source = source
        self.tokens = []
        self.current = 0
        self.line = 1

    def tokenize(self):
        while self.current < len(self.source):
            c = self.source[self.current]

            if c in ' \t\r':
                self.current += 1
            elif c == '\n':
                self.line += 1
                self.current += 1
            elif self._peek(2) == '//':
                self._skip_comment()
            elif c.isalpha():
                self._tokenize_identifier()
            elif c.isdigit():
                self._tokenize_integer()
            elif c == '\'':
                self._tokenize_string()
            elif c in SYMBOLS:
                self.tokens.append(Token(TokenType.SYMBOL, c, self.line))
                self.current += 1
            else:
                self._tokenize_operator()
        
        self.tokens.append(Token(TokenType.EOF, "EOF", self.line))
        return self.tokens

    def _peek(self, length):
        end = self.current + length
        return self.source[self.current:end]

    def _skip_comment(self):
        while self.current < len(self.source) and self.source[self.current] != '\n':
            self.current += 1

    def _tokenize_identifier(self):
        start = self.current
        while self.current < len(self.source) and (self.source[self.current].isalnum() or self.source[self.current] == '_'):
            self.current += 1
        text = self.source[start:self.current]
        type_ = TokenType.KEYWORD if text in KEYWORDS else TokenType.IDENTIFIER
        self.tokens.append(Token(type_, text, self.line))

    def _tokenize_integer(self):
        start = self.current
        while self.current < len(self.source) and self.source[self.current].isdigit():
            self.current += 1
        value = self.source[start:self.current]
        self.tokens.append(Token(TokenType.INTEGER, value, self.line))

    def _tokenize_string(self):
        self.current += 1  # Skip opening '
        start = self.current
        while self.current < len(self.source) and self.source[self.current] in OPERATORS:
            self.current += 1
        value = self.source[start:self.current]
        self.current += 1  # Skip closing '
        self.tokens.append(Token(TokenType.STRING, value, self.line))

    def _tokenize_operator(self):
        start = self.current
        while self.current < len(self.source) and self.source[self.current] in "+-*/=<>|&@:":
            self.current += 1
        value = self.source[start:self.current]
        if value:
            self.tokens.append(Token(TokenType.OPERATOR, value, self.line))
        else:
            raise Exception(f"Unknown character: {self.source[self.current]}")
