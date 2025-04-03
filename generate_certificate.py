import qrcode
from pptx import Presentation
from pptx.util import Inches
import os
import sys

def generate_certificate(name, certificate_id, issued_date, template_path, output_path):
    netlify_link = f"https://codeclashjec.netlify.app/certificates/{certificate_id}"
    qr_code_path = f"{certificate_id}_qr.png"

    # Generate QR Code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(netlify_link)
    qr.make(fit=True)
    qr_img = qr.make_image(fill="black", back_color="white")
    qr_img.save(qr_code_path)

    # Load PowerPoint template
    prs = Presentation(template_path)

    # Replace placeholders
    for slide in prs.slides:
        for shape in slide.shapes:
            if shape.has_text_frame:
                text = shape.text_frame.text
                if "{{name}}" in text:
                    shape.text_frame.text = text.replace("{{name}}", name)
                if "{{certificate_id}}" in text:
                    shape.text_frame.text = text.replace("{{certificate_id}}", certificate_id)
                if "{{issued_date}}" in text:
                    shape.text_frame.text = text.replace("{{issued_date}}", issued_date)

            if "{{qr_code}}" in getattr(shape, "text", ""):
                left = Inches(4)
                top = Inches(3)
                slide.shapes.add_picture(qr_code_path, left, top, width=Inches(2), height=Inches(2))
                shape.text = ""

    prs.save(output_path)
    os.remove(qr_code_path)

if __name__ == "__main__":
    name = sys.argv[1]
    certificate_id = sys.argv[2]
    issued_date = sys.argv[3]
    template_path = "template.pptx"
    output_path = f"certificates/certificate_{certificate_id}.pptx"

    os.makedirs("certificates", exist_ok=True)
    generate_certificate(name, certificate_id, issued_date, template_path, output_path)
    print(f"Certificate generated: {output_path}")