import flet as ft


def main(page: ft.Page):
    page.title = "ME-Bike GUI"
    page.window_width = 1024
    page.window_height = 600
    page.window_minimizable = False
    page.window_maximizable = False
    page.window_resizable = False
    page.window_full_screen = True
    page.window_top = 1000  # 位置(TOP)
    page.window_left = 10000  # 位置(LEFT)
    page.window_always_on_top = True
    page.window_skip_task_bar = False #本番環境ではTrueにする

    text = ft.Text(
        "Welcome to ME-Bike GUI",
        size=50,
        weight=ft.FontWeight.W_900,
        color=ft.colors.BLACK,
        selectable=False
    )
    page.add(text)
    page.update()


ft.app(target=main)