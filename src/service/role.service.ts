
import authenticated from '@/lib/axios/authenticate';


export async function getSystemRole() {
    try {
        const instance = await authenticated()
        const response = await instance.get(`/api/v1/roles/system`);

        return response.data;
    } catch (error: any) {
        throw error.response || error.message;
    }
}

export async function getPermission(role_uuid: string) {
    try {
        const instance = await authenticated()
        const response = await instance.get(`/api/v1/roles/${role_uuid}/permission`);
        return response.data;
    } catch (error: any) {
        throw error.response || error.message;
    }
}

export async function getUserRole() {
    try {
        const instance = await authenticated()
        const response = await instance.get(`/api/v1/roles/user`)
        return response.data;
    } catch (error: any) {
        throw error.response || error.message;
    }
}

export async function addUserRole(role_uuid: string, userUUIDs: string[]) {
    try {
        const instance = await authenticated()
        const response = await instance.post(`/api/v1/roles/${role_uuid}/add-user-role`, { users: userUUIDs });
        return response.data;
    } catch (error: any) {
        throw error.response || error.message
    }
}