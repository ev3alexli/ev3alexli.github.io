////////////////////////////////////////////
// color sensor 0:black, 100:white
////////////////////////////////////////////
//
// 1. get input parameters
let stopCondition = 3   // 0 stop on black line with another color sensor
let stopValue = 720  // stop when the stop color sensor got color less than stopValue
let power = -80 // default is -80, because out robot is backwards
let wheelDiameter = 7 // will only be used in DISTANCE_STOP
//
////////////////////////////////////////////
// init
////////////////////////////////////////////
//
// 3. ports definitions
let LEFT_COLOR_SENSOR = 1
let RIGHT_COLOR_SENSOR = 3
let MIDDLE_COLOR_SENSOR = 4
let GYRO_SENSOR = 2
//
////////////////////////////////////////////
// 6. stop conditions     // |value
let BLACK_LINE_STOP_1 = 10  // |black 
let BLACK_LINE_STOP_3 = 30
let DISTANCE_STOP = 1     // |centimeters
let ROTATION_STOP = 2     // |rotations
let DEGREE_STOP = 3       // |degrees
let TIMER_STOP = 4        // |miliseconds
//
////////////////////////////////////////////
// start
////////////////////////////////////////////
// 7. reset
motors.largeBC.reset()
control.timer1.reset()
//
// 10. define turn
let turn = 0
//
// current sensor readings
let gyroValue = 0
let stopColorValue = 0
//
// 11. setup PID parameters
automation.pid1.setGains(3, 3, 0)
//
// 12. loop for moving the robot
let keepLooping = true
while (keepLooping) {
    // check stop input
    if (stopCondition == BLACK_LINE_STOP_1 || stopCondition == BLACK_LINE_STOP_3) {
        // get color from stop color sensor
        let stopColorSensor = sensors.color1
        if (stopCondition == BLACK_LINE_STOP_3) {
            stopColorSensor = sensors.color3
        }
        stopColorValue = stopColorSensor.light(LightIntensityMode.Reflected)
        if (stopColorValue < stopValue) {
            keepLooping = false
        }
    } else if (stopCondition == DISTANCE_STOP) {
        let pastDistance = motors.largeB.angle() / 360 * 3.14 * wheelDiameter
        pastDistance = Math.abs(pastDistance)
        // brick.showString("Current Distance:", 10)
        // brick.showNumber(pastDistance, 11) 
        if (pastDistance >= stopValue) {
            keepLooping = false
        }
    } else if (stopCondition == ROTATION_STOP) {
        let pastRotation = motors.largeB.angle() / 360
        pastRotation = Math.abs(pastRotation)
        // brick.showString("Current Distance:", 10)
        // brick.showNumber(pastDistance, 11) 
        if (pastRotation >= stopValue) {
            keepLooping = false
        }
    } else if (stopCondition == DEGREE_STOP) {
        let pastDegree = motors.largeB.angle()
        pastDegree = Math.abs(pastDegree)
        if (pastDegree >= stopValue) {
            keepLooping = false
        }
    } else if (stopCondition == TIMER_STOP) {
        if (control.timer1.millis() >= stopValue) {
            keepLooping = false
        }
    }
    //
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

// set break after stop
motors.largeBC.setBrake(true)

// stop
motors.largeBC.stop()

// clear screen
brick.clearScreen()
//brick.exitProgram()