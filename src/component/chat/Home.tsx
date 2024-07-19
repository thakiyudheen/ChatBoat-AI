import React from 'react';
import { motion } from 'framer-motion';
import Chat2 from '../../assets/chat3.jpg';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate()
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-between p-4 md:flex-row md:p-0"
        >
            <div className="flex items-center justify-center mb-7 md:mb-0 md:mr-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="overflow-hidden md:w-[70vh] w-[40vh] rounded-full"
                >
                    <img src={Chat2} alt="Chat Icon" />
                </motion.div>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center md:text-left relative items-center"
            >
                <div>
                    <h1 className="text-2xl font-bold mb-2">Enjoy the new experience of chatting with global friends</h1>
                    <p className="text-gray-500 mb-6">Connect people around the world for free</p>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-purple-600 text-white py-2 px-10 rounded-full"
                        transition={{ duration: 0.2 }}
                        onClick={()=>navigate('/chatWindow')}
                    >
                        Get Started
                    </motion.button>
                    <p className="text-gray-400 text-sm mt-4">Powered by <strong>ussage</strong></p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Home;
