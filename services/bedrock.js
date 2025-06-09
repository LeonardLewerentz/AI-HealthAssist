// Assume this uses Bedrock SDK or API Gateway proxy
export const getSummary = async (inputText) => {
  const response = await fetch('https://your-api.com/bedrock-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: inputText }),
  });
  const data = await response.json();
  return data.summary;
};

