
import { CalculateNeuralProfile } from '../src/utils/NeuralProfileCalculator';
import { getNeuralKey } from '../src/data/NeuralGateDb';

const testDates = [
    { name: "Master H (Example)", date: "1980-05-20T00:00:00" },
    { name: "Test User (1990)", date: "1990-01-01T00:00:00" }
];

console.log("💎 [Universal Engine Reality Check] 💎\n");

testDates.forEach(test => {
    const date = new Date(test.date);
    const profile = CalculateNeuralProfile(date);
    const lifeWorkKey = getNeuralKey(profile.lifeWork);

    console.log(`👤 ${test.name} (${test.date.split('T')[0]})`);
    console.log(`   🧬 Life's Work: Gate ${profile.lifeWork}`);
    console.log(`   ✨ Name: ${lifeWorkKey.name}`);
    console.log(`   🔑 Keycodes: [Dark] ${lifeWorkKey.dark_code} -> [Neural] ${lifeWorkKey.neural_code}`);
    console.log(`   ----------------------------------------------------------------`);
});
