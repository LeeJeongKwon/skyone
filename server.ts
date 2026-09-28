import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasServerGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// API Key Tester endpoint
app.post('/api/test-key', async (req: Request, res: Response) => {
  const { provider, apiKey } = req.body;
  const startTime = Date.now();

  if (!provider) {
    return res.status(400).json({ success: false, message: 'Provider가 지정되지 않았습니다.' });
  }

  const effectiveKey = apiKey || (provider === 'gemini' ? process.env.GEMINI_API_KEY : '');

  if (!effectiveKey) {
    return res.status(400).json({ 
      success: false, 
      message: `${provider.toUpperCase()} API 키가 입력되지 않았거나 서버 환경변수에 없습니다.` 
    });
  }

  try {
    if (provider === 'gemini') {
      const ai = new GoogleGenAI({ apiKey: effectiveKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: 'Ping test. Reply with "OK".',
      });
      const latency = Date.now() - startTime;
      return res.json({
        success: true,
        message: 'Google Gemini API 연결 성공!',
        latencyMs: latency,
        sampleOutput: response.text?.slice(0, 50) || 'OK',
      });
    }

    if (provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${effectiveKey}` },
      });
      const latency = Date.now() - startTime;
      if (response.ok) {
        return res.json({
          success: true,
          message: 'OpenAI API 키 인증 성공!',
          latencyMs: latency,
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        return res.status(response.status).json({
          success: false,
          message: `OpenAI 인증 실패: ${(errorData as { error?: { message?: string } })?.error?.message || response.statusText}`,
          latencyMs: latency,
        });
      }
    }

    if (provider === 'anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/models', {
        headers: {
          'x-api-key': effectiveKey,
          'anthropic-version': '2023-06-01',
        },
      });
      const latency = Date.now() - startTime;
      if (response.ok || response.status === 400) {
        return res.json({
          success: true,
          message: 'Anthropic Claude API 키 유효성 확인 완료!',
          latencyMs: latency,
        });
      } else {
        return res.status(response.status).json({
          success: false,
          message: `Anthropic 인증 실패: 상태코드 ${response.status}`,
          latencyMs: latency,
        });
      }
    }

    if (provider === 'stability') {
      const response = await fetch('https://api.stability.ai/v1/user/account', {
        headers: { Authorization: `Bearer ${effectiveKey}` },
      });
      const latency = Date.now() - startTime;
      if (response.ok) {
        return res.json({
          success: true,
          message: 'Stability AI API 키 인증 성공!',
          latencyMs: latency,
        });
      } else {
        return res.status(response.status).json({
          success: false,
          message: `Stability AI 인증 실패: 상태코드 ${response.status}`,
          latencyMs: latency,
        });
      }
    }

    if (provider === 'replicate') {
      const response = await fetch('https://api.replicate.com/v1/account', {
        headers: { Authorization: `Bearer ${effectiveKey}` },
      });
      const latency = Date.now() - startTime;
      if (response.ok) {
        return res.json({
          success: true,
          message: 'Replicate API 토큰 인증 성공!',
          latencyMs: latency,
        });
      } else {
        return res.status(response.status).json({
          success: false,
          message: `Replicate 인증 실패: 상태코드 ${response.status}`,
          latencyMs: latency,
        });
      }
    }

    if (provider === 'kasi') {
      const latency = Date.now() - startTime;
      return res.json({
        success: true,
        message: '한국천문연구원 음양력/절기 공공 API 키 등록 완료!',
        latencyMs: latency,
      });
    }

    return res.status(400).json({ success: false, message: '지원되지 않는 Provider입니다.' });
  } catch (error: any) {
    const latency = Date.now() - startTime;
    return res.status(500).json({
      success: false,
      message: `연결 테스트 중 오류 발생: ${error.message || '네트워크 오류'}`,
      latencyMs: latency,
    });
  }
});

// Gemini AI analysis endpoint
app.post('/api/gemini/analyze', async (req: Request, res: Response) => {
  const { prompt, userKey, imageBase64, mimeType } = req.body;
  const apiKey = userKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(400).json({
      success: false,
      message: 'Gemini API 키가 설정되지 않았습니다. 설정 메뉴에서 API 키를 입력하거나 자체 역학 엔진 모드를 사용하세요.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    let contents: any = prompt;

    if (imageBase64) {
      contents = [
        {
          inlineData: {
            data: imageBase64.replace(/^data:[^;]+;base64,/, ''),
            mimeType: mimeType || 'image/jpeg',
          },
        },
        { text: prompt },
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
    });

    res.json({
      success: true,
      text: response.text,
    });
  } catch (error: any) {
    console.error('Gemini Analyze Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'AI 분석 처리 중 오류가 발생했습니다.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`천명원(天命院) 서버 실행 중: http://localhost:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer();
}
