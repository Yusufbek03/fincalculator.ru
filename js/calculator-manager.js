// Calculator Manager for Scalable Architecture
class CalculatorManager {
    constructor() {
        this.config = new CalculatorConfig();
        this.currentCalculator = null;
        this.seoManager = new SEOManager(this.config);
        this.initializeManager();
    }

    initializeManager() {
        // Detect current calculator from URL or default to credit
        this.detectCurrentCalculator();
        
        // Initialize SEO for current calculator
        this.seoManager.initializeSEO(this.currentCalculator);
        
        // Setup navigation
        this.setupNavigation();
        
        // Setup calculator switching
        this.setupCalculatorSwitching();
    }

    detectCurrentCalculator() {
        const path = window.location.pathname;
        const slug = path.split('/').pop().replace('.html', '');
        
        if (slug && slug !== 'index.html' && slug !== '') {
            this.currentCalculator = this.config.getCalculatorBySlug(slug);
        }
        
        // Default to credit calculator if none detected
        if (!this.currentCalculator) {
            this.currentCalculator = this.config.getCalculator('credit');
        }
    }

    setupNavigation() {
        const navContainer = document.querySelector('.nav');
        if (!navContainer) return;

        // Remove existing dropdown if it exists
        const existingDropdown = navContainer.querySelector('.calculator-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }

        // Create calculator dropdown
        const calculatorDropdown = document.createElement('div');
        calculatorDropdown.className = 'calculator-dropdown';
        calculatorDropdown.innerHTML = `
            <div class="dropdown-toggle">
                <span class="current-calculator">
                    ${this.currentCalculator.name}
                </span>
                <svg class="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
            </div>
        `;

        // Insert before install button
        const installButton = navContainer.querySelector('.install');
        if (installButton) {
            navContainer.insertBefore(calculatorDropdown, installButton);
        } else {
            navContainer.appendChild(calculatorDropdown);
        }

        // Add dropdown functionality
        this.setupDropdownFunctionality(calculatorDropdown);
    }

    setupDropdownFunctionality(dropdown) {
        // Disable dropdown functionality - just show current calculator
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Remove dropdown menu completely
        if (menu) {
            menu.remove();
        }
        
        // Remove click event listener
        toggle.style.cursor = 'default';
        toggle.removeEventListener('click', () => {});
    }

    setupCalculatorSwitching() {
        // Handle calculator switching via URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const calculatorId = urlParams.get('calculator');
        
        if (calculatorId) {
            const calculator = this.config.getCalculator(calculatorId);
            if (calculator) {
                this.switchCalculator(calculator);
            }
        }
    }

    switchCalculator(calculator) {
        this.currentCalculator = calculator;
        
        // Update page title and meta tags
        this.seoManager.updateMetaTags(calculator);
        
        // Update calculator form with new defaults
        this.updateCalculatorForm(calculator);
        
        // Update navigation
        this.updateNavigation(calculator);
        
        // Update URL without page reload
        this.updateURL(calculator);
    }

    updateCalculatorForm(calculator) {
        // Update form defaults based on calculator configuration
        const amountInput = document.getElementById('loan-amount');
        const rateInput = document.getElementById('interest-rate');
        
        if (amountInput && calculator.variables.defaultAmount) {
            amountInput.value = calculator.variables.defaultAmount.toLocaleString('ru-RU');
        }
        
        if (rateInput && calculator.variables.defaultRate) {
            rateInput.value = calculator.variables.defaultRate.toFixed(2).replace('.', ',');
        }

        // Update form validation
        this.updateFormValidation(calculator);
    }

    updateFormValidation(calculator) {
        const amountInput = document.getElementById('loan-amount');
        const rateInput = document.getElementById('interest-rate');
        
        if (amountInput && calculator.variables) {
            amountInput.min = calculator.variables.minAmount;
            amountInput.max = calculator.variables.maxAmount;
        }
        
        if (rateInput && calculator.variables) {
            rateInput.min = calculator.variables.minRate;
            rateInput.max = calculator.variables.maxRate;
        }
    }

    updateNavigation(calculator) {
        const currentCalculatorSpan = document.querySelector('.current-calculator');
        if (currentCalculatorSpan) {
            currentCalculatorSpan.innerHTML = `${calculator.icon} ${calculator.name}`;
        }

        // Update active state in dropdown
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `/${calculator.slug}`) {
                item.classList.add('active');
            }
        });
    }

    updateURL(calculator) {
        const newURL = `${window.location.origin}/${calculator.slug}`;
        window.history.pushState({ calculator: calculator.id }, '', newURL);
    }

    // Add new calculator dynamically
    addCalculator(calculatorData) {
        const success = this.config.addCalculator(calculatorData);
        if (success) {
            // Update navigation
            this.setupNavigation();
            
            // Update admin panel
            if (window.adminPanel) {
                window.adminPanel.updateCalculatorList();
            }
            
            return true;
        }
        return false;
    }

    // Update existing calculator
    updateCalculator(id, updates) {
        const success = this.config.updateCalculator(id, updates);
        if (success && id === this.currentCalculator.id) {
            // Update current calculator
            this.currentCalculator = this.config.getCalculator(id);
            this.seoManager.updateMetaTags(this.currentCalculator);
            this.updateCalculatorForm(this.currentCalculator);
        }
        return success;
    }

    // Remove calculator
    removeCalculator(id) {
        const success = this.config.removeCalculator(id);
        if (success) {
            // If removed calculator was current, switch to default
            if (id === this.currentCalculator.id) {
                this.switchCalculator(this.config.getCalculator('credit'));
            }
            
            // Update navigation
            this.setupNavigation();
            
            // Update admin panel
            if (window.adminPanel) {
                window.adminPanel.updateCalculatorList();
            }
        }
        return success;
    }

    // Get current calculator
    getCurrentCalculator() {
        return this.currentCalculator;
    }

    // Get all calculators
    getAllCalculators() {
        return this.config.getAllCalculators();
    }

    // Export configuration
    exportConfiguration() {
        return this.config.exportConfig();
    }

    // Import configuration
    importConfiguration(config) {
        this.config.importConfig(config);
        this.setupNavigation();
        if (window.adminPanel) {
            window.adminPanel.updateCalculatorList();
        }
    }
}

