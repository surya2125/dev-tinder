const { AsyncHandler, ErrorHandler } = require("../utils/handlers");
const { validateEditProfile, validateChangePassword } = require("../utils/validations");

// View profile
const viewProfile = AsyncHandler(async (req, res, next) => {
    // Get logged in user data
    const loggedInUser = req.user;

    // Remove sensitive data
    loggedInUser.password = undefined;

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched user profile successfully",
        data: loggedInUser
    });
});

// Edit profile
const editProfile = AsyncHandler(async (req, res, next) => {
    // Get data from request body
    const userData = req.body;

    // Validation of data
    validateEditProfile(userData);

    // Get logged in user data
    const loggedInUser = req.user;

    // Update the user
    Object.keys(userData).forEach((field) => (loggedInUser[field] = userData[field]));
    await loggedInUser.save();

    // Remove sensitive data
    loggedInUser.password = undefined;

    // Return the response
    res.status(200).json({
        success: true,
        message: "Updated user profile successfully",
        data: loggedInUser
    });
});

// Change password
const changePassword = AsyncHandler(async (req, res, next) => {
    // Get data from request body
    const { oldPassword, newPassword } = req.body;

    // Get logged in user data
    const loggedInUser = req.user;

    // Validation of data
    validateChangePassword(req.body);

    // Validate the old password
    const isValidPassword = await loggedInUser.validatePassword(oldPassword);
    if (!isValidPassword) {
        throw new ErrorHandler("Invalid Credentials", 401);
    }

    // Update the user's password
    loggedInUser.password = newPassword;
    await loggedInUser.save();

    // Return the response
    res.status(200).json({
        success: true,
        message: "Updated password successfully"
    });
});

module.exports = { viewProfile, editProfile, changePassword };
