import React, { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './component/chat/Home'
import ChatWindow from './component/chat/ChatWindow'

function App() {
  const [count, setCount] = useState(0)


  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatWindow" element={<ChatWindow />} />
      </Routes>
  );
}

      export default App
