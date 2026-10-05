import os
import sys
import types
from pathlib import Path

# Monkeypatch ai_edge_litert with tensorflow.lite so onnx2tf works seamlessly on Windows
import tensorflow as tf
mod = types.ModuleType("ai_edge_litert")
sub = types.ModuleType("ai_edge_litert.interpreter")
sub.Interpreter = tf.lite.Interpreter
mod.interpreter = sub
sys.modules["ai_edge_litert"] = mod
sys.modules["ai_edge_litert.interpreter"] = sub

from onnx2tf.onnx2tf import convert

def main():
    base_dir = Path(__file__).resolve().parent.parent
    onnx_path = base_dir / "backend" / "esp32_yolo.onnx"
    output_dir = base_dir / "mobile" / "assets" / "models"
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"[Converter] Input ONNX: {onnx_path}")
    print(f"[Converter] Output directory: {output_dir}")

    convert(
        input_onnx_file_path=str(onnx_path),
        output_folder_path=str(output_dir),
        output_signaturedefs=True,
    )

    print("[Converter] ONNX to TFLite conversion complete!")

if __name__ == "__main__":
    main()
