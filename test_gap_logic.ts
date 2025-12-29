/* eslint-disable */
const { MBTIMapper } = require('./src/modules/MBTIMapper');
const { GapAnalysisService } = require('./src/modules/GapAnalysisService');
const { CodeDecoder } = require('./src/modules/CodeDecoder');

// Mock Data for "NC-06" (Diplomat)
const innateVector = [0, 0, 2.0, 0, 2.0]; // Social/Flexible dominant

// Test Case 1: High Gap Scenario
console.log("🔹 [Test 1] Simulating NC-06 User with 'Gap High' Response...");

// User is ISFP (Passive/Emotional -> Gap with Opportunity Code?)
const acquiredVector1 = MBTIMapper.getVector("ISFP");
// Add High Gap Answer: "Avoid conflict" -> [2.0, 0, 0, 0, 0] (Passive/Caution)
// Acquired = ISFP Vector + Answer Vector
// ISFP Vector (approx): [1.5, 0, 0.5, 0, 1.5] (Passive + Social/Flex)
// Combined: [3.5, 0, 0.5, 0, 1.5] vs Innate [0, 0, 2.0, 0, 2.0]
// Distance should be high on Index 0.

acquiredVector1[0] += 2.0; // Simulate adding question value

const result1 = GapAnalysisService.calculateGap(innateVector, acquiredVector1);
console.log(`   gapLevel: ${result1.gapLevel}% (Expect > 30%)`);

const decoded1 = CodeDecoder.decodeState("NC-06", result1.gapLevel, "ISFP");
console.log(`   Genre: ${decoded1.description}`);
console.log(`   Opening: ${result1.gapLevel > 30 ? "Dark Code (Correct)" : "Neural Code (Fail)"}`);


// Test Case 2: Low Gap Scenario
console.log("\n🔹 [Test 2] Simulating NC-06 User with 'Optimal' Response...");
const acquiredVector2 = [0, 0, 2.0, 0, 2.0]; // Perfectly matching Acquired
const result2 = GapAnalysisService.calculateGap(innateVector, acquiredVector2);
console.log(`   gapLevel: ${result2.gapLevel}% (Expect < 30%)`);
console.log(`   Opening: ${result2.gapLevel <= 30 ? "Neural Code (Correct)" : "Dark Code (Fail)"}`);
