import app from './app';

const runEffesEYE = () => app.listen(process.env.PORT || 3000);

export default {
  run: runEffesEYE
};
