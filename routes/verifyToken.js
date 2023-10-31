const jwt = require("jsonwebtoken");

//authentication
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader) {
    //ambil authorization setelah sepasi
    const token = authHeader.split(" ")[1];

    //verify token
    jwt.verify(token, process.env.SECRET_JWT, (err, user) => {
      //jika error
      if (err) res.status(403).json("Token is not valid!");

      //jika success
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

//authorization
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    //jika user id sama dengan parameter yang dikirim atau user isAdmin
    if (req.user.id === req.params.id || req.user.isAdmin) {
      //next boleh lanjut/masuk
      next();
    } else {
      //gagal
      return res.status(403).json("You are not allowed to do that!");
    }
  });
};

//user isAdmin
const verifyTokenAndAdmin = (req, res, next) => {
  //verifikasi token
  verifyToken(req, res, () => {
    //jika user isAdmin
    if (req.user.isAdmin) {
      //next boleh lanjut masuk yang dibatasi admin
      next();
    } else {
      return res.status(403).json("You are not allowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
