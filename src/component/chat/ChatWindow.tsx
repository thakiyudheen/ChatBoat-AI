
import React, { useState, useEffect, useRef } from 'react';
import Chat2 from '../../assets/boat1.jpg';
import { motion } from 'framer-motion';
import { api_client } from '../../axios';
import { IoIosSend } from "react-icons/io";
import DOMPurify from 'dompurify';
import { HiOutlineChatAlt } from "react-icons/hi";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'boat';
  timestamp: string;
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState<boolean>(false)
  const messagesEndRef: any = useRef(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function convertToHTML(text: any) {
    // Split the text into lines
    const lines = text.split('\n');

    let html = '';
    let inList = false;


    lines.forEach((line: any) => {
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
      setInputText('');
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

        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="flex md:flex-row flex-col justify-between font-Poppins">
      <div className=" md:w-1/4 flex-col justify-center w-full">
        <h1 className='font-bold text-[3vh] md:text-[5vh] items-center text-purple-700'><span className='text-gray-500'>Chat with</span> AI</h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-hidden  relative md:block md:w-[70vh]   rounded-full"
        >

          <img src={Chat2} alt="Chat Icon" />
        </motion.div>
      </div>
      <div className="flex flex-col md:w-2/4 w-full h-[40vh] md:h-[90vh] rounded-lg bg-gray-100 ">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 items-end">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 flex flex-col items-center justify-center md:h-[60vh] h-[40vh]">
              <HiOutlineChatAlt className='text-[4vh] text-gray-400' />
              <small>Send your first message to start the conversation!</small>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end ' : 'justify-start text-start'} `}
              >
                <div
                  className={`max-w-lg px-4 py-2 ${message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-l-full rounded-tr-full'
                      : `${!loading ? 'bg-gray-300 text-black rounded-lg w-full' : 'bg-gray-300 text-black rounded-lg w-full'}`
                    }`}
                >
                  {message.sender === 'user' ? <p>{message.text}</p> : <small className='space-y-2'
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(convertToHTML(message.text)),
                    }}
                  />}
                  
                 

                  <div ref={messagesEndRef} />

                </div>


              </div>
            ))

          )}
           {loading && (
          <div className="flex justify-start text-start">
            <div className="max-w-lg px-4 py-2  text-black rounded-lg w-full">
            <div className="spinner border-t-[4px] border-b-[4px] border-gray-500 rounded-full w-4 h-4 animate-spin"></div>
            </div>
          </div>
        )}

        </div>
        <div className="bg-white flex py-4 rounded-lg">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type here..."
            className="flex-1 border rounded-full w-3/4  px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={sendMessage}
            className="ml-5 bg-gradient-to-r from-purple-700 to-purple-800 w-1/4  text-white rounded-full py-2 px-1 text-lg hover:bg-purple-700 focus:outline-none border-purple-700 focus:ring-2 focus:ring-purple-500"
          >
            <small className='flex justify-center items-center'>send <IoIosSend /></small>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
