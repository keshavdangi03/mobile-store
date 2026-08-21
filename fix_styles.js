const fs = require('fs');

try {
  let content = fs.readFileSync('e:/Programming/mobile-store/app/page.tsx', 'utf-8');

  // Replace hero section start background
  content = content.replace(
    /bg-slate-900 text-white/g,
    'bg-card-bg text-foreground border border-card-border'
  );

  // Replace gradient and relative for carousel slides
  content = content.replace(
    /bg-gradient-to-tr from-emerald-900 to-teal-800/g,
    'bg-transparent'
  );
  content = content.replace(
    /bg-gradient-to-tr from-purple-950 to-indigo-900/g,
    'bg-transparent'
  );
  content = content.replace(
    /bg-gradient-to-tr from-teal-900 via-emerald-900 to-green-800 relative overflow-hidden/g,
    'bg-transparent relative overflow-hidden'
  );
  content = content.replace(
    /bg-gradient-to-tr from-blue-950 via-indigo-900 to-slate-900 relative overflow-hidden/g,
    'bg-transparent relative overflow-hidden'
  );
  
  // Replace white/slate text with theme colors in hero
  content = content.replace(/text-slate-300/g, 'text-foreground/60');
  content = content.replace(/text-slate-200\/90/g, 'text-foreground/80');
  content = content.replace(/text-slate-100/g, 'text-foreground/80');
  
  // Replace buttons in hero configuration
  content = content.replace(
    /bg-white\/10 border-white\/20 hover:bg-white\/20/g,
    'bg-transparent border-card-border hover:bg-foreground/5'
  );
  
  // Replace borders
  content = content.replace(/border-white\/10/g, 'border-card-border');
  
  // Replace specific text-white to text-foreground ONLY in hero (not btn)
  // Actually easier to just replace specific side promos
  content = content.replace(/bg-emerald-950/g, 'bg-card-bg border border-card-border');
  content = content.replace(/bg-orange-950/g, 'bg-card-bg border border-card-border');
  content = content.replace(/text-emerald-200/g, 'text-foreground/60');
  content = content.replace(/text-orange-200/g, 'text-foreground/60');
  content = content.replace(/bg-emerald-600 hover:bg-emerald-500 text-white/g, 'bg-primary hover:opacity-90 text-primary-foreground');
  content = content.replace(/bg-orange-600 hover:bg-orange-500 text-white/g, 'bg-primary hover:opacity-90 text-primary-foreground');
  content = content.replace(/text-white space-y-2/g, 'text-foreground space-y-2');

  // Replace active indicator
  content = content.replace(
    /activeSlide === idx \? "bg-white w-6" : "bg-white\/40 hover:bg-white\/60"/g,
    'activeSlide === idx ? "bg-primary w-6" : "bg-card-border hover:bg-primary/50"'
  );
  
  // Video overlay
  content = content.replace(/opacity-20 pointer-events-none/g, 'opacity-5 pointer-events-none');
  
  // Decorative Vector circle
  content = content.replace(/bg-white\/5/g, 'bg-card-border/30');
  content = content.replace(/text-emerald-400/g, 'text-primary');
  content = content.replace(/text-blue-400/g, 'text-primary');

  fs.writeFileSync('e:/Programming/mobile-store/app/page.tsx', content);
  console.log("Success!");
} catch (e) {
  console.error(e);
}
