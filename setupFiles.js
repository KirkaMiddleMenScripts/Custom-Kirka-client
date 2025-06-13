const fs = require('fs');
const path = require('path');
const os = require('os');

function createUserScriptFolders() {
  const documentsPath = path.join(os.homedir(), 'Documents');
  console.log('Documents path:', documentsPath);

  const baseFolder = path.join(documentsPath, 'ThatKirkaClient');
  const scriptsFolder = path.join(baseFolder, 'scripts');

  try {
    if (!fs.existsSync(baseFolder)) {
      fs.mkdirSync(baseFolder, { recursive: true });
      console.log(`Created folder: ${baseFolder}`);
    }

    if (!fs.existsSync(scriptsFolder)) {
      fs.mkdirSync(scriptsFolder, { recursive: true });
      console.log(`Created folder: ${scriptsFolder}`);
    }

    const userScriptPath = path.join(scriptsFolder, 'example.user.js');
    if (!fs.existsSync(userScriptPath)) {
      const defaultContent = `// Example user script\n// Add your scripts here`;
      fs.writeFileSync(userScriptPath, defaultContent, 'utf8');
      console.log(`Created file: ${userScriptPath}`);
    }
  } catch (error) {
    console.error('Error creating folders:', error);
  }
}

module.exports = { createUserScriptFolders };
