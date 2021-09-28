const multer = require('multer');

const storage = multer.diskStorage({
  destination : (req,file, cb) => {
    cb(null, './uploads');
  },
  filename : (req, file, cb) => {
    // date대신 uuid나 다른 방식으로 유효성 만들어도 상관없음
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

//form data 이름 약속 후 변경
const single_uploader = multer({storage : storage}).single('image');

const multi_uploader = multer({storage : storage}).fields([
  //이부분은 프로젝트 혹은 api마다 따로 커스터마이징해서 만들어야함
  // ex : 이미지 3 개 업로드 시,, 3번째이미지는 여러장올린다고 가정
    {
      name : 'img1',
      maxCount : 1
    },
    {
      name : 'img2',
      maxCount : 1
    },
    {
      name : 'img3',
      maxCount : 12
    }
])
// imgs라는 하나의 form data에서 12장까지 중복되서 사진이 올경우
const array_uploader = multer({storage:storage}).array('imgs', 12);

module.exports = {single_uploader, multi_uploader, array_uploader}
