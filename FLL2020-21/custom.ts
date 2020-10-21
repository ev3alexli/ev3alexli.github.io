
/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.mindstorms.com/blocks/custom
 */

enum movingSideEnum {
    LonL = 11,
    LonR = 12,
    RonL = 31,
    RonR = 32
}

enum portEnum {
    LEFT_COLOR = 1,
    RIGHT_COLOR = 3,
    MIDDLE_COLOR = 4,
    GYRO_SENSOR = 2
}

enum positionEnum {
    LEFT = 1,
    RIGHT = 2,
    MIDDLE = 3
}

enum stopCondColorEnum {
    LINE_STOP = 0,   // |black
    DIS_STOP = 1,     // |cm
    ROT_STOP = 2,     // |rotation
    DEG_STOP = 3,       // |degree
    TIME_STOP = 4         // |second
}

enum stopCondGyroEnum {
    LINE_STOP_1 = 10,  // |black 
    LINE_STOP_3 = 30,
    DIS_STOP = 1,     // |cm
    ROT_STOP = 2,     // |rotation
    DEG_STOP = 3,       // |degree
    TIME_STOP = 4         // |second
}

/**
 * Custom blocks
 */
//% weight=100 color=#e01515 icon="枫"
namespace MapleRobot {
    /**
     * Moving along the black line and stopping with multiple conditions
     * @param movingSide Which side of moving, eg: 11
     * @param stopCondition Which condition of stopping, eg: 0
     * @param stopValue Which value of stopping, eg: 15
     * @param power Which power of robot running, eg: 80
     */
    //% block
    //% group="Color"
    export function colorMove(movingSide: movingSideEnum, stopCondition: stopCondColorEnum, stopValue: number, power: number): void {
        power = (-1) * Math.abs(power)
        ////////////////////////////////////////////
        // color sensor 0:black, 100:white
        ////////////////////////////////////////////
        //
        // 1. get input parameters
        // let movingSide = 11  // 11 left color sensor moving along left side of black line 12, 31, 32
        // let stopCondition = 1   // 0 stop on black line with another color sensor
        // let stopValue = 50  // stop when the stop color sensor got color less than stopValue
        // let power = -80 // default is -80, because out robot is backwards
        let wheelDiameter = 7 // will only be used in DIS_STOP
        //
        ////////////////////////////////////////////
        // init
        ////////////////////////////////////////////
        // 2. middle value of two colors black and white, 
        //    if side=LEFT turn=currentLight-50, 
        //    other turn=50-currentLight for direction
        let MIDDLE_VALUE_OF_TWO_COLOR = 50
        ////////////////////////////////////////////
        // start
        ////////////////////////////////////////////
        // 7. reset
        motors.largeBC.reset()
        control.timer1.reset()
        // 8. checking color sensor
        let moveColorSensor = sensors.color1
        let moveColorSensorId = portEnum.LEFT_COLOR
        let stopColorSensor = sensors.color3
        let stopColorSensorId = portEnum.RIGHT_COLOR
        // check input parameter movingSide, get moving color sensor, and stop color sensor
        if (Math.floor(movingSide / 10) == portEnum.RIGHT_COLOR) {
            stopColorSensorId = portEnum.LEFT_COLOR
            moveColorSensor = sensors.color3
            moveColorSensorId = portEnum.RIGHT_COLOR
            stopColorSensor = sensors.color1
        }
        //
        // 9. check input parameter movingSide, get moving side
        let side = positionEnum.LEFT
        if (movingSide % 10 == positionEnum.RIGHT) {
            side = positionEnum.RIGHT
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
            if (stopCondition == stopCondColorEnum.LINE_STOP) {
                // get color from stop color sensor
                stopColorValue = stopColorSensor.light(LightIntensityMode.Reflected)
                if (stopColorValue < stopValue) {
                    keepLooping = false
                }
            } else if (stopCondition == stopCondColorEnum.DIS_STOP) {
                let pastDistance = motors.largeB.angle() / 360 * 3.14 * wheelDiameter
                pastDistance = Math.abs(pastDistance)
                // brick.showString("Current Distance:", 10)
                // brick.showNumber(pastDistance, 11) 
                if (pastDistance >= stopValue) {
                    keepLooping = false
                }
            } else if (stopCondition == stopCondColorEnum.ROT_STOP) {
                let pastRotation = motors.largeB.angle() / 360
                pastRotation = Math.abs(pastRotation)
                // brick.showString("Current Distance:", 10)
                // brick.showNumber(pastDistance, 11) 
                if (pastRotation >= stopValue) {
                    keepLooping = false
                }
            } else if (stopCondition == stopCondColorEnum.DEG_STOP) {
                let pastDegree = motors.largeB.angle()
                pastDegree = Math.abs(pastDegree)
                if (pastDegree >= stopValue) {
                    keepLooping = false
                }
            } else if (stopCondition == stopCondColorEnum.TIME_STOP) {
                if (control.timer1.millis() >= stopValue) {
                    keepLooping = false
                }
            }
            //
            // get color from moving color sensor
            movingColorValue = moveColorSensor.light(LightIntensityMode.Reflected)
            //
            // turn calculation
            turn = automation.pid1.compute(0.1, MIDDLE_VALUE_OF_TWO_COLOR - movingColorValue)
            if (side == positionEnum.LEFT) {
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

    }

    /**
     * Moving with gyro sensor
     * @param movingSide Which side of moving, eg: 11
     * @param stopCondition Which condition of stopping, eg: 0
     * @param stopValue Which value of stopping, eg: 15
     * @param power Which power of robot running, eg: 80
     */
    //% block
    //% group="Gyro"
    export function gyroMove(stopCondition: stopCondGyroEnum, stopValue: number, power: number): void {
        power = (-1) * Math.abs(power)
        // 1. get input parameters
        // let stopCondition = 3   // 0 stop on black line with another color sensor
        // let stopValue = 720  // stop when the stop color sensor got color less than stopValue
        // let power = -80 // default is -80, because out robot is backwards
        let wheelDiameter = 7 // will only be used in DIS_STOP
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
            if (stopCondition == stopCondGyroEnum.LINE_STOP_1 || stopCondition == stopCondGyroEnum.LINE_STOP_3) {
                // get color from stop color sensor
                let stopColorSensor = sensors.color1
                if (stopCondition == stopCondGyroEnum.LINE_STOP_3) {
                    stopColorSensor = sensors.color3
                }
                stopColorValue = stopColorSensor.light(LightIntensityMode.Reflected)
                if (stopColorValue < stopValue) {
                    keepLooping = false
                }
            } else if (stopCondition == stopCondGyroEnum.DIS_STOP) {
                let pastDistance = motors.largeB.angle() / 360 * 3.14 * wheelDiameter
                pastDistance = Math.abs(pastDistance)
                // brick.showString("Current Distance:", 10)
                // brick.showNumber(pastDistance, 11) 
                if (pastDistance >= stopValue) {
                    keepLooping = false
                }
            } else if (stopCondition == stopCondGyroEnum.ROT_STOP) {
                let pastRotation = motors.largeB.angle() / 360
                pastRotation = Math.abs(pastRotation)
                // brick.showString("Current Distance:", 10)
                // brick.showNumber(pastDistance, 11) 
                if (pastRotation >= stopValue) {
                    keepLooping = false
                }
            } else if (stopCondition == stopCondGyroEnum.DEG_STOP) {
                let pastDegree = motors.largeB.angle()
                pastDegree = Math.abs(pastDegree)
                if (pastDegree >= stopValue) {
                    keepLooping = false
                }
            } else if (stopCondition == stopCondGyroEnum.TIME_STOP) {
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
    }

    /**
     * Turning wtih gyro sensor
     * @param targetAngle Angle of turning, eg: 90
     * @param turnPoint Pivot point setting, eg: 3
     */
    //% block
    //% group="Gyro"
    export function gyroTurn(targetAngle: number, turnPoint: positionEnum): void {
        // current sensor readings
        let gyroValue = 0
        //
        // turn right
        let turnRatio = 200
        // turn left
        if (targetAngle < 0) {
            turnRatio = -200
        }
        //
        let turnAngle = Math.abs(targetAngle)
        // reset gyro sensor
        //sensors.gyro2.reset()
        //loops.pause(100)
        //
        let keepLooping = true
        while (keepLooping) {
            // get value from gyro sensor
            gyroValue = Math.abs(sensors.gyro2.angle())
            // exit
            if (gyroValue >= turnAngle) {
                keepLooping = false
            }
            // calculate power
            let currentPower = 0.6 * (turnAngle - gyroValue) + 6
            //
            if (turnPoint == MIDDLE) {
                motors.largeBC.steer(turnRatio, currentPower)
                //brick.showNumber(MIDDLE, 1)
            } else if (turnPoint == LEFT) {
                if (targetAngle > 0) {
                    motors.largeB.run(currentPower)
                } else {
                    motors.largeB.run(0 - currentPower)
                }
                //brick.showNumber(LEFT, 1)
            } else if (turnPoint == RIGHT) {
                if (targetAngle > 0) {
                    motors.largeC.run(currentPower)
                } else {
                    motors.largeC.run(0 - currentPower)
                }
                //brick.showNumber(RIGHT, 1)
            }
            // display
            brick.showString("Gyro: ", 2)
            brick.showNumber(gyroValue, 3)
            brick.showString("Power: ", 5)
            brick.showNumber(currentPower, 6)
        }
        motors.largeBC.setBrake(true)
        motors.largeBC.stop()   
    }
    /**
     * Moving to black line
     * @param count Count of repetition, eg: 2
     */
    //% block
    //% group="Color"
    export function moveToBlack(count: number): void {
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
        
    }
    
    /**
     * Gyro distance with Acceleration and decceleration
     * @param distance Distance of movement, eg: 100
     */
    //% block
    //% group="Gyro"
    export function accelerationDistance(distance: number): void {
        let minSpeed = -10
        let turn = 0
        let power = 0
        let gyroValue = 0
        let keepLooping = true
        let wheelDiameter = 6.24
        let DYNAMIC_SPEED_ROTATION = 1.5
        let disRotation = distance / (3.14 * wheelDiameter)
        // setup PID parameters
        automation.pid1.setGains(3, 3, 0)
        // reset gyro
        //sensors.gyro2.reset()
        //sensors.gyro2.calibrate()
        // reset and start motor
        //motors.largeBC.reset()
        motors.largeBC.run(minSpeed)
        pause(100)
        // loop
        keepLooping = true
        while (keepLooping) {
            ////// current rotation
            let RofB = motors.largeB.angle() / 360
            RofB = Math.abs(RofB)
        
            ////// check condition, calculate power
            if (disRotation >= DYNAMIC_SPEED_ROTATION * 2) {
                // 1.1
                if (RofB <= DYNAMIC_SPEED_ROTATION) {
                    power = 100 * RofB / DYNAMIC_SPEED_ROTATION
                }
                // 1.2
                else if (RofB > disRotation - DYNAMIC_SPEED_ROTATION) {
                    power = 100 * (disRotation - RofB) / DYNAMIC_SPEED_ROTATION
                }
                // 1.3
                else {
                    power = 100
                }
            } else {
                // 2.1
                if (RofB < disRotation / 2) {
                    power = 100 * (RofB / (disRotation / 2))
                }
                // 2.2
                else {
                    power = 100 * (disRotation - RofB) / (disRotation / 2)
                }
            }
        
            ////// get value from gyro sensor
            gyroValue = sensors.gyro2.angle()
            // calculate turn pid 
            turn = automation.pid1.compute(0.1, 0 - gyroValue)
            // assign to moving steering
            motors.largeBC.steer(turn, 0 - Math.abs(power) + minSpeed)
        
            ////// check exit
            let pastDistance = motors.largeB.angle() / 360 * 3.14 * wheelDiameter
            pastDistance = Math.abs(pastDistance)
            if (pastDistance >= distance) {
                keepLooping = false
            }
        
            // display
            brick.showString("Gyro Value-:", 2)
            brick.showNumber(gyroValue, 3)
            brick.showString("turn-:", 5)
            brick.showNumber(turn, 6)
            brick.showString("RofB-:", 7)
            brick.showNumber(RofB, 8)
            brick.showString("Power-:", 9)
            brick.showNumber(power, 10)
        }
        
        // set break after stop
        motors.largeBC.setBrake(true)
        
        // stop
        motors.largeBC.stop()
    }
}
