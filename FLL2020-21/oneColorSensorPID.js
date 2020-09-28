let turn = 0
let colorValue = 0
let power = -80

control.timer1.reset()
// pid init
automation.pid1.setGains(0.5, 0.3, 0.0005)
//
while (true) {
    // only run for a while
    if (control.timer1.seconds() >= 4) {
        break;
    }
    // get color from color sensor
    colorValue = sensors.color1.light(LightIntensityMode.Reflected)
    // calculate turn pid 
    turn = automation.pid1.compute(0.1, colorValue - 50)
    // assign to moving steering
    motors.largeBC.steer(turn, power)
    // display
    brick.showString("Color Value-:", 2)
    brick.showNumber(colorValue, 3)
    brick.showString("turn Value:", 5)
    brick.showNumber(turn, 6)
}
brick.clearScreen()
