const mongoose = require("mongoose");
const validator = require("validator");
const { ErrorHandler } = require("../utils/handlers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Please provide a name"],
            minLength: [6, "Name must be at least 6 characters"],
            maxLength: [50, "Name must not exceed 50 characters"]
        },
        email: {
            type: String,
            trim: true,
            required: [true, "Please provide an email address"],
            unique: [true, "User already exists"],
            trim: true,
            lowercase: true,
            validate: function (value) {
                if (!validator.isEmail(value)) {
                    throw new ErrorHandler("Please provide a valid email address", 400);
                }
            }
        },
        password: {
            type: String,
            trim: true,
            required: [true, "Please provide a password"],
            validate: function (value) {
                if (!validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
                    throw new ErrorHandler(
                        "Password must be at least 8 characters long and includes at least one uppercase character, one lowercase character, one number and one symbol",
                        400
                    );
                }
            }
        },
        gender: {
            type: String,
            enum: {
                values: ["male", "female", "others"],
                message: `{VALUE} is not a valid gender type`
            },
            trim: true
        },
        age: {
            type: Number,
            min: [18, "Age must be at least 18 years old"]
        },
        about: {
            type: String,
            default: `This is a default about section`,
            trim: true
        },
        skills: {
            type: [String],
            trim: true
        },
        photoUrl: {
            type: String,
            trim: true,
            default: "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg",
            validate: function (value) {
                if (!validator.isURL(value)) {
                    throw new ErrorHandler("Please provide a valid photo url", 400);
                }
            }
        }
    },
    { timestamps: true, versionKey: false }
);

// Hash the password
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Validate the password
userSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate jwt
userSchema.methods.generateJWT = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
