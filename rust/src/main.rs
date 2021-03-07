mod game_of_life;
mod problem_1;
mod problem_2;
mod problem_22;
mod problem_3;
mod problem_4;
mod problem_96;

fn main() {
    println!("Conway's Game of Life");
    game_of_life::main();
    println!("\n\n\n");

    println!("Problem 1");
    problem_1::main();
    println!("\n\n\n");

    println!("Problem 2");
    problem_2::main();
    println!("\n\n\n");

    println!("Problem 3");
    problem_3::main();
    println!("\n\n\n");

    println!("Problem 4");
    problem_4::main();
    println!("\n\n\n");

    println!("Problem 22");
    problem_22::main();
    println!("\n\n\n");

    println!("Problem 96");
    problem_96::main();
    println!("\n\n\n");
}
