/* MakanLog v2: core offline PWA and on-demand caching of on-device AI runtime/model. */
const CACHE = 'makanlog-offline-v2-photo-20261124';
const PRECACHE = [
  './', './index.html', './styles.css', './app.js', './photo.js',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PRECACHE)));
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('makanlog-offline-')&&key!==CACHE).map(key=>caches.delete(key)))),
    self.clients.claim()
  ]));
});
function aiAsset(url){
  return (url.hostname==='cdn.jsdelivr.net' && url.pathname.startsWith('/npm/@tensorflow')) ||
    url.hostname==='tfhub.dev' ||
    (url.hostname==='storage.googleapis.com' && (/tfhub|tfjs|mobilenet/i.test(url.pathname)));
}
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const u=new URL(event.request.url);
  const sameOrigin=u.origin===self.location.origin;
  if(!sameOrigin&&!aiAsset(u))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(event.request,{ignoreSearch:sameOrigin});
    if(cached)return cached;
    try{
      const response=await fetch(event.request);
      if(response.ok||response.type==='opaque'){
        try{await cache.put(event.request,response.clone());}catch(err){console.warn('Could not cache asset; offline AI may be unavailable',err);}
      }
      return response;
    }catch(err){
      if(sameOrigin && event.request.mode==='navigate')return await cache.match('./index.html')||Response.error();
      return Response.error();
    }
  })());
});
