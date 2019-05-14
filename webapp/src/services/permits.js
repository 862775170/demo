import request from '@/utils/request';

const baseUrl = '/server/api/system/permits'

export async function getLists() {
    return request(`${baseUrl}/lists`)
}

export async function addPremits({ body }) {
    return request(baseUrl, {
        method: 'POST',
        body: body
    })
}

export async function updatePremits({ body }) {
    return request(baseUrl, {
        method: 'PUT',
        body: body
    })
}

export async function deletePremits({ id }) {
    return request(`${baseUrl}?id=${id}`, {
        method: 'DELETE',
    })
}