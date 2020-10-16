import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { nibss } from 'innovation-sandbox';

import redis from '../data/redis-store';
import { NIBSSError } from '../commons/errors';

const router = Router();

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
  const { ivkey, aes_key: aesKey, password, bvn } = data;
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

// TODO save verification to DB
const saveRegistration = async (bvnVerification) => {
  // BVN": "12345678901",
  // "FirstName": "Uchenna",
  // "MiddleName": "Chijioke",
  // "LastName": "Nwanyanwu",
  // "DateOfBirth": "22-Oct-1970",
  // "PhoneNumber": "07033333333",
  // "RegistrationDate": "16-Nov-2014",
  // "EnrollmentBank": "900",
  // "EnrollmentBranch": "Victoria Island",
  // "WatchListed": "NO"

  return uuid();
};

router.post('/', async (req, res) => {
  const { bvn, email, phoneNumber } = req.body;

  // TODO validate this with the API spec instead
  if (!bvn || !email || !phoneNumber) {
    res.status(400).json({
      message: 'Bad request. Pls provide required/valid request data'
    });
  }

  try {
    const { ivkey, aes_key: aesKey, password } = await getNIBSSCredentials();
    const verification = await verifyBVN({
      ivkey,
      aes_key: aesKey,
      password,
      bvn
    });
    const accountId = await saveRegistration(verification);

    res.json({
      accountId,
      message: 'Registration successfull!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Unable to handle your request. Pls contant support'
    });
  }
});

export default router;
