import  jwt  from "jsonwebtoken";

const authMiddleware=(req,res,next)=>{
try {
    
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    console.log(token)

    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, "Apple"); // Replace "Apple" with a secret stored in .env

    // ✅ Store user info in req (not res)
    req.user = decoded.userId; 
    next()

} catch (error) {
    console.log("Middleware Issue")
}

}

export default authMiddleware