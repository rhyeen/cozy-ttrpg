import { useState } from 'react';
import { functions } from '~/utils/firebase';
import { httpsCallable } from 'firebase/functions';

export function HomePage() {
  const [message, setMessage] = useState('');

  const callFunction = async () => {
    const helloWorld = httpsCallable(functions, 'helloWorld');
    const result = await helloWorld();
    setMessage((result.data as any).message);
  };

  return (
    <>
      <button onClick={callFunction}>Call Firebase Function</button>
      <p>{message}</p>
    </>
  );
}
