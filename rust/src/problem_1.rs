// If we list all the natural numbers below 10 that are multiples of 3 or 5, we get 3, 5, 6 and 9. The sum of these multiples is 23.
// Find the sum of all the multiples of 3 or 5 below 1000.

pub fn main() {
    let max_3 = 999 / 3;
    let max_5 = 995 / 5;

    let mut multiples: Vec<i32> = (0..=max_3).map(|it| it * 3).collect();
    let mut multiples_of_5: Vec<i32> = (0..=max_5).map(|it| it * 5).collect();

    multiples.append(&mut multiples_of_5);
    multiples.sort();
    multiples.dedup();
    let sum = multiples.iter().sum::<i32>();

    println!("{}", sum);
}
