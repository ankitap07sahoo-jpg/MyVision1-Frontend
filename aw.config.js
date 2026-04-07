// AWS Amplify v6 Configuration
// Update these values with your actual AWS Cognito and API Gateway settings

const awsConfig = {
  Auth: {
    Cognito: {
      region: "us-east-1",
      userPoolId: "us-east-1_3LLlLOh6e",
      userPoolClientId: "59537vht9sasjlihg301g9i03o",
    },
  },
  API: {
    REST: {
      MyVisionAPI: {
        endpoint: process.env.REACT_APP_API_URL || "https://4smy2qfmw3.execute-api.us-east-1.amazonaws.com/prod",
        region: "us-east-1",
      },
    },
  },
};

export default awsConfig;