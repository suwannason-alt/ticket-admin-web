

import unauthen from '@/lib/axios/unauthenticate';
import authenticated from '@/lib/axios/authenticate';
import Cookies from 'js-cookie';

export async function login(username: string, password: string) {
    try {
        const instance = await unauthen()
        const response = await instance.post(`/api/v1/users/login`, { email: username, password })
        Cookies.set('token', response.data.data.token)
        Cookies.set('refreshToken', response.data.data.refreshToken)
        return response;

    } catch (error: any) {
        throw error.response
    }
}

export async function profile() {
    try {
        const instance = await authenticated()
        const response = await instance.get(`/api/v1/users/profile`)
        return response.data;
    } catch (error: any) {
        throw error.response || error.message
    }
}

export async function permissions() {
    try {
        const instance = await authenticated()
        const response = await instance.get(`/api/v1/permissions/user`)
        return response.data;
    } catch (error: any) {
        throw error.response || error.message
    }
}

export async function company() {
    try {
        const instance = await authenticated()
        const response = await instance.get(`/api/v1/company`)
        return response.data;
    } catch (error: any) {
        return error.response || error.message
    }
}

export async function createGroup(name: string, description: string) {
    try {
        const instance = await authenticated()
        const response = await instance.post(`/api/v1/groups`, { name, description });
        return response.data;
    } catch (error: any) {
        throw error.response || error.message
    }
}

export async function listGroup(page: number, limit: number) {
    try {
        const instance = await authenticated()
        const response = await instance.get(`/api/v1/groups?page=${page}&&limit=${limit}`)
        return response.data;
    } catch (error: any) {
        throw error.response || error.message
    }
}

export async function listGroupMember(uuid: string, page: number, limit: number) {
    try {
        const instance = await authenticated()
        const response = await instance.get(`/api/v1/groups/member/${uuid}?page=${page}&&limit=${limit}`);
        return response.data;
    } catch (error: any) {
        throw error.response || error.message
    }
}

export async function listMemberNotInGroup(text: string, uuid: string, page: number, limit: number) {
    try {
        const body = {};
        if (text && text !== '') {
            Object.assign(body, { search: text });
        }
        const instance = await authenticated()
        const response = await instance.patch(`/api/v1/groups/not-member/${uuid}?page=${page}&&limit=${limit}`, body);
        return response.data;
    } catch (error: any) {
        throw error.response || error.message
    }
}

export async function addMemberToGroup(groupUUID: string, userUUIDs: string[]) {
    try {
        const instance = await authenticated()
        const response = await instance.post(`/api/v1/groups/${groupUUID}/add-user`, { users: userUUIDs });
        return response.data;
    } catch (error: any) {
        throw error.response || error.message
    }
}

export async function deleteGroup(uuid: string) {
    try {
        const instance = await authenticated()
        const response = await instance.delete(`/api/v1/groups/${uuid}`);
        return response.data;
    } catch (error: any) {
        throw error.response || error.message
    }
}

export async function listUser(page: number, limit: number) {
        try {
        const instance = await authenticated()
        const response = await instance.patch(`/api/v1/users?page=${page}&&limit=${limit}`)
        return response.data;
    } catch (error: any) {
        throw error.response || error.message
    }
}