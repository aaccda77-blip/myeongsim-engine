'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function StarBackground() {
    const [style, setStyle] = useState({ top: '0%', left: '0%', size: 1, duration: 2 });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStyle({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 3 + 2
        });
    }, []);

    return (
        <motion.div
            className="absolute bg-white rounded-full opacity-20"
            style={{
                width: style.size,
                height: style.size,
                top: style.top,
                left: style.left,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: style.duration, repeat: Infinity }}
        />
    );
}
