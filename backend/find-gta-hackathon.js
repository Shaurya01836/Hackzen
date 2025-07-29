// Script to find the GTA 6 Hackathon
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hackathon_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
const Hackathon = require('./model/HackathonModel');

async function findGTAHackathon() {
  try {
    console.log('🔍 Finding GTA 6 Hackathon...');
    
    // Search for hackathons with "GTA" in the title
    const gtaHackathons = await Hackathon.find({
      title: { $regex: /GTA/i }
    }).select('_id title rounds roundProgress');
    
    console.log(`📊 Found ${gtaHackathons.length} GTA hackathons:`);
    
    gtaHackathons.forEach((hackathon, index) => {
      console.log(`  ${index + 1}. ${hackathon.title}:`, {
        id: hackathon._id,
        rounds: hackathon.rounds?.length || 0,
        roundProgress: hackathon.roundProgress?.length || 0
      });
      
      if (hackathon.roundProgress) {
        hackathon.roundProgress.forEach((progress, pIndex) => {
          console.log(`    Round ${pIndex} progress:`, {
            roundIndex: progress.roundIndex,
            shortlistedSubmissions: progress.shortlistedSubmissions?.length || 0,
            shortlistedTeams: progress.shortlistedTeams?.length || 0,
            roundCompleted: progress.roundCompleted,
            shortlistedAt: progress.shortlistedAt
          });
        });
      }
    });
    
    // Also search for all hackathons to see if there are any with similar names
    const allHackathons = await Hackathon.find({}).select('_id title');
    console.log(`\n📊 All hackathons (${allHackathons.length}):`);
    
    allHackathons.forEach((hackathon, index) => {
      console.log(`  ${index + 1}. ${hackathon.title}: ${hackathon._id}`);
    });
    
    return gtaHackathons;
  } catch (error) {
    console.error('❌ Error finding GTA hackathon:', error);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting GTA hackathon search...\n');
  
  await findGTAHackathon();
  
  console.log('\n✅ Process completed');
  process.exit(0);
}

// Run the script
main().catch(console.error); 