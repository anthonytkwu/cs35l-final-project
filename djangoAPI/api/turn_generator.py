import random

def is_valid(board, row, col, num, n):
    # Check if the number is not repeated in the current row and column
    for i in range(n):
        if board[row][i] == num or board[i][col] == num:
            return False
    return True

def fill_board(board, n):
    for i in range(n):
        for j in range(n):
            if board[i][j] == 0:
                numbers = list(range(1, n + 1))
                random.shuffle(numbers)
                for num in numbers:
                    if is_valid(board, i, j, num, n):
                        board[i][j] = num
                        if fill_board(board, n):
                            return True
                        board[i][j] = 0
                return False
    return True

def generate_sudoku(n):
    board = [[0 for _ in range(n)] for _ in range(n)]
    fill_board(board, n)
    return board

# Generate and print the Sudoku board
def print_sudoku(board):
    for row in board:
        print(row)

# Example usage:
n = 9  # Change this value for different grid sizes
sudoku_board = generate_sudoku(n)
print_sudoku(sudoku_board)