
import { watch } from 'fs';
import { exec } from 'child_process';

let debounceTimer;

console.log('Starting auto-push watcher...');

watch('.', { recursive: true, persistent: true }, (eventType, filename) => {
    if (filename && filename.includes('.git')) return;
    
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        console.log(`Change detected in ${filename}. Pushing...`);
        exec('git add . && git commit -m "Auto-save" && git push', (err, stdout, stderr) => {
            if (err) {
                console.error('Push failed:', stderr);
            } else {
                console.log('Pushed successfully:', stdout);
            }
        });
    }, 5000); 
});
