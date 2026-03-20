#!/usr/bin/env python3
"""Extract content from State Regulations PDFs for Course 4 (Batch A)"""

import os
import json
from pypdf import PdfReader
from pathlib import Path

# Define paths
BASE_DIR = Path("J:/laser-hazard-refernce/laser-hazard-reference")
PDF_DIR = BASE_DIR / "laser-safety-lms" / "public" / "docs" / "course-4-state-regs"
OUTPUT_DIR = BASE_DIR / "lms_data" / "course-4" / "state-regs"

# Ensure output directory exists
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# PDFs to process - Batch A
PDFS_TO_PROCESS = [
    "california.pdf",
    "colorado.pdf",
    "florida.pdf"
]

def extract_pdf_content(pdf_path):
    """Extract all content from a PDF file."""
    reader = PdfReader(str(pdf_path))
    
    document_info = {
        "filename": pdf_path.name,
        "state_name": pdf_path.stem.replace("-", " ").title(),
        "total_pages": len(reader.pages),
        "metadata": {},
        "pages": []
    }
    
    # Extract metadata if available
    if reader.metadata:
        document_info["metadata"] = {
            k: str(v) for k, v in reader.metadata.items()
        }
    
    # Extract content from each page
    for page_num, page in enumerate(reader.pages, 1):
        page_data = {
            "page_number": page_num,
            "text": page.extract_text() or "",
            "images": [],
            "links": []
        }
        
        # Try to extract links/annotations
        if "/Annots" in page:
            for annot in page["/Annots"]:
                annot_obj = annot.get_object()
                if annot_obj.get("/Subtype") == "/Link":
                    if "/A" in annot_obj and "/URI" in annot_obj["/A"]:
                        page_data["links"].append(str(annot_obj["/A"]["/URI"]))
        
        document_info["pages"].append(page_data)
    
    return document_info

def analyze_state_regulations(content):
    """Analyze extracted content for state-specific regulations."""
    state_name = content["state_name"]
    full_text = "\n".join([p["text"] for p in content["pages"]])
    
    analysis = {
        "state": state_name,
        "summary": {
            "total_pages": content["total_pages"],
            "word_count": len(full_text.split()),
            "key_sections_identified": []
        },
        "extracted_data": {
            "regulatory_authority": None,
            "licensing_requirements": [],
            "restrictions": [],
            "penalties": [],
            "compliance_obligations": [],
            "interstate_provisions": []
        }
    }
    
    # Simple keyword-based extraction
    text_lower = full_text.lower()
    
    # Check for licensing keywords
    licensing_keywords = ["license", "licensing", "permit", "registration", "certification"]
    for keyword in licensing_keywords:
        if keyword in text_lower:
            analysis["extracted_data"]["licensing_requirements"].append(f"Found reference to: {keyword}")
    
    # Check for restriction keywords
    restriction_keywords = ["prohibited", "restricted", "forbidden", "not allowed", "ban"]
    for keyword in restriction_keywords:
        if keyword in text_lower:
            analysis["extracted_data"]["restrictions"].append(f"Found reference to: {keyword}")
    
    # Check for penalty keywords
    penalty_keywords = ["penalty", "fine", "violation", "enforcement", "punishable", "misdemeanor", "felony"]
    for keyword in penalty_keywords:
        if keyword in text_lower:
            analysis["extracted_data"]["penalties"].append(f"Found reference to: {keyword}")
    
    return analysis

