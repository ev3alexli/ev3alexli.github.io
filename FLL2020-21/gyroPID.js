let distance = 50
let power = 100
let wheelDiameter = 6.88
let colourBreak = 0
//

let turn = 0
let keepLooping = true
let disRotation = 0
let currentPower = 0
let currentRotation = 0
//
disRotation = distance / (3.14 * wheelDiameter)
//
motors.largeBC.reset()
//
if (power > 0) {
    motors.largeBC.run(20)
} else {
    motors.largeBC.run(-20)
}
loops.pause(200)
//
sensors.gyro2.reset()
// First loop
keepLooping = true
while (keepLooping) {
    if (power > 0) {
        turn = sensors.gyro2.angle() * 2
    } else {
        turn = sensors.gyro2.angle() * -2
    }
    motors.largeBC.steer(turn, power)
    // check color break
    if (colourBreak == 1) {
        if (sensors.color1.reflectedLight() < 20) {
            motors.largeBC.run(power / 3, 80, MoveUnit.Degrees)
            keepLooping = false
        }
    } else if (colourBreak == 3) {
        if (sensors.color3.reflectedLight() < 20) {
            motors.largeBC.run(power / 3, 80, MoveUnit.Degrees)
            keepLooping = false
        }
    }
    currentRotation = (Math.abs(motors.largeB.angle()) + Math.abs(motors.largeB.angle())) / 720
    if (currentRotation >= disRotation - 0.5) {
        keepLooping = false
    }
}
// second loop
keepLooping = true
while (keepLooping) {
    currentRotation = (Math.abs(motors.largeB.angle()) + Math.abs(motors.largeB.angle())) / 720
    if (currentRotation >= disRotation) {
        keepLooping = false
    }
    currentPower = power / (5.01 - (disRotation - currentRotation) * 10 ) + 5
    turn = sensors.gyro2.angle() * 2
    motors.largeBC.steer(turn, currentPower)

}