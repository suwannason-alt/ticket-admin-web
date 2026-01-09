'use server'

import { getPublicEnvByName, getEnvByName } from '@daniel-rose/envex/server'

export default async function getENV() {
    const userAPI = await getPublicEnvByName('NEXT_PUBLIC_USER_API') || ''
    const credentialAPI = await getPublicEnvByName('NEXT_PUBLIC_CREDENTIAL_API') || ''
    const service = await getEnvByName('SERVICE_UUID') || ''
    const authWeb = await getPublicEnvByName('NEXT_PUBLIC_AUTH_WEB') || ''
    const basePath = await getPublicEnvByName('NEXT_PUBLIC_BASE_PATH') || ''
    const assetPrefix = await getPublicEnvByName('NEXT_PUBLIC_ASSET_PREFIX') || ''
    

    return { userAPI, credentialAPI, service, authWeb, basePath, assetPrefix }
}