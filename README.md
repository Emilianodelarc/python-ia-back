# Backend Express + Groq

## Requisitos
- Node.js instalado
- Cuenta gratuita en https://console.groq.com

## Pasos para correr
1. `npm install`
2. Crear archivo `.env` con tu clave:
```
GROQ_API_KEY=tu_clave_real
```
3. Ejecutar servidor:
```
npm start
```
4. Endpoint:
POST http://localhost:3001/api/consejo

Body JSON:
```json
{
  "enunciado": "Crea una función que sume dos números",
  "codigo": "def sumar(a, b): return a + b"
}
```