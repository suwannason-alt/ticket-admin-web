/** @type {import('next').NextConfig} */

const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    // assetPrefix: '/admin',
    basePath: '/admin',
};

module.exports = withNextIntl(nextConfig);
