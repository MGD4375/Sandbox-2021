use wasm_bindgen::prelude::*;
extern crate fixedbitset;
use fixedbitset::FixedBitSet;
extern crate web_sys;
use std::collections::HashMap;

#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    Ok(())
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: FixedBitSet,
    shadow_cells: FixedBitSet,
    lookup: HashMap<FixedBitSet, FixedBitSet>,
}

#[wasm_bindgen]
impl Universe {
    pub fn new(width: u32, height: u32) -> Universe {
        if width % 2 != 0 || height % 2 != 0 {
            panic!("Unacceptable game height or width");
        }

        let size = (width * height) as usize;
        let mut cells = FixedBitSet::with_capacity(size);
        for i in 0..size {
            cells.set(i, js_sys::Math::random() < 0.5);
        }

        let mut lookup = HashMap::new();

        for one in 0..=1 {
            for two in 0..=1 {
                for three in 0..=1 {
                    for four in 0..=1 {
                        for five in 0..=1 {
                            for six in 0..=1 {
                                for seven in 0..=1 {
                                    for eight in 0..=1 {
                                        for nine in 0..=1 {
                                            for ten in 0..=1 {
                                                for eleven in 0..=1 {
                                                    for twelve in 0..=1 {
                                                        for thirteen in 0..=1 {
                                                            for fourteen in 0..=1 {
                                                                for fifteen in 0..=1 {
                                                                    for sixteen in 0..=1 {
                                                                        let mut key = FixedBitSet::with_capacity(16);

                                                                        key.set(0, one == 1);
                                                                        key.set(1, two == 1);
                                                                        key.set(2, three == 1);
                                                                        key.set(3, four == 1);
                                                                        key.set(4, five == 1);
                                                                        key.set(5, six == 1);
                                                                        key.set(6, seven == 1);
                                                                        key.set(7, eight == 1);
                                                                        key.set(8, nine == 1);
                                                                        key.set(9, ten == 1);
                                                                        key.set(10, eleven == 1);
                                                                        key.set(11, twelve == 1);
                                                                        key.set(12, thirteen == 1);
                                                                        key.set(13, fourteen == 1);
                                                                        key.set(14, fifteen == 1);
                                                                        key.set(15, sixteen == 1);

                                                                        //  Four positions can be changed by a measurement of 16.
                                                                        //  numbers go around in a clockwise direction from top left, 0, 1, 2, 3
                                                                        let mut return_set = FixedBitSet::with_capacity(4);
                                                                        let nw_count = one
                                                                            + two
                                                                            + three
                                                                            + five
                                                                            + seven
                                                                            + nine
                                                                            + ten
                                                                            + eleven;

                                                                        let ne_count = two
                                                                            + three
                                                                            + four
                                                                            + six
                                                                            + eight
                                                                            + ten
                                                                            + eleven
                                                                            + twelve;

                                                                        let sw_count = five
                                                                            + six
                                                                            + seven
                                                                            + nine
                                                                            + eleven
                                                                            + thirteen
                                                                            + fourteen
                                                                            + fifteen;

                                                                        let se_count = six
                                                                            + seven
                                                                            + eight
                                                                            + ten
                                                                            + twelve
                                                                            + fourteen
                                                                            + fifteen
                                                                            + sixteen;

                                                                        return_set.set(
                                                                            0,
                                                                            match (
                                                                                six == 1,
                                                                                nw_count,
                                                                            ) {
                                                                                (true, x)
                                                                                    if x < 2 =>
                                                                                {
                                                                                    false
                                                                                }
                                                                                (true, 2)
                                                                                | (true, 3) => true,
                                                                                (true, x)
                                                                                    if x > 3 =>
                                                                                {
                                                                                    false
                                                                                }
                                                                                (false, 3) => true,
                                                                                (otherwise, _) => {
                                                                                    otherwise
                                                                                }
                                                                            },
                                                                        );

                                                                        return_set.set(
                                                                            1,
                                                                            match (
                                                                                seven == 1,
                                                                                ne_count,
                                                                            ) {
                                                                                (true, x)
                                                                                    if x < 2 =>
                                                                                {
                                                                                    false
                                                                                }
                                                                                (true, 2)
                                                                                | (true, 3) => true,
                                                                                (true, x)
                                                                                    if x > 3 =>
                                                                                {
                                                                                    false
                                                                                }
                                                                                (false, 3) => true,
                                                                                (otherwise, _) => {
                                                                                    otherwise
                                                                                }
                                                                            },
                                                                        );

                                                                        return_set.set(
                                                                            2,
                                                                            match (
                                                                                ten == 1,
                                                                                sw_count,
                                                                            ) {
                                                                                (true, x)
                                                                                    if x < 2 =>
                                                                                {
                                                                                    false
                                                                                }
                                                                                (true, 2)
                                                                                | (true, 3) => true,
                                                                                (true, x)
                                                                                    if x > 3 =>
                                                                                {
                                                                                    false
                                                                                }
                                                                                (false, 3) => true,
                                                                                (otherwise, _) => {
                                                                                    otherwise
                                                                                }
                                                                            },
                                                                        );

                                                                        return_set.set(
                                                                            3,
                                                                            match (
                                                                                eleven == 1,
                                                                                se_count,
                                                                            ) {
                                                                                (true, x)
                                                                                    if x < 2 =>
                                                                                {
                                                                                    false
                                                                                }
                                                                                (true, 2)
                                                                                | (true, 3) => true,
                                                                                (true, x)
                                                                                    if x > 3 =>
                                                                                {
                                                                                    false
                                                                                }
                                                                                (false, 3) => true,
                                                                                (otherwise, _) => {
                                                                                    otherwise
                                                                                }
                                                                            },
                                                                        );

                                                                        lookup.insert(
                                                                            key, return_set,
                                                                        );
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        let shadow_cells = cells.clone();
        Universe {
            width,
            height,
            cells,
            shadow_cells,
            lookup,
        }
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn cells(&self) -> *const u32 {
        self.cells.as_slice().as_ptr()
    }

    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    fn scan_area(&self, row: u32, col: u32) -> FixedBitSet {
        let mut neighbours = FixedBitSet::with_capacity(16);

        let row1 = if row == 0 { self.height - 1 } else { row - 1 };
        let row2 = row;
        let row3 = row + 1;
        let row4 = if row + 1 == self.height - 1 {
            0
        } else {
            row + 2
        };
        let col1 = if col == 0 { self.width - 1 } else { col - 1 };
        let col2 = col;
        let col3 = col + 1;
        let col4 = if col + 1 == self.width - 1 {
            0
        } else {
            col + 2
        };

        //  Row 1
        neighbours.set(0, self.cells[self.get_index(row1, col1)]);
        neighbours.set(1, self.cells[self.get_index(row1, col2)]);
        neighbours.set(2, self.cells[self.get_index(row1, col3)]);
        neighbours.set(3, self.cells[self.get_index(row1, col4)]);

        //  Row 2
        neighbours.set(4, self.cells[self.get_index(row2, col1)]);
        neighbours.set(5, self.cells[self.get_index(row2, col2)]);
        neighbours.set(6, self.cells[self.get_index(row2, col3)]);
        neighbours.set(7, self.cells[self.get_index(row2, col4)]);

        //  Row 3
        neighbours.set(8, self.cells[self.get_index(row3, col1)]);
        neighbours.set(9, self.cells[self.get_index(row3, col2)]);
        neighbours.set(10, self.cells[self.get_index(row3, col3)]);
        neighbours.set(11, self.cells[self.get_index(row3, col4)]);

        //  Row 4
        neighbours.set(12, self.cells[self.get_index(row4, col1)]);
        neighbours.set(13, self.cells[self.get_index(row4, col2)]);
        neighbours.set(14, self.cells[self.get_index(row4, col3)]);
        neighbours.set(15, self.cells[self.get_index(row4, col4)]);

        return neighbours;
    }

    pub fn tick(&mut self) {
        for row in (0..self.height).step_by(2) {
            for col in (0..self.width).step_by(2) {
                let key = self.scan_area(row, col);

                let value = self.lookup.get(&key);

                match value {
                    Some(input) => {
                        let ne_i = self.get_index(row, col);
                        let nw_i = self.get_index(row, col + 1);
                        let se_i = self.get_index(row + 1, col);
                        let sw_i = self.get_index(row + 1, col + 1);
                        self.shadow_cells.set(ne_i + 0, input[0]);
                        self.shadow_cells.set(nw_i + 0, input[1]);
                        self.shadow_cells.set(se_i + 0, input[2]);
                        self.shadow_cells.set(sw_i + 0, input[3]);
                    }
                    None => panic!("There was no value to be looked up"),
                }
            }
        }

        self.cells = self.shadow_cells.clone();
    }
}
