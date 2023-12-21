const User = require("../models/User");

const userController = {

    // GET PROFILE (ADMIN OR STUDENT)
    getProfile: async (req, res) => {
        try {
            const userId = req.params.id;
            const requestingUserId = req.user.id;
            const requestingUserRole = req.user.role;

            // Chắc chắn chỉ admin hoặc sinh viên chủ sở hữu mới có quyền xem profile
            if (requestingUserRole === "admin" || userId === requestingUserId) {
                const user = await User.findById(userId);
                if (!user) {
                    return res.status(404).json("User not found");
                }

                // Nếu là sinh viên và không phải là chủ sở hữu, chỉ trả về thông tin cá nhân (không bao gồm tài khoản)
                const responseProfile = (requestingUserRole === "student" && userId !== requestingUserId)
                    ? user.profile.getPublicProfile()
                    : user.profile;

                res.status(200).json(responseProfile);
            } else {
                return res.status(403).json("You're not allowed to view this profile");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // UPDATE PROFILE (ADMIN OR STUDENT)
    updateProfile: async (req, res) => {
        try {
            const userId = req.params.id;
            const requestingUserId = req.user.id;
    
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json("User not found");
            }
    
            // Cập nhật thông tin hồ sơ theo yêu cầu
            if (req.body.fullName) user.profile.fullName = req.body.fullName;
            if (req.body.studentId) user.profile.studentId = req.body.studentId;
            if (req.body.dateOfBirth) user.profile.dateOfBirth = req.body.dateOfBirth;
            if (req.body.gender) user.profile.gender = req.body.gender;
            if (req.body.faculty) user.profile.faculty = req.body.faculty;
            if (req.body.major) user.profile.major = req.body.major;
            if (req.body.gpa) user.profile.gpa = req.body.gpa;
            if (req.body.advisor) user.profile.advisor = req.body.advisor;
    
    
            await user.save();
            res.status(200).json("Cập nhật hồ sơ thành công");
        } catch (err) {
            // Xử lý lỗi nếu có
            res.status(500).json({ error: "Lỗi Server Nội Bộ", chiTiet: err.message });
        }
    },

    // DELETE PROFILE (ADMIN)
    deleteProfile: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);
    
            if (!user) {
                return res.status(404).json("User not found");
            }
    
            // Thực hiện xóa hồ sơ theo yêu cầu
            if (user.profile) {
                user.profile = null; // Đặt giá trị profile về null sau khi xóa thành công
            }
    
            await user.save();
            res.status(200).json("Xóa hồ sơ thành công");
        } catch (err) {
            res.status(500).json({ error: "Lỗi Server Nội Bộ", chiTiet: err.message });
        }
    },
    getAllProfiles: async (req, res) => {
        try {
            const users = await User.find({ role: "student" });
            const profiles = users.map(user => ({
                userId: user._id,
                username: user.username,
                profile: user.profile ? user.profile : {}, 
            }));
    
            return res.status(200).json(profiles);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
    createProfile: async (req, res) => {
        try {
            const userId = req.params.id;
            const requestingUserId = req.user.id;
    
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json("User not found");
            }
    
            // Kiểm tra xem người dùng đã có hồ sơ chưa
            if (user.profile) {
                return res.status(400).json("User already has a profile");
            }
    
            // Tạo hồ sơ mới
            const newProfile = {
                fullName: req.body.fullName,
                studentId: req.body.studentId,
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                faculty: req.body.faculty,
                major: req.body.major,
                gpa: req.body.gpa,
                advisor: req.body.advisor
            };
    
            user.profile = newProfile;
            await user.save();
    
            res.status(201).json("Hồ sơ được tạo thành công");
        } catch (err) {
            res.status(500).json({ error: "Lỗi Server Nội Bộ", chiTiet: err.message });
        }
    },
};

module.exports = userController;
