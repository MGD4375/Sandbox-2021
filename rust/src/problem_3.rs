use std::time::Instant;

// The prime factors of 13195 are 5, 7, 13 and 29.
// What is the largest prime factor of the number 600851475143 ?

pub fn main() {
    let now = Instant::now();

    let input: f64 = 600851475143.0;

    //  we need to use a small trick. Any factor less than the square root of the number we check, will have corresponding factor larger than the square root of the number.
    //  So we only need to check up to the square root of the number.
    let answer = (2..((input.sqrt()) as i64))
        .rev()
        .find(|it| (input / *it as f64).fract() == 0.0 && is_prime(*it));

    let elapsed = now.elapsed();
    println!("Problem 3 solved in: {:?}", elapsed);
    println!("{:?}", answer);
}

fn is_prime(n: i64) -> bool {
    if n == 2 || n == 3 {
        return true;
    } else if n <= 1 || (n % 2) == 0 || (n % 3) == 0 {
        return false;
    }

    let mut i: i64 = 5;
    while i.pow(2) <= n {
        if (n % i) == (0) || (n % (i + 2)) == (0) {
            return false;
        }
        i += 6;
    }
    return true;
}
