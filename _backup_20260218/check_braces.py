
def check_balance(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    stack = []
    for i, line in enumerate(lines):
        for j, char in enumerate(line):
            if char in '{[(':
                stack.append((char, i + 1, j + 1))
            elif char in '}])':
                if not stack:
                    print(f"Error: Unmatched closing '{char}' at line {i+1} col {j+1}")
                    return
                last_char, last_line, last_col = stack.pop()
                if (last_char == '{' and char != '}') or \
                   (last_char == '[' and char != ']') or \
                   (last_char == '(' and char != ')'):
                     print(f"Error: Mismatched '{char}' at line {i+1} col {j+1} (matches '{last_char}' from line {last_line})")
                     return

    if stack:
        last_char, last_line, last_col = stack[-1]
        print(f"Error: Unmatched opening '{last_char}' at line {last_line} col {last_col}")
    else:
        print("Braces are balanced.")

check_balance('src/app/api/chat/route.ts')
