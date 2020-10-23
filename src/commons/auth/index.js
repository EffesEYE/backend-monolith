import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import DB from '../../data/db/models';

export const hashPswd = async (pswd) => bcrypt.hash(pswd, 10);

export const checkPswd = async ({ pswd, hash }) => bcrypt.compare(pswd, hash);

export const generateAuthToken = async (payload, validFor = '5m') => jwt
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

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized. Invalid token' });

  return jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: 'Unauthorized. Invalid token' });

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
    const profile = { firstname, phone, hashedpassword };

    if (userType === 'USER') profile.bvn = user.dataValues.bvn;

    const pswdMatched = await checkPswd({ pswd, hash: hashedpassword });
    if (!pswdMatched) return res.status(403).json({ message: INVALID_LOGIN_MSG });

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
