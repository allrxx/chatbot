
import express from 'express';
import { Ollama } from 'ollama';

const app = express();
const port = 3002;

const ollama = new Ollama({ host: 'http://localhost:11434' });

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await ollama.chat({
      model: 'gemma:1b',
      messages: [{ role: 'user', content: message }],
    });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error connecting to Ollama' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
