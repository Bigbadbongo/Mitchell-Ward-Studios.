from PIL import Image

img = Image.open('public/rooms/media__1780208949164.jpg')
w, h = img.size

# Scan horizontally along y = h // 2 (341) to find painting bounds by saturation
for x in range(w):
    r, g, b = img.getpixel((x, h // 2))
    sat = max(r, g, b) - min(r, g, b)
    if sat > 35:
        print(f"Left edge: x={x} ({x/w*100:.1f}%) RGB: {r},{g},{b}")
        break
        
for x in range(w - 1, -1, -1):
    r, g, b = img.getpixel((x, h // 2))
    sat = max(r, g, b) - min(r, g, b)
    if sat > 35:
        print(f"Right edge: x={x} ({x/w*100:.1f}%) RGB: {r},{g},{b}")
        break

# Scan vertically along x = w // 2 (512)
for y in range(h):
    r, g, b = img.getpixel((w // 2, y))
    sat = max(r, g, b) - min(r, g, b)
    if sat > 35:
        print(f"Top edge: y={y} ({y/h*100:.1f}%) RGB: {r},{g},{b}")
        break
        
for y in range(h - 1, -1, -1):
    r, g, b = img.getpixel((w // 2, y))
    sat = max(r, g, b) - min(r, g, b)
    if sat > 35:
        print(f"Bottom edge: y={y} ({y/h*100:.1f}%) RGB: {r},{g},{b}")
        break
