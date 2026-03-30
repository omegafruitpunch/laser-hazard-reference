import json

# Read the extracted content
with open("lms_data/course-7/raw_extraction.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Print summary of all PDFs
for pdf_name, content in data.items():
    print(f"\n{'='*60}")
    print(f"PDF: {pdf_name}")
    print(f"Pages: {content['page_count']}")
    # Show first 500 chars of first page
    if content['pages']:
        first_page = content['pages'][0]['content'][:500]
        print(f"First page preview:\n{first_page}...")
