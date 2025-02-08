const { exec } = require('child_process');
const path = require('path');

// First generate the JSON files
console.log('Generating JSON files...');
exec('python src/scripts/generate_data.py', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error generating data: ${error}`);
    return;
  }
  console.log(stdout); // Print Python script output
  console.log('JSON files generated successfully');
  
  // Then upload to Firebase
  console.log('Starting Firebase upload...');
  exec('node src/scripts/uploadToFirebase.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error uploading to Firebase: ${error}`);
      return;
    }
    console.log(stdout); // Print upload script output
    console.log('Data uploaded to Firebase successfully');
  });
}); 