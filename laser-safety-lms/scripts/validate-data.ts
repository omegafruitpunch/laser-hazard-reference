#!/usr/bin/env tsx
/**
 * Data Validation Script
 * 
 * Validates all JSON data files for:
 * - Valid JSON syntax
 * - Required fields
 * - Referential integrity
 * - Type consistency
 */

import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');

interface ValidationResult {
  file: string;
  valid: boolean;
  errors: string[];
}

/**
 * Validate a single JSON file
 */
async function validateJsonFile(filePath: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    file: path.relative(process.cwd(), filePath),
    valid: true,
    errors: [],
  };

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Check required fields based on file type
    if (filePath.includes('/courses/')) {
      validateCourse(data, result);
    } else if (filePath.includes('/modules/')) {
      validateModule(data, result);
    } else if (filePath.includes('/quiz-banks/')) {
      validateQuizBank(data, result);
    } else if (filePath.includes('/knowledge-graph/')) {
      validateKnowledgeGraph(data, result);
    }

  } catch (error) {
    result.valid = false;
    if (error instanceof SyntaxError) {
      result.errors.push(`Invalid JSON: ${error.message}`);
    } else {
      result.errors.push(`Error reading file: ${error}`);
    }
  }

  return result;
}

/**
 * Validate course structure
 */
function validateCourse(data: unknown, result: ValidationResult): void {
  const course = data as Record<string, unknown>;
  const requiredFields = ['id', 'title', 'description', 'duration', 'difficulty', 'modules'];

  for (const field of requiredFields) {
    if (!(field in course)) {
      result.valid = false;
      result.errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate ID format
  if (course.id && !/^course-\d+$/.test(course.id as string)) {
    result.valid = false;
    result.errors.push(`Invalid course ID format: ${course.id}`);
  }

  // Validate difficulty values
  const validDifficulties = ['beginner', 'intermediate', 'advanced'];
  if (course.difficulty && !validDifficulties.includes(course.difficulty as string)) {
    result.valid = false;
    result.errors.push(`Invalid difficulty: ${course.difficulty}. Must be one of: ${validDifficulties.join(', ')}`);
  }

  // Validate modules is an array
  if (course.modules && !Array.isArray(course.modules)) {
    result.valid = false;
    result.errors.push('modules must be an array');
  }
}

/**
 * Validate module structure
 */
function validateModule(data: unknown, result: ValidationResult): void {
  const module = data as Record<string, unknown>;
  const requiredFields = ['id', 'courseId', 'title', 'description', 'order', 'duration', 'phases'];

  for (const field of requiredFields) {
    if (!(field in module)) {
      result.valid = false;
      result.errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate ID format
  if (module.id && !/^module-\d+-\d+$/.test(module.id as string)) {
    result.valid = false;
    result.errors.push(`Invalid module ID format: ${module.id}`);
  }

  // Validate courseId reference
  if (module.courseId && !/^course-\d+$/.test(module.courseId as string)) {
    result.valid = false;
    result.errors.push(`Invalid courseId reference: ${module.courseId}`);
  }

  // Validate phases structure
  if (module.phases && Array.isArray(module.phases)) {
    const validPhaseTypes = ['warmup', 'core', 'practice', 'challenge'];
    module.phases.forEach((phase: Record<string, unknown>, index: number) => {
      if (!phase.type || !validPhaseTypes.includes(phase.type as string)) {
        result.valid = false;
        result.errors.push(`Invalid phase type at index ${index}: ${phase.type}`);
      }
      if (!phase.title) {
        result.valid = false;
        result.errors.push(`Missing title in phase at index ${index}`);
      }
    });
  }
}

/**
 * Validate quiz bank structure
 */
function validateQuizBank(data: unknown, result: ValidationResult): void {
  const quizBank = data as Record<string, unknown>;
  const requiredFields = ['id', 'courseId', 'title', 'questions'];

  for (const field of requiredFields) {
    if (!(field in quizBank)) {
      result.valid = false;
      result.errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate questions
  if (quizBank.questions && Array.isArray(quizBank.questions)) {
    quizBank.questions.forEach((question: Record<string, unknown>, index: number) => {
      if (!question.id) {
        result.valid = false;
        result.errors.push(`Missing ID in question at index ${index}`);
      }
      if (!question.question) {
        result.valid = false;
        result.errors.push(`Missing question text at index ${index}`);
      }
      if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
        result.valid = false;
        result.errors.push(`Invalid options in question at index ${index}`);
      }
      if (typeof question.correctIndex !== 'number') {
        result.valid = false;
        result.errors.push(`Missing or invalid correctIndex in question at index ${index}`);
      }
    });
  }
}

/**
 * Validate knowledge graph structure
 */
function validateKnowledgeGraph(data: unknown, result: ValidationResult): void {
  const graph = data as Record<string, unknown>;

  if (!graph.entities || !Array.isArray(graph.entities)) {
    result.valid = false;
    result.errors.push('Missing or invalid entities array');
  }

  if (!graph.relationships || !Array.isArray(graph.relationships)) {
    result.valid = false;
    result.errors.push('Missing or invalid relationships array');
  }

  // Check for duplicate entity IDs
  if (graph.entities && Array.isArray(graph.entities)) {
    const ids = new Set<string>();
    graph.entities.forEach((entity: Record<string, unknown>) => {
      if (ids.has(entity.global_id as string)) {
        result.valid = false;
        result.errors.push(`Duplicate entity ID: ${entity.global_id}`);
      }
      ids.add(entity.global_id as string);
    });
  }
}

/**
 * Recursively find all JSON files in a directory
 */
async function findJsonFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await findJsonFiles(fullPath)));
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return files;
}

/**
 * Main validation function
 */
async function validateAllData(): Promise<void> {
  console.log('🔍 Validating data files...\n');

  const jsonFiles = await findJsonFiles(DATA_DIR);
  console.log(`Found ${jsonFiles.length} JSON files to validate\n`);

  const results: ValidationResult[] = [];

  for (const file of jsonFiles) {
    const result = await validateJsonFile(file);
    results.push(result);

    if (result.valid) {
      console.log(`✅ ${result.file}`);
    } else {
      console.log(`❌ ${result.file}`);
      result.errors.forEach(error => console.log(`   - ${error}`));
    }
  }

  // Summary
  const validCount = results.filter(r => r.valid).length;
  const invalidCount = results.length - validCount;

  console.log('\n' + '='.repeat(50));
  console.log(`Validation Summary:`);
  console.log(`  Total files: ${results.length}`);
  console.log(`  Valid: ${validCount} ✅`);
  console.log(`  Invalid: ${invalidCount} ❌`);

  if (invalidCount > 0) {
    console.log('\nValidation failed! Please fix the errors above.');
    process.exit(1);
  } else {
    console.log('\n✨ All data files are valid!');
    process.exit(0);
  }
}

// Run validation
validateAllData();
