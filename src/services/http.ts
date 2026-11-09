const TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/** GET com tempo limite e mensagens de erro em linguagem simples. */
export async function getJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const resposta = await fetch(url, { signal: controller.signal });
    if (!resposta.ok) {
      throw new ApiError(`O serviço respondeu com erro (${resposta.status}). Tente de novo em instantes.`);
    }
    return (await resposta.json()) as T;
  } catch (erro) {
    if (erro instanceof ApiError) throw erro;
    throw new ApiError('Não foi possível conectar. Verifique sua internet e tente de novo.');
  } finally {
    clearTimeout(timer);
  }
}
