/**
 * Section reveal — the whole mechanism, as one inline script.
 *
 * Runs in <head> before first paint. It marks the document `js`, which is the
 * only thing that lets the reveal styles hide a block at all: the hidden
 * state can therefore only exist in a browser that is also running the code
 * that removes it. No JS, blocked JS, print, or reduced motion → the class is
 * never added and every section renders visible.
 *
 * Three mechanisms were measured on this page before landing here. Both of
 * the earlier ones failed the same way — sections permanently invisible:
 *
 *   1. CSS `animation-timeline: view()`. The ViewTimeline attached but never
 *      activated (`animation.currentTime` was null on every subject), and
 *      with seventeen subjects a programmatic scroll froze the renderer for
 *      >45s; disabling only those rules took the same scroll to 3ms. Firefox
 *      has no stable support for it either.
 *   2. An IntersectionObserver inside a React client component. The effect
 *      ran before the streamed page segment committed, so its query returned
 *      zero nodes — and separately, a jump from 0 to 2000px moved a section
 *      from below the viewport to above it inside one frame, crossing no
 *      threshold, so even a populated observer reported nothing for it.
 *
 * Hence: no React, re-query rather than snapshot, and test POSITION rather
 * than intersection state, so a block that has been scrolled past reveals
 * exactly like one that is arriving. rAF-throttled, and it only ever measures
 * blocks that are not yet revealed, so the work shrinks to nothing as the
 * guest scrolls. The MutationObserver keeps it correct across client-side
 * route changes, when a whole page of new blocks appears at once.
 */
export const REVEAL_SCRIPT = `(function(){
var d=document,r=d.documentElement;
try{
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  r.classList.add('js');
  var frame=0;
  function check(){
    frame=0;
    var els=d.querySelectorAll('.reveal:not(.is-in),.reveal-fade:not(.is-in)');
    var limit=window.innerHeight*0.92;
    for(var i=0;i<els.length;i++){
      if(els[i].getBoundingClientRect().top<limit)els[i].classList.add('is-in');
    }
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(check);}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule);
  addEventListener('load',schedule);
  function watch(){
    schedule();
    if(d.body)new MutationObserver(schedule).observe(d.body,{childList:true,subtree:true});
  }
  // This script is hoisted into <head> by the framework and may execute
  // either before or after DOMContentLoaded, so cover both rather than
  // assuming the event is still to come.
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',watch);
  else watch();
  // Content streams in for a moment after first paint; a short poll makes the
  // first screen correct even if nothing else has fired yet.
  var ticks=0,poll=setInterval(function(){schedule();if(++ticks>20)clearInterval(poll);},250);
}catch(e){r.classList.remove('js');}
})()`
