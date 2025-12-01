
import authenticated from '@/lib/axios/authenticate';


export async function getSystemRole() {
    try {
        const instance = await authenticated()
        const response = await instance.get(`/api/v1/roles/system`);

        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export async function getPermission(role_uuid: string) {
    try {
        const instance = await authenticated()
        const response = await instance.get(`/api/v1/roles/${role_uuid}/permission`);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export async function getUserRole() {
    try {
        const instance = await authenticated()
        const response = await instance.get(`/api/v1/roles/user`)
        return response.data;
    } catch (error) {
        throw error;
    }
}