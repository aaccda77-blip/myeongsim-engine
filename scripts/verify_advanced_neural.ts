
import { CalculateNeuralProfile } from '../src/utils/NeuralProfileCalculator';

console.log("🔍 Verifying Advanced Neural Calculation...");

// Test Date: 1990-01-01 12:00
const testDate = new Date("1990-01-01T12:00:00");
console.log(`📅 Test Date: ${testDate.toISOString()}`);

try {
    const profile = CalculateNeuralProfile(testDate);

    console.log("\n[🧬 Activation Sequence]");
    console.log("LifeWork:", profile.lifeWork);
    console.log("Evolution:", profile.evolution);
    console.log("Radiance:", profile.radiance);
    console.log("Purpose:", profile.purpose);

    console.log("\n[💖 Venus Sequence (Relationships)]");
    console.log("Attraction (Design Moon):", profile.attraction);
    console.log("IQ (Design Venus):", profile.iq);
    console.log("EQ (Design Mars):", profile.eq);
    console.log("SQ (Design Venus):", profile.sq);

    console.log("\n[💰 Pearl Sequence (Prosperity)]");
    console.log("Vocation (Design Mars):", profile.vocation);
    console.log("Culture (Design Jupiter):", profile.culture);
    console.log("Pearl (Personality Jupiter):", profile.pearl);

    if (profile.attraction && profile.vocation) {
        console.log("\n✅ SUCCESS: Advanced layers are active.");
    } else {
        console.error("\n❌ FAILED: Advanced layers are missing.");
        process.exit(1);
    }

} catch (e) {
    console.error("Error:", e);
    process.exit(1);
}
