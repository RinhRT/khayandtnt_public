const xlsx = require('xlsx') // Import thư viện xlsx để xử lý file Excel
const fs = require('fs') // Import thư viện fs để thao tác với file

// Hàm đọc dữ liệu từ file Excel
const read_data = (file) => {
    let workBook = xlsx.readFile(file.path) // Đọc file Excel

    const sheetNames = workBook.SheetNames // Lấy tên các sheet trong file
    let sheetInfo = []

    // Duyệt qua từng sheet để lấy dữ liệu
    sheetNames.forEach(sheetName => {
        const sheet = workBook.Sheets[sheetName]
        const data = xlsx.utils.sheet_to_json(sheet) // Chuyển sheet thành JSON

        if (data.length > 0) sheetInfo.push(...data) // Thêm dữ liệu vào mảng kết quả
    })

    // Xóa file sau khi xử lý
    fs.unlink(file.path, (error) => {
        if (error) throw Error(error) // Báo lỗi nếu không thể xóa file
        console.log('File was deleted') // Xóa thành công
    })

    return sheetInfo // Trả về dữ liệu đã đọc
}

// Xuất các hàm xử lý liên quan đến Excel
const workXLSX = {
    read_data
}

module.exports = workXLSX // Xuất module
