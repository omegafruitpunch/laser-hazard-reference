import fitz  # PyMuPDF
import os
import json

pdf_dir = "laser-safety-lms/public/docs/course-7-event-safety"
output_dir = "lms_data/course-7"
os.makedirs(output_dir, exist_ok=True)

pdfs = [
    "event-safety-planning.pdf",
    "venue-assessment.pdf", 
    "crowd-safety.pdf",
    "emergency-response.pdf",
    "insurance-liability.pdf",
    "weather-protocols.pdf"
]

all_content = {}

for pdf_name in pdfs:
    pdf_path = os.path.join(pdf_dir, pdf_name)
    if os.path.exists(pdf_path):
        doc = fitz.open(pdf_path)
        pages_content = []
        for page_num, page in enumerate(doc):
            text = page.get_text()
            pages_content.append({
                "page_num": page_num + 1,
                "content": text
            })
        all_content[pdf_name] = {
            "page_count": len(doc),
            "pages": pages_content
        }
        doc.close()
        print(f"Extracted {len(pages_content)} pages from {pdf_name}")

# Save raw extraction
with open(f"{output_dir}/raw_extraction.json", "w", encoding="utf-8") as f:
    json.dump(all_content, f, indent=2, ensure_ascii=False)

print(f"\nExtraction complete. Saved to {output_dir}/raw_extraction.json")
