let targetAngle = 90
let turnPoint = 3
// position definitions
let LEFT = 1
let RIGHT = 2
let MIDDLE = 3
//
// current sensor readings
let gyroValue = 0
//
// turn right
let turnRatio = 200
// turn left
if (targetAngle < 0) {
    turnRatio = -200
}
//
let turnAngle = Math.abs(targetAngle)
// reset gyro sensor
//sensors.gyro2.reset()
//loops.pause(100)
//
let keepLooping = true
while (keepLooping) {
    // get value from gyro sensor
    gyroValue = Math.abs(sensors.gyro2.angle())
    // exit
    if (gyroValue >= turnAngle) {
        keepLooping = false
    }
    // calculate power
    let currentPower = 0.6 * (turnAngle - gyroValue) + 6
    //
    if (turnPoint == MIDDLE) {
        motors.largeBC.steer(turnRatio, currentPower)
        //brick.showNumber(MIDDLE, 1)
    } else if (turnPoint == LEFT) {
        if (targetAngle > 0) {
            motors.largeB.run(currentPower)
        } else {
            motors.largeB.run(0 - currentPower)
        }
        //brick.showNumber(LEFT, 1)
    } else if (turnPoint == RIGHT) {
        if (targetAngle > 0) {
            motors.largeC.run(currentPower)
        } else {
            motors.largeC.run(0 - currentPower)
        }
        //brick.showNumber(RIGHT, 1)
    }
    // display
    brick.showString("Gyro: ", 2)
    brick.showNumber(gyroValue, 3)
    brick.showString("Power: ", 5)
    brick.showNumber(currentPower, 6)
}
motors.largeBC.setBrake(true)
motors.largeBC.stop()
