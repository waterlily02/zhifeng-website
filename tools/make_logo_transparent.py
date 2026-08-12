# -*- coding: utf-8 -*-
"""抠图v2：精确阈值 + 正确去白边公式"""
from PIL import Image
import numpy as np

SRC = r"C:/Users/Admin/Documents/公司品牌资料/logo_中英组合logo/jpg/jpg_cmyk.jpg"
OUT_DIR = r"C:/Users/Admin/WorkBuddy/2026-08-10-16-51-34/zhifeng-website/frontend/images"

img = Image.open(SRC).convert("RGBA")
arr = np.array(img).astype(np.float32)
r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
mn = np.minimum(np.minimum(r, g), b)

# 阈值：背景>=250透明，前景<=200不透明，中间线性过渡
BG_T = 250.0   # min >= BG_T 视为背景（纯白254）
FG_T = 200.0   # min <= FG_T 视为前景
alpha = np.where(mn >= BG_T, 0.0,
          np.where(mn <= FG_T, 255.0,
                   255.0 * (BG_T - mn) / (BG_T - FG_T)))

# 正确的去白边（un-mix，假设白底）：c' = (c - 255*(1-a)) / a
a = alpha / 255.0
valid = a > 0.15  # 只处理足够不透明的像素，避免放大噪声
for ch in range(3):
    c = arr[:, :, ch]
    corrected = (c - 255.0 * (1.0 - a)) / np.maximum(a, 1e-6)
    arr[:, :, ch] = np.where(valid, corrected, c)

arr[:, :, 3] = alpha
out = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")

# 裁剪内容边界
bbox = out.getbbox()
if bbox:
    out = out.crop(bbox)
print("裁剪后尺寸:", out.size)

# 高清版（高度600px）
target_h = 600
w, h = out.size
new_w = int(w * target_h / h)
big = out.resize((new_w, target_h), Image.LANCZOS)
big_path = OUT_DIR + "/logo_transparent.png"
big.save(big_path)
print("高清透明版:", big_path, big.size)

# 导航版（高度52px）
nav_h = 52
nav_w = max(1, int(new_w * nav_h / target_h))
nav = big.resize((nav_w, nav_h), Image.LANCZOS)
nav_path = OUT_DIR + "/logo_nav.png"
nav.save(nav_path)
print("导航透明版:", nav_path, nav.size)
print("完成！")
