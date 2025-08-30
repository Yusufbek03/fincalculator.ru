// Charts Manager for Credit Calculator - Based on fincalculator.ru implementation

// Register Chart.js Colors plugin
if (typeof Chart !== 'undefined') {
    Chart.register(Chart.registry.getPlugin('colors'));
}

class ChartsManager {
    constructor() {
        this.charts = {};
        this.currentData = null;
        this.initializeEventListeners();
        this.chartColors = {
            primary: '#28a745',
            secondary: '#ffc107',
            accent: '#007bff',
            danger: '#dc3545',
            info: '#17a2b8',
            warning: '#fd7e14',
            purple: '#6f42c1',
            pink: '#e83e8c'
        };
        
        // Определяем, является ли устройство мобильным (отключено для единообразия)
        this.isMobile = false;
        
        // Базовые настройки для всех диаграмм
        this.baseChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            aspectRatio: 1.0,
            layout: {
                padding: {
                    top: 6,
                    right: 6,
                    bottom: 6,
                    left: 6
                }
            },
            backgroundColor: 'transparent',
            plugins: {
                title: {
                    display: false
                },
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#28a745',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return label + ': ' + new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
                        }
                    }
                }
            },
                            scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Месяцы',
                            font: {
                                weight: 'bold',
                                size: 14
                            }
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Сумма (₽)',
                            font: {
                                weight: 'bold',
                                size: 14
                            }
                        },
                        ticks: {
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        }
                    }
                },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        };
    }

    initializeEventListeners() {
        console.log('ChartsManager.initializeEventListeners called');
        
        // Show/hide graphs toggle
        const showGraphToggle = document.getElementById('show-graph');
        if (showGraphToggle) {
            showGraphToggle.addEventListener('change', (e) => {
                this.toggleGraphsVisibility(e.target.checked);
            });
        }

        // Graph type checkboxes - simple functionality
        const graphTypeCheckboxes = document.querySelectorAll('#graph-types-section input[type="checkbox"]');
        graphTypeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateVisibleCharts();
            });
        });
        
        // Auto-show graphs if checkbox is checked
        if (showGraphToggle && showGraphToggle.checked) {
            console.log('Show graph toggle is checked, showing graphs');
            this.toggleGraphsVisibility(true);
            if (!this.currentData) {
                console.log('No current data, creating test data');
                this.createTestData();
            } else {
                console.log('Current data available, using real data');
            }
        }
        
        // Обработка изменения размера окна для корректного отображения диаграмм
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Обработка изменения ориентации устройства
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 100);
        });
    }
    
    handleResize() {
        // Перерисовываем все активные диаграммы при изменении размера окна
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.resize();
            }
        });
    }

    toggleGraphsVisibility(show) {
        const graphTypesSection = document.getElementById('graph-types-section');
        const chartsContainer = document.getElementById('charts-container');
        
        if (show) {
            graphTypesSection.classList.add('show');
            chartsContainer.classList.add('show');
            this.updateVisibleCharts();
        } else {
            graphTypesSection.classList.remove('show');
            chartsContainer.classList.remove('show');
        }
    }

    updateVisibleCharts() {
        console.log('updateVisibleCharts called');
        console.log('Current data available:', !!this.currentData);
        
        const chartWrappers = document.querySelectorAll('.chart-wrapper');
        console.log('Found chart wrappers:', chartWrappers.length);
        
        // Map chart IDs to checkbox IDs
        const chartCheckboxMap = {
            'payment-schedule-chart': 'graph-payment-schedule',
            'monthly-payment-term-chart': 'graph-monthly-payment-term',
            'overpayment-term-chart': 'graph-overpayment-term',
            'monthly-payment-amount-chart': 'graph-monthly-payment-amount',
            'overpayment-amount-chart': 'graph-overpayment-amount',
            'monthly-payment-rate-chart': 'graph-monthly-payment-rate',
            'overpayment-rate-chart': 'graph-overpayment-rate'
        };
        
        chartWrappers.forEach(wrapper => {
            const chartId = wrapper.id;
            const checkboxId = chartCheckboxMap[chartId];
            const checkbox = document.getElementById(checkboxId);
            
            console.log(`Chart ${chartId}: checkbox ${checkboxId} checked:`, checkbox ? checkbox.checked : 'checkbox not found');
            
            if (checkbox && checkbox.checked) {
                // Показываем график мгновенно
                wrapper.style.display = 'block';
                wrapper.classList.remove('hide');
                wrapper.classList.add('show');
                console.log(`Rendering chart: ${chartId}`);
                this.renderChart(chartId);
            } else {
                // Скрываем график мгновенно
                wrapper.classList.remove('show');
                wrapper.classList.add('hide');
                wrapper.style.display = 'none';
            }
        });
    }

    renderChart(chartId) {
        console.log('ChartsManager.renderChart called for:', chartId);
        if (!this.currentData) {
            console.warn('No current data available for chart rendering');
            return;
        }

        // Обновляем статус мобильного устройства (отключено для единообразия)
        this.isMobile = false;

        switch (chartId) {
            case 'payment-schedule-chart':
                console.log('Rendering payment schedule chart');
                this.renderPaymentScheduleChart();
                break;
            case 'monthly-payment-term-chart':
                console.log('Rendering monthly payment term chart');
                this.renderMonthlyPaymentTermChart();
                break;
            case 'overpayment-term-chart':
                console.log('Rendering overpayment term chart');
                this.renderOverpaymentTermChart();
                break;
            case 'monthly-payment-amount-chart':
                console.log('Rendering monthly payment amount chart');
                this.renderMonthlyPaymentAmountChart();
                break;
            case 'overpayment-amount-chart':
                console.log('Rendering overpayment amount chart');
                this.renderOverpaymentAmountChart();
                break;
            case 'monthly-payment-rate-chart':
                console.log('Rendering monthly payment rate chart');
                this.renderMonthlyPaymentRateChart();
                break;
            case 'overpayment-rate-chart':
                console.log('Rendering overpayment rate chart');
                this.renderOverpaymentRateChart();
                break;
            default:
                console.warn('Unknown chart type:', chartId);
        }
        
        // Принудительно обновляем размеры диаграммы после рендеринга
        setTimeout(() => {
            const chart = this.charts[chartId.replace('-chart', '')];
            if (chart) {
                chart.resize();
            }
        }, 100);
    }

    updateData(calculationData) {
        console.log('ChartsManager.updateData called with:', calculationData);
        console.log('Data validation:');
        console.log('- loanAmount:', calculationData.loanAmount);
        console.log('- loanTerm:', calculationData.loanTerm);
        console.log('- monthlyRate:', calculationData.monthlyRate);
        console.log('- schedule length:', calculationData.schedule ? calculationData.schedule.length : 'undefined');
        console.log('- monthlyPayment:', calculationData.monthlyPayment);
        
        this.currentData = calculationData;
        this.updateVisibleCharts();
    }

    // Payment Schedule Chart (Bar Chart)
    renderPaymentScheduleChart() {
        console.log('renderPaymentScheduleChart called');
        const canvas = document.getElementById('paymentScheduleChart');
        console.log('Canvas found:', !!canvas);
        console.log('Current data:', this.currentData);
        
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        if (!this.currentData) {
            console.error('No current data available');
            return;
        }
        
        if (!this.currentData.schedule || this.currentData.schedule.length === 0) {
            console.error('No schedule data available');
            return;
        }
        
        console.log('All checks passed, proceeding with chart creation');

        // Destroy existing chart
        if (this.charts.paymentSchedule) {
            this.charts.paymentSchedule.destroy();
        }

        const schedule = this.currentData.schedule;
        console.log('Schedule data sample:', schedule.slice(0, 3));
        
        const labels = schedule.map((payment, index) => {
            const date = new Date(payment.date);
            return `${date.getMonth() + 1}.${date.getFullYear()}`;
        });

        const principalData = schedule.map(payment => payment.principalPayment || payment.principal || 0);
        const interestData = schedule.map(payment => payment.interestPayment || payment.interest || 0);
        
        console.log('Principal data sample:', principalData.slice(0, 5));
        console.log('Interest data sample:', interestData.slice(0, 5));

        this.charts.paymentSchedule = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Погашение основного долга',
                        data: principalData,
                        backgroundColor: 'rgba(40, 167, 69, 0.8)',
                        borderColor: '#28a745',
                        borderWidth: 1,
                        borderRadius: 4,
                        borderSkipped: false
                    },
                    {
                        label: 'Выплата процентов',
                        data: interestData,
                        backgroundColor: 'rgba(255, 193, 7, 0.8)',
                        borderColor: '#ffc107',
                        borderWidth: 1,
                        borderRadius: 4,
                        borderSkipped: false
                    }
                ]
            },
            options: {
                ...this.baseChartOptions,
                scales: {
                    x: {
                        ...this.baseChartOptions.scales.x,
                        title: {
                            ...this.baseChartOptions.scales.x.title,
                            text: 'Месяцы'
                        }
                    },
                    y: {
                        ...this.baseChartOptions.scales.y,
                        title: {
                            ...this.baseChartOptions.scales.y.title,
                            text: 'Сумма (₽)'
                        }
                    }
                },
                plugins: {
                    ...this.baseChartOptions.plugins,
                    tooltip: {
                        ...this.baseChartOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y;
                                return label + ': ' + new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
                            },
                            afterLabel: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                return 'Общая сумма: ' + new Intl.NumberFormat('ru-RU').format(total) + ' ₽';
                            }
                        }
                    }
                }
            }
        });
    }

    // Monthly Payment vs Term Chart (Line Chart)
    renderMonthlyPaymentTermChart() {
        const canvas = document.getElementById('monthlyPaymentTermChart');
        if (!canvas || !this.currentData || !this.currentData.monthlyRate) {
            console.warn('Monthly payment term chart: insufficient data');
            return;
        }

        if (this.charts.monthlyPaymentTerm) {
            this.charts.monthlyPaymentTerm.destroy();
        }

        console.log('Monthly payment term chart data:', {
            monthlyRate: this.currentData.monthlyRate,
            loanAmount: this.currentData.loanAmount
        });

        const terms = Array.from({length: 30}, (_, i) => (i + 1) * 12); // 1-30 years
        const payments = terms.map(term => {
            const monthlyRate = this.currentData.monthlyRate;
            const amount = this.currentData.loanAmount;
            return this.calculateAnnuityPayment(amount, monthlyRate, term);
        });
        
        console.log('Monthly payment term chart payments sample:', payments.slice(0, 5));

        this.charts.monthlyPaymentTerm = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: terms.map(term => `${term} мес.`),
                datasets: [{
                    label: 'Ежемесячный платеж',
                    data: payments,
                    backgroundColor: 'rgba(0, 123, 255, 0.8)',
                    borderColor: '#007bff',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                ...this.baseChartOptions,
                scales: {
                    x: {
                        ...this.baseChartOptions.scales.x,
                        title: {
                            ...this.baseChartOptions.scales.x.title,
                            text: 'Срок кредита (месяцы)'
                        }
                    },
                    y: {
                        ...this.baseChartOptions.scales.y,
                        title: {
                            ...this.baseChartOptions.scales.y.title,
                            text: 'Ежемесячный платеж (₽)'
                        }
                    }
                },
                plugins: {
                    ...this.baseChartOptions.plugins,
                    tooltip: {
                        ...this.baseChartOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return 'Платеж: ' + new Intl.NumberFormat('ru-RU').format(context.parsed.y) + ' ₽';
                            }
                        }
                    }
                }
            }
        });
    }

    // Overpayment vs Term Chart (Line Chart)
    renderOverpaymentTermChart() {
        const canvas = document.getElementById('overpaymentTermChart');
        if (!canvas || !this.currentData || !this.currentData.monthlyRate) {
            console.warn('Overpayment term chart: insufficient data');
            return;
        }

        if (this.charts.overpaymentTerm) {
            this.charts.overpaymentTerm.destroy();
        }

        const terms = Array.from({length: 30}, (_, i) => (i + 1) * 12);
        const overpayments = terms.map(term => {
            const monthlyRate = this.currentData.monthlyRate;
            const amount = this.currentData.loanAmount;
            const payment = this.calculateAnnuityPayment(amount, monthlyRate, term);
            return (payment * term) - amount;
        });

        this.charts.overpaymentTerm = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: terms.map(term => `${term} мес.`),
                datasets: [{
                    label: 'Переплата',
                    data: overpayments,
                    backgroundColor: 'rgba(220, 53, 69, 0.8)',
                    borderColor: '#dc3545',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                ...this.baseChartOptions,
                scales: {
                    x: {
                        ...this.baseChartOptions.scales.x,
                        title: {
                            ...this.baseChartOptions.scales.x.title,
                            text: 'Срок кредита (месяцы)'
                        }
                    },
                    y: {
                        ...this.baseChartOptions.scales.y,
                        title: {
                            ...this.baseChartOptions.scales.y.title,
                            text: 'Переплата (₽)'
                        }
                    }
                },
                plugins: {
                    ...this.baseChartOptions.plugins,
                    tooltip: {
                        ...this.baseChartOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return 'Переплата: ' + new Intl.NumberFormat('ru-RU').format(context.parsed.y) + ' ₽';
                            }
                        }
                    }
                }
            }
        });
    }

    // Monthly Payment vs Amount Chart (Line Chart)
    renderMonthlyPaymentAmountChart() {
        const canvas = document.getElementById('monthlyPaymentAmountChart');
        if (!canvas || !this.currentData || !this.currentData.monthlyRate || !this.currentData.loanTerm) {
            console.warn('Monthly payment amount chart: insufficient data');
            return;
        }

        if (this.charts.monthlyPaymentAmount) {
            this.charts.monthlyPaymentAmount.destroy();
        }

        const amounts = Array.from({length: 20}, (_, i) => (i + 1) * 500000); // 500k to 10M
        const payments = amounts.map(amount => {
            const monthlyRate = this.currentData.monthlyRate;
            const term = this.currentData.loanTerm;
            return this.calculateAnnuityPayment(amount, monthlyRate, term);
        });

        this.charts.monthlyPaymentAmount = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: amounts.map(amount => new Intl.NumberFormat('ru-RU').format(amount) + ' ₽'),
                datasets: [{
                    label: 'Ежемесячный платеж',
                    data: payments,
                    backgroundColor: 'rgba(23, 162, 184, 0.8)',
                    borderColor: '#17a2b8',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                ...this.baseChartOptions,
                scales: {
                    x: {
                        ...this.baseChartOptions.scales.x,
                        title: {
                            ...this.baseChartOptions.scales.x.title,
                            text: 'Сумма кредита (₽)'
                        }
                    },
                    y: {
                        ...this.baseChartOptions.scales.y,
                        title: {
                            ...this.baseChartOptions.scales.y.title,
                            text: 'Ежемесячный платеж (₽)'
                        }
                    }
                },
                plugins: {
                    ...this.baseChartOptions.plugins,
                    tooltip: {
                        ...this.baseChartOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return 'Платеж: ' + new Intl.NumberFormat('ru-RU').format(context.parsed.y) + ' ₽';
                            }
                        }
                    }
                }
            }
        });
    }

    // Overpayment vs Amount Chart (Line Chart)
    renderOverpaymentAmountChart() {
        const canvas = document.getElementById('overpaymentAmountChart');
        if (!canvas || !this.currentData || !this.currentData.monthlyRate || !this.currentData.loanTerm) {
            console.warn('Overpayment amount chart: insufficient data');
            return;
        }

        if (this.charts.overpaymentAmount) {
            this.charts.overpaymentAmount.destroy();
        }

        const amounts = Array.from({length: 20}, (_, i) => (i + 1) * 500000);
        const overpayments = amounts.map(amount => {
            const monthlyRate = this.currentData.monthlyRate;
            const term = this.currentData.loanTerm;
            const payment = this.calculateAnnuityPayment(amount, monthlyRate, term);
            return (payment * term) - amount;
        });

        this.charts.overpaymentAmount = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: amounts.map(amount => new Intl.NumberFormat('ru-RU').format(amount) + ' ₽'),
                datasets: [{
                    label: 'Переплата',
                    data: overpayments,
                    backgroundColor: 'rgba(111, 66, 193, 0.8)',
                    borderColor: '#6f42c1',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                ...this.baseChartOptions,
                scales: {
                    x: {
                        ...this.baseChartOptions.scales.x,
                        title: {
                            ...this.baseChartOptions.scales.x.title,
                            text: 'Сумма кредита (₽)'
                        }
                    },
                    y: {
                        ...this.baseChartOptions.scales.y,
                        title: {
                            ...this.baseChartOptions.scales.y.title,
                            text: 'Переплата (₽)'
                        }
                    }
                },
                plugins: {
                    ...this.baseChartOptions.plugins,
                    tooltip: {
                        ...this.baseChartOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return 'Переплата: ' + new Intl.NumberFormat('ru-RU').format(context.parsed.y) + ' ₽';
                            }
                        }
                    }
                }
            }
        });
    }

    // Monthly Payment vs Rate Chart (Line Chart)
    renderMonthlyPaymentRateChart() {
        const canvas = document.getElementById('monthlyPaymentRateChart');
        if (!canvas || !this.currentData || !this.currentData.loanAmount || !this.currentData.loanTerm) {
            console.warn('Monthly payment rate chart: insufficient data');
            return;
        }

        if (this.charts.monthlyPaymentRate) {
            this.charts.monthlyPaymentRate.destroy();
        }

        const rates = Array.from({length: 20}, (_, i) => 5 + i * 0.5); // 5% to 14.5%
        const payments = rates.map(rate => {
            const monthlyRate = rate / 100 / 12;
            const amount = this.currentData.loanAmount;
            const term = this.currentData.loanTerm;
            return this.calculateAnnuityPayment(amount, monthlyRate, term);
        });

        this.charts.monthlyPaymentRate = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: rates.map(rate => rate.toFixed(1) + '%'),
                datasets: [{
                    label: 'Ежемесячный платеж',
                    data: payments,
                    backgroundColor: 'rgba(253, 126, 20, 0.8)',
                    borderColor: '#fd7e14',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                ...this.baseChartOptions,
                scales: {
                    x: {
                        ...this.baseChartOptions.scales.x,
                        title: {
                            ...this.baseChartOptions.scales.x.title,
                            text: 'Процентная ставка (%)'
                        }
                    },
                    y: {
                        ...this.baseChartOptions.scales.y,
                        title: {
                            ...this.baseChartOptions.scales.y.title,
                            text: 'Ежемесячный платеж (₽)'
                        }
                    }
                },
                plugins: {
                    ...this.baseChartOptions.plugins,
                    tooltip: {
                        ...this.baseChartOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return 'Платеж: ' + new Intl.NumberFormat('ru-RU').format(context.parsed.y) + ' ₽';
                            }
                        }
                    }
                }
            }
        });
    }

    // Overpayment vs Rate Chart (Line Chart)
    renderOverpaymentRateChart() {
        const canvas = document.getElementById('overpaymentRateChart');
        if (!canvas || !this.currentData || !this.currentData.loanAmount || !this.currentData.loanTerm) {
            console.warn('Overpayment rate chart: insufficient data');
            return;
        }

        if (this.charts.overpaymentRate) {
            this.charts.overpaymentRate.destroy();
        }

        const rates = Array.from({length: 20}, (_, i) => 5 + i * 0.5);
        const overpayments = rates.map(rate => {
            const monthlyRate = rate / 100 / 12;
            const amount = this.currentData.loanAmount;
            const term = this.currentData.loanTerm;
            const payment = this.calculateAnnuityPayment(amount, monthlyRate, term);
            return (payment * term) - amount;
        });

        this.charts.overpaymentRate = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: rates.map(rate => rate.toFixed(1) + '%'),
                datasets: [{
                    label: 'Переплата',
                    data: overpayments,
                    backgroundColor: 'rgba(232, 62, 140, 0.8)',
                    borderColor: '#e83e8c',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                ...this.baseChartOptions,
                scales: {
                    x: {
                        ...this.baseChartOptions.scales.x,
                        title: {
                            ...this.baseChartOptions.scales.x.title,
                            text: 'Процентная ставка (%)'
                        }
                    },
                    y: {
                        ...this.baseChartOptions.scales.y,
                        title: {
                            ...this.baseChartOptions.scales.y.title,
                            text: 'Переплата (₽)'
                        }
                    }
                },
                plugins: {
                    ...this.baseChartOptions.plugins,
                    tooltip: {
                        ...this.baseChartOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return 'Переплата: ' + new Intl.NumberFormat('ru-RU').format(context.parsed.y) + ' ₽';
                            }
                        }
                    }
                }
            }
        });
    }

    // Helper function to calculate annuity payment - Based on fincalculator.ru
    calculateAnnuityPayment(principal, monthlyRate, term) {
        if (monthlyRate === 0) return principal / term;
        
        const rate = monthlyRate;
        const n = term;
        
        if (rate === 0) return principal / n;
        
        return principal * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
    }

    // Create test data for charts
    createTestData() {
        const schedule = [];
        const startDate = new Date('2025-08-23');
        const monthlyPayment = 91821.85;
        const principal = 75897;
        const interest = 15924;
        
        for (let i = 0; i < 18; i++) {
            const paymentDate = new Date(startDate);
            paymentDate.setMonth(startDate.getMonth() + i);
            
            schedule.push({
                date: paymentDate,
                amount: monthlyPayment,
                principal: principal + (i * 1000),
                interest: interest - (i * 500),
                remainder: 1500000 - (i * principal)
            });
        }
        
        const testData = {
            loanAmount: 1500000,
            loanTerm: 18,
            monthlyRate: 0.125 / 12,
            schedule: schedule,
            monthlyPayment: monthlyPayment,
            totalPayments: 1652985.68,
            overpayment: 152985.68,
            overpaymentPercentage: 10.20
        };
        
        console.log('Test data created:', testData);
        this.updateData(testData);
    }

    // Destroy all charts
    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Initialize charts manager when DOM and Chart.js are loaded
function initializeChartsManager() {
    if (typeof Chart !== 'undefined') {
        // Register Chart.js Colors plugin
        if (Chart.registry.getPlugin('colors')) {
            Chart.register(Chart.registry.getPlugin('colors'));
        }
        
        window.chartsManager = new ChartsManager();
        console.log('ChartsManager initialized successfully');
    } else {
        console.warn('Chart.js not loaded yet, retrying...');
        setTimeout(initializeChartsManager, 100);
    }
}

// Try to initialize immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChartsManager);
} else {
    // DOM is already loaded
    initializeChartsManager();
}
