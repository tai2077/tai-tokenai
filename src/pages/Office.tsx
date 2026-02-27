import React, { useState, useEffect } from 'react';
import PixelOfficeApp from '../components/pixel-office/App';
import '../components/pixel-office/index.css';
import { MockHost } from '../components/pixel-office/MockHost';

export default function Office() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
            <MockHost />
            <PixelOfficeApp />
        </div>
    );
}
