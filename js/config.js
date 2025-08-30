// Configuration for Calculator Management System
class CalculatorConfig {
    constructor() {
        this.calculators = {
            'credit': {
                id: 'credit',
                name: 'Кредиты',
                slug: 'kreditnyj-kalkulyator',
                category: 'Кредитный',
                description: 'Расчет потребительского кредита',
                icon: '💰',
                color: '#28a745',
                variables: {
                    minAmount: 10000,
                    maxAmount: 5000000,
                    defaultAmount: 1500000,
                    minRate: 5,
                    maxRate: 30,
                    defaultRate: 12.5
                },
                seo: {
                    title: '{category} калькулятор {year} | Рассчитать ежемесячный платёж',
                    description: '{category} калькулятор {year} - быстрый расчет ежемесячного платежа, переплаты и графика погашения кредита онлайн',
                    h1: '{category} калькулятор',
                    keywords: 'кредитный калькулятор, расчет кредита, ежемесячный платеж'
                }
            },
            'mortgage': {
                id: 'mortgage',
                name: 'Ипотечный',
                slug: 'ipotechnyj-kalkulyator',
                category: 'Ипотечный',
                description: 'Расчет ипотечного кредита',
                icon: '🏠',
                color: '#007bff',
                variables: {
                    minAmount: 100000,
                    maxAmount: 30000000,
                    defaultAmount: 5000000,
                    minRate: 3,
                    maxRate: 20,
                    defaultRate: 8.5
                },
                seo: {
                    title: '{category} калькулятор {year} | Рассчитать ипотеку онлайн',
                    description: '{category} калькулятор {year} - расчет ипотечного кредита, ежемесячных платежей и переплаты',
                    h1: '{category} калькулятор',
                    keywords: 'ипотечный калькулятор, расчет ипотеки, ипотечный кредит'
                }
            },
            'auto': {
                id: 'auto',
                name: 'Автокредит',
                slug: 'avtokredit-kalkulyator',
                category: 'Автокредит',
                description: 'Расчет автокредита',
                icon: '🚗',
                color: '#fd7e14',
                variables: {
                    minAmount: 50000,
                    maxAmount: 5000000,
                    defaultAmount: 1000000,
                    minRate: 5,
                    maxRate: 25,
                    defaultRate: 10.5
                },
                seo: {
                    title: '{category} калькулятор {year} | Рассчитать автокредит',
                    description: '{category} калькулятор {year} - расчет автокредита, первоначального взноса и ежемесячных платежей',
                    h1: '{category} калькулятор',
                    keywords: 'автокредит калькулятор, расчет автокредита, автозайм'
                }
            },
            'consumer': {
                id: 'consumer',
                name: 'Потребительский',
                slug: 'potrebitelskij-kalkulyator',
                category: 'Потребительский',
                description: 'Расчет потребительского кредита',
                icon: '💳',
                color: '#6f42c1',
                variables: {
                    minAmount: 10000,
                    maxAmount: 3000000,
                    defaultAmount: 500000,
                    minRate: 7,
                    maxRate: 35,
                    defaultRate: 15.5
                },
                seo: {
                    title: '{category} калькулятор {year} | Рассчитать потребительский кредит',
                    description: '{category} калькулятор {year} - расчет потребительского кредита с минимальными требованиями',
                    h1: '{category} калькулятор',
                    keywords: 'потребительский кредит калькулятор, займ, микрокредит'
                }
            },
            'refinancing': {
                id: 'refinancing',
                name: 'Рефинансирование',
                slug: 'refinansirovanie-kalkulyator',
                category: 'Рефинансирование',
                description: 'Расчет рефинансирования кредитов',
                icon: '🔄',
                color: '#20c997',
                variables: {
                    minAmount: 100000,
                    maxAmount: 10000000,
                    defaultAmount: 2000000,
                    minRate: 3,
                    maxRate: 25,
                    defaultRate: 9.5
                },
                seo: {
                    title: '{category} калькулятор {year} | Рассчитать рефинансирование',
                    description: '{category} калькулятор {year} - расчет рефинансирования кредитов для снижения ставки',
                    h1: '{category} калькулятор',
                    keywords: 'рефинансирование калькулятор, перекредитование, снижение ставки'
                }
            }
        };

        this.globalSeo = {
            defaultTitle: '{category} калькулятор {year} | Рассчитать ежемесячный платёж',
            defaultDescription: '{category} калькулятор {year} - быстрый расчет ежемесячного платежа, переплаты и графика погашения кредита онлайн',
            defaultH1: '{category} калькулятор',
            siteName: 'FINCALCULATOR.RU',
            baseUrl: 'https://fincalculator.ru'
        };

        this.templates = {
            'Кредитный': {
                title: '{category} калькулятор {year} | Рассчитать ежемесячный платёж',
                description: '{category} калькулятор {year} - быстрый расчет ежемесячного платежа, переплаты и графика погашения кредита онлайн',
                h1: '{category} калькулятор'
            },
            'Ипотечный': {
                title: '{category} калькулятор {year} | Рассчитать ипотеку онлайн',
                description: '{category} калькулятор {year} - расчет ипотечного кредита, ежемесячных платежей и переплаты',
                h1: '{category} калькулятор'
            },
            'Автокредит': {
                title: '{category} калькулятор {year} | Рассчитать автокредит',
                description: '{category} калькулятор {year} - расчет автокредита, первоначального взноса и ежемесячных платежей',
                h1: '{category} калькулятор'
            },
            'Потребительский': {
                title: '{category} калькулятор {year} | Рассчитать потребительский кредит',
                description: '{category} калькулятор {year} - расчет потребительского кредита с минимальными требованиями',
                h1: '{category} калькулятор'
            },
            'Рефинансирование': {
                title: '{category} калькулятор {year} | Рассчитать рефинансирование',
                description: '{category} калькулятор {year} - расчет рефинансирования кредитов для снижения ставки',
                h1: '{category} калькулятор'
            }
        };
    }

