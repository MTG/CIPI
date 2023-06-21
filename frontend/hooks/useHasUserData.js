import { AuthContext } from '@/contexts/AuthContext'
import { useContext, useState, useEffect } from 'react';
import { API_HOST } from '@/config';

const getHasUserData = async (credential) => {
    const response = await fetch(`${API_HOST}/api/user`,
    {
      method: 'GET',
      headers: {
        Authentication: `Bearer ${credential}`
      }
    });
    const body = await response.json();
    return body;
}

export const useHasUserData = () => {
    const {credential } = useContext(AuthContext);
    const [hasData, setHasUserData] = useState(true);

    useEffect(() => {
        getHasUserData(credential).then(r => {
          setHasUserData(r['hasData'])
        }).catch((e) => console.log("no user data because not logged in", e))
      }, [credential]);

    return hasData
}