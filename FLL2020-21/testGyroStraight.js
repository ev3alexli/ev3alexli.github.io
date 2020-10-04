let turn = 0
let gyroValue = 0
let power = -80

control.timer1.reset()
// pid init
// automation.pid1.setGains(0.5, 0.3, 0.0002)
automation.pid1.setGains(3, 3, 0)
//sensors.gyro2.reset()
//
while (true) {
    // only run for a while
    if (control.timer1.seconds() >= 4) {
        break;
    }
    // get value from gyro sensor
    gyroValue = sensors.gyro2.angle()
    // calculate turn pid 
    turn = automation.pid1.compute(0.1, 0 - gyroValue)
    // assign to moving steering
    motors.largeBC.steer(turn, power)
    // display
    brick.showString("Gyro Value-:", 2)
    brick.showNumber(gyroValue, 3)
    brick.showString("turn--:", 5)
    brick.showNumber(turn, 6)
}
motors.largeBC.stop()
brick.showString("-----DONE!-----", 10)