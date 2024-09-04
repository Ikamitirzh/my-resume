// main.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // اینجا مطمئن شوید که بسته‌های مورد نیاز نصب شده‌اند
import App from './App'; // کامپوننت اصلی که کل بازی را مدیریت می‌کند

// پیدا کردن عنصر DOM که باید React در آن رندر شود
const container = document.getElementById('root');

if (container) {
    // ایجاد ریشه‌ی React و رندر کردن کامپوننت App
    const root = createRoot(container);
    root.render(<App />);
} else {
    console.error('Target container is not a DOM element.');
}
