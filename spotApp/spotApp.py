import flet as ft


def main(page: ft.Page):
    page.title = "ME-Bike GUI"
    page.window_width = 1024
    page.window_height = 600
    page.window_minimizable = False
    page.window_maximizable = False
    page.window_resizable = False

    page.update()


ft.app(target=main)