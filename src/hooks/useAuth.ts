import { useEffect, useState } from 'react';
import axios from 'axios';
interface User {
    uid: string;
    name?: string;
    image?: string
}
export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URI}/v1/auth/me`, { withCredentials: true })
            .then(res => {
                setUser(res.data);
                setStatus('authenticated')
            })
            .catch(() => {
                setUser(null);
                setStatus('unauthenticated')
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { user, status: status, isAuthLoading: loading };
};
