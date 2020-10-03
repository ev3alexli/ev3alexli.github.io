////////////////////////////////////////////
// color sensor 0:black, 100:white
////////////////////////////////////////////
//
// 1. get input parameters
let movingSide    = 11  // 11 left color sensor moving along left side of black line 12, 31, 32
let stopCondition = 1   // 0 stop on black line with another color sensor
let stopValue     = 50  // stop when the stop color sensor got color less than stopValue
let power         = -80 // default is -80, because out robot is backwards
let wheelDiameter = 7 // will only be used in DISTANCE_STOP
//
////////////////////////////////////////////
// init
////////////////////////////////////////////
// 2. middle value of two colors black and white, 
//    if side=LEFT turn=currentLight-50, 
//    other turn=50-currentLight for direction
let MIDDLE_VALUE_OF_TWO_COLOR = 50
//
// 3. ports definitions
let LEFT_COLOR_SENSOR = 1
let RIGHT_COLOR_SENSOR = 3
let MIDDLE_COLOR_SENSOR = 4
let GYRO_SENSOR = 2
//
////////////////////////////////////////////
// 4. position definitions
let LEFT = 1
let RIGHT = 2
let MIDDLE = 3
//
//////////////////////
// 5. moving along sides
let LEFT_COLOR_SENSOR_ON_LEFT_SIDE = 11
let LEFT_COLOR_SENSOR_ON_RIGHT_SIDE = 12
let RIGHT_COLOR_SENSOR_ON_LEFT_SIDE = 31
let RIGHT_COLOR_SENSOR_ON_RIGHT_SIDE = 32
//
////////////////////////////////////////////
// 6. stop conditions     // |value
let BLACK_LINE_STOP = 0   // |black
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
// 8. checking color sensor
let moveColorSensor = sensors.color1
let moveColorSensorId = LEFT_COLOR_SENSOR
let stopColorSensor = sensors.color3
let stopColorSensorId = RIGHT_COLOR_SENSOR
// check input parameter movingSide, get moving color sensor, and stop color sensor
if (Math.floor(movingSide / 10) == RIGHT_COLOR_SENSOR) {
    stopColorSensorId = LEFT_COLOR_SENSOR
    moveColorSensor = sensors.color3
    moveColorSensorId = RIGHT_COLOR_SENSOR
    stopColorSensor = sensors.color1
}
//
// 9. check input parameter movingSide, get moving side
let side = LEFT
if (movingSide % 10 == RIGHT) {
    side = RIGHT
}
//
// 10. define turn
let turn = 0
//
// current color sensor light
let movingColorValue = 0
let stopColorValue = 0
//
// 11. setup PID parameters
automation.pid1.setGains(0.5, 0.3, 0.0002)
//
// 12. loop for moving the robot
let keepLooping = true
while (keepLooping) {
    // check stop input
    if ( stopCondition == BLACK_LINE_STOP ) {
        // get color from stop color sensor
        stopColorValue = stopColorSensor.light(LightIntensityMode.Reflected)
        if( stopColorValue < stopValue ){
            keepLooping = false
        }
    } else if ( stopCondition == DISTANCE_STOP ) {
        let pastDistance = motors.largeB.angle() / 360 * 3.14 * wheelDiameter
        pastDistance = Math.abs(pastDistance)
        // brick.showString("Current Distance:", 10)
        // brick.showNumber(pastDistance, 11) 
        if (pastDistance >= stopValue) {
            keepLooping = false
        }
    } else if ( stopCondition == ROTATION_STOP ) {
        let pastRotation = motors.largeB.angle() / 360
        pastRotation = Math.abs(pastRotation)
        // brick.showString("Current Distance:", 10)
        // brick.showNumber(pastDistance, 11) 
        if (pastRotation >= stopValue) {
            keepLooping = false
        }
    } else if ( stopCondition ==DEGREE_STOP ) {
        let pastDegree = motors.largeB.angle()
        pastDegree = Math.abs(pastDegree)
        if (pastDegree >= stopValue) {
            keepLooping = false
        }
    } else if ( stopCondition == TIMER_STOP ) {
        if (control.timer1.millis() >= stopValue) {
            keepLooping = false
        }
    }
    //
    // get color from moving color sensor
    movingColorValue = moveColorSensor.light(LightIntensityMode.Reflected)
    //
    // turn calculation
    turn = automation.pid1.compute(0.1, MIDDLE_VALUE_OF_TWO_COLOR - movingColorValue )
    if (side == LEFT) {
        turn = turn * (-1)
    }
    //
    // assign to move steering
    motors.largeBC.steer(turn, power)
    //
    // display information
    brick.showString("Moving Color Value:", 3)
    brick.showNumber(movingColorValue, 4)
    brick.showString("turn Value:", 6)
    brick.showNumber(turn, 7)
    brick.showString("Stop Color Value:", 8)
    brick.showNumber(stopColorValue, 9)    
}

// set break after stop
motors.largeBC.setBrake(true)

// stop
motors.largeBC.stop()

// clear screen
brick.clearScreen()
//brick.exitProgram()