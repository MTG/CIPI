import { createContext, useState, useEffect, useRef } from 'react';
import { Login } from '@/components/Login'
import { API_HOST } from '@/config'

const DEFAULT_CONTEXT = {
  requireLogin: ({ allowSkip = false, skipTimeoutSeconds = 10 }) => console.log("context not initialized"),
  credential: null
}

export const AuthContext = createContext(DEFAULT_CONTEXT);

const SESSION_CREDENTIAL_KEY = "gid_credential"

const isTokenValid = async (credential) => {
  if (credential === null || credential === undefined) return false;
  try {
    const response = await fetch(`${API_HOST}/auth`, 
      {
        method: 'POST',
        headers: {
          Authentication: `Bearer ${credential}`
        }
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

export const AuthContextProvider = ({ children, oneTapEnabled = true }) => {
  const [credential, setCredential] = useState(null)

  useEffect(() => {
    const sessionCredential = sessionStorage.getItem(SESSION_CREDENTIAL_KEY)

    const script = document.createElement("script");
    isTokenValid(sessionCredential).then(isValid => {
      if (!isValid){
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = () => {
          console.debug("GOOGLE_AUTH_CLIENT_ID", process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID)
          window.google.accounts.id.initialize({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID,
              auto_select: true,
              callback: function(res){
                  console.log("Google flow callback received.")
                  if (!res.clientId || !res.credential || res.clientId !== process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID) {
                      console.error("Invalid response after Google Sign In flow.")
                      return
                  }
  
                  setCredential(res.credential)
                  sessionStorage.setItem(SESSION_CREDENTIAL_KEY, res.credential);
                }
          });
  
          window.google.accounts.id.prompt(); // also display the One Tap dialog
        }
      } else {
        setCredential(sessionCredential)
      }
  
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    })
    
    
    }, [oneTapEnabled])

  const [showLogin, setShowLogin] = useState(false)
  const [allowSkip, setAllowSkip] = useState(false)
  const [remainingSkipTimeoutSeconds, setRemainintSkipTimeoutSeconds] = useState(10)
  useEffect(() => {
    if (remainingSkipTimeoutSeconds <= 0) {
      if (!allowSkip) {
        return;
      }
      setShowLogin(false)
      return;
    }

    let timer = window.setInterval(() => {
      setRemainintSkipTimeoutSeconds(remainingSkipTimeoutSeconds - 1)
    }, 1000);
  
    return () => window.clearInterval(timer);
  }, [remainingSkipTimeoutSeconds])

  const requireLogin = async ({ allowSkip = false, skipTimeoutSeconds = 10 }) => {
    if (await isTokenValid(credential)) return true;
    setAllowSkip(allowSkip)
    setRemainintSkipTimeoutSeconds(skipTimeoutSeconds)
    setShowLogin(true)
    return false
  }

  const [context, setContext] = useState({
    requireLogin, credential
  })

  useEffect(() => {
    setContext({
      requireLogin, credential
    })
  }, [credential])

  return <AuthContext.Provider value={context}>
    { showLogin && <Login allowSkip={allowSkip} skipTimeoutSeconds={remainingSkipTimeoutSeconds} /> }
    { children }
  </AuthContext.Provider>;
}
