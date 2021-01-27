const STICKY_THRESHOLD = 0.004
export default function resolveElastic(aBody, bBody) {
    // Find the mid points of the bBody and aBody
    var aMidX = aBody.getMidX();
    var aMidY = aBody.getMidY();
    var bMidX = bBody.getMidX();
    var bMidY = bBody.getMidY();

    // To find the side of entry calculate based on
    // the normalized sides

    //  N.B The original code here didn't make much sense to me.
    //  In order to normalize a value we divide it by it's magnitude, for example a length of 5, normalized to 1 would be 5/5.
    var dx = (bMidX - aMidX) / ((aBody.halfWidth + bBody.halfWidth) / 2);
    var dy = (bMidY - aMidY) / ((aBody.halfHeight + bBody.halfHeight) / 2);

    // Calculate the absolute change in x and y
    var absDX = Math.abs(dx);
    var absDY = Math.abs(dy);

    // If the distance between the normalized x and y
    // position is less than a small threshold (.1 in this case)
    // then this object is approaching from a corner
    if (Math.abs(absDX - absDY) < .1) {
        // If the aBody is approaching from positive X
        if (dx < 0) {

            // Set the aBody x to the right side
            aBody.x = bBody.getRight();

            // If the aBody is approaching from negative X
        } else {

            // Set the aBody x to the left side
            aBody.x = bBody.getLeft() - aBody.width;
        }

        // If the aBody is approaching from positive Y
        if (dy < 0) {

            // Set the aBody y to the bottom
            aBody.y = bBody.getBottom();

            // If the aBody is approaching from negative Y
        } else {

            // Set the aBody y to the top
            aBody.y = bBody.getTop() - aBody.height;
        }

        //  Randomly select a x/y direction to reflect velocity on
        //  If you hit diagonally, always correct horizontally, this is a forgiving way of doing it.
        if (Math.random() < 0) {

            // Reflect the velocity at a reduced rate
            aBody.xVelocity = -aBody.xVelocity * bBody.restitution;

            // If the object's velocity is nearing 0, set it to 0
            // STICKY_THRESHOLD is set to .0004
            if (Math.abs(aBody.xVelocity) < STICKY_THRESHOLD) {
                aBody.xVelocity = 0;
            }
        } else {

            aBody.yVelocity = -aBody.yVelocity * bBody.restitution;
            if (Math.abs(aBody.yVelocity) < STICKY_THRESHOLD) {
                aBody.yVelocity = 0;
            }
        }

        // If the object is approaching from the sides
    } else if (absDX > absDY) {


        // If the aBody is approaching from positive X
        if (dx < 0) {
            aBody.x = bBody.getRight();

        } else {
            // If the aBody is approaching from negative X
            aBody.x = bBody.getLeft() - aBody.width;
        }

        // Velocity component
        aBody.xVelocity = -aBody.xVelocity * bBody.restitution;
        aBody.yVelocity /= 1.2


        if (Math.abs(aBody.xVelocity) < STICKY_THRESHOLD) {
            aBody.xVelocity = 0;
        }

        // If this collision is coming from the top or bottom more
    } else {

        // If the aBody is approaching from positive Y
        if (dy < 0) {
            aBody.y = bBody.getBottom();

        } else {
            // If the aBody is approaching from negative Y
            aBody.y = bBody.getTop() - aBody.height;
        }

        // Velocity component
        aBody.yVelocity = -aBody.yVelocity * bBody.restitution;
        aBody.xVelocity /= 1.2

        if (Math.abs(aBody.yVelocity) < STICKY_THRESHOLD) {
            aBody.yVelocity = 0;
        }
    }
};