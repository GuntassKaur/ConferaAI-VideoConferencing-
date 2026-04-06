const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const replacements = {
    'bg-white/5': 'bg-white',
    'bg-white/10': 'bg-slate-50',
    'bg-white/\\[0.02\\]': 'bg-slate-50',
    'bg-white/\\[0.03\\]': 'bg-slate-50',
    'border-white/5': 'border-slate-200',
    'border-white/10': 'border-slate-200',
    'bg-zinc-900': 'bg-slate-100',
    'bg-zinc-800': 'bg-indigo-50',
    'border-[#020617]': 'border-white',
    'bg-[#020617]': 'bg-white',
    'bg-black/40': 'bg-slate-100',
    'text-white': 'text-slate-800',  // this might catch some btn text but we fix buttons manually if needed
    'text-zinc-500': 'text-slate-500',
    'hover:text-white': 'hover:text-indigo-600',
    'hover:bg-white/5': 'hover:bg-indigo-50',
    'hover:bg-white/10': 'hover:bg-indigo-100',
    'hover:bg-black/60': 'hover:bg-slate-200'
};

walk(srcDir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let orig = content;
        for (const [key, val] of Object.entries(replacements)) {
            const regex = new RegExp(key.replace(/\//g, '\\/'), 'g');
            content = content.replace(regex, val);
        }
        if (content !== orig) {
            fs.writeFileSync(filePath, content);
            console.log('Updated ' + filePath);
        }
    }
});
