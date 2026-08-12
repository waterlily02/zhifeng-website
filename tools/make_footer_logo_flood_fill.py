# -*- coding: utf-8 -*-
"""
反白 logo 抠图（修复版）
========================
问题背景：jpg_反白2.jpg 是"白底 + 橙色图形 + 内部白色文字"。
白色文字（"rein"、"智蜂创元"）与白底同为 RGB(255,255,255)，
仅靠颜色/亮度无法区分，必须用「连通性」区分内外。

核心算法（洪水填充）：
1. 标记橙色像素 -> 前景图形，全部保留
2. 标记"可通行"像素（非橙、亮度>215）-> 外部白底 + 内部白色文字 + 边缘过渡色
3. 从图片四边开始对"可通行"像素做洪水填充
   - 被填到的：与外部背景连通 -> 设为透明
   - 没填到的：被橙色图形壁包围 -> 内部白色文字，保留
4. 裁剪透明边距，等比缩放到目标高度
5. 生成深色背景预览图，便于肉眼验证文字是否保留
"""
from PIL import Image
import numpy as np
import time

input_path = "logo_white.jpg"
output_path = "../frontend/images/logo_footer.png"
preview_path = "preview_footer.png"

t0 = time.time()
img = Image.open(input_path).convert("RGB")
arr = np.array(img).astype(np.int16)
h, w = arr.shape[:2]
r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
brightness = (r + g + b) / 3.0
print(f"原图尺寸: {w}x{h}")

# 1. 橙色前景（图形主体）
orng = (r > 200) & (g > 100) & (g < 220) & (b < 120)
print(f"橙色前景像素: {orng.sum()} ({orng.sum()/(w*h)*100:.2f}%)")

# 2. 可通行区域 = 非橙 且 亮度>215（外部白底 / 内部白字 / 过渡色）
passable = ~orng & (brightness > 215)
print(f"可通行(白色系)像素: {passable.sum()}")

# 3. 从四边洪水填充（并行 BFS / 逐层膨胀）
frontier = passable.copy()
frontier[1:-1, 1:-1] = False  # 起点：四条边上的可通行像素
visited = np.zeros_like(passable)
iters = 0
while frontier.any():
    visited |= frontier
    exp = np.zeros_like(frontier)
    exp[1:, :] |= frontier[:-1, :]
    exp[:-1, :] |= frontier[1:, :]
    exp[:, 1:] |= frontier[:, :-1]
    exp[:, :-1] |= frontier[:, 1:]
    frontier = exp & passable & ~visited
    iters += 1
print(f"洪水填充完成: {iters} 轮, 外部背景像素 {visited.sum()}")

# 4. 内部白色文字 = 可通行 但 未被填充到
inner_text = passable & ~visited
print(f"内部保留的白色文字像素: {inner_text.sum()}")

# 5. 构造 alpha
alpha = np.full((h, w), 255, dtype=np.uint8)
alpha[visited] = 0                      # 外部白底 -> 透明
# 外部背景与图形之间的过渡像素做柔和渐变（避免硬边）
edge_bg = visited & (brightness >= 228) & (brightness <= 245)
if edge_bg.any():
    t = ((245 - brightness[edge_bg]) / 17.0 * 255).astype(np.uint8)
    alpha[edge_bg] = t
# 内部白字（inner_text）保持 alpha=255，橙色保持 alpha=255

rgba = np.dstack((arr.astype(np.uint8), alpha))
result = Image.fromarray(rgba, "RGBA")

# 6. 裁剪透明边距
bbox = result.getbbox()
print(f"内容 bbox: {bbox}")
result = result.crop(bbox)

# 7. 等比缩放到目标高度（高清，CSS 显示时会更小）
target_h = 240
w2, h2 = result.size
if h2 > target_h:
    ratio = target_h / h2
    result = result.resize((max(1, int(w2 * ratio)), target_h), Image.LANCZOS)
print(f"最终尺寸: {result.size}")

result.save(output_path, "PNG")
print(f"已保存: {output_path}")

# 8. 统计
ra = np.array(result)
total = ra.shape[0] * ra.shape[1]
tr = (ra[:, :, 3] == 0).sum()
print(f"透明像素 {tr/total*100:.1f}%, 不透明像素 {(total-tr)/total*100:.1f}%")

# 9. 深色背景预览（验证内部白色文字可见）
canvas = Image.new("RGBA", result.size, (30, 34, 45, 255))
canvas.alpha_composite(result)
canvas.convert("RGB").save(preview_path, "PNG")
print(f"预览图已保存: {preview_path}")

print(f"总耗时 {time.time()-t0:.1f}s")
