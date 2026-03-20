#!/usr/bin/env python3
"""
Master Knowledge Graph Generator
Integrates all course knowledge graphs into a unified learning map
"""

import json
import os
from datetime import datetime
from collections import defaultdict

# Entity type taxonomy
ENTITY_TYPES = [
    "concept", "regulation", "standard", "procedure", 
    "hazard", "control", "calculation", "equipment",
    "organization", "role", "laser_class", "wavelength_range",
    "document", "training_topic", "requirement", "safety_measure"
]

# Relationship type taxonomy
RELATIONSHIP_TYPES = [
    "requires", "relates_to", "implements", "prohibits", 
    "mandates", "calculates", "protects_against", "defines",
    "enforces", "governs", "applies_to", "supersedes",
    "references", "complies_with", "certifies", "supplements"
]

# Course metadata
COURSES = {
    "course-1": {"name": "Laser Safety Fundamentals", "level": "beginner", "order": 1},
    "course-2": {"name": "FDA Compliance", "level": "intermediate", "order": 2},
    "course-3": {"name": "Biological Hazards", "level": "intermediate", "order": 3},
    "course-4": {"name": "State Regulations", "level": "intermediate", "order": 4},
    "course-5": {"name": "International Regulations", "level": "advanced", "order": 5},
    "course-6": {"name": "Outdoor & Airspace Safety", "level": "advanced", "order": 6},
    "course-7": {"name": "Event Safety", "level": "intermediate", "order": 7},
    "course-8": {"name": "Industry Standards", "level": "advanced", "order": 8},
}

def normalize_entity(entity, course_id, source_file):
    """Normalize entity to common format"""
    normalized = {
        "global_id": None,  # Will be assigned
        "course_id": course_id,
        "source_file": source_file,
        "original_id": entity.get("id") or entity.get("entity_id") or entity.get("node_id"),
        "name": entity.get("name") or entity.get("label") or entity.get("entity_name", ""),
        "type": normalize_type(entity.get("type") or entity.get("entity_type", "concept")),
        "attributes": {},
        "aliases": []
    }
    
    # Collect all attributes
    for key in ["attributes", "properties", "description", "definition", "severity", 
                "authority", "scope", "responsibilities", "power_limit", "hazard",
                "range", "wavelength", "status", "abbreviation", "full_name"]:
        if key in entity and entity[key]:
            if isinstance(entity[key], dict):
                normalized["attributes"].update(entity[key])
            else:
                normalized["attributes"][key] = entity[key]
    
    return normalized

def normalize_type(entity_type):
    """Normalize entity type to taxonomy"""
    type_mapping = {
        "regulatory_body": "regulation",
        "laser_class": "concept",
        "TechnicalTerm": "concept",
        "Hazard": "hazard",
        "Role": "role",
        "Regulation": "regulation",
        "Standard": "standard",
        "SafetySystem": "equipment",
        "LaserType": "equipment",
        "Organization": "organization",
        "training_topic": "training_topic",
        "document": "document",
        "requirement": "requirement",
        "state": "concept",
        "agency": "organization",
        "cfr": "regulation",
        "guidance": "document",
        "section": "concept",
        "category": "concept",
        "standard": "standard",
        "jurisdiction": "concept",
        "safety_parameter": "concept",
        "injury_effect": "hazard",
        "mechanism": "concept",
        "protection_mechanism": "control",
        "wavelength_range": "concept",
        "organ": "concept",
        "structure": "concept",
        "layer": "concept",
        "protective_pigment": "concept",
        "safety_measure": "control",
        "classification": "concept",
        "country": "concept",
        "concept": "concept"
    }
    return type_mapping.get(entity_type, entity_type)

