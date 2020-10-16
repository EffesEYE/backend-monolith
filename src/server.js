import path from 'path';
import dotenv from 'dotenv';
import app from './app';

const configFile = path.join(__dirname, `../.env.${process.env.NODE_ENV}`);
dotenv.config({ path: configFile });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EffesEYE Server Running @: ${PORT}`);
});
