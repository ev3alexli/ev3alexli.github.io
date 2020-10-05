let count = 0
count = 2
motors.largeB.setBrake(true)
motors.largeC.setBrake(true)
for (let i = 0; i < count; i++) {
    let colorBlack1 = false
    let colorBlack2 = false
    control.runInParallel(function () {
        motors.largeB.run(-16)
    })
    control.runInParallel(function () {
        motors.largeC.run(-16)
    })
    while (true) {
        if (sensors.color1.light(LightIntensityMode.Reflected) <= 15) {
            brick.showString("motorC", 1)
            if (colorBlack2) {
                pause(10)
            }
            motors.largeC.stop()
            colorBlack1 = true
        }
        if (sensors.color3.light(LightIntensityMode.Reflected) <= 15) {
            brick.showString("motorB", 2)
            if (colorBlack1) {
                pause(10)
            }
            motors.largeB.stop()
            colorBlack2 = true
        }
        if (colorBlack1 && colorBlack2) {
            colorBlack1 = false
            colorBlack2 = false
            motors.largeBC.steer(0, 16, 40, MoveUnit.Degrees)
            break;
        }
        pause(50)
    }

}
