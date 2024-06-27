# coding: utf-8
import nfc
import RPi.GPIO as GPIO
import binascii
import time
from threading import Thread, Timer
from evdev import InputDevice
from select import select
from keymap import keys
import requests

#登録済みタグ のIDm
Register_IDm = "012e48c23c8a414b"

# 待ち受けの1サイクル秒
TIME_cycle = 10.0
# 待ち受けの反応インターバル秒
TIME_interval = 0.2
# タッチされてから次の待ち受けを開始するまで無効化する秒
TIME_wait = 3

#ソレノイドロックをつなぐピンのGPIO(BCM番号)
Solenoid = 18

# NFC接続リクエストのための準備
# 212F(FeliCa)で設定
target_req_felica = nfc.clf.RemoteTarget("212F")

# 106A(NFC type A)で設定   
target_req_nfc = nfc.clf.RemoteTarget("106A")

#入力するキーボードの設定(キーボードを変更するたびに変更)
DEVICE = "/dev/input/by-id/usb-SEM_USB_Keyboard-event-kbd"
dev = InputDevice(DEVICE)

#ソレノイドロックをつなぐピンのGPIOをOUTMODEに
GPIO.setmode(GPIO.BCM)
GPIO.setup(Solenoid, GPIO.OUT)

#サーバのURL
url = "http://example.com/"

def server_get():
    r = request.get(url)
    print(r.text)
    
def server_put():
    p = request.put(url, data)
    print(p.text)
        
def solenoid_control():
    #SolenoidのピンをON
    GPIO.output(Solenoid, True)
    print ("開錠")
    time.sleep(5.0)         #5秒間維持
    #SolenoidのピンをOFF
    GPIO.output(Solenoid, False)
    print ("施錠")
    time.sleep(1.0)         #1秒間維持
    GPIO.cleanup

def check_FeliCa():
    print  ('FeliCa waiting...')
    # USBに接続されたNFCリーダに接続してインスタンス化
    clf = nfc.ContactlessFrontend('usb')
    # clf.sense( [リモートターゲット], [検索回数], [検索の間隔] )
    target_res = clf.sense(target_req_felica, iterations=int(TIME_cycle//TIME_interval)+1 , interval=TIME_interval)
    if not target_res is None:
        tag = nfc.tag.activate(clf, target_res)

        #IDmを取り出す
        idm = binascii.hexlify(tag.idm)
        print ('FeliCa detected. idm = ' + idm.decode())
	
        #特定のIDmだった場合
        if idm.decode() == Register_IDm:
            print('登録済み')
            solenoid_control()

        #sleepなしでは次の読み込みが始まって終了する
        print ('sleep ' + str(TIME_wait) + ' seconds')
        time.sleep(TIME_wait)

    clf.close()

while (True):
    if (r.text in 'True'):
        check_FeliCa()
        r, w, x = select([dev], [], [])       #テンキーの"ENTER"を押すと終了
        for event in dev.read():
            if event.type==1 and event.value==1:
                if event.code in keys:
                    if(event.code == 96): #"ENTER"
                        print("終了します")
                        exit()
                    else:
                        pass
                                                                                                                            
