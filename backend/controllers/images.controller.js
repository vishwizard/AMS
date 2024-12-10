import fs from 'fs';
import path from 'path';

const deleteImage = (imageName) => {
  return new Promise((resolve, reject) => {
    const imagePath = path.join(process.cwd(), '/my-electron-app/images', imageName);

    fs.unlink(imagePath, (err) => {
      if (err) {
        console.log(err);
        reject(false); 
      } else {
        // console.log(imagePath);
        resolve(true);
      }
    });
  });
};

export default deleteImage;
