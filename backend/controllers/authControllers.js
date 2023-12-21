const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Accounts = require("../models/User");

const authController = {
    registerUser: async (req, res) => {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hashed = bcrypt.hashSync(req.body.pass, salt);

            const newUser = new Accounts({
                _id: req.body._id,
                pass: hashed,
                role: req.body.role,
            });

            const user = await newUser.save();

            console.log("User saved to the database:", user);

            res.status(200).json(user);
        } catch (err) {
            console.error("Error during user registration:", err);
            res.status(500).json(err);
        }
    },

    // GENERATE ACCESS TOKEN
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "3600s" }
        );
    },

    // LOGIN USER
    loginUser: async (req, res) => {
        try {
            const user = await Accounts.findOne({ _id: req.body._id });

            if (!user) {
                return res.status(404).json("Wrong username");
            }

            const validPassword = await bcrypt.compare(req.body.pass, user.pass);

            if (!validPassword) {
                return res.status(404).json("Wrong password");
            }

            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user);

                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                    maxAge: 30 * 60 * 1000 
                });

                const { pass, ...others } = user._doc;
                return res.status(200).json({ ...others, accessToken });
            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

    userLogout: async (req, res) => {
        res.clearCookie("accessToken");
        res.status(200).json("Logged out!");
    }
};

module.exports = authController;
