use std::fs;

// Using names.txt (right click and 'Save Link/Target As...'), a 46K text file containing over five-thousand first names, begin by sorting it into alphabetical order. Then working out the alphabetical value for each name, multiply this value by its alphabetical position in the list to obtain a name score.
// For example, when the list is sorted into alphabetical order, COLIN, which is worth 3 + 15 + 12 + 9 + 14 = 53, is the 938th name in the list. So, COLIN would obtain a score of 938 × 53 = 49714.
// What is the total of all the name scores in the file?

pub fn main() {
    let colin = score("COLIN", 938);
    println!("Problem 22 test case - COLIN: {}", colin);

    let mut names: Vec<String> =
        fs::read_to_string("C:\\GitHub\\Sandbox-2021\\rust\\src\\problem_22\\names.txt")
            .expect("Something went wrong reading the file")
            .replace("\"", "")
            .split(",")
            .map(|it| it.to_string()) //  I'd prefer not to work with a copy :(
            .collect::<Vec<String>>();

    names.sort();

    let answer: i64 = names
        .iter()
        .enumerate()
        .map(|(index, it)| score(it, index + 1))
        .sum();

    println!("{:?}", answer);
}

fn score(name: &str, index: usize) -> i64 {
    return name.chars().map(|ch| (ch as i64) - 64).sum::<i64>() * (index as i64);
}
