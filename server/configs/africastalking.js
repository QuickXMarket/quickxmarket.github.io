import AfricasTalking from 'africastalking';

const africasTalkingConfig = () => {
  const africasTalking = AfricasTalking({
    apiKey: process.env.AFRICASTALKING_API_KEY,
    username: process.env.AFRICASTALKING_USERNAME,
  });

  return africasTalking;
};

export default africasTalkingConfig;
