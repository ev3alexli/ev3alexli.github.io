let magic = 0
control.runInParallel(function () {
    for (let i = 0; i < 4; i++) {
        magic = Math.randomRange(1000, 5000)
        pause(450)
    }
})
for (let i = 0; i < 4; i++) {
    console.logValue("magic", magic)
    pause(500)
}
