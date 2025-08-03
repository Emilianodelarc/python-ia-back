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
  const { enunciado, codigo, idioma = "es" } = req.body;

  const prompt = {
    es: `Analizá el siguiente código Python:\n${codigo}\n\nConsigna: ${enunciado}\n\nBrindá un consejo útil para mejorar el código.`,
    en: `Analyze the following Python code:\n${codigo}\n\nInstruction: ${enunciado}\n\nProvide a helpful tip to improve the code.`,
    pt: `Analise o seguinte código Python:\n${codigo}\n\nEnunciado: ${enunciado}\n\nForneça uma dica útil para melhorar o código.`
  }[idioma];

  const systemPrompt = {
    es: 'Sos un experto en Python. Tu tarea es revisar y explicar código.',
    en: 'You are a Python expert. Your task is to review and explain code.',
    pt: 'Você é um especialista em Python. Sua tarefa é revisar e explicar código.'
  }[idioma];

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
          { role: 'system', content: systemPrompt },
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