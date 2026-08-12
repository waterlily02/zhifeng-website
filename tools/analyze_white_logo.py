from PIL import Image
import numpy as np

img = Image.open("logo_white.jpg").convert("RGB")
arr = np.array(img)
h, w = arr.shape[:2]
r, g, b = arr[:,:,0].astype(int), arr[:,:,1].astype(int), arr[:,:,2].astype(int)
brightness = (r + g + b) / 3

orng = (r > 200) & (g > 100) & (g < 220) & (b < 120)
# 近白：非纯白且亮度 235-254（可能是浅灰白文字）
near_white = ~orng & (brightness >= 235) & (brightness < 255)
pure_bg = (r == 255) & (g == 255) & (b == 255)

print(f"近白(235-254)像素: {near_white.sum()} ({near_white.sum()/(w*h)*100:.3f}%)")
print(f"纯白背景像素: {pure_bg.sum()} ({pure_bg.sum()/(w*h)*100:.3f}%)")

# 近白像素位置统计
ys, xs = np.where(near_white)
if len(ys):
    print(f"近白像素范围: x={xs.min()}-{xs.max()}, y={ys.min()}-{ys.max()}")

# 每格3px字符画：x 1000-2200, y 430-780
scale = 3
y0, y1, x0, x1 = 430, 780, 1000, 2200
print(f"\n近白像素分布字符画（每格={scale}px, x {x0}-{x1}, y {y0}-{y1}）")
print("图例: #=近白密集  W=近白  O=橙色  o=淡橙  ' '=纯白")
for y in range(y0, y1, scale):
    row = ""
    for x in range(x0, x1, scale):
        nw = near_white[y:y+scale, x:x+scale].sum()
        og = orng[y:y+scale, x:x+scale].sum()
        if og > 3:
            row += "O"
        elif og > 1:
            row += "o"
        elif nw > 4:
            row += "#"
        elif nw > 0:
            row += "W"
        else:
            row += " "
    print(f"{y:4d}|{row}|")
