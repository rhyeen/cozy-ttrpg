import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { auth } from './firebase';
import { signInWithGoogle } from './auth';

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      setUser(user);
      console.log('user updated', user)
    });
  }, []);

  return (
    <main className="space-y-4 bg-gray-100 min-h-screen">
      {user?.email && <p>Signed in as: {user.email}</p>}

        <div className="flex ">
            <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="w-20 h-20" alt="Vite logo"/>
            </a>
            <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="w-20 h-20" alt="React logo" />
            </a>
        </div>
        <h1 className="text-4xl font-bold text-center py-8">Vite + React</h1>
        <button className="bg-cozy-blue rounded-lg p-4" onClick={signInWithGoogle}> 
          Sign in with Google
        </button> 
        <div className="card p-4 rounded-md border-2 border-gray-300 shadow-md max-w-md mx-auto">
            <button className="bg-blue-200 rounded-lg p-4" onClick={() => setCount((count) => count + 1)}>
                count is {count}
            </button>
            <button className='bg-green-300 p-2 rounded-md' onClick={signInWithGoogle}>
                Sign In With Google
            </button>
            <p>
                Edit <code>src/App.tsx</code> and save to test HMR
            </p>
        </div> 
        <p className="read-the-docs">
            Click on the Vite and React logos to learn more
        </p>
    </main>
  )
}

export default App

