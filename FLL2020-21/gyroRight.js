sensors.gyro2.reset()
let targetAngle = 90
let power = 30
let gyroAngle = 0
if (targetAngle > 50) {
    targetAngle = targetAngle - 3
} else {
    targetAngle = targetAngle
}
let keepLooping = true
while (keepLooping) {
    gyroAngle = sensors.gyro2.angle()
    if (targetAngle <= Math.abs(gyroAngle)) {
        keepLooping = false
    }
    if (targetAngle - Math.abs(gyroAngle) <= 30) {
        power = 10
    } else {
        power = 30
    }
    motors.largeBC.steer(200, power)
    brick.showValue("targetAngle = ", targetAngle, 1)
    brick.showValue("gyroAngle = ", gyroAngle, 5)
}
brick.showString("end now get out trash", 8)
motors.largeBC.setBrake(true)
motors.largeBC.stop()