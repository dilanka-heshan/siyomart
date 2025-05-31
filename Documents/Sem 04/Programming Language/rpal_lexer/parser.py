from lexer import TokenType
from ast import ASTNode

class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.current = 0

    def peek(self):
        return self.tokens[self.current]

    def advance(self):
        token = self.tokens[self.current]
        self.current += 1
        return token

    def match(self, *types):
        if self.peek().type in types:
            return self.advance()
        return None

    def expect(self, expected_type):
        token = self.advance()
        if token.type != expected_type:
            raise SyntaxError(f"Expected {expected_type}, got {token.type}")
        return token

    def parse_E(self):
        token = self.peek()
        if token.value == 'let':
            self.advance()
            d = self.parse_D()
            # self.expect(TokenType.KEYWORD)  # expect 'in'
            token = self.expect(TokenType.KEYWORD)
            if token.value != 'in':
             raise SyntaxError(f"Expected keyword 'in', got '{token.value}'")

            e = self.parse_E()
            return ASTNode('let', [d, e])
        elif token.value == 'fn':
            self.advance()
            vb_list = []
            while self.peek().type == TokenType.IDENTIFIER or self.peek().value == '(':
                vb_list.append(self.parse_Vb())
            self.expect(TokenType.SYMBOL)  # expect '.'
            e = self.parse_E()
            return ASTNode('lambda', vb_list + [e])
        else:
            return self.parse_Ew()

    def parse_R(self):
        left = self.parse_Rn()
        while self.peek().type in (TokenType.IDENTIFIER, TokenType.INTEGER, TokenType.STRING):
            right = self.parse_Rn()
            left = ASTNode('gamma', [left, right])
        return left

    def parse_Rn(self):
        token = self.peek()
        if token.type == TokenType.IDENTIFIER:
            return ASTNode(f"<ID:{self.advance().value}>")
        elif token.type == TokenType.INTEGER:
            return ASTNode(f"<INT:{self.advance().value}>")
        elif token.type == TokenType.STRING:
            return ASTNode(f"<STR:{self.advance().value}>")
        elif token.value == 'true':
            self.advance()
            return ASTNode('true')
        elif token.value == 'false':
            self.advance()
            return ASTNode('false')
        elif token.value == '(':
            self.advance()
            e = self.parse_E()
            self.expect(TokenType.SYMBOL)  # ')'
            return e
        else:
            raise SyntaxError(f"Unexpected token in Rn: {token}")
        

    def parse_D(self):
        left = self.parse_Da()
        if self.peek().value == 'within':
            self.advance()
            right = self.parse_D()
            return ASTNode('within', [left, right])
        else:
            return left

    def parse_Da(self):
        nodes = [self.parse_Dr()]
        while self.peek().value == 'and':
            self.advance()
            nodes.append(self.parse_Dr())
        if len(nodes) > 1:
            return ASTNode('and', nodes)
        else:
            return nodes[0]

    def parse_Dr(self):
        if self.peek().value == 'rec':
            self.advance()
            db = self.parse_Db()
            return ASTNode('rec', [db])
        else:
            return self.parse_Db()

    def parse_Db(self):
        if self.peek().value == '(':
            self.advance()
            d = self.parse_D()
            self.expect(TokenType.SYMBOL)  # ')'
            return d

        token = self.peek()
        if token.type == TokenType.IDENTIFIER:
            id_token = self.advance()
            if self.peek().type == TokenType.IDENTIFIER or self.peek().value == '(':
                vb_list = [self.parse_Vb()]
                while self.peek().type == TokenType.IDENTIFIER or self.peek().value == '(':
                    vb_list.append(self.parse_Vb())
                self.expect(TokenType.OPERATOR)  # '='
                expr = self.parse_E()
                return ASTNode('function_form', [ASTNode(f"<ID:{id_token.value}>")] + vb_list + [expr])
            else:
                vl = ASTNode(f"<ID:{id_token.value}>")
                self.expect(TokenType.OPERATOR)  # '='
                expr = self.parse_E()
                return ASTNode('=', [vl, expr])
        else:
            raise SyntaxError(f"Unexpected token in Db: {token}")

    def parse_Ew(self):
        left = self.parse_T()
        if self.peek().value == 'where':
            self.advance()
            dr = self.parse_Dr()
            return ASTNode('where', [left, dr])
        else:
            return left

    def parse_T(self):
        nodes = [self.parse_Ta()]
        while self.peek().value == ',':
            self.advance()
            nodes.append(self.parse_Ta())
        if len(nodes) > 1:
            return ASTNode('tau', nodes)
        else:
            return nodes[0]
        
    def parse_Ta(self):
        left = self.parse_Tc()
        while self.peek().value == 'aug':
            self.advance()
            right = self.parse_Tc()
            left = ASTNode('aug', [left, right])
        return left

    def parse_Tc(self):
        left = self.parse_B()
        if self.peek().value == '->':
            self.advance()
            middle = self.parse_Tc()
            self.expect(TokenType.OPERATOR)  # Expect '|'
            right = self.parse_Tc()
            return ASTNode('->', [left, middle, right])
        else:
            return left
        
    def parse_B(self):
        left = self.parse_Bt()
        while self.peek().value == 'or':
            self.advance()
            right = self.parse_Bt()
            left = ASTNode('or', [left, right])
        return left

    def parse_Bt(self):
        left = self.parse_Bs()
        while self.peek().value == '&':
            self.advance()
            right = self.parse_Bs()
            left = ASTNode('&', [left, right])
        return left

    def parse_Bs(self):
        if self.peek().value == 'not':
            self.advance()
            return ASTNode('not', [self.parse_Bp()])
        else:
            return self.parse_Bp()

    def parse_Bp(self):
        left = self.parse_A()
        token = self.peek()

        if token.value in {'gr', '>', 'ge', '>=', 'ls', '<', 'le', '<=', 'eq', 'ne'}:
            op = token.value
            self.advance()
            right = self.parse_A()

            # Normalize to standard RPAL ops
            if op in {'gr', '>'}: op = 'gr'
            elif op in {'ge', '>='}: op = 'ge'
            elif op in {'ls', '<'}: op = 'ls'
            elif op in {'le', '<='}: op = 'le'
            elif op == 'eq': op = 'eq'
            elif op == 'ne': op = 'ne'

            return ASTNode(op, [left, right])
        else:
            return left

    def parse_A(self):
        token = self.peek()
        if token.value == '+':
            self.advance()
            return self.parse_At()
        elif token.value == '-':
            self.advance()
            return ASTNode('neg', [self.parse_At()])

        left = self.parse_At()
        while self.peek().value in {'+', '-'}:
            op = self.advance().value
            right = self.parse_At()
            left = ASTNode(op, [left, right])
        return left

    def parse_At(self):
        left = self.parse_Af()
        while self.peek().value in {'*', '/'}:
            op = self.advance().value
            right = self.parse_Af()
            left = ASTNode(op, [left, right])
        return left

    def parse_Af(self):
        left = self.parse_Ap()
        if self.peek().value == '**':
            self.advance()
            right = self.parse_Af()
            return ASTNode('**', [left, right])
        return left

    def parse_Ap(self):
        left = self.parse_R()
        while self.peek().value == '@':
            self.advance()
            id_token = self.expect(TokenType.IDENTIFIER)
            right = self.parse_R()
            left = ASTNode('@', [left, ASTNode(f"<ID:{id_token.value}>"), right])
        return left

    # def parse_R(self):
    #     left = self.parse_Rn()
    #     while self.peek().type in {TokenType.IDENTIFIER, TokenType.INTEGER, TokenType.STRING} or self.peek().value in {'true', 'false', 'nil', 'dummy', '('}:
    #         right = self.parse_Rn()
    #         left = ASTNode('gamma', [left, right])
    #     return left

    # def parse_Rn(self):
    #     token = self.peek()
    #     if token.type == TokenType.IDENTIFIER:
    #         return ASTNode(f"<ID:{self.advance().value}>")
    #     elif token.type == TokenType.INTEGER:
    #         return ASTNode(f"<INT:{self.advance().value}>")
    #     elif token.type == TokenType.STRING:
    #         return ASTNode(f"<STR:{self.advance().value}>")
    #     elif token.value in {'true', 'false', 'nil', 'dummy'}:
    #         return ASTNode(self.advance().value)
    #     elif token.value == '(':
    #         self.advance()
    #         e = self.parse_E()
    #         self.expect(TokenType.SYMBOL)  # should be ')'
    #         return e
    #     else:
    #         raise SyntaxError(f"Unexpected token in Rn: {token}")


    def parse_Vb(self):
        token = self.peek()

        if token.type == TokenType.IDENTIFIER:
            return ASTNode(f"<ID:{self.advance().value}>")

        elif token.value == '(':
            self.advance()
            if self.peek().value == ')':
                self.advance()
                return ASTNode('()')

            vl_node = self.parse_Vl()
            self.expect(TokenType.SYMBOL)  # expect ')'
            return vl_node

        else:
            raise SyntaxError(f"Invalid Vb at token: {token}")
        
    def parse_Vl(self):
        nodes = []

        token = self.expect(TokenType.IDENTIFIER)
        nodes.append(ASTNode(f"<ID:{token.value}>"))

        while self.peek().value == ',':
            self.advance()
            token = self.expect(TokenType.IDENTIFIER)
            nodes.append(ASTNode(f"<ID:{token.value}>"))

        if len(nodes) == 1:
            return nodes[0]
        else:
            return ASTNode(',', nodes)

