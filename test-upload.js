const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fs = require('fs');

async function testUpload() {
  fs.writeFileSync('test.pdf', '%PDF-1.4\n1 0 obj\n<<\n/Title (Test PDF)\n/Creator (Node.js)\n>>\nendobj\nxref\n0 2\n0000000000 65535 f \n0000000009 00000 n \ntrailer\n<<\n/Size 2\n/Root 1 0 R\n>>\nstartxref\n56\n%%EOF');
  
  cloudinary.uploader.upload('test.pdf', { resource_type: 'auto', folder: 'portfolio' }, (error, result) => {
    if (error) {
      console.error('ERROR:', error);
    } else {
      console.log('SUCCESS:', result.secure_url);
      console.log('FORMAT:', result.format);
      console.log('RESOURCE_TYPE:', result.resource_type);
    }
  });
}

testUpload();
