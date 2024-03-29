import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import DB from '../../data/db/models';

export const hashPswd = async (pswd) => bcrypt.hash(pswd, 10);

export const checkPswd = async ({ pswd, hash }) => bcrypt.compare(pswd, hash);

export const generateAuthToken = async (payload, validFor = '35m') => jwt
  .sign(payload, process.env.JWT_SECRET, { expiresIn: validFor });

export const verifyAuthToken = (token) => new Promise((resolve) => {
  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return resolve(false);

    return resolve(true);
  });
});

export const requiresAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // This is likely dead code since the API validation will
  // enforce presence of the header, but safer to double check
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized. Invalid Authorization header' });

  const headerValues = authHeader.split(' ');
  const authType = headerValues[0];
  const token = headerValues[1];

  if (!authType || authType.toLowerCase() !== 'bearer') return res.status(401).json({ message: 'Unauthorized. Invalid header' });
  if (!token) return res.status(401).json({ message: 'Unauthorized. Invalid token' });

  return jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: 'Unauthorized. Cannot verify token' });

    req.user = user;
    return next();
  });
};

export const login = async (req, res, userType = 'USER') => {
  const { pswd, email } = req.body;
  const INVALID_LOGIN_MSG = 'Invalid login. Pls check your credentials and try again';

  try {
    const user = await DB.User.findOne({ where: { accounttype: `${userType}`, email } });
    if (!user) return res.status(403).json({ message: INVALID_LOGIN_MSG });

    const { firstname, phone, hashedpassword } = user.dataValues;
    const profile = {
      firstname, phone, email, hashedpassword
    };

    if (userType === 'USER') profile.bvn = user.dataValues.bvn;

    const pswdMatched = await checkPswd({ pswd, hash: hashedpassword });
    if (!pswdMatched) return res.status(403).json({ message: INVALID_LOGIN_MSG });

    // Update the DB that we just
    // saw this user. Treat as a synchronouse
    // operation by not waiting for it;
    user.lastseen = new Date();
    user.save();

    const authToken = await generateAuthToken(profile);

    return res.status(200).json({
      authToken,
      message: 'Successful login'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Unable to handle your login request. Pls try again or contact support'
    });
  }
};
