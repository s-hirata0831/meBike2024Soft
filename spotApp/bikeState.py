from pygame import mixer
import time

def music_play():
    mixer.init()
    mixer.music.load("spotApp/notBike.mp3")
    mixer.music.play(loops=7)
    while mixer.music.get_busy():
        time.sleep(0.1)

music_play()

idm = "01010312f41c442a"