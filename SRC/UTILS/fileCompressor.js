const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const fullPath = path.join(uploadFolder, file.originalname);
      const folder = path.dirname(fullPath);
      fs.mkdirSync(folder, { recursive: true }); // Garante que as subpastas existam
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      cb(null, path.basename(file.originalname));
    },
});