import os
from PIL import Image, ImageDraw
import sys

def process_sprite(image_path, out_gif_path):
    # Load image
    img = Image.open(image_path).convert("RGBA")
    width, height = img.size
    
    # 1. Very basic segmentation: the image is a 1x4 horizontal grid.
    # The image is 1024x1024 or similar, with 4 boxes evenly spaced in the middle.
    # Instead of complex OpenCV, let's just find the horizontal bounding box of all non-white pixels,
    # and then divide that width by 4.
    
    # Find bounding box of everything non-white
    pixels = img.load()
    min_x, min_y, max_x, max_y = width, height, 0, 0
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if not (r > 240 and g > 240 and b > 240):
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
                
    if min_x > max_x or min_y > max_y:
        print("Empty image?")
        return

    # Trim the overall image to just the row of boxes
    trimmed = img.crop((min_x, min_y, max_x, max_y))
    t_width, t_height = trimmed.size
    
    # The boxes might have some spacing. Let's assume 4 roughly equal segments:
    frame_width = t_width // 4
    
    frames = []
    
    for i in range(4):
        # Crop the frame
        left = i * frame_width
        right = left + frame_width
        
        # Add a little buffer inwards to crop out the thick black border
        # The borders look to be about 5-10% of the frame width. Let's crop in 10% on all sides.
        margin_x = int(frame_width * 0.08)
        margin_y = int(t_height * 0.08)
        
        frame = trimmed.crop((left + margin_x, margin_y, right - margin_x, t_height - margin_y))
        
        # Transparentize the background
        f_width, f_height = frame.size
        f_pixels = frame.load()
        for fy in range(f_height):
            for fx in range(f_width):
                r, g, b, a = f_pixels[fx, fy]
                if r > 220 and g > 220 and b > 220:
                    f_pixels[fx, fy] = (255, 255, 255, 0)
                    
        frames.append(frame)
        
    # Save as animated GIF
    # duration is in ms. 200ms per frame = 5 FPS
    frames[0].save(
        out_gif_path, 
        save_all=True, 
        append_images=frames[1:], 
        optimize=False, 
        duration=250, 
        loop=0,
        disposal=2, # Clear frame before rendering next
        format='GIF'
    )
    print(f"Saved: {out_gif_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python sprite_to_gif.py <input.png> <output.gif>")
    else:
        process_sprite(sys.argv[1], sys.argv[2])
