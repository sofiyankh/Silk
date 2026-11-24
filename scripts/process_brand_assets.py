import os
from PIL import Image, ImageOps
import numpy as np

os.makedirs("public/brand/logo", exist_ok=True)
os.makedirs("public/brand/products", exist_ok=True)
os.makedirs("public/videos", exist_ok=True)

# 1. Process Logo
logo_path = "brand/file_000000006a6c82109551a7b104263048.png"
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert("RGBA")
    # Save original logo
    logo.save("public/brand/logo/silk-logo-original.png")
    
    # Create clean transparent white logo (remove pure black background)
    data = np.array(logo)
    # Background is black (low RGB)
    # The needle and thread is bright/cream
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    # Brightness
    brightness = 0.299 * r + 0.587 * g + 0.114 * b
    
    # Alpha mask based on brightness
    alpha = np.clip((brightness - 25) * (255 / (160 - 25)), 0, 255).astype(np.uint8)
    
    # White logo with alpha
    white_logo = np.zeros_like(data)
    white_logo[:,:,0] = 255
    white_logo[:,:,1] = 255
    white_logo[:,:,2] = 255
    white_logo[:,:,3] = alpha
    Image.fromarray(white_logo).save("public/brand/logo/silk-logo-white.png")
    
    # Dark/Black logo for light backgrounds
    black_logo = np.zeros_like(data)
    black_logo[:,:,0] = 21
    black_logo[:,:,1] = 21
    black_logo[:,:,2] = 21
    black_logo[:,:,3] = alpha
    Image.fromarray(black_logo).save("public/brand/logo/silk-logo-black.png")
    print("Logo processed successfully!")

# 2. Product mappings and cropping
products = [
    {
        "id": "butterfly-hoodie",
        "file": "brand/file_00000000b518821181665af159a6daf0.png",
        "name": "Butterfly Cream Hoodie",
        "details_count": 4
    },
    {
        "id": "blue-floral-hoodie",
        "file": "brand/file_000000004790821082a09309621bb193.png",
        "name": "Blue Floral Black Hoodie",
        "details_count": 3
    },
    {
        "id": "black-signature-hoodie",
        "file": "brand/file_0000000059408210a2971f1966ec18e3.png",
        "name": "Black Signature Birds Hoodie",
        "details_count": 4
    },
    {
        "id": "sakura-hoodie",
        "file": "brand/file_000000009c0482109a59083eb675058b.png",
        "name": "Sakura Blossom Heather Hoodie",
        "details_count": 3
    },
    {
        "id": "birds-sakura-hoodie",
        "file": "brand/file_000000008e80821093ef396d4fcf09b8.png",
        "name": "Birds & Blossom Heather Grey Hoodie",
        "details_count": 3
    },
    {
        "id": "monochrome-blossom-hoodie",
        "file": "brand/file_00000000d05c8210b6156f499f7c9fd8.png",
        "name": "Monochrome Blossom Heather Hoodie",
        "details_count": 3
    }
]

for p in products:
    p_dir = os.path.join("public/brand/products", p["id"])
    os.makedirs(p_dir, exist_ok=True)
    im = Image.open(p["file"])
    w, h = im.size
    
    # Crop Front (top-left) and Back (top-right)
    # top half ends around y=750
    front = im.crop((0, 0, 765, 750))
    back = im.crop((771, 0, 1536, 750))
    
    front.save(os.path.join(p_dir, "front.jpg"), "JPEG", quality=92)
    back.save(os.path.join(p_dir, "back.jpg"), "JPEG", quality=92)
    
    # Full composite also saved for high-res reference
    im.save(os.path.join(p_dir, "composite.jpg"), "JPEG", quality=90)
    
    # Bottom strip details
    strip = im.crop((0, 755, 1536, 1024))
    if p["details_count"] == 4:
        # 4 panels: ~384 px each
        col_w = 1536 // 4
        for i in range(4):
            detail = strip.crop((i * col_w + (4 if i>0 else 0), 0, (i+1)*col_w - 4, 1024-755))
            detail.save(os.path.join(p_dir, f"detail-{i+1}.jpg"), "JPEG", quality=92)
    else:
        # 3 panels: ~512 px each or custom
        col_w = 1536 // 3
        for i in range(3):
            detail = strip.crop((i * col_w + (4 if i>0 else 0), 0, (i+1)*col_w - 4, 1024-755))
            detail.save(os.path.join(p_dir, f"detail-{i+1}.jpg"), "JPEG", quality=92)
            
    print(f"Processed product {p['id']}")

print("All brand assets processed!")
