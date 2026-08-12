# -*- coding: utf-8 -*-
"""验证抠图结果：透明度分布、前景颜色完整性"""
from PIL import Image
import numpy as np

path = r"C:/Users/Admin/WorkBuddy/2026-08-10-16-51-34/zhifeng-website/frontend/images/logo_transparent.png"
img = Image.open(path).convert("RGBA")
arr = np.array(img)
h, w = arr.shape[:2]
print("尺寸:", w, "x", h)

alpha = arr[:, :, 3]
print(f"全透明像素占比: {(alpha == 0).mean()*100:.1f}%")
print(f"半透明像素占比: {((alpha > 0) & (alpha < 255)).mean()*100:.1f}%")
print(f"完全不透明像素占比: {(alpha == 255).mean()*100:.1f}%")

# 检查前景颜色是否完整（排除透明像素）
mask = alpha > 128
fg = arr[mask][:, :3].astype(int)
print("\n前景颜色分布:")
blue = ((fg[:, 2] > fg[:, 0] + 30) & (fg[:, 2] > fg[:, 1] + 30)).mean() * 100
orange = ((fg[:, 0] > 180) & (fg[:, 1] > 60) & (fg[:, 1] < 200) & (fg[:, 2] < 100)).mean() * 100
dark = (fg.max(axis=1) < 100).mean() * 100
other = 100 - blue - orange - dark
print(f"  蓝色文字/图形: {blue:.1f}%")
print(f"  橙色文字/图形: {orange:.1f}%")
print(f"  深色(黑)文字: {dark:.1f}%")
print(f"  其他(边缘过渡): {other:.1f}%")

# 检查内容是否充满画布（左右上下是否有大块空白）
rows_with_content = (alpha > 0).any(axis=1)
cols_with_content = (alpha > 0).any(axis=0)
print(f"\n内容上下边界: 第{np.argmax(rows_with_content)}行 ~ 第{h - np.argmax(rows_with_content[::-1])}行")
print(f"内容左右边界: 第{np.argmax(cols_with_content)}列 ~ 第{w - np.argmax(cols_with_content[::-1])}列")
