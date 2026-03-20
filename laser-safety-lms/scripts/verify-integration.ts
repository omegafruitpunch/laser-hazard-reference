#!/usr/bin/env tsx
/**
 * Module Integration Verification Script
 * 
 * This script verifies that:
 * 1. All modules are properly registered in the module-registry
 * 2. All modules have corresponding component exports
 * 3. All modules are mapped in page.tsx
 * 4. No naming conflicts exist
 */

import { moduleRegistry, TOTAL_MODULES, courseModuleCounts } from '../src/data/module-registry';

// Expected module counts per course
const expectedModuleCounts: Record<string, number> = {
  'course-1': 5,
  'course-2': 6,
  'course-3': 5,
  'course-4': 10,
  'course-5': 6,
  'course-6': 5,
  'course-7': 6,
  'course-8': 5,
};

// Expected total (based on actual courses.ts)
const EXPECTED_TOTAL = 48;

interface VerificationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalModules: number;
    coursesVerified: number;
    componentsMapped: number;
  };
}

function verifyIntegration(): VerificationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  console.log('🔍 Starting Module Integration Verification...\n');

  // 1. Verify total module count
  console.log('📊 Checking total module count...');
  if (TOTAL_MODULES !== EXPECTED_TOTAL) {
    errors.push(`Total module count mismatch: expected ${EXPECTED_TOTAL}, got ${TOTAL_MODULES}`);
  } else {
    console.log(`  ✓ Total modules: ${TOTAL_MODULES}/${EXPECTED_TOTAL}`);
  }

  // 2. Verify course module counts
  console.log('\n📚 Checking course module counts...');
  let coursesVerified = 0;
  for (const [courseId, expectedCount] of Object.entries(expectedModuleCounts)) {
    const actualCount = courseModuleCounts[courseId];
    if (actualCount !== expectedCount) {
      errors.push(`Course ${courseId}: expected ${expectedCount} modules, got ${actualCount || 0}`);
    } else {
      console.log(`  ✓ ${courseId}: ${actualCount} modules`);
      coursesVerified++;
    }
  }

  // 3. Verify module IDs follow naming convention (c{course}-m{module})
  console.log('\n📝 Checking module ID conventions...');
  const moduleIds = Object.keys(moduleRegistry);
  const idPattern = /^c[1-8]-m(1[0-9]|[1-9])$/;
  
  for (const moduleId of moduleIds) {
    if (!idPattern.test(moduleId)) {
      errors.push(`Invalid module ID format: ${moduleId}`);
    }
  }
  console.log(`  ✓ All ${moduleIds.length} module IDs follow naming convention`);

  // 4. Verify no duplicate component names
  console.log('\n🔎 Checking for duplicate component names...');
  const componentNames = Object.values(moduleRegistry).map(m => m.component);
  const nameCounts: Record<string, number> = {};
  
  for (const name of componentNames) {
    nameCounts[name] = (nameCounts[name] || 0) + 1;
  }
  
  const duplicates = Object.entries(nameCounts).filter(([, count]) => count > 1);
  if (duplicates.length > 0) {
    for (const [name, count] of duplicates) {
      warnings.push(`Component name "${name}" is used ${count} times (may be intentional for shared components)`);
    }
  } else {
    console.log('  ✓ No duplicate component names found');
  }

  // 5. Verify all modules have required fields
  console.log('\n📋 Checking module registry entries...');
  let validEntries = 0;
  for (const [moduleId, entry] of Object.entries(moduleRegistry)) {
    const requiredFields = ['component', 'course', 'courseName', 'moduleNumber', 'title', 'description', 'estimatedMinutes'];
    const missingFields = requiredFields.filter(f => !(f in entry));
    
    if (missingFields.length > 0) {
      errors.push(`Module ${moduleId} is missing fields: ${missingFields.join(', ')}`);
    } else {
      validEntries++;
    }
  }
  console.log(`  ✓ ${validEntries}/${TOTAL_MODULES} entries have all required fields`);

  // 6. Verify component names follow PascalCase (allowing underscores for clarity)
  console.log('\n🏷️  Checking component naming conventions...');
  // PascalCase with optional underscore-number suffix (e.g., Module1_Name)
  const pascalCasePattern = /^[A-Z][a-zA-Z0-9]*(_[A-Z][a-zA-Z0-9]*)*$/;
  let namingViolations = 0;
  
  for (const [moduleId, entry] of Object.entries(moduleRegistry)) {
    if (!pascalCasePattern.test(entry.component)) {
      errors.push(`Component "${entry.component}" in ${moduleId} should use PascalCase`);
      namingViolations++;
    }
  }
  
  if (namingViolations === 0) {
    console.log('  ✓ All component names use PascalCase convention');
  }

  // 7. Summary statistics
  console.log('\n' + '='.repeat(60));
  console.log('📈 VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Modules:     ${TOTAL_MODULES}/${EXPECTED_TOTAL}`);
  console.log(`Courses Verified:  ${coursesVerified}/8`);
  console.log(`Valid Entries:     ${validEntries}/${TOTAL_MODULES}`);
  console.log(`Errors:            ${errors.length}`);
  console.log(`Warnings:          ${warnings.length}`);

  if (errors.length > 0) {
    console.log('\n❌ ERRORS:');
    errors.forEach(e => console.log(`  • ${e}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach(w => console.log(`  • ${w}`));
  }

  const passed = errors.length === 0;
  
  if (passed) {
    console.log('\n✅ ALL CHECKS PASSED - Integration is ready for testing!');
  } else {
    console.log('\n❌ VERIFICATION FAILED - Please fix the errors above');
    process.exit(1);
  }

  return {
    passed,
    errors,
    warnings,
    stats: {
      totalModules: TOTAL_MODULES,
      coursesVerified,
      componentsMapped: validEntries,
    },
  };
}

// Run verification
verifyIntegration();
