import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.json({ success: false, message: "Not Authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)

    if (decoded?.id) {
      req.body.userId = decoded.id;
      return res.json({
        success: true,
        userId: decoded.id,
        message: "User is authenticated",
      });
    //   next();
    } else {
      return res.json({ success: false, message: "Not Authorized" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default authUser;
