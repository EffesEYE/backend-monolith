import app from './app';

const runEffesEYE = () => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`EffesEYE Server Running On: ${PORT}`);
  });
};

export default {
  run: runEffesEYE
};
