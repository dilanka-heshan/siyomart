class ASTNode:
    def __init__(self, label, children=None):
        self.label = label
        self.children = children if children else []

    def add_child(self, node):
        self.children.append(node)

    def print_ast(self, level=0):
        print("." * level + self.label)
        for child in self.children:
            child.print_ast(level + 1)
