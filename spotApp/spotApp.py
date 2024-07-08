import flet as ft
import datetime

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
            page.views.append(
                ft.View(
                    "/01_token",
                    [
                        page.appbar,
                        ft.Row([
                        ft.ElevatedButton(
                            content=ft.Text(
                                value="back",
                                font_family="BIZ UDPGothic"
                            ),
                            on_click=open_00_top,
                        )
                        ],alignment=ft.MainAxisAlignment.END),
                        ft.Row([
                            ft.Text(
                                "トークンを入力",
                                size=60,
                                weight=ft.FontWeight.W_900,
                                color=ft.colors.BLACK,
                                selectable=False,
                                font_family="BIZ UDPGothic"
                            )
                        ], alignment=ft.MainAxisAlignment.START),
                    ],
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