def extract_entities_from_kg(kg_data, course_id, source_file):
    """Extract entities from various knowledge graph formats"""
    entities = []
    
    # Handle different structures
    if "knowledge_graph" in kg_data:
        kg = kg_data["knowledge_graph"]
        if "entities" in kg:
            for e in kg["entities"]:
                entities.append(normalize_entity(e, course_id, source_file))
        if "nodes" in kg:
            for n in kg["nodes"]:
                if isinstance(n, dict):
                    entities.append(normalize_entity(n, course_id, source_file))
    
    # Handle nodes dict with categories (e.g., "entities", "organizations", "standards")
    if "nodes" in kg_data and isinstance(kg_data["nodes"], dict):
        for category, items in kg_data["nodes"].items():
            if isinstance(items, list):
                for item in items:
                    if isinstance(item, dict):
                        item["_category"] = category
                        entities.append(normalize_entity(item, course_id, source_file))
    elif "nodes" in kg_data and isinstance(kg_data["nodes"], list):
        for n in kg_data["nodes"]:
            if isinstance(n, dict):
                entities.append(normalize_entity(n, course_id, source_file))
    
    if "entities" in kg_data and isinstance(kg_data["entities"], list):
        for e in kg_data["entities"]:
            if isinstance(e, dict):
                entities.append(normalize_entity(e, course_id, source_file))
    
    # Handle nested structure in course-8
    if "knowledge_graph" in kg_data and "nodes" in kg_data["knowledge_graph"]:
        nodes = kg_data["knowledge_graph"]["nodes"]
        if isinstance(nodes, dict):
            for category, items in nodes.items():
                if isinstance(items, list):
                    for item in items:
                        if isinstance(item, dict):
                            item["_category"] = category
                            if not any(e.get("original_id") == item.get("id") for e in entities):
                                entities.append(normalize_entity(item, course_id, source_file))
    
    return entities

def extract_relationships_from_kg(kg_data, course_id, source_file, entity_id_map):
    """Extract relationships from various knowledge graph formats"""
    relationships = []
    
    rel_data = []
    if "knowledge_graph" in kg_data:
        kg = kg_data["knowledge_graph"]
        if "relationships" in kg:
            rel_data = kg["relationships"]
        elif "edges" in kg:
            rel_data = kg["edges"]
    
    # Handle edges dict with relationships array
    if "edges" in kg_data and isinstance(kg_data["edges"], dict):
        if "relationships" in kg_data["edges"]:
            rel_data = kg_data["edges"]["relationships"]
    elif "edges" in kg_data and isinstance(kg_data["edges"], list):
        rel_data = kg_data["edges"]
    
    if "relationships" in kg_data and isinstance(kg_data["relationships"], list):
        rel_data = kg_data["relationships"]
    
    for rel in rel_data:
        if not isinstance(rel, dict):
            continue
            
        source = rel.get("source") or rel.get("from") or rel.get("source_id")
        target = rel.get("target") or rel.get("to") or rel.get("target_id")
        rel_type = rel.get("type") or rel.get("relation") or rel.get("relationship", "relates_to")
        
        if source and target:
            relationships.append({
                "source": source,
                "target": target,
                "type": rel_type,
                "course_id": course_id,
                "source_file": source_file,
                "attributes": {k: v for k, v in rel.items() 
                              if k not in ["source", "target", "type", "relation", "relationship", "from", "to"]}
            })
    
    return relationships

def deduplicate_entities(entities):
    """Deduplicate entities across courses based on name similarity"""
    # Create name-based clusters
    name_clusters = defaultdict(list)
    
    for entity in entities:
        # Normalize name for clustering
        name_key = entity["name"].lower().strip()
        # Remove common suffixes/prefixes for better matching
        name_key = name_key.replace("(lso)", "").replace("lso", "laser safety officer")
        name_key = name_key.replace("mpe", "maximum permissible exposure")
        name_key = name_key.replace("nohd", "nominal ocular hazard distance")
        name_clusters[name_key].append(entity)
    
    # Merge clusters
    deduplicated = []
    global_id = 0
    entity_mapping = {}  # Maps (course_id, original_id) -> global_id
    
    for name_key, cluster in name_clusters.items():
        # Create merged entity
        merged = {
            "global_id": f"E{global_id:05d}",
            "name": cluster[0]["name"],
            "type": cluster[0]["type"],
            "attributes": {},
            "course_origins": [],
            "aliases": set()
        }
        
        # Merge attributes and track origins
        for entity in cluster:
            merged["attributes"].update(entity["attributes"])
            merged["aliases"].add(entity["name"])
            merged["course_origins"].append({
                "course_id": entity["course_id"],
                "original_id": entity["original_id"],
                "source_file": entity["source_file"]
            })
            # Map original IDs to global ID
            key = (entity["course_id"], entity["original_id"])
            entity_mapping[key] = merged["global_id"]
        
        merged["aliases"] = list(merged["aliases"])
        deduplicated.append(merged)
        global_id += 1
    
    return deduplicated, entity_mapping

