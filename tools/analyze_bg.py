# -*- coding: utf-8 -*-
"""分析背景min通道分布，确定抠图阈值"""
from PIL import Image
import numpy as np

path = r"C:/Users/Admin/Documents/公司品牌资料/logo_中英组合logo/jpg/jpg_cmyk.jpg"
img = Image.open(path).convert("RGB")
arr = np.array(img).astype(np.float32)

r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
mn = np.minimum(np.minimum(r, g), b)
mx = np.maximum(np.maximum(r, g), b)

# min通道直方图
hist, edges = np.histogram(mn, bins=[0, 50, 100, 150, 180, 200, 220, 235, 245, 250, 252, 254, 256])
for i in range(len(hist)):
    print(f"min在[{edges[i]},{edges[i+1]}) : {hist[i]/mn.size*100:.2f}%")

# 背景区域(四角+边缘)的min值
h, w = arr.shape[:2]
edge_mask = np.zeros((h, w), dtype=bool)
edge_mask[:20, :] = True
edge_mask[-20:, :] = True
edge_mask[:, :20] = True
edge_mask[:, -20:] = True
print(f"\n边缘区域min均值: {mn[edge_mask].mean():.1f}")
print(f"边缘区域min分布:")
for i in range(len(hist)):
    print(f"  min在[{edges[i]},{edges[i+1]}) : {(np.histogram(mn[edge_mask], bins=[0,50,100,150,180,200,220,235,245,250,252,254,256])[0][i])/edge_mask.sum()*100:.2f}%")

# 饱和彩色前景（蓝/橙）的min值
sat = (mx - mn) > 60
print(f"\n彩色区域min均值: {mn[sat].mean():.1f}")
print(f"彩色区域min<100占比: {((mn < 100) & sat).mean():.3f}")
