import {parse} from 'devalue';

const NUXT_DATA_REGEX = /<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/;

// Редьюсеры для распаковки внутренних обёрток Nuxt 3
const nuxtReducers = {
    Reactive: (v: unknown) => v,
    ShallowReactive: (v: unknown) => v,
    Ref: (v: unknown) => v,
    ShallowRef: (v: unknown) => v,
    NuxtError: (v: unknown) => v,
    EmptyRef: () => null,
    EmptyShallowRef: () => null,
};

export async function fetchNuxtData<T = Record<string, unknown>>(url: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(url, {
        headers: {
            Accept: 'text/html,application/xhtml+xml',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36',
        },
        signal
    });

    if (!response.ok) {
        throw new Error(`HTTP ошибка ${response.status} при загрузке ${url}`);
    }

    const html = await response.text();
    const match = html.match(NUXT_DATA_REGEX);

    if (!match || !match[1]) {
        throw new Error('Тег __NUXT_DATA__ не найден в ответе сервера');
    }

    try {
        return parse(match[1], nuxtReducers) as T;
    } catch (error) {
        throw new Error(`Ошибка декодирования devalue: ${(error as Error).message}`);
    }
}