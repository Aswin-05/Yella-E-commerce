const fs = require('fs');

// Function to create a folder using ID
module.exports.createFolderWithId = (id, directory)=>{
  const baseDirectory = directory; // Specify the base directory path
  const folderName = `${baseDirectory}${id}`; // Concatenate ID with base directory path

  fs.mkdir(folderName, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating folder:', err);
    } else {
      console.log('Folder created successfully');
    }
  });
}




