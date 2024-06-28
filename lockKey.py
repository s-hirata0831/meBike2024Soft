# coding: utf-8
import RPi.GPIO as GPIO
import time
import nfc
import binascii
import time

 # 待ち受けの1サイクル秒
TIME_cycle = 10.0
# 待ち受けの反応インターバル秒
TIME_interval = 0.2
# タッチされてから次の待ち受けを開始するまで無効化する秒
TIME_wait = 3

# NFC接続リクエストのための準備
# 212F(FeliCa)で設定
target_req_felica = nfc.clf.RemoteTarget("212F")

# 106A(NFC type A)で設定
target_req_nfc = nfc.clf.RemoteTarget("106A")

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
        if idm.decode() == "012e48c23c8a414b":
            print('登録済み')

        #sleepなしでは次の読み込みが始まって終了する
        print ('sleep ' + str(TIME_wait) + ' seconds')
        time.sleep(TIME_wait)

    clf.close()
    
check_FeliCa()
