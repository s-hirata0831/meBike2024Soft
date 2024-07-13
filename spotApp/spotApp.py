import flet as ft
import datetime
import random as rnd
import os
import firebase_admin
from firebase_admin import firestore
from firebase_admin import credentials

#------
#Firebase初期設定
#------
#Firebaseを初期化
cred = credentials.Certificate('meBike.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Web APIキー
api_key = os.environ.get('API_KEY')
 
# プロジェクトID
project_id = os.environ.get('PROJECT_ID')

#FirebaseのドキュメントIDを指定
city_ref = db.collection("token").document("nitMaizuruCollege")

#------
#画面出力
#------
def main(page: ft.Page):
    #------
    #ページ設定
    #------
    page.title = "ME-Bike GUI"
    page.window_max_width = 1920
    page.window_max_height = 1080
    page.window_minimizable =False
    page.window_maximizable = True
    page.window_resizable = True
    page.window_full_screen = True
    page.window_always_on_top = True
    page.window_skip_task_bar = True
    page.bgcolor=ft.colors.WHITE
    #フォント
    page.fonts={
        "BIZ UDPGothic": "BIZUDPGothic-Regular.ttf"
    }
    #AppBar(上部バナー)
    page.appbar = ft.AppBar(
        leading=ft.Icon(ft.icons.PEDAL_BIKE_SHARP),
        leading_width=80,
        title=ft.Text("ME-Bike Station"),
        center_title= False,
        bgcolor=ft.colors.SURFACE_VARIANT
    )

    #------
    #現在時刻取得
    #------
    now = datetime.datetime.now()


    #------
    #画面表示
    #------
    def route_change(e):
        #ページのクリア
        page.views.clear()
        
        #トップページ
        page.views.append(
            ft.View(
                "/",
                [
                    page.appbar,
                    ft.Container(ft.Column([
                        ft.Row([
                            ft.Text(
                                "ME-Bike 舞鶴高専ステーション",
                                size=120,
                                color=ft.colors.BLACK,
                                selectable=False,
                                font_family="BIZ UDPGothic"
                            ),
                        ],alignment=ft.MainAxisAlignment.CENTER),
                        ft.Row([
                            ft.Text(
                                "QRコードを読み取って利用開始",
                                size=50,
                                color=ft.colors.BLACK,
                                selectable=False,
                                font_family="BIZ UDPGothic"
                            )
                        ], alignment=ft.MainAxisAlignment.CENTER),
                        ft.Row([
                            ft.Image(
                                src=f"ME-Bike.jpg",
                                width=500,
                                height=500,
                                fit=ft.ImageFit.CONTAIN
                            ),
                            ft.Image(
                                src=f"qr.png",
                                width=500,
                                height=500,
                                fit=ft.ImageFit.CONTAIN
                            )
                        ],spacing=20,alignment=ft.MainAxisAlignment.CENTER),
                        ft.Row([
                            ft.Text(
                                '最近の利用: '+str(now),
                                size=40,
                                color=ft.colors.BLACK,
                                selectable=False,
                                font_family="BIZ UDPGothic"
                            )
                        ],alignment=ft.MainAxisAlignment.CENTER, vertical_alignment=ft.CrossAxisAlignment.END),
                        ft.Row([
                            ft.ElevatedButton(
                                content=ft.Text(
                                    value="利用開始",
                                    size=60,
                                    font_family="BIZ UDPGothic"
                                ),
                                on_click=open_01_token
                            )
                        ],alignment=ft.MainAxisAlignment.CENTER)
                    ],),
                    margin=10,
                    padding=10,
                    )
                ],
            )
        )

        #トークン入力画面
        if page.route == "/01_token":
            #トークンを生成
            random = rnd.randint(100000,999999)
            city_ref.update({"token_f": random})
            page.views.append(
                ft.View(
                    "/01_token",
                    [
                        page.appbar,
                        ft.Row(
                            [ft.ElevatedButton(
                                content=ft.Text(
                                    "back",
                                    size=40,
                                    font_family="BIZ UDPGothic"
                                ),
                                on_click=open_00_top,
                            )],
                            alignment=ft.MainAxisAlignment.END
                        ),
                        ft.Column([
                            ft.Column([
                                ft.Text(
                                    "トークンを入力",
                                    size=60,
                                    weight=ft.FontWeight.W_900,
                                    color=ft.colors.BLACK,
                                    selectable=False,
                                    font_family="BIZ UDPGothic"
                                ),
                                ft.Text(
                                    "Webアプリ上に以下の数字を入力してください。",
                                    size=50,
                                    weight=ft.FontWeight.W_900,
                                    color=ft.colors.BLACK,
                                    selectable=False,
                                    font_family="BIZ UDPGothic"
                                ),
                                ft.Text(
                                    "入力できたら次へ進む",
                                    size=50,
                                    weight=ft.FontWeight.W_900,
                                    color=ft.colors.BLACK,
                                    selectable=False,
                                    font_family="BIZ UDPGothic"
                                )
                            ],horizontal_alignment=ft.CrossAxisAlignment.START),
                            ft.Column([
                                ft.Text(
                                    random,
                                    size=120,
                                    weight=ft.FontWeight.W_900,
                                    color=ft.colors.BLACK,
                                    selectable=False,
                                    font_family="BIZ UDPGothic"
                                )
                            ],horizontal_alignment=ft.CrossAxisAlignment.CENTER)
                        ],alignment=ft.MainAxisAlignment.END)
                    ]
                )
            )
        
        #ページ更新
        page.update()


    #------
    #画面遷移
    #------
    #現在のページを削除して前のページに戻る
    def view_pop(e):
        page.views.pop()
        top_view = page.views[-1]
        page.go(top_view.route)

    #TOPページへ戻る
    def open_00_top(e):
        page.views.pop()
        top_view = page.views[0]
        page.go(top_view.route)

    #01_tokenへ移動
    def open_01_token(e):
        page.go("/01_token")

    #------
    #イベントの登録
    #------
    page.on_route_change = route_change
    page.on_view_pop = view_pop

    #------
    #起動時の処理
    #------
    page.go(page.route)

ft.app(target=main)