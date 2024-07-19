
import React, { useState, useEffect, useRef  } from 'react';
import Chat2 from '../../assets/boat1.jpg';
import { motion } from 'framer-motion';
import { api_client } from '../../axios';
import DOMPurify from 'dompurify';


interface Message {
  id: number;
  text: string;
  sender: 'user' | 'boat';
  timestamp: string;
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading , setLoading]= useState<boolean>(false)
  const messagesEndRef : any= useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function convertToHTML(text:any) {
    // Split the text into lines
    const lines = text.split('\n');
    
    let html = '';
    let inList = false;

  
    lines.forEach((line : any)=> {
      line = line.trim();
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (line.startsWith('**') && line.endsWith('**')) {
        // Main heading
        html += `<h1>${line.replace(/\*\*/g, '')}</h1>`;
      } else if (line.startsWith('***') && line.endsWith('***')) {
        // Sub-heading
        html += `<h3>${line.replace(/\*\*\*/g, '')}</h3>`;
      } else if (line.startsWith('*')) {
        // List item
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        html += `<li>${line.substring(1).trim()}</li>`;
      } else {
        // Regular paragraph
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<p>${line}</p>`;
      }
    });
  
    if (inList) {
      html += '</ul>';
    }
  
    return html;
  }
  
  const sendMessage = async () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const data = {
        contents: [
          {
            role: 'user',
            parts: [{ text: inputText }]
          }
        ]
      };

      try {
      setLoading(true)
        const response = await api_client.post('', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        setLoading(false)

        if (response.status === 200) {
          const boatMessageText = response?.data?.candidates[0]?.content?.parts[0]?.text;
          const boatMessage: Message = {
            id: Date.now(),
            text: boatMessageText,
            sender: 'boat',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prevMessages) => [...prevMessages, boatMessage]);
          setInputText('');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="flex md:flex-row flex-col justify-between font-Poppins">
    <div className=" md:w-1/4 flex-col justify-center w-full">
    <h1 className='font-bold text-[5vh] items-center text-purple-700'><span className='text-gray-500'>Chat with</span> AI</h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="overflow-hidden md:w-[70vh] w-[40vh] relative md:block left-4 rounded-full"
      >
        <img src={Chat2} alt="Chat Icon" />
      </motion.div>
    </div>
    <div className="flex flex-col md:w-2/4 w-full h-[40vh] md:h-[90vh] rounded-lg bg-gray-100 ">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 items-end">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">
            Send your first message to start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end ' : 'justify-start text-start'} `}
            >
              <div
                className={`max-w-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-l-full rounded-tr-full'
                    :`${!loading ? 'bg-gray-300 text-black rounded-lg w-full' : 'bg-gray-300 text-black rounded-lg w-full'}`
                }`}
              >
                {message.sender === 'user'?<p>{message.text}</p>:<small className='space-y-2'
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(convertToHTML(message.text)),
  }}
/>}
<div ref={messagesEndRef} />
                
              </div>
             
              
            </div>
          ))
        )}
      </div>
      <div className="bg-white p-4 flex w-full rounded-lg">
        {/* <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type here..."
          className="flex-1 border rounded-full px-4    py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-purple-700  text-white rounded-full p-2 hover:bg-purple-700 focus:outline-none border-purple-700 focus:ring-2 focus:ring-purple-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button> */}
      </div>
    </div>
  </div>
  );
};

export default ChatWindow;
