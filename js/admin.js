// Admin Panel for Dynamic Meta Tag Generation
class AdminPanel {
    constructor() {
        this.panel = document.getElementById('admin-panel');
        this.overlay = document.getElementById('admin-overlay');
        this.isOpen = false;

        // Use CalculatorManager if available
        this.calculatorManager = window.calculatorManager;
        this.config = this.calculatorManager ? this.calculatorManager.config : new CalculatorConfig();
        
        // Default formulas with more examples
        this.defaultFormulas = {
            title: '{category} калькулятор {year} | Рассчитать ежемесячный платёж',
            description: '{category} калькулятор {year} - быстрый расчет ежемесячного платежа, переплаты и графика погашения кредита онлайн',
            h1: '{category} калькулятор'
        };

        // Get templates from config
        this.formulaTemplates = this.config.templates;

        // Current calculator data
        this.calculatorData = {
            category: this.calculatorManager ? this.calculatorManager.getCurrentCalculator().category : 'Кредитный',
            year: new Date().getFullYear().toString()
        };

        this.initializeEventListeners();
        this.loadFormulas();
        this.updateMetaTags();
        this.createEnhancedUI();
        
        // Show preview on first load
        setTimeout(() => {
            this.previewChanges();
        }, 100);
    }

    createEnhancedUI() {
        // Add template selector
        const templateSection = document.createElement('div');
        templateSection.innerHTML = `
            <div style="margin-bottom: 20px; padding: 16px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 12px;">Быстрые шаблоны:</h4>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    ${Object.keys(this.formulaTemplates).map(category => 
                        `<button class="template-btn" data-category="${category}" style="padding: 6px 12px; border: 1px solid #dee2e6; border-radius: 4px; background: white; font-size: 12px; cursor: pointer;">${category}</button>`
                    ).join('')}
                </div>
            </div>
            
            <div style="margin-bottom: 20px; padding: 16px; background: #e8f5e8; border-radius: 6px; border: 1px solid #28a745;">
                <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #28a745;">Переменные для формул:</h4>
                <div style="font-size: 12px; color: #155724;">
                    <div style="margin-bottom: 4px;"><code>{category}</code> - тип калькулятора (Кредитный, Ипотечный, Автокредит, Потребительский)</div>
                    <div style="margin-bottom: 4px;"><code>{year}</code> - текущий год</div>
                    <div style="margin-bottom: 4px;"><code>{month}</code> - текущий месяц</div>
                    <div style="margin-bottom: 4px;"><code>{day}</code> - текущий день</div>
                    <div style="margin-bottom: 4px;"><code>{date}</code> - полная дата</div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px; padding: 16px; background: #fff3cd; border-radius: 6px; border: 1px solid #ffc107;">
                <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #856404;">Полезные советы:</h4>
                <ul style="font-size: 12px; color: #856404; margin: 0; padding-left: 16px;">
                    <li>Используйте ключевые слова в начале title и description</li>
                    <li>Длина title должна быть 50-60 символов</li>
                    <li>Длина description должна быть 150-160 символов</li>
                    <li>H1 должен быть кратким и содержать основное ключевое слово</li>
                </ul>
            </div>
        `;

        // Insert template section after the header
        const header = this.panel.querySelector('h2').parentNode;
        header.parentNode.insertBefore(templateSection, header.nextSibling);

        // Add template button event listeners
        this.panel.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                this.applyTemplate(category);
            });
        });

        // Add character counter
        this.addCharacterCounters();
    }

    addCharacterCounters() {
        const inputs = ['title-formula', 'description-formula', 'h1-formula'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = 'font-size: 11px; color: #6c757d; margin-top: 4px; text-align: right;';
            
            input.parentNode.appendChild(counter);
            
            const updateCounter = () => {
                const length = input.value.length;
                const maxLength = id === 'title-formula' ? 60 : id === 'description-formula' ? 160 : 50;
                const color = length > maxLength ? '#dc3545' : length > maxLength * 0.8 ? '#ffc107' : '#6c757d';
                counter.style.color = color;
                counter.textContent = `${length}/${maxLength}`;
            };
            
            input.addEventListener('input', updateCounter);
            updateCounter();
        });
    }

    applyTemplate(category) {
        const template = this.formulaTemplates[category];
        if (template) {
            document.getElementById('title-formula').value = template.title;
            document.getElementById('description-formula').value = template.description;
            document.getElementById('h1-formula').value = template.h1;
            
            // Update calculator data
            this.calculatorData.category = category;
            
            // Trigger preview update
            this.previewChanges();
            
            this.showNotification(`Применен шаблон для ${category}`, 'success');
        }
    }

    initializeEventListeners() {
        // Admin toggle button
        document.getElementById('admin-toggle').addEventListener('click', () => {
            this.togglePanel();
        });

        // Close admin panel
        document.getElementById('close-admin').addEventListener('click', () => {
            this.closePanel();
        });

        // Close on overlay click
        this.overlay.addEventListener('click', () => {
            this.closePanel();
        });

        // Save formulas
        document.getElementById('save-formulas').addEventListener('click', () => {
            this.saveFormulas();
        });

        // Auto-update year and date variables
        setInterval(() => {
            const currentYear = new Date().getFullYear().toString();
            if (this.calculatorData.year !== currentYear) {
                this.calculatorData.year = currentYear;
                this.updateMetaTags();
                if (this.isOpen) {
                    this.previewChanges();
                }
            }
        }, 60000); // Check every minute

        // Real-time preview
        const formulaInputs = ['title-formula', 'description-formula', 'h1-formula'];
        formulaInputs.forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.debounce(() => this.previewChanges(), 300)();
            });
        });

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.isOpen) {
                // Ctrl+S to save
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    this.saveFormulas();
                }
                
                // Ctrl+Z to reset to defaults
                if (e.ctrlKey && e.key === 'z') {
                    e.preventDefault();
                    this.resetToDefaults();
                }
                
                // Ctrl+Shift+T to apply template
                if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                    e.preventDefault();
                    this.showTemplateSelector();
                }
            }
        });

        // Reset formulas button
        const resetButton = document.getElementById('reset-formulas');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetToDefaults();
            });
        }

        // Export settings button
        const exportButton = document.getElementById('export-settings');
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                this.exportSettings();
            });
        }

        // Import settings button
        const importButton = document.getElementById('import-settings');
        const importFile = document.getElementById('import-file');
        if (importButton && importFile) {
            importButton.addEventListener('click', () => {
                importFile.click();
            });
            
            importFile.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.importSettings(e.target.files[0]);
                }
            });
        }

        // Generate sitemap button
        const sitemapButton = document.getElementById('generate-sitemap');
        if (sitemapButton) {
            sitemapButton.addEventListener('click', () => {
                this.generateSitemap();
            });
        }

        // Test formulas button


        // Add formula validation
        formulaInputs.forEach(id => {
            document.getElementById(id).addEventListener('blur', () => {
                this.validateFormula(id);
            });
        });
    }

    togglePanel() {
        if (this.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }

    openPanel() {
        this.panel.classList.add('open');
        this.overlay.classList.add('show');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    closePanel() {
        this.panel.classList.remove('open');
        this.overlay.classList.remove('show');
        this.isOpen = false;
        document.body.style.overflow = '';
    }

    loadFormulas() {
        // Load formulas from localStorage or use defaults
        const savedFormulas = localStorage.getItem('seo-formulas');
        const formulas = savedFormulas ? JSON.parse(savedFormulas) : this.defaultFormulas;

        document.getElementById('title-formula').value = formulas.title;
        document.getElementById('description-formula').value = formulas.description;
        document.getElementById('h1-formula').value = formulas.h1;
    }

    saveFormulas() {
        const formulas = {
            title: document.getElementById('title-formula').value,
            description: document.getElementById('description-formula').value,
            h1: document.getElementById('h1-formula').value
        };

        // Save to localStorage
        localStorage.setItem('seo-formulas', JSON.stringify(formulas));

        // Update meta tags using new system
        if (this.calculatorManager && this.calculatorManager.seoManager) {
            this.calculatorManager.seoManager.updateGlobalFormulas(formulas);
        } else {
            this.updateMetaTags();
        }

        // Show success message
        this.showNotification('Формулы сохранены и применены ко всем калькуляторам!', 'success');

        // Close panel
        setTimeout(() => {
            this.closePanel();
        }, 1000);
    }

    updateMetaTags() {
        const savedFormulas = localStorage.getItem('seo-formulas');
        const formulas = savedFormulas ? JSON.parse(savedFormulas) : this.defaultFormulas;

        // Process formulas with variables
        const processedTitle = this.processFormula(formulas.title);
        const processedDescription = this.processFormula(formulas.description);
        const processedH1 = this.processFormula(formulas.h1);

        // Update DOM elements
        document.title = processedTitle;
        document.getElementById('dynamic-title').content = processedTitle;
        document.getElementById('dynamic-description').content = processedDescription;
        document.getElementById('dynamic-h1').textContent = processedH1;

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');

        if (ogTitle) ogTitle.content = processedTitle;
        if (ogDescription) ogDescription.content = processedDescription;

        // Update structured data
        this.updateStructuredData(processedTitle, processedDescription);
    }

    processFormula(formula, calculator = null) {
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
            ...this.calculatorData,
            ...dateData,
            ...(calculator && {
                category: calculator.category,
                name: calculator.name,
                description: calculator.description
            })
        };

        // Replace variables
        Object.keys(allVariables).forEach(key => {
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            processed = processed.replace(regex, allVariables[key]);
        });

        return processed;
    }

    updateStructuredData(title, description) {
        const structuredDataScript = document.querySelector('script[type="application/ld+json"]');
        if (structuredDataScript) {
            const data = JSON.parse(structuredDataScript.textContent);
            data.name = title;
            data.description = description;
            structuredDataScript.textContent = JSON.stringify(data, null, 2);
        }
    }

    previewChanges() {
        if (!this.isOpen) return;

        const formulas = {
            title: document.getElementById('title-formula').value,
            description: document.getElementById('description-formula').value,
            h1: document.getElementById('h1-formula').value
        };

        // Get preview container
        const previewContainer = document.getElementById('formula-preview');
        if (!previewContainer) return;

        // Update preview
        const previewTitle = this.processFormula(formulas.title);
        const previewDescription = this.processFormula(formulas.description);
        const previewH1 = this.processFormula(formulas.h1);

        // Update preview elements
        const titleSpan = document.getElementById('preview-title');
        const descriptionSpan = document.getElementById('preview-description');
        const h1Span = document.getElementById('preview-h1');

        if (titleSpan) titleSpan.textContent = previewTitle;
        if (descriptionSpan) descriptionSpan.textContent = previewDescription;
        if (h1Span) h1Span.textContent = previewH1;

        // Show preview container
        previewContainer.style.display = 'block';

        // Add character count indicators
        this.updateCharacterCounts(previewTitle, previewDescription, previewH1);
    }

    updateCharacterCounts(title, description, h1) {
        const titleSpan = document.getElementById('preview-title');
        const descriptionSpan = document.getElementById('preview-description');
        const h1Span = document.getElementById('preview-h1');

        // Add character count to title
        if (titleSpan) {
            const titleLength = title.length;
            const titleColor = titleLength > 60 ? '#dc3545' : titleLength > 50 ? '#ffc107' : '#28a745';
            titleSpan.style.color = titleColor;
            titleSpan.textContent = `${title} (${titleLength}/60)`;
        }

        // Add character count to description
        if (descriptionSpan) {
            const descLength = description.length;
            const descColor = descLength > 160 ? '#dc3545' : descLength > 140 ? '#ffc107' : '#28a745';
            descriptionSpan.style.color = descColor;
            descriptionSpan.textContent = `${description} (${descLength}/160)`;
        }

        // Add character count to H1
        if (h1Span) {
            const h1Length = h1.length;
            const h1Color = h1Length > 50 ? '#dc3545' : h1Length > 40 ? '#ffc107' : '#28a745';
            h1Span.style.color = h1Color;
            h1Span.textContent = `${h1} (${h1Length}/50)`;
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.admin-notification');
        existingNotifications.forEach(n => n.remove());

        // Create notification
        const notification = document.createElement('div');
        notification.className = `admin-notification fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white z-50 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Method to add new calculator types (for future scalability)
    addCalculatorType(category, customVariables = {}) {
        this.calculatorData = {
            ...this.calculatorData,
            category,
            ...customVariables
        };
        this.updateMetaTags();
    }

    // Export current settings
    exportSettings() {
        const settings = {
            formulas: JSON.parse(localStorage.getItem('seo-formulas') || '{}'),
            calculatorData: this.calculatorData,
            templates: this.formulaTemplates,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `fincalculator-settings-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Настройки экспортированы!', 'success');
    }

    // Import settings
    importSettings(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const settings = JSON.parse(e.target.result);

                if (settings.formulas) {
                    localStorage.setItem('seo-formulas', JSON.stringify(settings.formulas));
                    this.loadFormulas();
                }

                if (settings.calculatorData) {
                    this.calculatorData = {...this.calculatorData, ...settings.calculatorData };
                }

                if (settings.templates) {
                    this.formulaTemplates = {...this.formulaTemplates, ...settings.templates };
                }

                this.updateMetaTags();
                this.previewChanges();
                this.showNotification('Настройки успешно импортированы!', 'success');
            } catch (error) {
                console.error('Import error:', error);
                this.showNotification('Ошибка при импорте настроек: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    // Generate sitemap (enhanced implementation)
    generateSitemap() {
        const baseUrl = this.config.globalSeo.baseUrl || window.location.origin;
        const sitemapData = this.config.generateSitemapData();

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        sitemapData.forEach(url => {
            sitemap += `
    <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`;
        });

        sitemap += `
</urlset>`;

        const blob = new Blob([sitemap], { type: 'application/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `sitemap-${new Date().toISOString().split('T')[0]}.xml`;
        link.click();
        
        this.showNotification('Sitemap сгенерирован и скачан!', 'success');
    }





    validateFormula(inputId) {
        const input = document.getElementById(inputId);
        const value = input.value;
        let isValid = true;
        let message = '';

        switch (inputId) {
            case 'title-formula':
                if (value.length > 60) {
                    isValid = false;
                    message = 'Title слишком длинный (макс. 60 символов)';
                }
                if (!value.includes('{category}')) {
                    message = 'Рекомендуется добавить {category} в title';
                }
                break;
            case 'description-formula':
                if (value.length > 160) {
                    isValid = false;
                    message = 'Description слишком длинный (макс. 160 символов)';
                }
                if (!value.includes('{category}')) {
                    message = 'Рекомендуется добавить {category} в description';
                }
                break;
            case 'h1-formula':
                if (value.length > 50) {
                    isValid = false;
                    message = 'H1 слишком длинный (макс. 50 символов)';
                }
                break;
        }

        // Show validation message
        this.showValidationMessage(input, message, isValid);
    }

    showValidationMessage(input, message, isValid) {
        // Remove existing validation message
        const existingMessage = input.parentNode.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (message) {
            const messageElement = document.createElement('div');
            messageElement.className = `validation-message ${isValid ? 'warning' : 'error'}`;
            messageElement.style.cssText = `
                font-size: 11px; 
                margin-top: 4px; 
                color: ${isValid ? '#856404' : '#dc3545'};
            `;
            messageElement.textContent = message;
            input.parentNode.appendChild(messageElement);
        }
    }

    resetToDefaults() {
        if (confirm('Сбросить формулы к значениям по умолчанию?')) {
            document.getElementById('title-formula').value = this.defaultFormulas.title;
            document.getElementById('description-formula').value = this.defaultFormulas.description;
            document.getElementById('h1-formula').value = this.defaultFormulas.h1;
            
            // Clear localStorage
            localStorage.removeItem('seo-formulas');
            
            // Update preview
            this.previewChanges();
            
            // Update meta tags
            this.updateMetaTags();
            
            this.showNotification('Формулы сброшены к значениям по умолчанию', 'info');
        }
    }

    showTemplateSelector() {
        const templateNames = Object.keys(this.formulaTemplates);
        const template = prompt(`Выберите шаблон (${templateNames.join(', ')}):`);
        
        if (template && this.formulaTemplates[template]) {
            this.applyTemplate(template);
        }
    }
}

// Performance monitoring is handled by performance-optimizer.js

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();

    // Add keyboard shortcut for admin panel (Ctrl+Shift+A)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            document.getElementById('admin-toggle').style.display = 'block';
            window.adminPanel.togglePanel();
        }
    });
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/js/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}