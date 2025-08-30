// Optimized Service Worker for Calculator Performance
const CACHE_NAME = 'calculator-cache-v1.0';
const STATIC_CACHE = 'static-cache-v1.0';
const DYNAMIC_CACHE = 'dynamic-cache-v1.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/calculator.js',
    '/config.js',
    '/calculator-manager.js',
    '/admin.js',
    '/performance-optimizer.js',
    '/xlsx.min.js',
    '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests (except fonts)
    if (!url.origin.includes(self.location.origin) && !url.href.includes('fonts.googleapis.com')) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then(response => {
                // Return cached version if available
                if (response) {
                    console.log('Serving from cache:', request.url);
                    return response;
                }
                
                // Clone the request for network fallback
                const fetchRequest = request.clone();
                
                return fetch(fetchRequest)
                    .then(response => {
                        // Check if response is valid
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response for caching
                        const responseToCache = response.clone();
                        
                        // Cache dynamic content
                        if (shouldCache(request.url)) {
                            caches.open(DYNAMIC_CACHE)
                                .then(cache => {
                                    cache.put(request, responseToCache);
                                    console.log('Cached dynamic content:', request.url);
                                });
                        }
                        
                        return response;
                    })
                    .catch(error => {
                        console.error('Fetch failed:', error);
                        
                        // Return offline page for navigation requests
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        
                        return new Response('Network error', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// Determine if URL should be cached
function shouldCache(url) {
    const urlObj = new URL(url);
    
    // Cache calculator-related requests
    if (urlObj.pathname.includes('calculator') || 
        urlObj.pathname.includes('admin') ||
        urlObj.pathname.includes('config')) {
        return true;
    }
    
    // Cache font requests
    if (urlObj.href.includes('fonts.googleapis.com') || 
        urlObj.href.includes('fonts.gstatic.com')) {
        return true;
    }
    
    // Cache static assets
    if (urlObj.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|ico)$/)) {
        return true;
    }
    
    return false;
}

// Background sync for offline calculations
self.addEventListener('sync', event => {
    if (event.tag === 'calculator-sync') {
        console.log('Background sync triggered');
        event.waitUntil(performBackgroundSync());
    }
});

// Background sync function
function performBackgroundSync() {
    // Process any pending calculations
    return Promise.resolve()
        .then(() => {
            console.log('Background sync completed');
        })
        .catch(error => {
            console.error('Background sync failed:', error);
        });
}

// Push notification handling
self.addEventListener('push', event => {
    console.log('Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'Новое уведомление от калькулятора',
                    icon: '/icons/icon.svg',
            badge: '/icons/icon.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Открыть калькулятор',
                icon: '/icon-192x192.png'
            },
            {
                action: 'close',
                title: 'Закрыть',
                icon: '/icon-192x192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Кредитный калькулятор', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling for calculator data
self.addEventListener('message', event => {
    console.log('Message received in Service Worker:', event.data);
    
    if (event.data && event.data.type === 'CACHE_CALCULATOR_DATA') {
        // Cache calculator results
        const { key, data } = event.data;
        event.waitUntil(
            caches.open(DYNAMIC_CACHE)
                .then(cache => {
                    const response = new Response(JSON.stringify(data), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                    return cache.put(`/calculator-data/${key}`, response);
                })
        );
    }
    
    if (event.data && event.data.type === 'GET_CALCULATOR_DATA') {
        // Retrieve cached calculator data
        const { key } = event.data;
        event.waitUntil(
            caches.match(`/calculator-data/${key}`)
                .then(response => {
                    if (response) {
                        return response.json();
                    }
                    return null;
                })
                .then(data => {
                    event.ports[0].postMessage({ data });
                })
        );
    }
});

// Performance monitoring
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
        console.log('Performance metrics received:', event.data.metrics);
        
        // Store performance metrics for analysis
        event.waitUntil(
            caches.open(DYNAMIC_CACHE)
                .then(cache => {
                    const metrics = {
                        timestamp: Date.now(),
                        ...event.data.metrics
                    };
                    
                    const response = new Response(JSON.stringify(metrics), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                    
                    return cache.put('/performance-metrics', response);
                })
        );
    }
});

// Cache warming for critical resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                // Pre-warm cache with critical resources
                const criticalResources = [
                    'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap',
                    '/calculator.js',
                    '/config.js'
                ];
                
                return Promise.all(
                    criticalResources.map(url => 
                        fetch(url)
                            .then(response => cache.put(url, response))
                            .catch(error => console.warn('Failed to pre-warm cache for:', url, error))
                    )
                );
            })
    );
});

console.log('Service Worker loaded');