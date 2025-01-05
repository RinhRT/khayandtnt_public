const Users = require('../models/user');
const bcrypt = require('bcrypt');
const Grades = require('../models/grade');

const userService = {
    addNew: async (reqData) => {
        try {
            const datas = reqData;
            const info = [];
    
            for (const data of datas) {
                let level = data.level;
                if (level > 2 || level < 0) {
                    level = 2; 
                }
    
                // Tìm user đã tồn tại
                let userInfo = await Users.findOne({ email: data.email }).select('-password');
    
                if (userInfo) {
                    info.push({ ...userInfo._doc });
                }
    
                if (!userInfo) {
                    let grade = await Grades.findOne({ name: data.grade });
                    if (!grade && data.grade) {
                        grade = new Grades({ name: data.grade });
                        await grade.save();
                    }
    
                    // Hash mật khẩu
                    let hash = await bcrypt.hash(String(data.password), 10);
    
                    // Tạo mới user
                    const user = new Users({
                        name: data.name,
                        email: data.email,
                        password: hash,
                        level: level,  // Sử dụng giá trị level đã kiểm tra và điều chỉnh
                        grade: grade ? grade._id : null
                    });
    
                    await user.save();
    
                    const { password, ...other } = user._doc;
                    info.push({ ...other });
    
                    if (grade) {
                        await Grades.updateOne({ _id: grade._id }, { $push: { students: user._id } });
                    }
                }
            }
    
            return info;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Tìm người dùng theo grade
    find_user_by_grades: async (reqData) => {
        try {
            const query = reqData ? { grade: reqData.grade } : {}; // Tìm theo grade hoặc tất cả
            const data = await Users.find(query).select('-password'); // Loại bỏ password, level, status
            
            if (data.length > 0) {
                return {
                    status: 200,
                    message: "Find users successfully",
                    data: data
                };
            }

            return {
                status: 404,
                message: "No users found",
                data: null
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    find_user: async (reqData) => {
        try {
            let data;
            if (reqData) {
                data = await Users.findById(reqData._id)
                    .select('-password')  
            } else {
                // Nếu không có _id, lấy tất cả người dùng và populate trường grade
                data = await Users.aggregate([
                    {
                        $lookup: {
                            from: 'grades',  // Tên collection của model Grades trong MongoDB
                            localField: 'grade',  // Trường grade trong Users (ObjectId)
                            foreignField: '_id',  // Trường _id trong Grades
                            as: 'grade'  // Tên trường nối
                        }
                    },
                    {
                        $unwind: { 
                            path: '$grade',  // Lấy đối tượng grade duy nhất (không phải mảng)
                            preserveNullAndEmptyArrays: true  // Nếu không có grade thì vẫn giữ lại user
                        }
                    },
                    {
                        $project: {
                            name: 1, // Giữ lại trường name của người dùng
                            email: 1, // Giữ lại trường email của người dùng
                            status: 1, // Giữ lại trường status của người dùng
                            level: 1, // Giữ lại trường level của người dùng
                            grade: '$grade.name',  // Lấy tên lớp học từ grade
                            lastUpdatedDate: 1 // Giữ lại trường lastUpdatedDate
                        }
                    }
                ]);
            }

            if (data) {
                return {
                    status: 200,
                    message: "Find users successfully",
                    data: data
                };
            }

            return {
                status: 404,
                message: "Find users fail",
                data: null
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Tìm người dùng theo email
    find_user_by_email: async (reqData) => {
        try {
            const data = await Users.findOne({ email: reqData.email }).select('-password');
            
            if (data) {
                return {
                    status: 200,
                    message: "Find users successfully",
                    data: data
                };
            }

            return {
                status: 404,
                message: "User not found",
                data: null
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Cập nhật thông tin người dùng
    update_user: async (reqData) => {
        try {
            // Tìm người dùng và populate thông tin về lớp học (grade)
            let data = await Users.findById(reqData._id).populate('grade'); 
            
            if (!data) {
                return {
                    status: 404,
                    message: "User not found",
                    data: null,
                };
            }
    
            // Nếu mật khẩu cần thay đổi, hash lại
            if (reqData.password) {
                let hash = await bcrypt.hash(String(reqData.password), 10);
                data.password = hash;
            }
    
            if (reqData.status) {
                data.status = reqData.status;
            }
    
            if (reqData.name) {
                data.name = reqData.name;
            }
    
            if (reqData.level) {
                data.level = reqData.level;
            }
    
            let oldGrade = data.grade ? await Grades.findById(data.grade) : null;
    
            if (reqData.grade) {
                let dataGrade = await Grades.findOne({ name: reqData.grade });
                if (!dataGrade && reqData.grade) {
                    dataGrade = new Grades({ name: reqData.grade });
                    await dataGrade.save();
                }
    
                data.grade = dataGrade._id;
    
                if (oldGrade && oldGrade._id !== dataGrade._id) {
                    await Grades.updateOne({ _id: oldGrade._id }, { $pull: { students: data._id } });
    
                    await Grades.updateOne({ _id: dataGrade._id }, { $push: { students: data._id } });
                } else if (!oldGrade) {
                    await Grades.updateOne({ _id: dataGrade._id }, { $push: { students: data._id } });
                }
            }
    
            data.lastUpdatedDate = new Date();
    
            await data.save();
            
            const { password, ...other } = data._doc;
    
            return {
                status: 200,
                message: "User updated successfully",
                data: { ...other },
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Xóa người dùng
    delete: async (reqData) => {
        try {
            const ids = reqData.map(data => data._id);  // Lấy mảng các ID
            
            const deleteResult = await Users.deleteMany({ _id: { $in: ids } });
    
            if (deleteResult.deletedCount === 0) {
                throw new Error('No users were deleted.');
            }
    
            const updateResult = await Grades.updateMany(
                { students: { $in: ids } }, 
                { $pull: { students: { $in: ids } } }
            );
    
            if (updateResult.nModified === 0) {
                console.log('No grades were updated.');
            }
    
            return {
                status: 200,
                message: 'Users deleted successfully',
            };
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    },

    // Đăng nhập
    login: async (reqData) => {
        let dataReturn = {
            status: 404,
            message: "User not found",
            data: null
        };

        try {
            let user = await Users.findOne({ email: reqData.email }) // Loại bỏ password, level, status

            if (!user) return dataReturn;

            let valid = await bcrypt.compare(reqData.password, user.password);
            if (!valid) return dataReturn;

            const { password, ...other } = user._doc

            return {
                status: 200,
                message: "Login successfully",
                data: {...other}
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    getUserStatusCount: async () => {
        try {
            // Sử dụng aggregation để nhóm và đếm số lượng status
            const result = await Users.aggregate([
                {
                    $group: {
                        _id: "$status", // Nhóm theo trường status
                        count: { $sum: 1 } // Đếm số lượng mỗi trạng thái
                    }
                },
                {
                    $project: {
                        _id: 0,  // Không trả về _id của nhóm
                        status: "$_id",  // Trả về status
                        count: 1  // Trả về count
                    }
                }
            ]);

            const statusCount = {
                received: 0,
                returned: 0,
                not_received: 0
            };

            result.forEach(item => {
                if (item.status === 'received') {
                    statusCount.received = item.count;
                } else if (item.status === 'returned') {
                    statusCount.returned = item.count;
                } else if (item.status === 'not_received') {
                    statusCount.not_received = item.count;
                }
            });

            return {
                status: 200,
                message: "User status count retrieved successfully",
                data: statusCount
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },
};

module.exports = userService;
