import { JSDOM } from 'jsdom';

(async () => {
    try {
        const dom = await JSDOM.fromURL('http://localhost:3000', {
            runScripts: "dangerously",
            resources: "usable",
            pretendToBeVisual: true
        });

        dom.window.addEventListener('error', (event) => {
            console.error('JSDOM Error:', event.error);
        });

        dom.window.addEventListener('unhandledrejection', (event) => {
            console.error('JSDOM Unhandled Rejection:', event.reason);
        });
        
        // Wait for 5 seconds to let scripts load and execute
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log("Root element content after 5s:");
        console.log(dom.window.document.getElementById('root')?.innerHTML?.substring(0, 500));
        
        const logs = dom.window.document.getElementById('error-log');
        if (logs) {
            console.log("Error log div contents:");
            console.log(logs.textContent);
        }
    } catch (e) {
        console.error("Script failed", e);
    }
})();
