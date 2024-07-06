import flet as ft


def main(page: ft.Page):
    page.title = "ME-Bike GUI"
    page.window_width = 1024
    page.window_height = 600
    page.window_minimizable = False
    page.window_maximizable = False
    page.window_resizable = False
    #page.window_top = 0  # 位置(TOP)
    #page.window_left = 0  # 位置(LEFT)
    page.window_always_on_top = True
    page.window_skip_task_bar = True #本番環境ではTrueにする

    text = ft.Text(
        "ME-Bike GUIへようこそ！",
        size=50,
        weight=ft.FontWeight.W_900,
        color=ft.colors.BLACK,
        selectable=False
    )   

    page.update()
    page.add(text)


ft.app(target=main)