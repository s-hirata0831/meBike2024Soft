# -*- coding: utf-8 -*-
import cv2

def main():
    # ウェブカメラを起動
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open video device.")
        return

    # 初期化のために複数フレームを読み込む
    for i in range(10):
        ret, img = cap.read()

    # ウェブカメラを解放
    cap.release()

    if not ret:
        print("Error: Could not read frame.")
        return

    # カスケード型識別器の読み込み
    cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

    if cascade.empty():
        print("Error: Could not load cascade classifier.")
        return

    # グレースケール変換
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 顔領域の探索
    faces = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(30, 30))

    # 顔領域を赤色の矩形で囲む
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 255), 4)

    # 結果を出力
    output_path = "spotApp/result.jpg"
    cv2.imwrite(output_path, img)
    print(f"Result saved as '{output_path}'")

if __name__ == '__main__':
    main()
