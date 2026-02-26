from PIL import Image
import glob
import os

images = glob.glob('/Users/yudeyou/Desktop/tai-402/public/images/agents/*.png')

for file in images:
    img = Image.open(file).convert("RGBA")
    
    # 1. We will use a flood fill algorithm from the 4 corners to detect the background
    # This is much safer than just deleting white, which might delete the robot's eyes!
    
    width, height = img.size
    pixels = img.load()
    
    # Target color we want to remove (let's check the top-left pixel)
    # Usually it's solid white or near white: (255, 255, 255, 255)
    # We will accept a tolerance for 'white-ish' colors due to compression
    
    def is_background(r, g, b, a):
        # Allow anything from light gray to pure white as background if it's connected to edges
        return r > 230 and g > 230 and b > 230 and a > 0
        
    visited = set()
    queue = []
    
    # Add borders to queue
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))
        
    while queue:
        x, y = queue.pop(0)
        
        if (x, y) in visited:
            continue
            
        if x < 0 or x >= width or y < 0 or y >= height:
            continue
            
        visited.add((x, y))
        r, g, b, a = pixels[x, y]
        
        if is_background(r, g, b, a):
            pixels[x, y] = (255, 255, 255, 0) # Make transparent
            # Add neighbors
            queue.append((x+1, y))
            queue.append((x-1, y))
            queue.append((x, y+1))
            queue.append((x, y-1))

    img.save(file, "PNG")
    print(f"Deep Processed: {os.path.basename(file)}")