def build_cross_course_connections(entities, relationships):
    """Build explicit cross-course connections"""
    connections = []
    
    # Find entities that appear in multiple courses
    entity_courses = defaultdict(set)
    for entity in entities:
        for origin in entity.get("course_origins", []):
            entity_courses[entity["global_id"]].add(origin["course_id"])
    
    # Create cross-course links for entities appearing in multiple courses
    for global_id, courses in entity_courses.items():
        if len(courses) > 1:
            entity = next(e for e in entities if e["global_id"] == global_id)
            connections.append({
                "type": "shared_concept",
                "entity_id": global_id,
                "entity_name": entity["name"],
                "entity_type": entity["type"],
                "courses": sorted(list(courses)),
                "description": f"'{entity['name']}' appears in {len(courses)} courses"
            })
    
    # Add prerequisite relationships between courses
    prerequisite_map = [
        ("course-1", "course-2", "Fundamentals required for FDA Compliance"),
        ("course-1", "course-3", "Fundamentals required for Biological Hazards"),
        ("course-2", "course-4", "FDA Compliance informs State Regulations"),
        ("course-1", "course-5", "Fundamentals required for International Regulations"),
        ("course-1", "course-6", "Fundamentals required for Outdoor Safety"),
        ("course-3", "course-6", "Bio-effects inform Outdoor Safety"),
        ("course-5", "course-6", "International informs Outdoor Airspace"),
        ("course-1", "course-7", "Fundamentals required for Event Safety"),
        ("course-6", "course-7", "Outdoor Safety informs Event Safety"),
        ("course-1", "course-8", "Fundamentals required for Standards"),
        ("course-2", "course-8", "FDA Compliance relates to Standards"),
    ]
    
    for prereq, course, desc in prerequisite_map:
        connections.append({
            "type": "course_prerequisite",
            "from_course": prereq,
            "to_course": course,
            "description": desc
        })
    
    return connections

def generate_learning_paths(entities, relationships):
    """Generate personalized learning paths"""
    
    # Beginner Path
    beginner_path = {
        "name": "Beginner Path",
        "description": "Essential fundamentals for all laser safety personnel",
        "target_audience": "New laser operators, venue staff, basic users",
        "estimated_hours": 8,
        "prerequisites": [],
        "courses": ["course-1", "course-3"],
        "modules": [
            {"course": "course-1", "focus": "Laser fundamentals and classification"},
            {"course": "course-3", "focus": "Basic bio-effects and MPE concepts"}
        ],
        "key_concepts": [
            "Laser Classification (Class 1-4)",
            "Basic eye and skin hazards",
            "MPE fundamentals",
            "Safety controls overview"
        ],
        "certification_outcome": "Basic Laser Safety Awareness"
    }
    
    # LSO Certification Path
    lso_path = {
        "name": "LSO Certification Path",
        "description": "Complete preparation for Certified Laser Safety Officer",
        "target_audience": "Aspiring Laser Safety Officers",
        "estimated_hours": 45,
        "prerequisites": ["Basic laser safety knowledge"],
        "courses": ["course-1", "course-3", "course-8", "course-2", "course-4"],
        "modules": [
            {"course": "course-1", "focus": "Core fundamentals", "required": True},
            {"course": "course-3", "focus": "Bio-effects and MPE calculations", "required": True},
            {"course": "course-8", "focus": "Industry standards (ANSI Z136)", "required": True},
            {"course": "course-2", "focus": "FDA regulatory framework", "required": True},
            {"course": "course-4", "focus": "State-specific requirements", "required": False}
        ],
        "key_concepts": [
            "LSO responsibilities and authority",
            "MPE/NOHD calculations",
            "ANSI Z136.1 requirements",
            "FDA 21 CFR 1040 compliance",
            "State regulatory variations"
        ],
        "certification_outcome": "Preparation for CLSO/CMLSO certification"
    }
    
    # Compliance Officer Path
    compliance_path = {
        "name": "Compliance Officer Path",
        "description": "Comprehensive regulatory compliance training",
        "target_audience": "Regulatory compliance officers, legal staff",
        "estimated_hours": 50,
        "prerequisites": ["Basic laser knowledge"],
        "courses": ["course-1", "course-2", "course-4", "course-5", "course-8"],
        "modules": [
            {"course": "course-1", "focus": "Fundamentals foundation", "required": True},
            {"course": "course-2", "focus": "FDA federal regulations", "required": True},
            {"course": "course-4", "focus": "State regulations (all states)", "required": True},
            {"course": "course-5", "focus": "International regulations", "required": True},
            {"course": "course-8", "focus": "Standards compliance", "required": True}
        ],
        "key_concepts": [
            "Federal vs State jurisdiction",
            "FDA reporting requirements",
            "State-by-state variations",
            "International harmonization",
            "Variance procedures"
        ],
        "certification_outcome": "Laser Regulatory Compliance Specialist"
    }
    
    # Technician Path
    technician_path = {
        "name": "Laser Technician Path",
        "description": "Practical skills for laser show technicians",
        "target_audience": "Laser operators, show technicians, roadies",
        "estimated_hours": 35,
        "prerequisites": [],
        "courses": ["course-1", "course-3", "course-7", "course-6"],
        "modules": [
            {"course": "course-1", "focus": "Fundamentals", "required": True},
            {"course": "course-3", "focus": "Bio-effects and eyewear", "required": True},
            {"course": "course-7", "focus": "Event safety and crowd management", "required": True},
            {"course": "course-6", "focus": "Outdoor shows and FAA coordination", "required": False}
        ],
        "key_concepts": [
            "Safe laser operation",
            "Protective eyewear selection",
            "Crowd safety protocols",
            "Emergency procedures",
            "NOTAM procedures (if outdoor)"
        ],
        "certification_outcome": "Certified Laser Show Technician"
    }
    
    # Advanced Practitioner Path
    advanced_path = {
        "name": "Advanced Practitioner Path",
        "description": "Expert-level comprehensive training",
        "target_audience": "Experienced LSOs, consultants, advanced practitioners",
        "estimated_hours": 65,
        "prerequisites": ["LSO certification or equivalent experience"],
        "courses": ["course-1", "course-2", "course-3", "course-4", "course-5", "course-6", "course-7", "course-8"],
        "modules": [
            {"course": "course-1", "focus": "Advanced fundamentals review", "required": True},
            {"course": "course-2", "focus": "Advanced FDA compliance", "required": True},
            {"course": "course-3", "focus": "Advanced bio-effects", "required": True},
            {"course": "course-4", "focus": "Multi-state compliance", "required": True},
            {"course": "course-5", "focus": "Global regulatory framework", "required": True},
            {"course": "course-6", "focus": "Complex outdoor operations", "required": True},
            {"course": "course-7", "focus": "Large-scale event safety", "required": True},
            {"course": "course-8", "focus": "Standards interpretation", "required": True}
        ],
        "key_concepts": [
            "All core concepts",
            "Complex compliance scenarios",
            "Multi-jurisdictional shows",
            "Risk assessment methodologies",
            "Standards development process"
        ],
        "certification_outcome": "Advanced Laser Safety Professional"
    }
    
    return {
        "beginner": beginner_path,
        "lso_certification": lso_path,
        "compliance_officer": compliance_path,
        "technician": technician_path,
        "advanced": advanced_path
    }

