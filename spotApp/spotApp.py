import flet as ft


def main(page: ft.Page):
    page.title = "ME-Bike GUI"
    page.window_width = 1024
    page.window_height = 600
    page.window_minimizable = False
    page.window_maximizable = False
    page.window_resizable = False
    page.window_full_screen = True
    page.window_always_on_top = True
    page.window_skip_task_bar = False

    page.fonts={
        "BIZ UDPGothic": "BIZUDPGothic-Regular.ttf"
    }

    page.appbar = ft.AppBar(
        leading=ft.Icon(ft.icons.PEDAL_BIKE_SHARP),
        leading_width=40,
        title=ft.Text("ME-Bike Station"),
        center_title= False,
        bgcolor=ft.colors.SURFACE_VARIANT
    )

    text = ft.Text(
        "Welcome to ME-Bike GUIようこそ1fl",
        size=50,
        weight=ft.FontWeight.W_900,
        color=ft.colors.BLACK,
        selectable=False,
        font_family="BIZ UDPGothic"
    )
    page.add(text)
    page.update()


ft.app(target=main)