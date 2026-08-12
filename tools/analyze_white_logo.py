from PIL import Image
import numpy as np

img = Image.open("logo_white.jpg").convert("RGB")
arr = np.array(img)
height, width = arr.shape[:2]
print(f"图片尺寸: {width} x {height}")
print(f"总像素: {width * height}")

# 颜色聚类分析
pixels = arr.reshape(-1, 3)
# 按颜色出现频率统计
unique, counts = np.unique(pixels, axis=0, return_counts=True)
order = np.argsort(-counts)
print("\n=== 前20种主要颜色 ===")
for i in range(min(20, len(unique))):
    r, g, b = unique[order[i]]
    count = counts[order[i]]
    pct = count / len(pixels) * 100
    print(f"RGB({r:3d},{g:3d},{b:3d}) 数量:{count:8d} 占比:{pct:5.2f}%")

# 背景亮度分析
brightness = np.mean(arr, axis=2)
print(f"\n亮度统计: min={brightness.min():.1f}, max={brightness.max():.1f}, mean={brightness.mean():.1f}")
print(f"高亮区域(>240)占比: {(brightness > 240).sum() / brightness.size * 100:.2f}%")
print(f"白色区域(>250)占比: {(brightness > 250).sum() / brightness.size * 100:.2f}%")

# 前景颜色分析（非高亮区域）
mask = brightness < 230
fg_pixels = pixels[mask]
if len(fg_pixels) > 0:
    print(f"\n前景像素占比: {len(fg_pixels)/len(pixels)*100:.2f}%")
    print(f"前景平均RGB: {fg_pixels.mean(axis=0).astype(int)}")
    print(f"前景RGB范围: R={fg_pixels[:,0].min()}-{fg_pixels[:,0].max()}, G={fg_pixels[:,1].min()}-{fg_pixels[:,1].max()}, B={fg_pixels[:,2].min()}-{fg_pixels[:,2].max()}")
