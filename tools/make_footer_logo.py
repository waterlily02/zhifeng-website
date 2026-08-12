from PIL import Image
import numpy as np

input_path = "logo_white.jpg"
output_path = "../frontend/images/logo_footer.png"

img = Image.open(input_path).convert("RGBA")
arr = np.array(img)

r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]

# 计算每个像素与背景白的距离（亮度）
brightness = np.mean(arr[:,:,:3], axis=2)

# 白色背景阈值：亮度 > 245 视为背景
# 前景阈值：亮度 < 230 视为前景
# 中间做平滑过渡
alpha = np.ones_like(brightness, dtype=np.float32) * 255

# 背景：亮度高 -> 透明
mask_bg = brightness > 245
alpha[mask_bg] = 0

# 边缘平滑：230-245 之间渐变
mask_edge = (brightness >= 230) & (brightness <= 245)
if mask_edge.any():
    t = (brightness[mask_edge] - 230) / 15.0
    alpha[mask_edge] = (1 - t) * 255

# 同时考虑颜色：如果像素接近橙色则保留（即使亮度稍高）
# 橙色特征：R 高，G 中等，B 低
is_orange = (r > 200) & (g > 100) & (g < 220) & (b < 100) & (r > g) & (g > b)
alpha[is_orange] = 255

# 裁剪透明边距
rgba = np.dstack((r, g, b, alpha.astype(np.uint8)))
result = Image.fromarray(rgba, mode='RGBA')

# 获取非透明区域bbox
bbox = result.getbbox()
if bbox:
    result = result.crop(bbox)
    print(f"裁剪后尺寸: {result.size}")

# 等比例缩放到适合footer的高度（保持高清，但限制最大宽度）
target_height = 120
w, h = result.size
if h > target_height:
    ratio = target_height / h
    new_w = int(w * ratio)
    result = result.resize((new_w, target_height), Image.LANCZOS)
    print(f"缩放后尺寸: {result.size}")

result.save(output_path, "PNG")
print(f"已保存: {output_path}")

# 验证
result_arr = np.array(result)
total = result_arr.size // 4
transparent = (result_arr[:,:,3] == 0).sum()
opaque = (result_arr[:,:,3] == 255).sum()
print(f"透明像素: {transparent/total*100:.1f}%, 不透明像素: {opaque/total*100:.1f}%")
