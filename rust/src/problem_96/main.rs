use std::fs;

// Su Doku (Japanese meaning number place) is the name given to a popular puzzle concept. Its origin is unclear, but credit must be attributed to Leonhard Euler who invented a similar, and much more difficult, puzzle idea called Latin Squares. The objective of Su Doku puzzles, however, is to replace the blanks (or zeros) in a 9 by 9 grid in such that each row, column, and 3 by 3 box contains each of the digits 1 to 9. Below is an example of a typical starting puzzle grid and its solution grid.
// p096_1.png     p096_2.png
// A well constructed Su Doku puzzle has a unique solution and can be solved by logic, although it may be necessary to employ "guess and test" methods in order to eliminate options (there is much contested opinion over this). The complexity of the search determines the difficulty of the puzzle; the example above is considered easy because it can be solved by straight forward direct deduction.
// The 6K text file, sudoku.txt (right click and 'Save Link/Target As...'), contains fifty different Su Doku puzzles ranging in difficulty, but all with unique solutions (the first puzzle in the file is the example above).
// By solving all fifty puzzles find the sum of the 3-digit numbers found in the top left corner of each solution grid; for example, 483 is the 3-digit number found in the top left corner of the solution grid above.

pub fn main() {
    let mut games = vec![];
    fs::read_to_string("C:\\GitHub\\Sandbox-2021\\rust\\src\\problem_96\\sudoku.txt")
        .expect("Something went wrong reading the file")
        .split("\n")
        .for_each(|line| {
            if line.contains("Grid") {
                games.push(vec![]);
            } else {
                let index = games.len() - 1;
                let cells = line
                    .chars()
                    .filter(|cell| *cell != '\r')
                    .map(|cell| cell.to_string().parse::<i8>().unwrap())
                    .collect::<Vec<i8>>();
                games[index].push(cells);
            }
        });

    let mut games = games
        .iter()
        .map(|it| SuDoku { value: it.clone() })
        .collect::<Vec<SuDoku>>();

    let mut solutions = vec![];

    for game in &mut games {
        match solve(game) {
            Ok(result) => {
                solutions.push(result);
                println!("Sudoku solved: {}", solutions.len());
            }
            Err(message) => println!("Failed to Solve: {}", message),
        }
    }

    let values: i32 = solutions
        .iter()
        .map(|solution| {
            let a = solution.get(&Index { row: 0, col: 0 });
            let b = solution.get(&Index { row: 0, col: 1 });
            let c = solution.get(&Index { row: 0, col: 2 });
            let mut st = String::default();
            st.push_str(&a.to_string());
            st.push_str(&b.to_string());
            st.push_str(&c.to_string());
            let value = st.parse::<i32>().unwrap();
            return value;
        })
        .sum();

    println!("{}", values);
}

fn solve(sudoku: &mut SuDoku) -> Result<&SuDoku, String> {
    match sudoku.get_next_cell() {
        None => return Ok(sudoku),
        Some(index) => {
            for num in 1..=9 {
                if sudoku.is_valid_move(&index, num) {
                    sudoku.set(&index, num);
                    let foo = solve(sudoku);
                    if foo.is_ok() {
                        return Ok(sudoku);
                    } else {
                        sudoku.set(&index, 0);
                    }
                }
            }

            return Err("Solve hit a dead end.".to_string());
        }
    }
}

#[derive(Debug, Clone)]
struct SuDoku {
    value: Vec<Vec<i8>>,
}

impl SuDoku {
    fn get(&self, index: &Index) -> i8 {
        return self.value[index.row][index.col];
    }

    fn set(&mut self, index: &Index, value: i8) {
        self.value[index.row][index.col] = value;
    }

    fn get_next_cell(&self) -> Option<Index> {
        for row_index in 0..=8 {
            for col_index in 0..=8 {
                let index = Index {
                    row: row_index,
                    col: col_index,
                };
                if self.get(&index) == 0 {
                    return Some(index);
                }
            }
        }
        return None;
    }

    fn is_valid_move(&self, index: &Index, value: i8) -> bool {
        if self.get_col(index.col).iter().any(|it| *it == value)
            || self.get_row(index.row).iter().any(|it| *it == value)
            || self.get_area(&index).iter().any(|it| *it == value)
        {
            return false;
        };

        return true;
    }

    fn get_area(&self, index: &Index) -> Vec<i8> {
        let x_index: usize = index.row / 3 * 3;
        let y_index: usize = index.col / 3 * 3;

        let mut area = vec![];
        for x in 0..3 {
            for y in 0..3 {
                area.push(self.value[x_index + x][y_index + y])
            }
        }

        return area;
    }

    fn get_row(&self, row_index: usize) -> Vec<i8> {
        return self.value[row_index].clone();
    }

    fn get_col(&self, col_index: usize) -> Vec<i8> {
        return self
            .value
            .iter()
            .map(|row| row[col_index])
            .collect::<Vec<i8>>();
    }
}

#[derive(Debug)]
struct Index {
    row: usize,
    col: usize,
}