    // Get calculator by ID
    getCalculator(id) {
        return this.calculators[id] || null;
    }

    // Get calculator by slug
    getCalculatorBySlug(slug) {
        return Object.values(this.calculators).find(calc => calc.slug === slug) || null;
    }

    // Get all calculators
    getAllCalculators() {
        return Object.values(this.calculators);
    }

    // Get calculator categories
    getCategories() {
        return Object.values(this.calculators).map(calc => calc.category);
    }

    // Add new calculator
    addCalculator(calculator) {
        if (calculator.id && !this.calculators[calculator.id]) {
            this.calculators[calculator.id] = {
                ...calculator,
                seo: {
                    ...this.globalSeo,
                    ...calculator.seo
                }
            };
            return true;
        }
        return false;
    }

    // Update calculator
    updateCalculator(id, updates) {
        if (this.calculators[id]) {
            this.calculators[id] = { ...this.calculators[id], ...updates };
            return true;
        }
        return false;
    }

    // Remove calculator
    removeCalculator(id) {
        if (this.calculators[id]) {
            delete this.calculators[id];
            return true;
        }
        return false;
    }

    // Get SEO template for category
    getSeoTemplate(category) {
        return this.templates[category] || this.globalSeo;
    }

    // Update global SEO settings
    updateGlobalSeo(seo) {
        this.globalSeo = { ...this.globalSeo, ...seo };
    }

    // Export configuration
    exportConfig() {
        return {
            calculators: this.calculators,
            globalSeo: this.globalSeo,
            templates: this.templates,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
    }

    // Import configuration
    importConfig(config) {
        if (config.calculators) {
            this.calculators = { ...this.calculators, ...config.calculators };
        }
        if (config.globalSeo) {
            this.globalSeo = { ...this.globalSeo, ...config.globalSeo };
        }
        if (config.templates) {
            this.templates = { ...this.templates, ...config.templates };
        }
    }

    // Generate sitemap data
    generateSitemapData() {
        const baseUrl = this.globalSeo.baseUrl;
        const urls = [];

        // Add main page
        urls.push({
            loc: baseUrl,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'daily',
            priority: '1.0'
        });

        // Add calculator pages
        Object.values(this.calculators).forEach(calc => {
            urls.push({
                loc: `${baseUrl}/${calc.slug}`,
                lastmod: new Date().toISOString().split('T')[0],
                changefreq: 'weekly',
                priority: '0.8'
            });
        });

        return urls;
    }

    // Get calculator navigation data
    getNavigationData() {
        return Object.values(this.calculators).map(calc => ({
            id: calc.id,
            name: calc.name,
            slug: calc.slug,
            icon: calc.icon,
            color: calc.color,
            description: calc.description
        }));
    }
}

// Export for use in other files
window.CalculatorConfig = CalculatorConfig;