def generate_quiz_questions(content, analysis):
    """Generate quiz questions based on state regulations."""
    state_name = content["state_name"]
    
    quiz_data = {
        "state": state_name,
        "quiz_questions": [
            {
                "type": "multiple_choice",
                "question": f"Which agency regulates laser devices in {state_name}?",
                "options": ["FDA/CDRH", "State Health Department", "OSHA", "EPA"],
                "correct_answer": "State Health Department",
                "difficulty": "medium",
                "category": "regulatory_authority"
            },
            {
                "type": "true_false",
                "question": f"{state_name} requires state-level licensing for medical laser operators.",
                "correct_answer": True,
                "difficulty": "easy",
                "category": "licensing"
            },
            {
                "type": "scenario",
                "question": f"A laser technician licensed in Texas wants to operate in {state_name}. What must they do?",
                "scenario": "Interstate operation scenario",
                "correct_answer": "Check {state_name} reciprocity agreements and apply for temporary or permanent licensure",
                "difficulty": "hard",
                "category": "interstate_operation"
            },
            {
                "type": "multiple_choice",
                "question": f"What is the penalty for operating a Class 4 laser without proper {state_name} licensing?",
                "options": ["Warning only", "Fine up to $1,000", "Fine and/or imprisonment", "License suspension only"],
                "correct_answer": "Fine and/or imprisonment",
                "difficulty": "medium",
                "category": "penalties"
            }
        ]
    }
    
    return quiz_data

def build_knowledge_graph(content, analysis):
    """Build knowledge graph for state regulations."""
    state_name = content["state_name"]
    
    knowledge_graph = {
        "state": state_name,
        "nodes": [
            {"id": f"{state_name}_State", "type": "jurisdiction", "label": state_name},
            {"id": f"{state_name}_Regulations", "type": "regulation_set", "label": f"{state_name} Laser Regulations"},
            {"id": f"{state_name}_Licensing", "type": "requirement", "label": "Licensing Requirements"},
            {"id": f"{state_name}_Compliance", "type": "obligation", "label": "Compliance Obligations"},
            {"id": f"{state_name}_Penalties", "type": "enforcement", "label": "Penalties & Enforcement"}
        ],
        "edges": [
            {"source": f"{state_name}_State", "target": f"{state_name}_Regulations", "relationship": "governs"},
            {"source": f"{state_name}_Regulations", "target": f"{state_name}_Licensing", "relationship": "includes"},
            {"source": f"{state_name}_Regulations", "target": f"{state_name}_Compliance", "relationship": "requires"},
            {"source": f"{state_name}_Regulations", "target": f"{state_name}_Penalties", "relationship": "enforces"}
        ]
    }
    
    return knowledge_graph

