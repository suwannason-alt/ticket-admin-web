
import authenticated from '@/lib/axios/authenticate';

export async function companyUser() {
    try {
        const instance = await authenticated()
    } catch (error) {
        throw error;
    }
}