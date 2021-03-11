use wasm_bindgen::prelude::*;
use web_sys::console;
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
    lookup: HashMap<FixedBitSet, bool>,
}

#[wasm_bindgen]
impl Universe {
    pub fn new(width: u32, height: u32) -> Universe {
        // if width % 2 != 0 || height % 2 != 0 {
        //     panic!("Unacceptable game height or width");
        // }

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
                                            let mut key = FixedBitSet::with_capacity(9);

                                            key.set(0, one == 1);
                                            key.set(1, two == 1);
                                            key.set(2, three == 1);
                                            key.set(3, four == 1);
                                            key.set(4, five == 1);
                                            key.set(5, six == 1);
                                            key.set(6, seven == 1);
                                            key.set(7, eight == 1);
                                            key.set(8, nine == 1);

                                            let count = one
                                                + two
                                                + three
                                                + four
                                                + six
                                                + seven
                                                + eight
                                                + nine;

                                            lookup.insert(
                                                key,
                                                match (five == 1, count) {
                                                    (true, x) if x < 2 => false,
                                                    (true, 2) | (true, 3) => true,
                                                    (true, x) if x > 3 => false,
                                                    (false, 3) => true,
                                                    (otherwise, _) => otherwise,
                                                },
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

        let string = format!("{:?}", lookup);
        let array = js_sys::Array::new();
        array.push(&string.into());
        web_sys::console::log(&array);

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
        let mut neighbours = FixedBitSet::with_capacity(9);

        let north = if row == 0 { self.height - 1 } else { row - 1 };
        let south = if row == self.height - 1 { 0 } else { row + 1 };
        let west = if col == 0 { self.width - 1 } else { col - 1 };
        let east = if col == self.width - 1 { 0 } else { col + 1 };

        //  Above
        neighbours.set(0, self.cells[self.get_index(north, west)]);
        neighbours.set(1, self.cells[self.get_index(north, col)]);
        neighbours.set(2, self.cells[self.get_index(north, east)]);

        //  My row
        neighbours.set(3, self.cells[self.get_index(row, west)]);
        neighbours.set(4, self.cells[self.get_index(row, col)]);
        neighbours.set(5, self.cells[self.get_index(row, east)]);

        //  My col
        neighbours.set(6, self.cells[self.get_index(south, west)]);
        neighbours.set(7, self.cells[self.get_index(south, col)]);
        neighbours.set(8, self.cells[self.get_index(south, east)]);

        return neighbours;
    }

    pub fn tick(&mut self) {
        for row in (0..self.height).step_by(5) {
            for col in (0..self.width).step_by(5) {
                let idx = self.get_index(row, col);
                let key = self.scan_area(row, col);

                let value = self.lookup.get(&key);
                self.shadow_cells.set(idx + 0, *value.unwrap());
                self.shadow_cells.set(idx + 1, *value.unwrap());
                self.shadow_cells.set(idx + 2, *value.unwrap());
                self.shadow_cells.set(idx + 3, *value.unwrap());
                self.shadow_cells.set(idx + 4, *value.unwrap());
            }
        }

        self.cells = self.shadow_cells.clone();
    }
}
