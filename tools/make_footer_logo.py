# -*- coding: utf-8 -*-
"""
黑底反白 logo 抠图
==================
输入：logo_black.png（黑底 + 白色文字 "Rein / 智蜂创元" + 橙色 "BEE"）
输出：透明底 PNG，仅去除黑色背景，保留白色文字与橙色图形。

处理策略：
1. 黑色背景（亮度<35）→ 完全透明
2. 白色文字、橙色图形 → 不透明
3. 暗色过渡像素（非白非橙、亮度<75）→ 按亮度渐变透明，避免边缘黑边
4. 裁剪透明边距，等比缩放到高清尺寸
"""
from PIL import Image
import numpy as np
import time

input_path = "logo_black.png"
output_path = "../frontend/images/logo_footer.png"
preview_path = "preview_footer_light.png"

t0 = time.time()
img = Image.open(input_path).convert("RGB")
arr = np.array(img).astype(np.int16)
h, w = arr.shape[:2]
r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
brightness = (r + g + b) / 3.0
print(f"原图尺寸: {w}x{h}")

# 前景识别
is_white = (r > 190) & (g > 190) & (b > 190)
is_orange = (r > 190) & (g > 100) & (g < 230) & (b < 110)
print(f"白色文字像素: {is_white.sum()} | 橙色图形像素: {is_orange.sum()}")

# alpha 默认保留
alpha = np.full((h, w), 255, dtype=np.uint8)

# 黑色背景及暗色过渡（非前景）做渐变透明，消除黑边
is_dark = ~is_white & ~is_orange & (brightness < 75)
if is_dark.any():
    # 亮度 0-25 → 0；25-75 → 渐变到 255
    t = ((brightness[is_dark] - 25) / 50.0 * 255).clip(0, 255).astype(np.uint8)
    alpha[is_dark] = t

# 纯黑兜底
alpha[brightness < 25] = 0

# 前景强制不透明（覆盖上述渐变可能误伤的区域）
alpha[is_white] = 255
alpha[is_orange] = 255

rgba = np.dstack((arr.astype(np.uint8), alpha))
result = Image.fromarray(rgba, "RGBA")

# 裁剪透明边距
bbox = result.getbbox()
print(f"内容 bbox: {bbox}")
result = result.crop(bbox)

# 等比缩放到目标高度（高清）
target_h = 240
w2, h2 = result.size
if h2 > target_h:
    ratio = target_h / h2
    result = result.resize((max(1, int(w2 * ratio)), target_h), Image.LANCZOS)
print(f"最终尺寸: {result.size}")

result.save(output_path, "PNG")
print(f"已保存: {output_path}")

# 统计
ra = np.array(result)
total = ra.shape[0] * ra.shape[1]
tr = (ra[:, :, 3] == 0).sum()
op = (ra[:, :, 3] == 255).sum()
print(f"透明 {tr/total*100:.1f}%, 不透明 {op/total*100:.1f}%, 半透明 {(total-tr-op)/total*100:.1f}%")

# 浅色背景预览（验证去底是否干净）
canvas = Image.new("RGBA", result.size, (245, 247, 250, 255))
canvas.alpha_composite(result)
canvas.convert("RGB").save(preview_path, "PNG")
print(f"浅色背景预览: {preview_path}")

print(f"总耗时 {time.time()-t0:.2f}s")
