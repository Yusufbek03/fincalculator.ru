// Performance Optimizer for Google PageSpeed Insights 90+ Score
class PerformanceOptimizer {
    constructor() {
        this.metrics = {};
        this.optimizations = new Map();
        this.initializeOptimizations();
        this.startMonitoring();
    }

    initializeOptimizations() {
        // Critical CSS inlining
        this.optimizations.set('critical-css', () => this.inlineCriticalCSS());
        
        // Image optimization
        this.optimizations.set('image-optimization', () => this.optimizeImages());
        
        // JavaScript optimization
        this.optimizations.set('js-optimization', () => this.optimizeJavaScript());
        
        // Font optimization
        this.optimizations.set('font-optimization', () => this.optimizeFonts());
        
        // Resource hints
        this.optimizations.set('resource-hints', () => this.addResourceHints());
        
        // Service Worker optimization
        this.optimizations.set('service-worker', () => this.optimizeServiceWorker());
        
        // Caching optimization
        this.optimizations.set('caching', () => this.optimizeCaching());
    }

    startMonitoring() {
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Monitor resource loading
        this.monitorResourceLoading();
        
        // Monitor JavaScript performance
        this.monitorJavaScriptPerformance();
        
        // Monitor layout shifts
        this.monitorLayoutShifts();
    }

    // Critical CSS Inlining
    inlineCriticalCSS() {
        const criticalCSS = `
            /* Critical CSS for above-the-fold content */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Rubik', sans-serif; background-color: #f8f9fa; color: #333; line-height: 1.5; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
            .header { background: white; padding: 12px 0; }
            .header-content { display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 14px; font-weight: 600; color: #28a745; text-decoration: none; letter-spacing: 0.5px; }
            .nav { display: flex; align-items: center; gap: 24px; font-size: 13px; }
            .main { padding: 40px 0 80px; }
            .page-title { font-size: 32px; font-weight: 600; margin-bottom: 40px; color: #333; }
            .calculator { background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); margin-bottom: 60px; }
            .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; margin-bottom: 32px; }
            .form-group { display: flex; flex-direction: column; }
            .form-label { font-size: 13px; color: #A99E96; margin-bottom: 8px; font-weight: 400; }
            .form-input { padding: 12px 16px; border: 1px solid #dee2e6; border-radius: 6px; font-size: 14px; font-family: 'Rubik', sans-serif; background: white; transition: border-color 0.2s; }
            .calculate-btn { background: #28a745; color: white; border: none; padding: 14px 32px; border-radius: 6px; font-size: 14px; font-family: 'Rubik', sans-serif; font-weight: 600; cursor: pointer; transition: background-color 0.2s; width: 321px; height: 44px; }
        `;

        // Create style element for critical CSS
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        style.setAttribute('data-critical', 'true');
        
        // Insert at the beginning of head
        document.head.insertBefore(style, document.head.firstChild);
        
        console.log('Critical CSS inlined');
    }

