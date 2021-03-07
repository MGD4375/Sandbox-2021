use rand::Rng;

pub fn main() {
    let mut rng = rand::thread_rng();
    let row_length = 60;
    let col_length = 60;
    let mut board = Board {
        col_length: col_length,
        row_length: row_length,
        value: vec![false; col_length * row_length],
    };

    for row_index in 0..(row_length) {
        for col_index in 0..(col_length) {
            if rng.gen_range(0..10) > 8 {
                board.set(row_index, col_index, true)
            }
        }
    }

    board.set(1, 0, true);
    board.set(1, 1, true);
    board.set(1, 2, true);

    let mut count = 0;
    loop {
        board = board.tick();

        let mut output = String::default();
        for row_index in 0..(row_length) {
            for col_index in 0..(col_length) {
                if *board.get(row_index, col_index) {
                    output.push('X');
                } else {
                    output.push(' ');
                }
            }
            output.push('\n');
        }
        println!("{}", output);
        count += 1;
        if count > 100 {
            break;
        };
    }
}

#[derive(Debug)]
struct Board {
    col_length: usize,
    row_length: usize,
    value: Vec<bool>,
}
impl Board {
    fn get(&self, row_index: usize, col_index: usize) -> &bool {
        return &self.value[(row_index * self.col_length) + col_index];
    }
    fn set(&mut self, row_index: usize, col_index: usize, value: bool) {
        if row_index > self.row_length || col_index > self.col_length {
            panic!(
                "Out of range exception for index: {},{}",
                row_index, col_index
            );
        }
        self.value[(row_index * self.col_length) + col_index] = value;
    }

    fn tick(self) -> Board {
        let mut shadow_board = Board {
            col_length: self.col_length,
            row_length: self.row_length,
            value: vec![false; self.col_length * self.row_length],
        };

        for row_index in 0..(self.row_length) {
            for col_index in 0..(self.col_length) {
                let neighbour_count = vec![
                    (row_index as i32 - 1, col_index as i32 - 1),
                    (row_index as i32 - 1, col_index as i32 - 0),
                    (row_index as i32 - 1, col_index as i32 + 1),
                    (row_index as i32 - 0, col_index as i32 - 1),
                    (row_index as i32 - 0, col_index as i32 + 1),
                    (row_index as i32 + 1, col_index as i32 - 1),
                    (row_index as i32 + 1, col_index as i32 - 0),
                    (row_index as i32 + 1, col_index as i32 + 1),
                ]
                .iter()
                .filter(|pos| {
                    return pos.0 >= 0
                        && pos.1 >= 0
                        && pos.0 < self.row_length as i32
                        && pos.1 < self.col_length as i32;
                })
                .map(|pos| {
                    return self.get(pos.0 as usize, pos.1 as usize);
                })
                .filter(|&it| *it == true)
                .count();

                match neighbour_count {
                    0..=1 => shadow_board.set(row_index, col_index, false),
                    2 => shadow_board.set(
                        row_index,
                        col_index,
                        self.get(row_index, col_index).clone(),
                    ),
                    3 => shadow_board.set(row_index, col_index, true),
                    4..=8 => shadow_board.set(row_index, col_index, false),
                    _ => panic!("Impossible number of neighbours"),
                }
            }
        }
        return shadow_board;
    }
}
