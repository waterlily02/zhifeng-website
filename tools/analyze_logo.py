# -*- coding: utf-8 -*-
"""分析logo图片的颜色构成，确定抠图策略"""
from PIL import Image
import numpy as np
from collections import Counter

path = r"C:/Users/Admin/Documents/公司品牌资料/logo_中英组合logo/jpg/jpg_cmyk.jpg"
img = Image.open(path)
print("模式:", img.mode, "尺寸:", img.size)

# 转RGB分析
if img.mode == "CMYK":
    rgb = img.convert("RGB")
else:
    rgb = img.convert("RGB")

# 取四角和边缘像素判断背景色
w, h = rgb.size
corners = [
    rgb.getpixel((5, 5)),
    rgb.getpixel((w - 5, 5)),
    rgb.getpixel((5, h - 5)),
    rgb.getpixel((w - 5, h - 5)),
    rgb.getpixel((w // 2, 5)),
    rgb.getpixel((w // 2, h - 5)),
    rgb.getpixel((5, h // 2)),
    rgb.getpixel((w - 5, h // 2)),
]
print("四角+边缘像素:", corners)

# 统计全图颜色分布（量化后）
arr = np.array(rgb)
# 把颜色量化到 32 级，统计出现最多的颜色
quant = (arr // 32) * 32
flat = quant.reshape(-1, 3)
counter = Counter(map(tuple, flat))
print("最常见的10种颜色（量化后）:")
for color, count in counter.most_common(10):
    pct = count / len(flat) * 100
    print(f"  RGB{color}  占比{pct:.1f}%")

# 白色像素占比
white_mask = (arr[:, :, 0] > 230) & (arr[:, :, 1] > 230) & (arr[:, :, 2] > 230)
print(f"白色背景像素占比: {white_mask.mean()*100:.1f}%")

# 深色像素占比（可能是文字）
dark_mask = (arr[:, :, 0] < 100) & (arr[:, :, 1] < 100) & (arr[:, :, 2] < 100)
print(f"深色(文字)像素占比: {dark_mask.mean()*100:.1f}%")

# 蓝色像素（品牌色）占比
blue_mask = (arr[:, :, 2] > arr[:, :, 0] + 30) & (arr[:, :, 2] > arr[:, :, 1] + 30)
print(f"偏蓝像素占比: {blue_mask.mean()*100:.1f}%")
