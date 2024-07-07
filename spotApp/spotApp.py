import flet as ft

def main(page: ft.Page):
    #------
    #ページ設定
    #------
    page.title = "ME-Bike GUI"
    page.window_width = 1024
    page.window_height = 600
    page.window_minimizable = False
    page.window_maximizable = False
    page.window_resizable = False
    page.window_full_screen = True
    page.window_always_on_top = True
    page.window_skip_task_bar = False
    #フォント
    page.fonts={
        "BIZ UDPGothic": "BIZUDPGothic-Regular.ttf"
    }
    #AppBar(上部バナー)
    page.appbar = ft.AppBar(
        leading=ft.Icon(ft.icons.PEDAL_BIKE_SHARP),
        leading_width=40,
        title=ft.Text("ME-Bike Station"),
        center_title= False,
        bgcolor=ft.colors.SURFACE_VARIANT
    )


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
                    ft.Text(
                        "ME-Bikeへようこそ",
                        size=50,
                        weight=ft.FontWeight.W_900,
                        color=ft.colors.BLACK,
                        selectable=False,
                        font_family="BIZ UPDGothic"
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
                        ft.Text(
                            "ME-Bikeへようこそ",
                            size=50,
                            weight=ft.FontWeight.W_900,
                            color=ft.colors.BLACK,
                            selectable=False,
                            font_family="BIZ UPDGothic"
                        )
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