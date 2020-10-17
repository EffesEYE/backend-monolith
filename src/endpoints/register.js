import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { nibss } from 'innovation-sandbox';

import DB from '../data/db/models';
import redis from '../data/redis-store';
import errors from '../commons/errors';

const router = Router();
const { NIBSSError } = errors;

const generateNIBSSCredentials = async () => {
  const credentials = await nibss.Bvnr.Reset({
    sandbox_key: process.env.SANDBOXKEY,
    organisation_code: process.env.NIBSSOrganisationCode
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
    sandbox_key: process.env.SANDBOXKEY,
    organisation_code: process.env.NIBSSOrganisationCode
  });
  return verification;
};

const createUserAccount = async (bvnVerification, email, pswd) => {
  const {
    BVN, FirstName, MiddleName, LastName, PhoneNumber
  } = bvnVerification;

  // TODO hash the password
  const accountId = uuid();
  await DB.User.create({
    email,
    bvn: BVN,
    accounttype: 'USER',
    lastname: LastName,
    phone: PhoneNumber,
    hashedpassword: pswd,
    accountid: accountId,
    firstname: FirstName,
    middlename: MiddleName
  });
  return accountId;
};

router.post('/', async (req, res) => {
  const { bvn, pswd, email } = req.body;

  // TODO validate this with the API spec instead
  if (!bvn || !pswd || !email) {
    res.status(400).json({
      message: 'Bad request. Pls provide required/valid request data'
    });
  }

  try {
    const { ivkey, aes_key: aesKey, password } = await getNIBSSCredentials();
    const { data: verification } = await verifyBVN({
      ivkey,
      aes_key: aesKey,
      password,
      bvn
    });
    const accountId = await createUserAccount(verification, email, pswd);

    res.json({
      accountId,
      message: 'Registration successfull!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Unable to handle your request. Pls try again or contact support'
    });
  }
});

export default router;
