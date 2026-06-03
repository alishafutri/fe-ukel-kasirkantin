export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    return fetch(`http://localhost:8000${endpoint}`, {
        ...options,
        headers: {
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
            ...options.headers,
        },
    });
}