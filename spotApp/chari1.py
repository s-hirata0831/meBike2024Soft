# coding: utf-8
import nfc
import RPi.GPIO as GPIO
import binascii
import time
import requests
import json
import asyncio

#登録済みタグ のIDm
Register_IDm = "012e48c23c8a414b"

# 待ち受けの1サイクル秒(FeliCa)
TIME_cycle = 10.0
# 待ち受けの反応インターバル秒(FeliCa)
TIME_interval = 0.2
# 次の待ち受けを開始するまで無効化する秒(FeliCa & server)
TIME_wait = 3

#ソレノイドロックをつなぐピンのGPIO(BCM番号)
Solenoid = 18

# NFC接続リクエストのための準備
# 212F(FeliCa)で設定
target_req_felica = nfc.clf.RemoteTarget("212F")

# 106A(NFC type A)で設定   
target_req_nfc = nfc.clf.RemoteTarget("106A")

#ソレノイドロックをつなぐピンのGPIOをOUTMODEに
GPIO.setmode(GPIO.BCM)
GPIO.setup(Solenoid, GPIO.OUT)

#サーバのURL
url = "http://example.com/"

#ソレノイドロック動作
def solenoid_control():
    #ソレノイドの状態(ON)を送信
    data = ["id": "1", "key": "true"]
    p = request.post(url, data)
    print(p.text)
    #SolenoidのピンをON
    GPIO.output(Solenoid, True)
    print ("開錠")
    time.sleep(5.0)         #5秒間維持
    #SolenoidのピンをOFF
    GPIO.output(Solenoid, False)
    print ("施錠")
    time.sleep(1.0)         #1秒間維持
    #ソレノイドの状態(OFF)を送信
    data = ["id": "1", "key": "false"]
    p = request.post(url, data)
    print(p.text)
    GPIO.cleanup

async def check_FeliCa():
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
            
        #ソレノイドの状態を受信
        r1 = request.get(url)
        data1 = json.loads(r1.text)
        print(data1["Solenoid"])
            
        #ソレノイドがOFFだった場合
        if data1["Solenoid"] == 'false':
            #ソレノイドロックを動作
            solenoid_control()
        else:
            print('ソレノイド動作中')

        #sleepなしでは次の読み込みが始まって終了する
        print ('sleep ' + str(TIME_wait) + ' seconds')
        time.sleep(TIME_wait)

    clf.close()
    
async def server_receive():
    #サーバからの受信
    r2 = request.get(url)
    data2 = json.loads(r2.text)
    print(data2["Server"])
    
    #サーバからの受信が'true'だった場合
    if data2["Server"] == 'true' :
        #ソレノイドロックを動作
        solenoid_control()
        
    #sleepなしでは次の読み込みが始まって終了する
    print ('sleep ' + str(TIME_wait) + ' seconds')
    time.sleep(TIME_wait)

async def main():
    #並列して実行
    await asyncio.gather(check_FeliCa(), server_receive())

#イベントループを開始
asyncio.run(main())
