import { ApiProvider, AppSettings } from '../types';
import { addApiLog } from '../utils/storage';

export interface TestKeyResult {
  success: boolean;
  message: string;
  latencyMs?: number;
  sampleOutput?: string;
}

export async function testApiKey(provider: ApiProvider, apiKey: string): Promise<TestKeyResult> {
  const providerClean = provider.replace('ApiKey', '');
  addApiLog(provider, '연결 테스트 시작', 'testing', `${providerClean.toUpperCase()} 키 테스트를 시도합니다.`);

  try {
    const response = await fetch('/api/test-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: providerClean,
        apiKey: apiKey?.trim(),
      }),
    });

    const data = await response.json();
    if (response.ok && data.success) {
      addApiLog(
        provider,
        '연결 테스트 성공',
        'success',
        `${data.message || '인증 성공'} (${data.latencyMs ?? 0}ms)`,
        data.latencyMs
      );
      return {
        success: true,
        message: data.message,
        latencyMs: data.latencyMs,
        sampleOutput: data.sampleOutput,
      };
    } else {
      addApiLog(
        provider,
        '연결 테스트 실패',
        'failed',
        data.message || '인증 실패 또는 오류 발생',
        data.latencyMs
      );
      return {
        success: false,
        message: data.message || '키 인증에 실패했습니다.',
        latencyMs: data.latencyMs,
      };
    }
  } catch (error: any) {
    const errorMsg = error.message || '서버 통신 실패';
    addApiLog(provider, '연결 오류', 'failed', errorMsg);
    return {
      success: false,
      message: `통신 오류: ${errorMsg}`,
    };
  }
}

export async function requestAiAnalysis(
  topic: string,
  userPrompt: string,
  settings: AppSettings,
  imageBase64?: string
): Promise<string> {
  // If engine mode is offline, no API is called
  if (settings.engineMode === 'offline') {
    return '';
  }

  const combinedPrompt = `[역학 분석 지침]
${settings.masterPrompt}

[사용자 맞춤 추가 지침]
${settings.customPrompt}

[분석 주제]
${topic}

[상세 입력 정보]
${userPrompt}

위 정보에 대해 깊이 있는 해설과 구체적이고 실천 가능한 개운(開運) 조언을 한국어로 품격 있게 작성해 주세요.`;

  try {
    const response = await fetch('/api/gemini/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: combinedPrompt,
        userKey: settings.apiKeys.geminiApiKey,
        imageBase64,
      }),
    });

    const data = await response.json();
    if (response.ok && data.success && data.text) {
      addApiLog('gemini', `${topic} AI 분석`, 'success', 'AI 심층 해설 생성 완료');
      return data.text;
    } else {
      addApiLog('gemini', `${topic} AI 분석 실패`, 'failed', data.message || '생성 실패');
      return '';
    }
  } catch (err: any) {
    addApiLog('gemini', `${topic} AI 오류`, 'failed', err.message || '네트워크 오류');
    return '';
  }
}
