let count = 0
count = 2
if (count > 0) {
    for (let i = 0; i < count; i++) {
        control.runInParallel(function () {
            motors.largeB.run(16)
            sensors.color1.pauseUntilColorDetected(ColorSensorColor.Black)
        })
        motors.largeC.run(16)
        sensors.color3.pauseUntilColorDetected(ColorSensorColor.Black)
        pause(10)
        motors.largeBC.steer(0, -16, 40, MoveUnit.Degrees)
    }
}
