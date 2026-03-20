#!/usr/bin/env python3
"""
PDF Extraction Script for Laser Safety LMS
Extracts text and metadata from PDF files for LMS content processing.
"""

import json
import os
from pathlib import Path
import PyPDF2
import pdfplumber

# Configuration
PDF_DIR = Path("laser-safety-lms/public/docs/course-1-fundamentals")
OUTPUT_DIR = Path("lms_data/extracted_content/course-1")
PDFS_TO_PROCESS = [
    "beam-hazard-calculations.pdf",
    "lso-role.pdf"
]

def extract_with_pypdf2(pdf_path):
    """Extract text using PyPDF2"""
    text_content = []
    metadata = {}
    
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            metadata = {
                'num_pages': len(pdf_reader.pages),
                'pdf_info': dict(pdf_reader.metadata) if pdf_reader.metadata else {}
            }
            
            for i, page in enumerate(pdf_reader.pages):
                text = page.extract_text()
                text_content.append({
                    'page_num': i + 1,
                    'text': text if text else "",
                    'method': 'pypdf2'
                })
    except Exception as e:
        metadata['error'] = str(e)
    
    return text_content, metadata

def extract_with_pdfplumber(pdf_path):
    """Extract text using pdfplumber (better for tables)"""
    text_content = []
    tables = []
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                page_tables = page.extract_tables()
                
                text_content.append({
                    'page_num': i + 1,
                    'text': text if text else "",
                    'method': 'pdfplumber'
                })
                
                if page_tables:
                    tables.append({
                        'page_num': i + 1,
                        'tables': page_tables
                    })
    except Exception as e:
        print(f"pdfplumber error: {e}")
    
    return text_content, tables

def process_pdf(pdf_filename):
    """Process a single PDF file with multiple extraction methods"""
    pdf_path = PDF_DIR / pdf_filename
    
    if not pdf_path.exists():
        print(f"ERROR: File not found: {pdf_path}")
        return None
    
    print(f"\n{'='*60}")
    print(f"Processing: {pdf_filename}")
    print(f"{'='*60}")
    
    # Extract with both methods
    pypdf2_content, metadata = extract_with_pypdf2(pdf_path)
    plumber_content, tables = extract_with_pdfplumber(pdf_path)
    
    # Combine results - prefer pdfplumber text if available, fall back to PyPDF2
    combined_pages = []
    for i in range(len(pypdf2_content)):
        pypdf2_text = pypdf2_content[i]['text'] if i < len(pypdf2_content) else ""
        plumber_text = plumber_content[i]['text'] if i < len(plumber_content) else ""
        
        # Use the longer text (usually more complete)
        best_text = plumber_text if len(plumber_text) > len(pypdf2_text) else pypdf2_text
        
        # Get tables for this page
        page_tables = []
        for table_entry in tables:
            if table_entry['page_num'] == i + 1:
                page_tables = table_entry['tables']
                break
        
        combined_pages.append({
            'page_num': i + 1,
            'text': best_text,
            'tables': page_tables,
            'text_length': len(best_text),
            'has_tables': len(page_tables) > 0
        })
    
    result = {
        'filename': pdf_filename,
        'source_path': str(pdf_path),
        'metadata': metadata,
        'total_pages': len(combined_pages),
        'pages': combined_pages
    }
    
    # Save extracted content
    output_file = OUTPUT_DIR / f"{pdf_filename.replace('.pdf', '_extracted.json')}"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    # Also save a readable text version
    text_output_file = OUTPUT_DIR / f"{pdf_filename.replace('.pdf', '_extracted.txt')}"
    with open(text_output_file, 'w', encoding='utf-8') as f:
        f.write(f"EXTRACTED CONTENT: {pdf_filename}\n")
        f.write(f"{'='*60}\n\n")
        for page in combined_pages:
            f.write(f"\n--- PAGE {page['page_num']} ---\n")
            f.write(page['text'])
            f.write("\n")
            if page['has_tables']:
                f.write(f"\n[TABLES ON THIS PAGE: {len(page['tables'])}]\n")
    
    print(f"[OK] Extracted {len(combined_pages)} pages")
    print(f"[OK] Saved to: {output_file}")
    print(f"[OK] Text version: {text_output_file}")
    
    return result

def main():
    """Main processing function"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    results = {}
    for pdf in PDFS_TO_PROCESS:
        result = process_pdf(pdf)
        if result:
            results[pdf] = result
    
    # Save summary
    summary_file = OUTPUT_DIR / "extraction_summary.json"
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump({
            'processed_pdfs': list(results.keys()),
            'total_pdfs': len(results),
            'output_directory': str(OUTPUT_DIR)
        }, f, indent=2)
    
    print(f"\n{'='*60}")
    print("EXTRACTION COMPLETE")
    print(f"{'='*60}")
    print(f"Processed: {len(results)} PDFs")
    print(f"Summary saved to: {summary_file}")

if __name__ == "__main__":
    main()
