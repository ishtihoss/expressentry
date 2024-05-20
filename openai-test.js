const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function main() {
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Say this is a test' }],
    stream: true,
  }, { responseType: 'stream' });

  const stream = response.data;

  stream.on('data', (chunk) => {
    const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
    for (const line of lines) {
      const message = line.replace(/^data: /, '');
      if (message === '[DONE]') {
        stream.destroy();
        return;
      }
      const parsed = JSON.parse(message);
      process.stdout.write(parsed.choices[0].delta.content || '');
    }
  });

  stream.on('end', () => {
    process.stdout.write('\n');
  });
}

main();