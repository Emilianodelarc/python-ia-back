import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = process.env.GROQ_API_KEY;

app.post('/api/consejo', async (req, res) => {
  const { enunciado, codigo } = req.body;

  const prompt = `Analizá el siguiente código Python:\n${codigo}\n\nConsigna: ${enunciado}\n\nBrindá un consejo útil para mejorar el código.`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: 'Sos un experto en Python. Tu tarea es revisar y explicar código.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      res.json({ consejo: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: 'Respuesta inválida de Groq' });
    }
  } catch (err) {
    console.error('Error al consultar Groq:', err);
    res.status(500).json({ error: 'Error en el servidor Groq' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor Express escuchando en http://localhost:${PORT}`);
});