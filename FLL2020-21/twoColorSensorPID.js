let test = 0
control.timer1.reset()
automation.pid1.setGains(0.125, 0.0525, 0.0525)
while (true) {
    if (control.timer1.seconds() >= 60) {
        break;
    }
    test = automation.pid1.compute(0.0001, sensors.color4.light(LightIntensityMode.Reflected) - sensors.color3.light(LightIntensityMode.Reflected))
    motors.largeBC.steer(test, 50)
    brick.showNumber(test, 6)
}
brick.clearScreen()
forever(function () {
    brick.exitProgram()
})