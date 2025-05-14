import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'de', 'ja', 'zh-CN', 'fr', 'it', 'pt-BR', 'ru', 'ar', 'cs', 'es', 'ko', 'pt-PT'],
    defaultLocale: 'en',
});