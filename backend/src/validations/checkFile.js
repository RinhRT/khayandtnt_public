//Tạo hàm kiểm tra file gửi lên từ phía người dùng
const check_File_XLSX_Validation = (req, res, next) => {
    //Lấy files từ req (Files ở đây là mảng)
    const files = req?.files

    //Nếu không có files thì trả về cho người dùng mã 403 kèm lời nhắn
    if (files?.length === 0) return res.status(403).json({ message: `No such files`})

    //Lọc qua từng file
    files.forEach(file => {
        let typeFile = file?.originalname.split('.')[1]

        //Kiểm tra có phải là file excel không?
        if (typeFile != 'xlsx')
            return res.status(403).json({ message: `Cannot read file ${typeFile}. you can change over to xlsx`})
    });
    next()
}

module.exports = {
    check_File_XLSX_Validation
}
