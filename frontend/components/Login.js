import { useEffect, useRef } from 'react';

export const Login = ({ allowSkip, skipTimeoutSeconds }) => {
    const divRef = useRef(null);
  
    useEffect(() => {
      window.google.accounts.id.renderButton(divRef.current, {
          text: 'continue_with',
      });
    }, [])
  
    return <div className={`h-screen w-screen flex items-center justify-center absolute z-50 bg-white/30 backdrop-blur-md`}>
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="text-sm p-8 select-none">
            { allowSkip? `Log in or wait ${skipTimeoutSeconds} seconds...` : "Log in to continue." }
        </div>
        <div ref={divRef} />
      </div>
    </div>
  }
  