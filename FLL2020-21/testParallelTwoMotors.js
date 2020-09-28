let ONE_SECONT = 1000
let TWO_SECOND = 2000
control.runInParallel(function () {
    motors.largeB.run(50)
})
pause(ONE_SECONT)
motors.mediumA.run(50)
pause(TWO_SECOND*2)
motors.largeB.stop()
motors.mediumA.stop()
