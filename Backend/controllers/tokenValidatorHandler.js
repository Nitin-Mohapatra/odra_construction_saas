exports.tokenHandler = (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Token is valid",
      role: req.user.role,       // <-- Return role
      User_id: req.user.User_id  // <-- Optional but useful
    });
  };
  