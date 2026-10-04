import os
import sys
import subprocess
from pathlib import Path

def convert():
    base_dir = Path(__file__).resolve().parent.parent
    onnx_path = base_dir / "backend" / "esp32_yolo.onnx"
    output_dir = base_dir / "mobile" / "assets" / "models"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Converting ONNX model: {onnx_path}")
    print(f"Output directory: {output_dir}")
    
    # Run onnx2tf command
    cmd = [
        sys.executable, "-m", "onnx2tf",
        "-i", str(onnx_path),
        "-o", str(output_dir),
        "-osd" # output signature def
    ]
    
    res = subprocess.run(cmd, capture_output=True, text=True)
    print("STDOUT:", res.stdout)
    if res.stderr:
        print("STDERR:", res.stderr)
        
    print("Done conversion check.")

if __name__ == "__main__":
    convert()
