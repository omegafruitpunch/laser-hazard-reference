#!/usr/bin/env python3
"""
PDF Content Extraction Script for Laser Safety LMS
Uses PyMuPDF (fitz) for reliable text extraction
"""

import fitz  # PyMuPDF
import json
import os
import sys
from pathlib import Path

def extract_pdf_content(pdf_path, output_dir):
    """Extract all content from a PDF file."""
    pdf_name = Path(pdf_path).stem
    course_dir = Path(output_dir)
    course_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Processing: {pdf_path}")
    
    # Open PDF
    doc = fitz.open(pdf_path)
    
    extracted_data = {
        "pdf_name": Path(pdf_path).name,
        "total_pages": len(doc),
        "pages": []
    }
    
    # Extract content from each page
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # Extract text
        text = page.get_text()
        
        # Extract images info
        image_list = page.get_images()
        
        # Extract links
        links = page.get_links()
        
        # Get page dimensions
        rect = page.rect
        
        page_data = {
            "page_num": page_num + 1,
            "text": text,
            "word_count": len(text.split()),
            "image_count": len(image_list),
            "link_count": len(links),
            "dimensions": {
                "width": rect.width,
                "height": rect.height
            }
        }
        
        extracted_data["pages"].append(page_data)
        print(f"  Page {page_num + 1}: {len(text)} chars, {len(image_list)} images")
    
    doc.close()
    
    # Save extracted content
    output_file = course_dir / f"{pdf_name}_extracted.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    # Also save plain text for easier reading
    text_output_file = course_dir / f"{pdf_name}_extracted.txt"
    with open(text_output_file, 'w', encoding='utf-8') as f:
        f.write(f"PDF: {extracted_data['pdf_name']}\n")
        f.write(f"Total Pages: {extracted_data['total_pages']}\n")
        f.write("=" * 80 + "\n\n")
        
        for page in extracted_data["pages"]:
            f.write(f"--- Page {page['page_num']} ---\n")
            f.write(f"Words: {page['word_count']}, Images: {page['image_count']}\n\n")
            f.write(page['text'])
            f.write("\n\n" + "=" * 80 + "\n\n")
    
    print(f"Saved: {output_file}")
    print(f"Saved: {text_output_file}")
    return extracted_data

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python extract_pdf.py <pdf_path> <output_dir>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    output_dir = sys.argv[2]
    
    extract_pdf_content(pdf_path, output_dir)
