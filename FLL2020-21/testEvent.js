control.onEvent(13, 0, function () {
    brick.setStatusLight(StatusLight.Red)
    music.playSoundEffect(sounds.communicationLego)
})
control.onEvent(13, 1, function () {
    brick.setStatusLight(StatusLight.Green)
    music.playSoundEffect(sounds.animalsDogBark1)
})
control.runInParallel(function () {
    for (let i = 0; i <= 20 - 1; i++) {
        pause(3000)
        control.raiseEvent(
        13,
        i % 2
        )
        console.logValue("mod", i % 2)
    }
})