// SEO Manager for handling meta tags across calculators
class SEOManager {
    constructor(config) {
        this.config = config;
        this.globalFormulas = null;
        this.loadGlobalFormulas();
    }

    loadGlobalFormulas() {
        const savedFormulas = localStorage.getItem('seo-formulas');
        this.globalFormulas = savedFormulas ? JSON.parse(savedFormulas) : {
            title: this.config.globalSeo.defaultTitle,
            description: this.config.globalSeo.defaultDescription,
            h1: this.config.globalSeo.defaultH1
        };
    }

    initializeSEO(calculator) {
        this.updateMetaTags(calculator);
        this.updateStructuredData(calculator);
    }

    updateMetaTags(calculator) {
        if (!calculator) return;

        // Process formulas with calculator data
        const title = this.processFormula(this.globalFormulas.title, calculator);
        const description = this.processFormula(this.globalFormulas.description, calculator);
        const h1 = this.processFormula(this.globalFormulas.h1, calculator);

        // Update DOM elements
        document.title = title;
        
        const titleMeta = document.getElementById('dynamic-title');
        const descriptionMeta = document.getElementById('dynamic-description');
        const h1Element = document.getElementById('dynamic-h1');

        if (titleMeta) titleMeta.content = title;
        if (descriptionMeta) descriptionMeta.content = description;
        if (h1Element) h1Element.textContent = h1;

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');

        if (ogTitle) ogTitle.content = title;
        if (ogDescription) ogDescription.content = description;
        if (ogUrl) ogUrl.content = `${this.config.globalSeo.baseUrl}/${calculator.slug}`;

        // Update keywords
        const keywordsMeta = document.querySelector('meta[name="keywords"]');
        if (keywordsMeta && calculator.seo.keywords) {
            keywordsMeta.content = calculator.seo.keywords;
        }
    }

    updateStructuredData(calculator) {
        const structuredDataScript = document.querySelector('script[type="application/ld+json"]');
        if (structuredDataScript && calculator) {
            const data = JSON.parse(structuredDataScript.textContent);
            data.name = `${calculator.name} Калькулятор`;
            data.description = calculator.description;
            data.url = `${this.config.globalSeo.baseUrl}/${calculator.slug}`;
            structuredDataScript.textContent = JSON.stringify(data, null, 2);
        }
    }

    processFormula(formula, calculator) {
        let processed = formula;

        // Get current date for additional variables
        const now = new Date();
        const dateData = {
            year: now.getFullYear().toString(),
            month: (now.getMonth() + 1).toString().padStart(2, '0'),
            day: now.getDate().toString().padStart(2, '0'),
            date: now.toLocaleDateString('ru-RU'),
            monthName: now.toLocaleDateString('ru-RU', { month: 'long' }),
            monthNameShort: now.toLocaleDateString('ru-RU', { month: 'short' })
        };

        // Combine all variables
        const allVariables = {
            category: calculator.category,
            name: calculator.name,
            description: calculator.description,
            ...dateData
        };

        // Replace variables
        Object.keys(allVariables).forEach(key => {
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            processed = processed.replace(regex, allVariables[key]);
        });

        return processed;
    }

    // Update global formulas
    updateGlobalFormulas(formulas) {
        this.globalFormulas = { ...this.globalFormulas, ...formulas };
        localStorage.setItem('seo-formulas', JSON.stringify(this.globalFormulas));
        
        // Update current calculator's meta tags
        if (window.calculatorManager && window.calculatorManager.getCurrentCalculator()) {
            this.updateMetaTags(window.calculatorManager.getCurrentCalculator());
        }
    }

    // Get current formulas
    getCurrentFormulas() {
        return this.globalFormulas;
    }
}

// Export for use in other files
window.CalculatorManager = CalculatorManager;
window.SEOManager = SEOManager;
