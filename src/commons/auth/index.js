import bcrypt from 'bcrypt';

export const hashPswd = async (pswd) => bcrypt.hash(pswd, 10);
export const checkPswd = async (pswd, hash) => bcrypt.compare(pswd, hash);
