import argparse
from Parser.Parser import Parser
from Lexical_Analyzer.lexical_analyzer import tokenize
from AST.Ast import ASTFactory
from CSE_Machine.CSE_Machine import CSEMachineFactory

def main():
    parser = argparse.ArgumentParser(description='Process some RPAL files.')
    parser.add_argument('file_name', type=str, help='The RPAL program input file')
    parser.add_argument('-ast', action='store_true', help='Print the abstract syntax tree')
    parser.add_argument('-sast', action='store_true', help='Print the standardized abstract syntax tree')
    args = parser.parse_args()

    with open(args.file_name, "r") as input_file:
        input_text = input_file.read()
    
    tokens = tokenize(input_text)

    try:
        parser = Parser(tokens)
        ast_nodes = parser.parse()
        if ast_nodes is None:
            return
        
        string_ast = parser.convert_ast_to_string_ast()
        if args.ast:
            for string in string_ast:
                print(string)
            return
        
        ast_factory = ASTFactory()
        ast = ast_factory.get_abstract_syntax_tree(string_ast)
        ast.standardize()
        if args.sast:
            ast.print_ast()
            return
        
        cse_machine_factory = CSEMachineFactory()
        cse_machine = cse_machine_factory.get_cse_machine(ast)
        print("Output of the above program is:")
        print(cse_machine.get_answer())

    except Exception as e:
        print(e)

if __name__ == "__main__":
    main()
