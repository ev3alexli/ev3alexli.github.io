let targetAngle = 0
let currentPower = 0
let keepLooping = false
sensors.gyro2.reset()
loops.pause(100)
keepLooping = true
while (keepLooping) {
    if (sensors.gyro2.angle() <= targetAngle * -1) {
        keepLooping = false
    }
    currentPower = 0.6 * (sensors.gyro2.angle() + targetAngle) + 6
    motors.largeBC.steer(200, currentPower)
}
motors.largeBC.setBrake(true)
motors.largeBC.stop()
