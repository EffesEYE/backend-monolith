import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { nibss } from 'innovation-sandbox';

import DB from '../data/db/models';
import redis from '../data/redis-store';
import errors from '../commons/errors';
import { hashPswd } from '../commons/auth';
import { sendWelcomeEmail } from '../commons/email';

const router = Router();
const { NIBSSError } = errors;

const generateNIBSSCredentials = async () => {
  const credentials = await nibss.Bvnr.Reset({
    sandbox_key: process.env.SANDBOX_KEY,
    organisation_code: process.env.NIBSS_ORG_CODE
  });

  const { status } = credentials;
  if (status && status >= 400) {
    const message = 'Request likely has invalid Sandbox key and/or NIBSS ORG code';
    console.error(`[HTTP:${status}] ${message}`);
    throw new NIBSSError({
      status,
      message
    });
  }

  return credentials;
};

const getNIBSSCredentials = async () => {
  let credentials;
  const nibssCerts = await redis.hget('nibsscerts', 'effeseye').then((data) => data);
  if (!nibssCerts) {
    credentials = await generateNIBSSCredentials();
    redis.hset('nibsscerts', 'effeseye', JSON.stringify(credentials));
  }

  credentials = JSON.parse(nibssCerts);
  return credentials;
};

const verifyBVN = async (data) => {
  const {
    ivkey, aes_key: aesKey, password, bvn
  } = data;
  const verification = await nibss.Bvnr.VerifySingleBVN({
    bvn,
    ivkey,
    password,
    aes_key: aesKey,
    sandbox_key: process.env.SANDBOX_KEY,
    organisation_code: process.env.NIBSS_ORG_CODE
  });
  return verification;
};

const isDuplicateRegistrationAttempt = async (email) => {
  const user = await DB.User.findOne({ where: { email } });
  return !(user === null);
};

const createUserAccount = async (bvnVerification, email, pswd) => {
  const {
    BVN, FirstName, MiddleName, LastName, PhoneNumber
  } = bvnVerification;

  const accountId = uuid();
  const accounttype = email === process.env.ADMIN_EMAIL ? 'ADMIN' : 'USER';
  await DB.User.create({
    email,
    bvn: BVN,
    accounttype,
    lastname: LastName,
    phone: PhoneNumber,
    hashedpassword: pswd,
    accountid: accountId,
    firstname: FirstName,
    middlename: MiddleName
  });
  return { accountId, firstname: FirstName };
};

const registerEndpoint = async (req, res) => {
  const { bvn, pswd, email } = req.body;

  try {
    const isDuplicateReg = await isDuplicateRegistrationAttempt(email);
    if (isDuplicateReg) {
      return res.status(401).json({ message: 'Unauthorized. User already exists!' });
    }

    const { ivkey, aes_key: aesKey, password } = await getNIBSSCredentials();
    const { data: verification } = await verifyBVN({
      ivkey,
      aes_key: aesKey,
      password,
      bvn
    });
    const hashedPswd = await hashPswd(pswd);
    const { accountId, firstname } = await createUserAccount(verification, email, hashedPswd);

    sendWelcomeEmail({ to: email, firstname });
    res.status(201).json({
      accountId,
      message: 'Registration successfull!'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to handle your registration request. Pls try again or contact support'
    });
  }
};

router.post('/', registerEndpoint);

export default router;
