const { AsyncHandler } = require("../utils/handlers");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");

const USER_SAFE_DATA = "name photoUrl age gender about skills";

// Connection requests received
const connectionRequestsReceived = AsyncHandler(async (req, res, next) => {
    // Get logged in user data
    const loggedInUser = req.user;

    // Get all the connection requests received by the user
    const allConnectionRequestsReceived = await ConnectionRequestModel.find({
        status: "interested",
        toUserId: loggedInUser._id
    })
        .select("fromUserId")
        .populate({ path: "fromUserId", select: USER_SAFE_DATA });

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched all connection requests received successfully",
        data: allConnectionRequestsReceived
    });
});

// All Connections
const allConnections = AsyncHandler(async (req, res, next) => {
    // Get logged in user data
    const loggedInUser = req.user;

    // Get all the connections of the user
    const allConnections = await ConnectionRequestModel.find({
        $or: [
            { fromUserId: loggedInUser._id, status: "accepted" },
            { toUserId: loggedInUser._id, status: "accepted" }
        ]
    }).populate([
        { path: "fromUserId", select: USER_SAFE_DATA },
        { path: "toUserId", select: USER_SAFE_DATA }
    ]);

    // Get only the connections data
    const allConnectionsData = allConnections.map((connection) => {
        if (String(connection.fromUserId._id) === String(loggedInUser._id)) {
            return connection.toUserId;
        } else {
            return connection.fromUserId;
        }
    });

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched all connections successfully",
        data: allConnectionsData
    });
});

// Users Feed
const feed = AsyncHandler(async (req, res, next) => {
    // Get logged in user data
    const loggedInUser = req.user;

    // Get data from request query
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Get all the connection requests of the user
    const allConnections = await ConnectionRequestModel.find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
    }).populate([
        { path: "fromUserId", select: USER_SAFE_DATA },
        { path: "toUserId", select: USER_SAFE_DATA }
    ]);

    // Filter out all the unique users to hide from feed
    const usersToHideFromFeed = new Set();
    allConnections.forEach((connection) => {
        usersToHideFromFeed.add(connection.fromUserId._id.toString());
        usersToHideFromFeed.add(connection.toUserId._id.toString());
    });

    // Show all the users that are not on the list
    const usersToBeShownOnFeed = await UserModel.find({
        $and: [{ _id: { $nin: Array.from(usersToHideFromFeed) } }, { _id: { $ne: loggedInUser._id } }]
    })
        .select(USER_SAFE_DATA)
        .limit(limit)
        .skip(skip);

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched all connections successfully",
        data: usersToBeShownOnFeed
    });
});

module.exports = { connectionRequestsReceived, allConnections, feed };
