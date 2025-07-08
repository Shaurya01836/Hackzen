const fs = require('fs');
const path = require('path');

const cleanupFiles = () => {
  console.log('🧹 Badge System File Cleanup\n');
  
  const filesToKeep = [
    'controllers/badgeController.js',
    'model/BadgeModel.js',
    'routes/badgeRoutes.js',
    'scripts/initBadges.js',
    'simple-badge-cleanup.js'
  ];
  
  const filesToRemove = [
    'fix-badge-system.js',
    'quick-badge-fix.js',
    'test-badge-system.js',
    'clear-badges.js'
  ];
  
  console.log('📁 Files to KEEP (essential):');
  filesToKeep.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  });
  
  console.log('\n🗑️ Files to REMOVE (temporary):');
  filesToRemove.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`   ${exists ? '📄' : '❌'} ${file}`);
  });
  
  console.log('\n📋 Summary:');
  console.log('   - Keep: Badge controller, model, routes, and init script');
  console.log('   - Remove: Temporary fix scripts (optional)');
  console.log('   - Frontend: Updated to reduce API calls');
  
  console.log('\n✅ Badge system is now optimized!');
  console.log('🎯 Next steps:');
  console.log('   1. Restart your backend server');
  console.log('   2. Refresh your frontend');
  console.log('   3. Check that console logs are much cleaner');
  console.log('   4. Test badge display in UI');
  
  // Optionally remove temporary files
  const shouldRemove = process.argv.includes('--remove');
  if (shouldRemove) {
    console.log('\n🗑️ Removing temporary files...');
    filesToRemove.forEach(file => {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`   ✅ Removed: ${file}`);
      }
    });
    console.log('✅ Cleanup completed!');
  } else {
    console.log('\n💡 To remove temporary files, run: node cleanup-files.js --remove');
  }
};

cleanupFiles(); 