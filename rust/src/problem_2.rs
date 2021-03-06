// Each new term in the Fibonacci sequence is generated by adding the previous two terms. By starting with 1 and 2, the first 10 terms will be:
// 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...
// By considering the terms in the Fibonacci sequence whose values do not exceed four million, find the sum of the even-valued terms.

pub fn main() {
    let mut previous = 0;
    let mut current = 1;

    let mut values = vec![];

    loop {
        let hold = current;
        current += previous;
        previous = hold;
        values.push(current);

        if current > 4000000 {
            values.pop();
            let sum: i32 = values.iter().filter(|it| *it % 2 == 0).sum();
            println!("{}", sum);
            break;
        }
    }
}
