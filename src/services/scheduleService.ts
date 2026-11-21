import { fetchNuxtData } from './nuxtParser';

const BASE_URL = 'https://site.mstimetables.ru/01a00f53d32773b5b396bf3eb6f57ce2';

export async function getRawScheduleData(path = '') {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${BASE_URL}${normalizedPath}`;
    console.log(url);

    const nuxtPayload = await fetchNuxtData<{ data?: Record<string, unknown> }>(url);

    // В Nuxt 3 полезная нагрузка обычно лежит внутри свойства data
    return nuxtPayload?.data ?? nuxtPayload;
}