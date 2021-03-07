// A palindromic number reads the same both ways. The largest palindrome made from the product of two 2-digit numbers is 9009 = 91 × 99.
// Find the largest palindrome made from the product of two 3-digit numbers.

pub fn main() {
    let mut candidates = vec![];
    for i in (900..=999).rev() {
        for j in (900..=999).rev() {
            candidates.push(i * j);
        }
    }

    candidates.sort();
    let answer = candidates.iter().rev().find(|it| {
        let word = it.to_string();
        let reverse = word.chars().rev().collect::<String>();
        return word == reverse;
    });

    println!("{:?}", answer);
}
