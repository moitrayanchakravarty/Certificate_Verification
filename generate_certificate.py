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
                for paragraph in shape.text_frame.paragraphs:
                    # Combine all runs into a single string
                    full_text = "".join(run.text for run in paragraph.runs)

                    # Replace placeholders in the combined text
                    full_text = full_text.replace("{{name}}", name)
                    full_text = full_text.replace("{{certificate_id}}", certificate_id)
                    full_text = full_text.replace("{{issued_date}}", issued_date)

                    # Clear all runs and reapply the updated text with formatting
                    for run in paragraph.runs:
                        run.text = ""  # Clear existing text
                    if paragraph.runs:
                        paragraph.runs[0].text = full_text  # Set the updated text in the first run

            if "{{qr_code}}" in getattr(shape, "text", ""):
                left = Inches(4)
                top = Inches(3)
                slide.shapes.add_picture(qr_code_path, left, top, width=Inches(2), height=Inches(2))
                shape.text = ""

    prs.save(output_path)
    os.remove(qr_code_path)

if __name__ == "__main__":
    name = sys.argv[1]
    certificate_id = sys.argv[2]  # Firebase-generated certificate ID
    issued_date = sys.argv[3]
    template_path = "template.pptx"
    output_path = f"certificates/certificate_{certificate_id}.pptx"

    os.makedirs("certificates", exist_ok=True)
    generate_certificate(name, certificate_id, issued_date, template_path, output_path)
    print(f"Certificate generated: {output_path}")