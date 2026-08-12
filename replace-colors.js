const fs = require('fs');
const path = require('path');

function replaceInFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            replaceInFiles(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = content;
            
            // Replace hardcoded backgrounds with theme variables
            updated = updated.replace(/bg-slate-50 dark:bg-slate-900\/50/g, 'bg-card-bg');
            updated = updated.replace(/bg-slate-50 dark:bg-slate-900/g, 'bg-card-bg');
            updated = updated.replace(/bg-slate-50/g, 'bg-card-bg');
            updated = updated.replace(/dark:bg-slate-900/g, ''); // Let html.dark handle dark mode card-bg
            updated = updated.replace(/bg-white dark:bg-slate-900/g, 'bg-card-bg');
            updated = updated.replace(/bg-white dark:bg-slate-950/g, 'bg-card-bg');
            updated = updated.replace(/bg-slate-100 dark:bg-slate-800/g, 'hover:bg-black/5 dark:hover:bg-white/10');
            updated = updated.replace(/bg-slate-100/g, 'bg-black/5');
            updated = updated.replace(/dark:hover:bg-slate-800/g, 'hover:bg-white/10');
            updated = updated.replace(/hover:bg-slate-50/g, 'hover:bg-white/40');
            updated = updated.replace(/border-gray-200 dark:border-gray-800/g, 'border-card-border');
            updated = updated.replace(/border-gray-200/g, 'border-card-border');
            updated = updated.replace(/border-slate-200 dark:border-slate-800/g, 'border-card-border');
            
            if (updated !== content) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

replaceInFiles(path.join(__dirname, 'app'));
replaceInFiles(path.join(__dirname, 'components'));
console.log("Done");
