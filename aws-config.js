// AWS Amplify v6 Configuration
// Connected to existing AWS backend

const awsConfig = {
  Auth: {
    Cognito: {
      region: "us-east-1",
      userPoolId: "us-east-1_3LLlLOh6e",
      userPoolClientId: "59537vht9sasjlihg301g9i03o",
    },
  },
};

export default awsConfig;
