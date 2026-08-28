# -*- coding: utf-8 -*-
"""
Travel PWA App 圖示生成器（Pillow）
用法：python scripts/gen_icons.py
產出：
  icons/icon-192.png         192x192  (purpose: any)
  icons/icon-512.png         512x512  (purpose: any)
  icons/icon-512-maskable.png 512x512  (purpose: maskable，圖案縮至安全區)
  icons/apple-touch-icon.png 180x180  (iOS 主畫面，系統自動圓角)

設計：竹綠漸層背景 + 白色地圖釘 + 柿橙太陽與山巒（濟州島・自駕意象）
"""
from PIL import Image, ImageDraw, ImageFilter

SIZE = 512
TOP = (143, 160, 127)      # #8fa07f 竹綠（亮）
BOTTOM = (74, 90, 64)      # #4a5a40 深竹綠
WHITE = (255, 255, 255, 255)
SUN = (232, 163, 94)       # #e8a35e 柿橙
HILL_BACK = (219, 231, 210)   # #dbe7d2
HILL_FRONT = (196, 214, 180)  # #c4d6b4


def vgradient(size, top, bottom):
    """垂直漸層背景"""
    grad = Image.new('RGB', (1, size))
    d = ImageDraw.Draw(grad)
    for y in range(size):
        t = y / (size - 1)
        d.line([(0, y), (0, y)], fill=(
            round(top[0] + (bottom[0] - top[0]) * t),
            round(top[1] + (bottom[1] - top[1]) * t),
            round(top[2] + (bottom[2] - top[2]) * t),
        ))
    return grad.resize((size, size))


def draw_pin(ad, cx, cy, r, tip):
    """白色地圖釘（圓頂 + 尖端），座標以 512 畫布為準"""
    ad.polygon([(cx - r, cy), (cx, tip), (cx + r, cy)], fill=WHITE)
    ad.ellipse([cx - r, cy - r, cx + r, cy + r], fill=WHITE)


def compose(scale=1.0):
    """scale < 1 供 maskable 縮圖至安全區"""
    base = Image.new('RGBA', (SIZE, SIZE))
    base.paste(vgradient(SIZE, TOP, BOTTOM), (0, 0))

    art = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    ad = ImageDraw.Draw(art)

    # 背景氣泡點綴（半透明白）
    for x, y, rr, a in [(118, 92, 9, 70), (398, 128, 13, 60), (430, 62, 6, 80)]:
        ad.ellipse([x - rr, y - rr, x + rr, y + rr], fill=(255, 255, 255, a))

    # 地圖釘
    draw_pin(ad, 256, 200, 175, 484)

    # 釘內圖案：後山 → 前山 → 太陽
    ad.polygon([(118, 300), (205, 192), (292, 300)], fill=HILL_BACK + (255,))
    ad.polygon([(172, 306), (258, 228), (344, 306)], fill=HILL_FRONT + (255,))
    # 蜿蜒小路（前山腳下 → 釘尖方向）
    ad.line([(256, 320), (238, 342), (256, 362), (246, 380)], fill=(255, 255, 255, 185), width=9, joint='curve')
    # 太陽與高光
    ad.ellipse([176, 118, 236, 178], fill=SUN + (255,))
    ad.ellipse([188, 131, 206, 149], fill=(246, 204, 155, 255))

    # 釘子尖端陰影
    shadow = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).ellipse([178, 486, 334, 508], fill=(28, 38, 24, 95))
    art.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(7)))

    if scale != 1.0:
        art = art.resize((int(SIZE * scale), int(SIZE * scale)), Image.LANCZOS)
        base.paste(art, ((SIZE - art.width) // 2, (SIZE - art.height) // 2), art)
    else:
        base.alpha_composite(art)
    return base.convert('RGB')


if __name__ == '__main__':
    import os
    out = os.path.join(os.path.dirname(__file__), '..', 'icons')
    os.makedirs(out, exist_ok=True)

    compose(1.0).save(os.path.join(out, 'icon-512.png'))
    compose(1.0).resize((192, 192), Image.LANCZOS).save(os.path.join(out, 'icon-192.png'))
    compose(0.78).save(os.path.join(out, 'icon-512-maskable.png'))
    compose(1.0).resize((180, 180), Image.LANCZOS).save(os.path.join(out, 'apple-touch-icon.png'))
    print('Icons generated →', out)