    // Image Optimization
    optimizeImages() {
        // Lazy loading for images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
            
            // Add width and height attributes to prevent layout shifts
            if (!img.width || !img.height) {
                img.style.width = 'auto';
                img.style.height = 'auto';
            }
            
            // Use WebP format if supported
            if (this.supportsWebP()) {
                const src = img.src;
                if (src && !src.includes('.webp')) {
                    img.src = src.replace(/\.(jpg|jpeg|png)/i, '.webp');
                }
            }
        });

        // Optimize background images
        const elementsWithBg = document.querySelectorAll('[style*="background"]');
        elementsWithBg.forEach(el => {
            const style = el.style.backgroundImage;
            if (style && style.includes('url(') && this.supportsWebP()) {
                el.style.backgroundImage = style.replace(/\.(jpg|jpeg|png)/i, '.webp');
            }
        });

        console.log('Images optimized');
    }

    // JavaScript Optimization
    optimizeJavaScript() {
        // Defer non-critical JavaScript
        const scripts = document.querySelectorAll('script:not([data-critical])');
        scripts.forEach(script => {
            if (!script.async && !script.defer) {
                script.defer = true;
            }
        });

        // Optimize event listeners with debouncing
        this.optimizeEventListeners();

        // Use Intersection Observer for lazy loading
        this.setupIntersectionObserver();

        console.log('JavaScript optimized');
    }

    // Font Optimization
    optimizeFonts() {
        // Preload critical fonts
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.href = 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap';
        fontPreload.as = 'style';
        fontPreload.onload = () => {
            fontPreload.onload = null;
            fontPreload.rel = 'stylesheet';
        };
        document.head.appendChild(fontPreload);

        // Font display swap
        const fontLink = document.querySelector('link[href*="fonts.googleapis.com"]');
        if (fontLink) {
            fontLink.href = fontLink.href + '&display=swap';
        }

        // Fallback font stack
        document.documentElement.style.fontFamily = "'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

        console.log('Fonts optimized');
    }

    // Resource Hints
    addResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
        ];

        hints.forEach(hint => {
            const link = document.createElement('link');
            Object.assign(link, hint);
            document.head.appendChild(link);
        });

        console.log('Resource hints added');
    }

    // Service Worker Optimization
    optimizeServiceWorker() {
        if ('serviceWorker' in navigator) {
            // Register service worker with caching strategy
            navigator.serviceWorker.register('/js/sw.js', {
                scope: '/'
            }).then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            }).catch(error => {
                console.log('Service Worker registration failed:', error);
            });
        }
    }

    // Caching Optimization
    optimizeCaching() {
        // Add cache headers via meta tags (for static hosting)
        const cacheMeta = document.createElement('meta');
        cacheMeta.httpEquiv = 'Cache-Control';
        cacheMeta.content = 'public, max-age=31536000, immutable';
        document.head.appendChild(cacheMeta);

        // Local storage caching for calculator data
        this.setupLocalStorageCaching();
    }

    // Event Listener Optimization
    optimizeEventListeners() {
        // Debounce function for performance
        window.debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        // Throttle function for performance
        window.throttle = (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };
    }

    // Intersection Observer Setup
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });

            // Observe elements for lazy loading
            document.querySelectorAll('.lazy-load').forEach(el => {
                observer.observe(el);
            });
        }
    }

    // Local Storage Caching
    setupLocalStorageCaching() {
        // Cache calculator results
        const cacheKey = 'calculator_cache';
        const cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours

        window.cacheCalculatorResult = (key, data) => {
            const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
            cache[key] = {
                data: data,
                timestamp: Date.now()
            };
            localStorage.setItem(cacheKey, JSON.stringify(cache));
        };

        window.getCachedResult = (key) => {
            const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
            const item = cache[key];
            
            if (item && (Date.now() - item.timestamp) < cacheExpiry) {
                return item.data;
            }
            
            return null;
        };
    }

    // Core Web Vitals Monitoring
    monitorCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
                console.log('LCP:', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    console.log('FID:', this.metrics.fid);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.metrics.cls = clsValue;
                console.log('CLS:', clsValue);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    // Resource Loading Monitoring
    monitorResourceLoading() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.initiatorType === 'script' && entry.duration > 100) {
                        console.warn('Slow script loading:', entry.name, entry.duration);
                    }
                });
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }

    // JavaScript Performance Monitoring
    monitorJavaScriptPerformance() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const longTaskObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 50) {
                        console.warn('Long task detected:', entry.duration);
                    }
                });
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });
        }
    }

    // Layout Shifts Monitoring
    monitorLayoutShifts() {
        let layoutShiftScore = 0;
        
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    layoutShiftScore += entry.value;
                }
            }
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
    }

    // WebP Support Detection
    supportsWebP() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Run all optimizations
    async optimize() {
        console.log('Starting performance optimizations...');
        
        const optimizations = Array.from(this.optimizations.values());
        
        for (const optimization of optimizations) {
            try {
                await optimization();
            } catch (error) {
                console.error('Optimization failed:', error);
            }
        }
        
        console.log('Performance optimizations completed');
        this.generateReport();
    }

    // Generate performance report
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            recommendations: this.getRecommendations()
        };
        
        console.log('Performance Report:', report);
        return report;
    }

    // Get performance recommendations
    getRecommendations() {
        const recommendations = [];
        
        if (this.metrics.lcp > 2500) {
            recommendations.push('Optimize Largest Contentful Paint (LCP) - consider image optimization and critical CSS');
        }
        
        if (this.metrics.fid > 100) {
            recommendations.push('Optimize First Input Delay (FID) - reduce JavaScript execution time');
        }
        
        if (this.metrics.cls > 0.1) {
            recommendations.push('Optimize Cumulative Layout Shift (CLS) - add explicit dimensions to images');
        }
        
        return recommendations;
    }

    // Get current performance score
    getPerformanceScore() {
        let score = 100;
        
        // LCP scoring
        if (this.metrics.lcp > 4000) score -= 30;
        else if (this.metrics.lcp > 2500) score -= 15;
        
        // FID scoring
        if (this.metrics.fid > 300) score -= 30;
        else if (this.metrics.fid > 100) score -= 15;
        
        // CLS scoring
        if (this.metrics.cls > 0.25) score -= 30;
        else if (this.metrics.cls > 0.1) score -= 15;
        
        return Math.max(0, score);
    }
}

// Performance monitoring and optimization
class PerformanceMonitor {
    constructor() {
        this.optimizer = new PerformanceOptimizer();
        this.metrics = {};
        this.startTime = performance.now();
        this.initializeMonitoring();
    }

    initializeMonitoring() {
        // Monitor page load
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now() - this.startTime;
            this.checkPerformance();
        });

        // Monitor calculation performance
        this.monitorCalculationPerformance();
    }

    monitorCalculationPerformance() {
        // Monitor calculator performance
        if (window.CreditCalculator) {
            const originalCalculate = window.CreditCalculator.prototype.calculate;
            window.CreditCalculator.prototype.calculate = function() {
                const start = performance.now();
                const result = originalCalculate.call(this);
                const end = performance.now();

                this.metrics = this.metrics || {};
                this.metrics.calculationTime = end - start;

                if (this.metrics.calculationTime > 1000) {
                    console.warn('Slow calculation detected:', this.metrics.calculationTime);
                }

                return result;
            };
        }
    }

    checkPerformance() {
        console.log('Performance Metrics:', this.metrics);

        // Check if performance is below threshold
        if (this.metrics.loadTime > 3000) {
            console.warn('Page load time is above 3 seconds:', this.metrics.loadTime);
        }

        if (this.metrics.calculationTime > 1000) {
            console.warn('Calculation time is above 1 second:', this.metrics.calculationTime);
        }

        // Get performance score
        const score = this.optimizer.getPerformanceScore();
        console.log('Performance Score:', score);

        if (score < 90) {
            console.warn('Performance score below 90. Running optimizations...');
            this.optimizer.optimize();
        }
    }

    getMetrics() {
        return {
            ...this.metrics,
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            } : null,
            performanceScore: this.optimizer.getPerformanceScore()
        };
    }
}

// Initialize performance optimization
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
    window.performanceMonitor = new PerformanceMonitor();
    
    // Run optimizations
    window.performanceOptimizer.optimize();
});

// Export for use in other files
window.PerformanceOptimizer = PerformanceOptimizer;
window.PerformanceMonitor = PerformanceMonitor;