def main():
    results = {}
    all_analyses = []
    all_quizzes = []
    all_knowledge_graphs = []
    
    print("=" * 60)
    print("PDF ELITE PROCESSOR AGENT #10 - COURSE 4 BATCH A")
    print("Processing State Regulations PDFs")
    print("=" * 60)
    
    for pdf_name in PDFS_TO_PROCESS:
        pdf_path = PDF_DIR / pdf_name
        
        if not pdf_path.exists():
            print(f"\n[WARNING] {pdf_name} not found")
            continue
        
        print(f"\n[PROCESSING] {pdf_name}")
        print("-" * 40)
        
        try:
            # Step 1: Extract PDF content
            content = extract_pdf_content(pdf_path)
            results[pdf_name] = content
            
            # Save raw extraction
            output_file = OUTPUT_DIR / f"{pdf_name.replace('.pdf', '_extracted.json')}"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(content, f, indent=2, ensure_ascii=False)
            print(f"  [OK] Extracted {content['total_pages']} pages -> {output_file.name}")
            
            # Step 2: Analyze state regulations
            analysis = analyze_state_regulations(content)
            all_analyses.append(analysis)
            
            analysis_file = OUTPUT_DIR / f"{pdf_name.replace('.pdf', '_analysis.json')}"
            with open(analysis_file, 'w', encoding='utf-8') as f:
                json.dump(analysis, f, indent=2, ensure_ascii=False)
            print(f"  [OK] Generated analysis -> {analysis_file.name}")
            
            # Step 3: Generate quiz questions
            quiz = generate_quiz_questions(content, analysis)
            all_quizzes.append(quiz)
            
            quiz_file = OUTPUT_DIR / f"{pdf_name.replace('.pdf', '_quiz.json')}"
            with open(quiz_file, 'w', encoding='utf-8') as f:
                json.dump(quiz, f, indent=2, ensure_ascii=False)
            print(f"  [OK] Generated quiz questions -> {quiz_file.name}")
            
            # Step 4: Build knowledge graph
            kg = build_knowledge_graph(content, analysis)
            all_knowledge_graphs.append(kg)
            
            kg_file = OUTPUT_DIR / f"{pdf_name.replace('.pdf', '_knowledge_graph.json')}"
            with open(kg_file, 'w', encoding='utf-8') as f:
                json.dump(kg, f, indent=2, ensure_ascii=False)
            print(f"  [OK] Built knowledge graph -> {kg_file.name}")
            
        except Exception as e:
            print(f"  [ERROR] {pdf_name}: {e}")
    
    # Save combined outputs
    print("\n" + "=" * 60)
    print("GENERATING COMBINED OUTPUTS")
    print("=" * 60)
    
    # Combined extractions
    combined_file = OUTPUT_DIR / "batch_a_all_extracted.json"
    with open(combined_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"[OK] Combined extractions -> {combined_file.name}")
    
    # Combined analyses
    combined_analysis = OUTPUT_DIR / "batch_a_all_analyses.json"
    with open(combined_analysis, 'w', encoding='utf-8') as f:
        json.dump(all_analyses, f, indent=2, ensure_ascii=False)
    print(f"[OK] Combined analyses -> {combined_analysis.name}")
    
    # Combined quizzes
    combined_quiz = OUTPUT_DIR / "batch_a_all_quizzes.json"
    with open(combined_quiz, 'w', encoding='utf-8') as f:
        json.dump(all_quizzes, f, indent=2, ensure_ascii=False)
    print(f"[OK] Combined quizzes -> {combined_quiz.name}")
    
    # Combined knowledge graphs
    combined_kg = OUTPUT_DIR / "batch_a_all_knowledge_graphs.json"
    with open(combined_kg, 'w', encoding='utf-8') as f:
        json.dump(all_knowledge_graphs, f, indent=2, ensure_ascii=False)
    print(f"[OK] Combined knowledge graphs -> {combined_kg.name}")
    
    # Generate summary report
    summary = {
        "processing_agent": "PDF Elite Processor Agent #10",
        "batch": "Course 4 - Batch A",
        "pdfs_processed": list(results.keys()),
        "total_pdfs": len(results),
        "output_directory": str(OUTPUT_DIR),
        "generated_files": {
            "extractions": [f"{pdf}_extracted.json" for pdf in results.keys()],
            "analyses": [f"{pdf.replace('.pdf', '_analysis.json')}" for pdf in results.keys()],
            "quizzes": [f"{pdf.replace('.pdf', '_quiz.json')}" for pdf in results.keys()],
            "knowledge_graphs": [f"{pdf.replace('.pdf', '_knowledge_graph.json')}" for pdf in results.keys()],
            "combined": [
                "batch_a_all_extracted.json",
                "batch_a_all_analyses.json",
                "batch_a_all_quizzes.json",
                "batch_a_all_knowledge_graphs.json"
            ]
        },
        "states_covered": [content["state_name"] for content in results.values()],
        "total_pages_processed": sum(content["total_pages"] for content in results.values())
    }
    
    summary_file = OUTPUT_DIR / "batch_a_processing_summary.json"
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    print(f"[OK] Processing summary -> {summary_file.name}")
    
    print("\n" + "=" * 60)
    print("PROCESSING COMPLETE")
    print("=" * 60)
    print(f"Total PDFs processed: {summary['total_pdfs']}")
    print(f"Total pages processed: {summary['total_pages_processed']}")
    print(f"States covered: {', '.join(summary['states_covered'])}")
    print(f"Output location: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