def build_entity_index(entities):
    """Build searchable entity index"""
    index = {
        "by_type": defaultdict(list),
        "by_course": defaultdict(list),
        "by_name": {},
        "search_terms": defaultdict(list)
    }
    
    for entity in entities:
        # By type
        index["by_type"][entity["type"]].append(entity["global_id"])
        
        # By course
        for origin in entity.get("course_origins", []):
            index["by_course"][origin["course_id"]].append(entity["global_id"])
        
        # By name
        index["by_name"][entity["name"].lower()] = entity["global_id"]
        
        # Search terms
        words = entity["name"].lower().split()
        for word in words:
            if len(word) > 2:
                index["search_terms"][word].append(entity["global_id"])
    
    # Convert defaultdicts to regular dicts
    return {
        "by_type": dict(index["by_type"]),
        "by_course": dict(index["by_course"]),
        "by_name": index["by_name"],
        "search_terms": dict(index["search_terms"])
    }

def main():
    """Main function to build master knowledge graph"""
    
    base_path = "lms_data/knowledge_graphs"
    all_entities = []
    all_relationships = []
    
    # Load all knowledge graphs
    kg_files = [
        ("course-1", "course-1-knowledge-graph.json"),
        ("course-1", "course-1/beam-hazard-calculations_kg.json"),
        ("course-1", "course-1/lso-role_kg.json"),
        ("course-2", "course-2-knowledge-graph.json"),
        ("course-2", "course-2/fda-forms_knowledge_graph.json"),
        ("course-2", "course-2/laser-notice-50_knowledge_graph.json"),
        ("course-3", "course-3/ocular-hazards_knowledge_graph.json"),
        ("course-3", "course-3/skin-hazards_knowledge_graph.json"),
        ("course-4", "course-4/batch_c_knowledge_graph.json"),
        ("course-5", "course-5/module-5-4-knowledge-graph.json"),
        ("course-5", "course-5/module-5-5-knowledge-graph.json"),
        ("course-5", "course-5/module-5-6-knowledge-graph.json"),
        ("course-6", "course-6/outdoor_airspace_kg.json"),
        ("course-8", "course-8/knowledge_graph.json"),
    ]
    
    print("Loading knowledge graphs...")
    for course_id, file_path in kg_files:
        full_path = os.path.join(base_path, file_path)
        if os.path.exists(full_path):
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                entities = extract_entities_from_kg(data, course_id, file_path)
                all_entities.extend(entities)
                print(f"  Loaded {file_path}: {len(entities)} entities")
            except Exception as e:
                print(f"  Error loading {file_path}: {e}")
        else:
            print(f"  File not found: {full_path}")
    
    print(f"\nTotal entities extracted: {len(all_entities)}")
    
    # Deduplicate entities
    print("\nDeduplicating entities...")
    deduplicated_entities, entity_mapping = deduplicate_entities(all_entities)
    print(f"Unique entities after deduplication: {len(deduplicated_entities)}")
    
    # Extract relationships
    print("\nExtracting relationships...")
    for course_id, file_path in kg_files:
        full_path = os.path.join(base_path, file_path)
        if os.path.exists(full_path):
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                rels = extract_relationships_from_kg(data, course_id, file_path, entity_mapping)
                all_relationships.extend(rels)
            except Exception as e:
                pass
    
    print(f"Total relationships extracted: {len(all_relationships)}")
    
    # Build cross-course connections
    print("\nBuilding cross-course connections...")
    cross_connections = build_cross_course_connections(deduplicated_entities, all_relationships)
    print(f"Cross-course connections identified: {len(cross_connections)}")
    
    # Generate learning paths
    print("\nGenerating learning paths...")
    learning_paths = generate_learning_paths(deduplicated_entities, all_relationships)
    
    # Build course summaries
    course_summaries = {}
    for course_id in COURSES:
        course_entities = [e for e in deduplicated_entities 
                          if any(o["course_id"] == course_id for o in e.get("course_origins", []))]
        entry_points = [e["global_id"] for e in course_entities 
                       if e["type"] in ["concept", "regulation", "standard"]][:5]
        
        course_summaries[course_id] = {
            "name": COURSES[course_id]["name"],
            "level": COURSES[course_id]["level"],
            "order": COURSES[course_id]["order"],
            "entity_count": len(course_entities),
            "entry_points": entry_points,
            "key_entities": [e["global_id"] for e in course_entities[:10]]
        }
    
    # Build master knowledge graph
    master_kg = {
        "version": "1.0.0",
        "generated_at": datetime.now().isoformat(),
        "total_entities": len(deduplicated_entities),
        "total_relationships": len(all_relationships),
        "entity_types": ENTITY_TYPES,
        "relationship_types": RELATIONSHIP_TYPES,
        "entities": deduplicated_entities,
        "relationships": all_relationships,
        "courses": course_summaries,
        "cross_course_connections": cross_connections,
        "learning_paths": learning_paths
    }
    
    # Save master knowledge graph
    output_path = "lms_data/master_knowledge_graph.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(master_kg, f, indent=2, ensure_ascii=False)
    print(f"\n[OK] Master knowledge graph saved to: {output_path}")
    
    # Build and save entity index
    entity_index = build_entity_index(deduplicated_entities)
    index_path = "lms_data/knowledge_graph/entity_index.json"
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(entity_index, f, indent=2, ensure_ascii=False)
    print(f"[OK] Entity index saved to: {index_path}")
    
    # Save learning paths separately
    paths_path = "lms_data/knowledge_graph/learning_paths.json"
    with open(paths_path, 'w', encoding='utf-8') as f:
        json.dump(learning_paths, f, indent=2, ensure_ascii=False)
    print(f"[OK] Learning paths saved to: {paths_path}")
    
    # Print summary
    print("\n" + "="*60)
    print("MASTER KNOWLEDGE GRAPH SUMMARY")
    print("="*60)
    print(f"Total unique entities: {len(deduplicated_entities)}")
    print(f"Total relationships: {len(all_relationships)}")
    print(f"Cross-course connections: {len(cross_connections)}")
    print(f"Learning paths: {len(learning_paths)}")
    
    print("\nEntities by type:")
    type_counts = defaultdict(int)
    for e in deduplicated_entities:
        type_counts[e["type"]] += 1
    for t, count in sorted(type_counts.items(), key=lambda x: -x[1]):
        print(f"  {t}: {count}")
    
    print("\nEntities by course:")
    for course_id, summary in sorted(course_summaries.items(), key=lambda x: x[1]["order"]):
        print(f"  {course_id}: {summary['entity_count']} entities")
    
    print("\nLearning paths available:")
    for path_id, path in learning_paths.items():
        print(f"  {path_id}: {path['name']} ({path['estimated_hours']} hours, {len(path['courses'])} courses)")

if __name__ == "__main__":
    main()
