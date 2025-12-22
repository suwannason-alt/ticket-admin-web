
import authenticated from '@/lib/axios/authenticate';

export async function companyUser() {
    try {
        const instance = await authenticated()
    } catch (error) {
        throw error;
    }
}

export async function getCurrentCompanyUser() {
    try {
        const instance = await authenticated()
        const response = await instance.get(`/api/v1/company/current`);
        return response.data;
    } catch (error: any) {
        throw error.response || error.message
    }
}

export async function updateCompanyProfile(uuid: string, body: any) {
    try {
        const instance = await authenticated()
        const response = await instance.put(`/api/v1/company/${uuid}`, body);
        return response.data;
    } catch (error: any) {
        throw error.response || error.message
    }
}