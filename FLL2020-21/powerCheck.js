let powerCheck = false;

control.runInParallel(() => {
    while (!powerCheck) {
        if (brick.batteryLevel() < 5) {
            powerCheck = true;
        } else {
            pause(5000);
        }
    }
})

while (!powerCheck) {
    motors.largeBC.tank(20, 20, 5, MoveUnit.Seconds)
    motors.largeBC.steer(15, 20, 6, MoveUnit.Rotations)
    motors.largeBC.tank(40, 40, 5, MoveUnit.Seconds)
    motors.largeBC.steer(-10, 20, 3, MoveUnit.Rotations)
}
motors.stopAll()