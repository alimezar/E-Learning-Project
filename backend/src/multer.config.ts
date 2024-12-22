import { diskStorage } from 'multer';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig = {
  storage: diskStorage({
    destination: join(__dirname, '..', 'uploads/modules'), // Save directly in `/uploads`
    filename: (req, file, callback) => {
      const uniqueName = `file-${Date.now()}-${uuidv4()}${file.originalname}`;
      callback(null, uniqueName);
    },
  }),
};

export const multerOptions = {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
};
