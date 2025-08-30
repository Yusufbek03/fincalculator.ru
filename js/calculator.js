// Credit Calculator Functionality
class CreditCalculator {
    constructor() {
        this.form = document.getElementById('credit-form');
        this.resultsSection = document.getElementById('results-section');
        this.initializeEventListeners();
        this.setDefaultDate();
        this.updateMetaTagsOnLoad();
        
        // Проверяем загрузку библиотеки XLSX
        this.checkXLSXLibrary();
    }

    initializeEventListeners() {
        // Check if required elements exist
        if (!this.form) {
            console.error('Credit form not found');
            return;
        }

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculate();
        });

        // Real-time calculation on input change
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (this.resultsSection && this.resultsSection.classList.contains('hidden')) return;
                this.debounce(() => this.calculate(), 500)();
            });
        });

        // Inflation checkbox toggle
        const inflationCheckbox = document.getElementById('consider-inflation');
        if (inflationCheckbox) {
            inflationCheckbox.addEventListener('change', (e) => {
                console.log('Inflation checkbox changed:', e.target.checked);
                this.toggleInflationColumns(e.target.checked);
                this.toggleInflationActive(e.target.checked);
                if (this.resultsSection && !this.resultsSection.classList.contains('hidden')) {
                    console.log('Calling calculate() from inflation toggle');
                    this.calculate();
                } else {
                    console.log('Results section is hidden, not calling calculate()');
                }
            });
        } else {
            console.warn('Inflation checkbox not found');
        }

        // Advanced settings toggle
        const advancedSettingsCheckbox = document.getElementById('advanced-settings');
        if (advancedSettingsCheckbox) {
            advancedSettingsCheckbox.addEventListener('change', (e) => {
                this.toggleAdvancedOptions(e.target.checked);
            });
        }

        // Auto-calculate on advanced settings changes
        const commissionTypeSelect = document.getElementById('commission-type');
        if (commissionTypeSelect) {
            commissionTypeSelect.addEventListener('change', () => {
                this.autoCalculate();
            });
        }

        const commissionAmountInput = document.getElementById('commission-amount');
        if (commissionAmountInput) {
            commissionAmountInput.addEventListener('input', (e) => {
                this.formatNumberInput(e.target);
                this.autoCalculate();
            });
        }

        const prepaymentDateInput = document.getElementById('prepayment-date');
        if (prepaymentDateInput) {
            prepaymentDateInput.addEventListener('change', () => {
                this.autoCalculate();
            });
        }

        const prepaymentAmountInput = document.getElementById('prepayment-amount');
        if (prepaymentAmountInput) {
            prepaymentAmountInput.addEventListener('input', (e) => {
                this.formatNumberInput(e.target);
                this.autoCalculate();
            });
        }






        // Budget optimization toggle
        const budgetOptimizationCheckbox = document.getElementById('budget-optimization');
        if (budgetOptimizationCheckbox) {
            budgetOptimizationCheckbox.addEventListener('change', (e) => {
                this.toggleBudgetOptions(e.target.checked);
            });
        }



        // Auto-calculate on budget settings changes
        const maxMonthlyPaymentInput = document.getElementById('max-monthly-payment');
        if (maxMonthlyPaymentInput) {
            maxMonthlyPaymentInput.addEventListener('input', (e) => {
                this.formatNumberInput(e.target);
                this.autoCalculate();
                this.updateBudgetValidation(e.target);
            });
            
            // Добавляем подсказку при фокусе
            maxMonthlyPaymentInput.addEventListener('focus', () => {
                this.showInputHint(maxMonthlyPaymentInput, 'Введите максимальную сумму, которую вы можете платить ежемесячно');
            });
        }

        const optimizationPrioritySelect = document.getElementById('optimization-priority');
        if (optimizationPrioritySelect) {
            optimizationPrioritySelect.addEventListener('change', () => {
                this.autoCalculate();
            });
            
            // Добавляем подсказку при изменении
            optimizationPrioritySelect.addEventListener('focus', () => {
                this.showPriorityHint();
            });
        }

        // Auto-calculate on form field changes
        const loanTermInput = document.getElementById('loan-term');
        if (loanTermInput) {
            loanTermInput.addEventListener('input', (e) => {
                this.formatNumberInput(e.target);
                this.autoCalculate();
            });
        }

        const termTypeSelect = document.getElementById('term-type');
        if (termTypeSelect) {
            termTypeSelect.addEventListener('change', () => {
                this.autoCalculate();
            });
        }

        const ratePeriodSelect = document.getElementById('rate-period');
        if (ratePeriodSelect) {
            ratePeriodSelect.addEventListener('change', () => {
                this.autoCalculate();
            });
        }

        const rateTypeSelect = document.getElementById('rate-type');
        if (rateTypeSelect) {
            rateTypeSelect.addEventListener('change', () => {
                this.autoCalculate();
            });
        }

        const paymentTypeSelect = document.getElementById('payment-type');
        if (paymentTypeSelect) {
            paymentTypeSelect.addEventListener('change', () => {
                this.autoCalculate();
            });
        }

        const loanDateInput = document.getElementById('loan-date');
        if (loanDateInput) {
            loanDateInput.addEventListener('change', () => {
                this.autoCalculate();
            });
        }

        // Format number inputs
        const loanAmountInput = document.getElementById('loan-amount');
        if (loanAmountInput) {
            loanAmountInput.addEventListener('input', (e) => {
                this.formatNumberInput(e.target);
                this.autoCalculate();
            });
        }

        const interestRateInput = document.getElementById('interest-rate');
        if (interestRateInput) {
            interestRateInput.addEventListener('input', (e) => {
                this.formatRateInput(e.target);
                this.autoCalculate();
            });
        }

        // Additional features
        const addCommissionBtn = document.getElementById('add-commission');
        if (addCommissionBtn) {
            addCommissionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCommissionModal();
            });
        }

        const addPrepaymentBtn = document.getElementById('add-prepayment');
        if (addPrepaymentBtn) {
            addPrepaymentBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPrepaymentModal();
            });
        }

        // Export functionality
        const exportPdfBtn = document.getElementById('export-pdf');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportToPDF();
            });
        }

        const exportExcelBtn = document.getElementById('export-excel');
        if (exportExcelBtn) {
            exportExcelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportToExcel();
            });
        }

        const shareLinkBtn = document.getElementById('share-link');
        if (shareLinkBtn) {
            shareLinkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.shareCalculation();
            });
        }

        // PWA install functionality
        this.setupPWAInstall();
        
        // Credit holidays checkbox functionality
        const creditHolidaysCheckbox = document.getElementById('credit-holidays-checkbox');
        const creditHolidaysNumber = document.getElementById('credit-holidays-number');
        const creditHolidaysSelect = document.getElementById('credit-holidays-select');
        
        if (creditHolidaysCheckbox && creditHolidaysNumber && creditHolidaysSelect) {
            creditHolidaysCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    creditHolidaysNumber.style.display = 'inline-block';
                    creditHolidaysSelect.style.display = 'inline-block';
                } else {
                    creditHolidaysNumber.style.display = 'none';
                    creditHolidaysSelect.style.display = 'none';
                }
                // Автоматически пересчитываем при изменении чекбокса
                this.autoCalculate();
            });
            
            // Добавляем обработчики для полей кредитных каникул
            creditHolidaysNumber.addEventListener('input', () => {
                this.autoCalculate();
            });
            
            creditHolidaysSelect.addEventListener('change', () => {
                this.autoCalculate();
            });
        }
        

    }

    setDefaultDate() {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        document.getElementById('loan-date').value = nextMonth.toISOString().split('T')[0];
        
        // Set initial active state for inflation toggle
        const inflationCheckbox = document.getElementById('consider-inflation');
        if (inflationCheckbox && inflationCheckbox.checked) {
            this.toggleInflationActive(true);
        }
    }

    updateMetaTagsOnLoad() {
        // Update meta tags when calculator loads
        if (window.adminPanel) {
            setTimeout(() => {
                window.adminPanel.updateMetaTags();
            }, 100);
        }
    }

    formatNumberInput(input) {
        let value = input.value.replace(/[^\d]/g, '');
        if (value) {
            value = parseInt(value).toLocaleString('ru-RU');
        }
        input.value = value;
    }

    formatRateInput(input) {
        let value = input.value.replace(/[^\d.,]/g, '').replace(',', '.');
        if (value.split('.').length > 2) {
            value = value.substring(0, value.lastIndexOf('.'));
        }
        input.value = value;
    }

    parseNumber(str) {
        return parseFloat(str.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    }

    autoCalculate() {
        // Проверяем, что результаты уже отображаются
        const resultsSection = document.getElementById('results-section');
        if (!resultsSection || resultsSection.classList.contains('hidden')) {
            return; // Не пересчитываем, если результаты не отображаются
        }

        // Очищаем предыдущий таймер
        if (this.autoCalculateTimer) {
            clearTimeout(this.autoCalculateTimer);
        }

        // Устанавливаем новый таймер с задержкой 500мс
        this.autoCalculateTimer = setTimeout(() => {
            console.log('Auto-calculating due to form field change...');
            console.log('Credit holidays state:', {
                checkbox: document.getElementById('credit-holidays-checkbox')?.checked,
                amount: document.getElementById('credit-holidays-number')?.value,
                unit: document.getElementById('credit-holidays-select')?.value
            });
            this.calculate();
        }, 500);
    }

    calculate() {
        console.log('Calculate function called');
        
        const calculateBtn = document.getElementById('calculate-btn');
        if (!calculateBtn) {
            console.error('Calculate button not found');
            return;
        }

        console.log('Calculate button found, starting calculation...');
        calculateBtn.classList.add('loading');
        calculateBtn.textContent = 'Расчёт...';

        setTimeout(() => {
            try {
                console.log('Getting form data...');
                const data = this.getFormData();
                        console.log('Form data received:', data);
        console.log('Credit holidays in form data:', {
            creditHolidays: data.creditHolidays,
            creditHolidaysAmount: data.creditHolidaysAmount,
            creditHolidaysUnit: data.creditHolidaysUnit
        });
        
                console.log('Performing calculation...');
        const results = this.performCalculation(data);
        console.log('Calculation completed:', results);
        
        // Сохраняем результаты для экспорта
        this.currentResults = results;
        this.currentFormData = data;
        
        console.log('Displaying results...');
        this.displayResults(results);
                
                console.log('Generating payment schedule...');
                console.log('Results object:', results);
                console.log('Results.schedule:', results.schedule);
                console.log('About to call generatePaymentSchedule...');
                this.generatePaymentSchedule(results);
                console.log('generatePaymentSchedule call completed');
                
                console.log('Showing results section...');
                if (this.resultsSection) {
                    this.resultsSection.classList.remove('hidden');
                }
                
                console.log('Calculation completed successfully');
            } catch (error) {
                console.error('Calculation error:', error);
                this.showNotification('Ошибка при расчёте. Проверьте введённые данные.', 'error');
            } finally {
                console.log('Resetting button...');
                calculateBtn.classList.remove('loading');
                calculateBtn.textContent = 'Рассчитать';
            }
        }, 300);
    }

    getFormData() {
        const loanAmountInput = document.getElementById('loan-amount');
        const loanTermInput = document.getElementById('loan-term');
        const termTypeSelect = document.getElementById('term-type');
        const interestRateInput = document.getElementById('interest-rate');
        const rateTypeSelect = document.getElementById('rate-type');
        const ratePeriodSelect = document.getElementById('rate-period');
        const paymentTypeSelect = document.getElementById('payment-type');
        const loanDateInput = document.getElementById('loan-date');
        const considerInflationCheckbox = document.getElementById('consider-inflation');
        const advancedSettingsCheckbox = document.getElementById('advanced-settings');
        const budgetOptimizationCheckbox = document.getElementById('budget-optimization');
        const maxMonthlyPaymentInput = document.getElementById('max-monthly-payment');
        const optimizationPrioritySelect = document.getElementById('optimization-priority');
        
        // Расширенные настройки
        const commissionTypeSelect = document.getElementById('commission-type');
        const commissionAmountInput = document.getElementById('commission-amount');
        const prepaymentDateInput = document.getElementById('prepayment-date');
        const prepaymentAmountInput = document.getElementById('prepayment-amount');

        // Кредитные каникулы - получаем напрямую из DOM
        const creditHolidaysCheckbox = document.getElementById('credit-holidays-checkbox');
        const creditHolidaysNumber = document.getElementById('credit-holidays-number');
        const creditHolidaysSelect = document.getElementById('credit-holidays-select');

        if (!loanAmountInput || !loanTermInput || !termTypeSelect || !interestRateInput || 
            !ratePeriodSelect || !paymentTypeSelect || !loanDateInput || !considerInflationCheckbox) {
            throw new Error('Required form elements not found');
        }

        const loanAmount = this.parseNumber(loanAmountInput.value);
        const loanTerm = parseInt(loanTermInput.value);
        const termType = termTypeSelect.value;
        const interestRate = this.parseNumber(interestRateInput.value);
        const rateType = rateTypeSelect ? rateTypeSelect.value : 'fixed';
        const ratePeriod = ratePeriodSelect.value;
        const paymentType = paymentTypeSelect.value;
        const loanDate = new Date(loanDateInput.value);
        const considerInflation = considerInflationCheckbox.checked;
        console.log('Form data - considerInflation:', considerInflation);
        
        // Расширенные настройки
        const budgetOptimization = budgetOptimizationCheckbox ? budgetOptimizationCheckbox.checked : false;
        const maxMonthlyPayment = maxMonthlyPaymentInput ? this.parseNumber(maxMonthlyPaymentInput.value) : 0;
        const optimizationPriority = optimizationPrioritySelect ? optimizationPrioritySelect.value : 'minimize-term';
        
        // Комиссии
        const commissionType = commissionTypeSelect ? commissionTypeSelect.value : 'percent';
        const commissionAmount = commissionAmountInput ? this.parseNumber(commissionAmountInput.value) : 0;
        
        // Досрочное погашение
        const prepaymentDate = prepaymentDateInput && prepaymentDateInput.value ? new Date(prepaymentDateInput.value) : null;
        const prepaymentAmount = prepaymentAmountInput ? this.parseNumber(prepaymentAmountInput.value) : 0;

        // Кредитные каникулы
        const creditHolidays = creditHolidaysCheckbox ? creditHolidaysCheckbox.checked : false;
        const creditHolidaysAmount = creditHolidaysNumber ? parseInt(creditHolidaysNumber.value) : 1;
        const creditHolidaysUnit = creditHolidaysSelect ? creditHolidaysSelect.value : 'лет';

        console.log('Credit holidays data:', {
            creditHolidays,
            creditHolidaysAmount,
            creditHolidaysUnit
        });

        // Получаем расширенные настройки
        const advancedSettings = window.getAdvancedSettings ? window.getAdvancedSettings() : {};

        // Convert to months if needed
        const termInMonths = termType === 'years' ? loanTerm * 12 : loanTerm;

        // Convert rate to monthly if needed
        const monthlyRate = ratePeriod === 'year' ? interestRate / 12 / 100 : interestRate / 100;

        const formData = {
            loanAmount,
            termInMonths,
            monthlyRate,
            paymentType,
            rateType,
            loanDate,
            considerInflation,
            annualInflationRate: 0.06, // 6% annual inflation
            // Расширенные настройки
            budgetOptimization,
            maxMonthlyPayment,
            optimizationPriority,
            // Комиссии
            commissionType,
            commissionAmount,
            // Досрочное погашение
            prepaymentDate,
            prepaymentAmount,
            // Кредитные каникулы
            creditHolidays,
            creditHolidaysAmount,
            creditHolidaysUnit,
            // Новые расширенные настройки
            ...advancedSettings
        };
        
        console.log('Form data created:', formData);
        return formData;
    }

    performCalculation(data) {
        const { 
            loanAmount, 
            termInMonths, 
            monthlyRate, 
            paymentType, 
            rateType,
            considerInflation, 
            annualInflationRate, 
            budgetOptimization, 
            maxMonthlyPayment, 
            optimizationPriority,
            commissionType,
            commissionAmount,
            prepaymentDate,
            prepaymentAmount,
            // Расширенные настройки
            rounding,
            percentageRounding,
            paymentDay,
            annuityLimit,
            postponePayment,
            postponeType,
            interestAccrual,
            creditHolidays,
            creditHolidaysAmount,
            creditHolidaysUnit
        } = data;

        let monthlyPayment;
        let schedule = [];
        let totalPayments = 0;
        let totalInterest = 0;
        let totalCommission = 0;
        
        // Обработка типа ставки
        console.log('Rate type:', rateType);
        if (rateType === 'variable') {
            console.log('Using variable rate calculation');
            // Для плавающей ставки можно добавить дополнительную логику
            // Например, изменение ставки в зависимости от времени
        } else {
            console.log('Using fixed rate calculation');
        }
        
        // Расчет комиссий
        let commissionPayment = 0;
        if (commissionAmount > 0) {
            switch (commissionType) {
                case 'percent':
                    commissionPayment = (loanAmount * commissionAmount) / 100;
                    break;
                case 'fixed':
                    commissionPayment = commissionAmount;
                    break;
                case 'monthly':
                    commissionPayment = commissionAmount * termInMonths;
                    break;
            }
            totalCommission = commissionPayment;
        }

        if (paymentType === 'annuity') {
            // Annuity payment calculation
            let effectiveTerm = termInMonths;
            let effectiveLoanAmount = loanAmount;
            
            // Если есть кредитные каникулы, пересчитываем платеж
            if (creditHolidays && creditHolidaysAmount > 0) {
                const holidayMonths = creditHolidaysUnit === 'лет' ? creditHolidaysAmount * 12 : 
                                     creditHolidaysUnit === 'месяцев' ? creditHolidaysAmount : 0;
                
                // Эффективный срок для погашения основного долга (без кредитных каникул)
                effectiveTerm = termInMonths - holidayMonths;
                
                // В период кредитных каникул накапливаются проценты, которые добавляются к основному долгу
                let accumulatedInterest = 0;
                for (let month = 1; month <= holidayMonths; month++) {
                    accumulatedInterest += effectiveLoanAmount * monthlyRate;
                }
                effectiveLoanAmount += accumulatedInterest;
                
                console.log('Credit holidays calculation:', {
                    holidayMonths,
                    effectiveTerm,
                    accumulatedInterest,
                    effectiveLoanAmount
                });
            }
            
            // Рассчитываем ежемесячный платеж с учетом кредитных каникул
            monthlyPayment = effectiveLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, effectiveTerm)) /
                (Math.pow(1 + monthlyRate, effectiveTerm) - 1);

            // Применяем округление платежа
            if (rounding) {
                switch (rounding) {
                    case 'kopecks':
                        monthlyPayment = Math.round(monthlyPayment * 100) / 100;
                        break;
                    case 'rubles':
                        monthlyPayment = Math.round(monthlyPayment);
                        break;
                    case 'tens':
                        monthlyPayment = Math.round(monthlyPayment / 10) * 10;
                        break;
                    case 'hundreds':
                        monthlyPayment = Math.round(monthlyPayment / 100) * 100;
                        break;
                }
            }
            
            // Если есть кредитные каникулы, создаем диапазон платежей для аннуитетных платежей
            let originalMonthlyPayment = monthlyPayment;
            if (creditHolidays && creditHolidaysAmount > 0) {
                const holidayMonths = creditHolidaysUnit === 'лет' ? creditHolidaysAmount * 12 : 
                                     creditHolidaysUnit === 'месяцев' ? creditHolidaysAmount : 0;
                
                // Первый платеж (в период каникул) - только проценты
                const firstPayment = loanAmount * monthlyRate;
                
                // Последний платеж - основной аннуитетный платеж
                const lastPayment = monthlyPayment;
                
                monthlyPayment = {
                    first: firstPayment,
                    last: lastPayment
                };
                
                console.log('Annuity payment with credit holidays range:', {
                    first: monthlyPayment.first,
                    last: monthlyPayment.last,
                    holidayMonths,
                    originalMonthlyPayment
                });
            }

            let remainingBalance = loanAmount;

            for (let month = 1; month <= termInMonths; month++) {
                // Проверяем кредитные каникулы
                let isCreditHoliday = false;
                if (creditHolidays && creditHolidaysAmount > 0) {
                    const holidayMonths = creditHolidaysUnit === 'лет' ? creditHolidaysAmount * 12 : 
                                         creditHolidaysUnit === 'месяцев' ? creditHolidaysAmount : 0;
                    if (month <= holidayMonths) {
                        isCreditHoliday = true;
                    }
                }

                const interestPayment = remainingBalance * monthlyRate;
                let currentMonthlyPayment = typeof monthlyPayment === 'object' ? monthlyPayment.last : monthlyPayment;
                let principalPayment = currentMonthlyPayment - interestPayment;
                
                // В период кредитных каникул платим только проценты
                if (isCreditHoliday) {
                    principalPayment = 0;
                    currentMonthlyPayment = interestPayment; // В период каникул платим только проценты
                }
                
                remainingBalance -= principalPayment;

                // Ensure remaining balance doesn't go negative due to rounding
                if (remainingBalance < 0.01) remainingBalance = 0;

                // Ограничение последнего платежа аннуитетом
                if (annuityLimit && month === termInMonths && remainingBalance > 0) {
                    const lastPayment = Math.min(currentMonthlyPayment, remainingBalance + interestPayment);
                    principalPayment = lastPayment - interestPayment;
                    remainingBalance = 0;
                }

                const paymentDate = new Date(data.loanDate);
                paymentDate.setMonth(paymentDate.getMonth() + month);

                // Проверяем досрочное погашение
                let additionalPayment = 0;
                if (prepaymentDate && prepaymentAmount > 0) {
                    const prepaymentMonth = Math.floor((prepaymentDate - data.loanDate) / (1000 * 60 * 60 * 24 * 30.44));
                    if (month === prepaymentMonth) {
                        additionalPayment = Math.min(prepaymentAmount, remainingBalance);
                        remainingBalance -= additionalPayment;
                        if (remainingBalance < 0.01) remainingBalance = 0;
                    }
                }



                // Calculate inflation-adjusted values
                const monthlyInflationRate = Math.pow(1 + annualInflationRate, 1 / 12) - 1;
                const inflationFactor = Math.pow(1 + monthlyInflationRate, month);
                const inflationAdjustedPayment = (currentMonthlyPayment + additionalPayment) / inflationFactor;
                const inflationAdjustedBalance = remainingBalance / inflationFactor;

                schedule.push({
                    month,
                    date: paymentDate,
                    payment: currentMonthlyPayment + additionalPayment,
                    inflationAdjustedPayment: considerInflation ? inflationAdjustedPayment : null,
                    principalPayment: principalPayment + additionalPayment,
                    interestPayment,
                    remainingBalance,
                    inflationAdjustedBalance: considerInflation ? inflationAdjustedBalance : null,
                    additionalPayment: additionalPayment > 0 ? additionalPayment : null
                });

                totalPayments += currentMonthlyPayment + additionalPayment;
                totalInterest += interestPayment;
            }
        } else {
            // Differentiated payment calculation
            let effectiveTerm = termInMonths;
            let effectiveLoanAmount = loanAmount;
            
            // Если есть кредитные каникулы, пересчитываем для дифференцированных платежей
            if (creditHolidays && creditHolidaysAmount > 0) {
                const holidayMonths = creditHolidaysUnit === 'лет' ? creditHolidaysAmount * 12 : 
                                     creditHolidaysUnit === 'месяцев' ? creditHolidaysAmount : 0;
                
                // Эффективный срок для погашения основного долга (без кредитных каникул)
                effectiveTerm = termInMonths - holidayMonths;
                
                // В период кредитных каникул накапливаются проценты, которые добавляются к основному долгу
                let accumulatedInterest = 0;
                for (let month = 1; month <= holidayMonths; month++) {
                    accumulatedInterest += effectiveLoanAmount * monthlyRate;
                }
                effectiveLoanAmount += accumulatedInterest;
                
                console.log('Credit holidays calculation (differentiated):', {
                    holidayMonths,
                    effectiveTerm,
                    accumulatedInterest,
                    effectiveLoanAmount
                });
            }
            
            const principalPayment = effectiveLoanAmount / effectiveTerm;
            let remainingBalance = effectiveLoanAmount;

            for (let month = 1; month <= termInMonths; month++) {
                // Проверяем кредитные каникулы
                let isCreditHoliday = false;
                if (creditHolidays && creditHolidaysAmount > 0) {
                    const holidayMonths = creditHolidaysUnit === 'лет' ? creditHolidaysAmount * 12 : 
                                         creditHolidaysUnit === 'месяцев' ? creditHolidaysAmount : 0;
                    if (month <= holidayMonths) {
                        isCreditHoliday = true;
                    }
                }

                const interestPayment = remainingBalance * monthlyRate;
                let currentPrincipalPayment = principalPayment;
                
                // В период кредитных каникул платим только проценты
                if (isCreditHoliday) {
                    currentPrincipalPayment = 0;
                }
                
                const currentMonthlyPayment = currentPrincipalPayment + interestPayment;
                remainingBalance -= currentPrincipalPayment;

                if (remainingBalance < 0.01) remainingBalance = 0;

                const paymentDate = new Date(data.loanDate);
                paymentDate.setMonth(paymentDate.getMonth() + month);

                // Проверяем досрочное погашение
                let additionalPayment = 0;
                if (prepaymentDate && prepaymentAmount > 0) {
                    const prepaymentMonth = Math.floor((prepaymentDate - data.loanDate) / (1000 * 60 * 60 * 24 * 30.44));
                    if (month === prepaymentMonth) {
                        additionalPayment = Math.min(prepaymentAmount, remainingBalance);
                        remainingBalance -= additionalPayment;
                        if (remainingBalance < 0.01) remainingBalance = 0;
                    }
                }

                const monthlyInflationRate = Math.pow(1 + annualInflationRate, 1 / 12) - 1;
                const inflationFactor = Math.pow(1 + monthlyInflationRate, month);
                const inflationAdjustedPayment = (currentMonthlyPayment + additionalPayment) / inflationFactor;
                const inflationAdjustedBalance = remainingBalance / inflationFactor;

                schedule.push({
                    month,
                    date: paymentDate,
                    payment: currentMonthlyPayment + additionalPayment,
                    inflationAdjustedPayment: considerInflation ? inflationAdjustedPayment : null,
                    principalPayment: principalPayment + additionalPayment,
                    interestPayment,
                    remainingBalance,
                    inflationAdjustedBalance: considerInflation ? inflationAdjustedBalance : null,
                    additionalPayment: additionalPayment > 0 ? additionalPayment : null
                });

                totalPayments += currentMonthlyPayment + additionalPayment;
                totalInterest += interestPayment;
            }

            // For differentiated payments, show range
            monthlyPayment = {
                first: schedule[0].payment,
                last: schedule[schedule.length - 1].payment
            };
            
            console.log('Differentiated payment range:', {
                first: monthlyPayment.first,
                last: monthlyPayment.last,
                scheduleLength: schedule.length
            });
        }

        const overpayment = totalPayments + totalCommission - loanAmount;
        const overpaymentPercentage = (overpayment / loanAmount) * 100;

        console.log('Basic calculation results:', {
            totalPayments,
            loanAmount,
            overpayment,
            overpaymentPercentage: overpaymentPercentage.toFixed(2)
        });

        // Calculate inflation-adjusted totals
        let totalInflationAdjustedPayments = 0;
        if (considerInflation) {
            totalInflationAdjustedPayments = schedule.reduce((sum, payment) =>
                sum + payment.inflationAdjustedPayment, 0);
            console.log('Inflation calculation:', {
                considerInflation,
                totalInflationAdjustedPayments,
                scheduleLength: schedule.length
            });
        } else {
            console.log('Inflation not considered');
        }

        const inflationAdjustedOverpayment = totalInflationAdjustedPayments - loanAmount;
        const inflationAdjustedOverpaymentPercentage = (inflationAdjustedOverpayment / loanAmount) * 100;

        // Правильный расчет полной стоимости кредита (ПСК)
        // ПСК = (общие платежи + комиссии - сумма кредита) / сумма кредита * 100
        const totalCostPercentage = ((totalPayments + totalCommission - loanAmount) / loanAmount) * 100;

        console.log('Total cost calculation:', {
            totalPayments,
            loanAmount,
            totalInterest,
            overpayment,
            totalCostPercentage: totalCostPercentage.toFixed(3),
            monthlyRate: data.monthlyRate * 12 * 100,
            calculation: `(${totalPayments} - ${loanAmount}) / ${loanAmount} * 100 = ${totalCostPercentage.toFixed(3)}%`
        });



        // Budget optimization logic
        let optimizedResults = null;
        if (budgetOptimization && maxMonthlyPayment) {
            optimizedResults = this.calculateBudgetOptimization(
                loanAmount, monthlyRate, paymentType, maxMonthlyPayment, optimizationPriority
            );
        }

        // Применяем расширенные настройки к расписанию платежей
        if (window.applyAdvancedSettingsToSchedule) {
            const advancedSettings = window.getAdvancedSettings ? window.getAdvancedSettings() : {};
            schedule = window.applyAdvancedSettingsToSchedule(schedule, advancedSettings);
        }

        const finalResults = {
            monthlyPayment,
            totalPayments,
            totalInflationAdjustedPayments: considerInflation ? totalInflationAdjustedPayments : null,
            overpayment,
            overpaymentPercentage,
            inflationAdjustedOverpayment: considerInflation ? inflationAdjustedOverpayment : null,
            inflationAdjustedOverpaymentPercentage: considerInflation ? inflationAdjustedOverpaymentPercentage : null,
            totalCostPercentage: totalCostPercentage,
            totalCommission,
            schedule,
            loanAmount,
            termInMonths,
            monthlyRate,
            considerInflation,
            budgetOptimization,
            optimizedResults
        };
        
        console.log('Final calculation results:', {
            considerInflation: finalResults.considerInflation,
            totalPayments: finalResults.totalPayments,
            overpayment: finalResults.overpayment,
            overpaymentPercentage: finalResults.overpaymentPercentage.toFixed(2),
            inflationAdjustedOverpayment: finalResults.inflationAdjustedOverpayment,
            inflationAdjustedOverpaymentPercentage: finalResults.inflationAdjustedOverpaymentPercentage,
            totalCostPercentage: finalResults.totalCostPercentage.toFixed(3),
            scheduleLength: finalResults.schedule.length,
            firstScheduleItem: finalResults.schedule[0]
        });
        
        console.log('Schedule data for charts:', {
            firstPayment: finalResults.schedule[0],
            principalPayment: finalResults.schedule[0].principalPayment,
            interestPayment: finalResults.schedule[0].interestPayment,
            totalScheduleLength: finalResults.schedule.length
        });
        
        return finalResults;
    }

    displayResults(results) {
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        };

        // Monthly payment
        const monthlyPaymentElement = document.getElementById('monthly-payment');
        if (monthlyPaymentElement) {
            console.log('Monthly payment data:', results.monthlyPayment);
            if (typeof results.monthlyPayment === 'object') {
                const paymentText = `${formatCurrency(results.monthlyPayment.first)} ... ${formatCurrency(results.monthlyPayment.last)}`;
                monthlyPaymentElement.textContent = paymentText;
                console.log('Updated monthly payment (range):', paymentText);
            } else {
                const paymentText = formatCurrency(results.monthlyPayment);
                monthlyPaymentElement.textContent = paymentText;
                console.log('Updated monthly payment (single):', paymentText);
            }
        } else {
            console.warn('monthly-payment element not found');
        }

        // Total payments
        const totalPaymentsElement = document.getElementById('total-payments');
        if (totalPaymentsElement) {
            totalPaymentsElement.textContent = formatCurrency(results.totalPayments);
        }

        // Inflation-adjusted total payments
        const inflationTotalRow = document.getElementById('inflation-total-row');
        const totalPaymentsInflationElement = document.getElementById('total-payments-inflation');
        if (totalPaymentsInflationElement) {
            if (results.considerInflation && results.totalInflationAdjustedPayments) {
                totalPaymentsInflationElement.textContent = formatCurrency(results.totalInflationAdjustedPayments);
                console.log('Updated total-payments-inflation (with inflation):', formatCurrency(results.totalInflationAdjustedPayments));
            } else {
                // Если инфляция не учитывается, показываем обычные общие платежи
                totalPaymentsInflationElement.textContent = formatCurrency(results.totalPayments);
                console.log('Updated total-payments-inflation (without inflation):', formatCurrency(results.totalPayments));
            }
        } else {
            console.warn('total-payments-inflation element not found');
        }

        // Overpayment
        const overpaymentElement = document.getElementById('overpayment');
        if (overpaymentElement) {
            overpaymentElement.textContent =
                `${formatCurrency(results.overpayment)} (${results.overpaymentPercentage.toFixed(2)}% от суммы кредита)`;
        }
        
        // Обновляем отдельные элементы переплаты
        const overpaymentAmountElement = document.getElementById('overpayment-amount');
        if (overpaymentAmountElement) {
            overpaymentAmountElement.textContent = formatCurrency(results.overpayment);
            console.log('Updated overpayment-amount:', formatCurrency(results.overpayment));
        } else {
            console.warn('overpayment-amount element not found');
        }
        
        const overpaymentPercentElement = document.getElementById('overpayment-percent');
        if (overpaymentPercentElement) {
            overpaymentPercentElement.textContent = results.overpaymentPercentage.toFixed(2);
            console.log('Updated overpayment-percent:', results.overpaymentPercentage.toFixed(2));
        } else {
            console.warn('overpayment-percent element not found');
        }

        // Inflation-adjusted overpayment - всегда обновляем элементы
        const inflationOverpaymentRow = document.getElementById('inflation-overpayment-row');
        const overpaymentInflationElement = document.getElementById('overpayment-inflation');
        if (inflationOverpaymentRow && overpaymentInflationElement) {
            if (results.considerInflation && results.inflationAdjustedOverpayment !== null) {
                overpaymentInflationElement.textContent =
                    `${formatCurrency(results.inflationAdjustedOverpayment)} (${results.inflationAdjustedOverpaymentPercentage.toFixed(2)}% от суммы кредита)`;
                inflationOverpaymentRow.style.display = 'flex';
            } else {
                // Если инфляция не учитывается, показываем обычную переплату
                overpaymentInflationElement.textContent =
                    `${formatCurrency(results.overpayment)} (${results.overpaymentPercentage.toFixed(2)}% от суммы кредита)`;
                inflationOverpaymentRow.style.display = 'flex';
            }
        }
        
        // Обновляем отдельные элементы переплаты с учетом инфляции
        const overpaymentInflationAmountElement = document.getElementById('overpayment-inflation-amount');
        if (overpaymentInflationAmountElement) {
            if (results.considerInflation && results.inflationAdjustedOverpayment !== null) {
                overpaymentInflationAmountElement.textContent = formatCurrency(results.inflationAdjustedOverpayment);
            } else {
                // Если инфляция не учитывается, показываем обычную переплату
                overpaymentInflationAmountElement.textContent = formatCurrency(results.overpayment);
            }
        } else {
            console.warn('overpayment-inflation-amount element not found');
        }
        
        const overpaymentInflationPercentElement = document.getElementById('overpayment-inflation-percent');
        if (overpaymentInflationPercentElement) {
            if (results.considerInflation && results.inflationAdjustedOverpaymentPercentage !== null) {
                overpaymentInflationPercentElement.textContent = results.inflationAdjustedOverpaymentPercentage.toFixed(2);
            } else {
                // Если инфляция не учитывается, показываем обычный процент переплаты
                overpaymentInflationPercentElement.textContent = results.overpaymentPercentage.toFixed(2);
            }
        } else {
            console.warn('overpayment-inflation-percent element not found');
        }
        
        // Принудительно обновляем все элементы переплаты
        console.log('Updating overpayment values:', {
            considerInflation: results.considerInflation,
            overpayment: results.overpayment,
            overpaymentPercentage: results.overpaymentPercentage,
            inflationAdjustedOverpayment: results.inflationAdjustedOverpayment,
            inflationAdjustedOverpaymentPercentage: results.inflationAdjustedOverpaymentPercentage
        });

        // Total cost percentage
        const totalCostElement = document.getElementById('total-cost');
        if (totalCostElement) {
            const totalCostValue = results.totalCostPercentage.toFixed(3);
            console.log('Setting total-cost element to:', `${totalCostValue}%`);
            totalCostElement.textContent = `${totalCostValue}%`;
            console.log('Updated total-cost:', `${totalCostValue}%`);
            console.log('Element content after update:', totalCostElement.textContent);
            
            // Принудительно обновляем еще раз для надежности
            setTimeout(() => {
                totalCostElement.textContent = `${totalCostValue}%`;
                console.log('Forced update total-cost:', `${totalCostValue}%`);
                console.log('Element content after forced update:', totalCostElement.textContent);
            }, 50);
        } else {
            console.warn('total-cost element not found');
        }

        // Credit holidays info
        this.displayCreditHolidaysInfo(results);


        
        // Budget optimization results
        if (results.budgetOptimization && results.optimizedResults) {
            this.displayBudgetOptimizationResults(results.optimizedResults);
        }
        
        // Обновляем мобильную версию результатов
        this.updateMobileResults(results);
        
        // Обновляем графики
        this.updateCharts(results);
        
        // Принудительно обновляем все элементы результатов
        setTimeout(() => {
            const formatCurrency = (amount) => {
                return new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(amount);
            };
            
            // Обновляем все основные элементы
            const allElements = {
                'monthly-payment': typeof results.monthlyPayment === 'object' 
                    ? `${formatCurrency(results.monthlyPayment.first)} ... ${formatCurrency(results.monthlyPayment.last)}`
                    : formatCurrency(results.monthlyPayment),
                'total-payments': formatCurrency(results.totalPayments),
                'total-payments-inflation': results.considerInflation && results.totalInflationAdjustedPayments
                    ? formatCurrency(results.totalInflationAdjustedPayments)
                    : formatCurrency(results.totalPayments),
                'overpayment-amount': formatCurrency(results.overpayment),
                'overpayment-percent': results.overpaymentPercentage.toFixed(2),
                'overpayment-inflation-amount': results.considerInflation && results.inflationAdjustedOverpayment !== null 
                    ? formatCurrency(results.inflationAdjustedOverpayment) 
                    : formatCurrency(results.overpayment),
                'overpayment-inflation-percent': results.considerInflation && results.inflationAdjustedOverpaymentPercentage !== null 
                    ? results.inflationAdjustedOverpaymentPercentage.toFixed(2) 
                    : results.overpaymentPercentage.toFixed(2),
                'total-cost': `${results.totalCostPercentage.toFixed(3)}%`
            };
            
            Object.entries(allElements).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                    console.log(`Forced update ${id}:`, value);
                    
                    // Специальная отладка для monthly-payment
                    if (id === 'monthly-payment') {
                        console.log('Forced update monthly payment details:', {
                            originalData: results.monthlyPayment,
                            formattedValue: value
                        });
                    }
                    
                    // Специальная отладка для total-cost
                    if (id === 'total-cost') {
                        console.log('Forced update total-cost details:', {
                            originalValue: results.totalCostPercentage,
                            formattedValue: value
                        });
                    }
                }
            });
            
            // Обновляем мобильную версию еще раз
            this.updateMobileResults(results);
            
            // Дополнительное принудительное обновление total-cost
            const totalCostElements = document.querySelectorAll('#total-cost, .mobile-value:last-child');
            totalCostElements.forEach((element, index) => {
                const totalCostValue = `${results.totalCostPercentage.toFixed(3)}%`;
                element.textContent = totalCostValue;
                console.log(`Additional forced update total-cost element ${index}:`, totalCostValue);
            });
        }, 100);
    }

    displayCreditHolidaysInfo(results) {
        // Проверяем, есть ли кредитные каникулы
        const hasCreditHolidays = results.creditHolidays && results.creditHolidaysAmount > 0;
        
        // Элементы для десктопной версии
        const creditHolidaysLabel = document.getElementById('credit-holidays-label');
        const creditHolidaysInfo = document.getElementById('credit-holidays-info');
        
        // Элементы для мобильной версии
        const mobileCreditHolidays = document.getElementById('mobile-credit-holidays');
        const mobileCreditHolidaysInfo = document.getElementById('mobile-credit-holidays-info');
        
        if (hasCreditHolidays) {
            const holidayMonths = results.creditHolidaysUnit === 'лет' ? 
                results.creditHolidaysAmount * 12 : results.creditHolidaysAmount;
            
            const holidayText = `Первые ${holidayMonths} ${results.creditHolidaysUnit === 'лет' ? 
                (holidayMonths === 1 ? 'месяц' : holidayMonths < 5 ? 'месяца' : 'месяцев') : 
                (results.creditHolidaysAmount === 1 ? 'месяц' : results.creditHolidaysAmount < 5 ? 'месяца' : 'месяцев')} - только проценты`;
            
            // Показываем информацию в десктопной версии
            if (creditHolidaysLabel && creditHolidaysInfo) {
                creditHolidaysLabel.style.display = 'inline';
                creditHolidaysInfo.style.display = 'inline';
                creditHolidaysInfo.textContent = holidayText;
            }
            
            // Показываем информацию в мобильной версии
            if (mobileCreditHolidays && mobileCreditHolidaysInfo) {
                mobileCreditHolidays.style.display = 'flex';
                mobileCreditHolidaysInfo.textContent = holidayText;
            }
            
            console.log('Credit holidays info displayed:', holidayText);
        } else {
            // Скрываем информацию если кредитные каникулы не используются
            if (creditHolidaysLabel && creditHolidaysInfo) {
                creditHolidaysLabel.style.display = 'none';
                creditHolidaysInfo.style.display = 'none';
            }
            
            if (mobileCreditHolidays && mobileCreditHolidaysInfo) {
                mobileCreditHolidays.style.display = 'none';
            }
        }
    }

    updateCharts(results) {
        console.log('updateCharts called with results:', results);
        console.log('Results validation:');
        console.log('- loanAmount:', results.loanAmount);
        console.log('- loanTerm:', results.termInMonths);
        console.log('- monthlyRate:', results.monthlyRate);
        console.log('- schedule:', results.schedule);
        console.log('- monthlyPayment:', results.monthlyPayment);
        console.log('- totalPayments:', results.totalPayments);
        console.log('- overpayment:', results.overpayment);
        
        // Проверяем, доступен ли ChartsManager
        if (window.chartsManager) {
            console.log('ChartsManager is available');
            
            // Подготавливаем данные для графиков из реальных результатов
            const chartData = {
                loanAmount: results.loanAmount,
                loanTerm: results.termInMonths,
                monthlyRate: results.monthlyRate,
                schedule: results.schedule,
                monthlyPayment: results.monthlyPayment,
                totalPayments: results.totalPayments,
                overpayment: results.overpayment,
                overpaymentPercentage: results.overpaymentPercentage
            };
            
            console.log('Chart data prepared:', chartData);
            
            console.log('Prepared chart data from real results:', chartData);
            
            // Обновляем данные в ChartsManager
            window.chartsManager.updateData(chartData);
        } else {
            console.error('ChartsManager is not available');
        }
    }



    updateMobileResults(results) {
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        };
        
        // Обновляем мобильные элементы
        const mobileElements = document.querySelectorAll('.mobile-result-item .mobile-value');
        if (mobileElements.length >= 6) {
            // Сумма платежа в месяц
            if (typeof results.monthlyPayment === 'object') {
                mobileElements[0].textContent = `${formatCurrency(results.monthlyPayment.first)} ... ${formatCurrency(results.monthlyPayment.last)}`;
            } else {
                mobileElements[0].textContent = formatCurrency(results.monthlyPayment);
            }
            
            // Всего платежей
            mobileElements[1].textContent = formatCurrency(results.totalPayments);
            
            // Всего платежей с учетом инфляции
            if (results.considerInflation && results.totalInflationAdjustedPayments) {
                mobileElements[2].textContent = formatCurrency(results.totalInflationAdjustedPayments);
            } else {
                mobileElements[2].textContent = formatCurrency(results.totalPayments);
            }
            
            // Переплата
            mobileElements[3].textContent = `${formatCurrency(results.overpayment)} (${results.overpaymentPercentage.toFixed(2)}% от суммы кредита)`;
            
            // Переплата с учетом инфляции
            if (results.considerInflation && results.inflationAdjustedOverpayment !== null) {
                mobileElements[4].textContent = `${formatCurrency(results.inflationAdjustedOverpayment)} (${results.inflationAdjustedOverpaymentPercentage.toFixed(2)}% от суммы кредита)`;
            } else {
                mobileElements[4].textContent = `${formatCurrency(results.overpayment)} (${results.overpaymentPercentage.toFixed(2)}% от суммы кредита)`;
            }
            
            // Полная стоимость кредита
            const mobileTotalCost = `${results.totalCostPercentage.toFixed(3)}%`;
            mobileElements[5].textContent = mobileTotalCost;
            console.log('Updated mobile total-cost:', mobileTotalCost);
            
            // Кредитные каникулы (если есть)
            if (mobileElements[6] && results.creditHolidays && results.creditHolidaysAmount > 0) {
                const holidayMonths = results.creditHolidaysUnit === 'лет' ? 
                    results.creditHolidaysAmount * 12 : results.creditHolidaysAmount;
                
                const holidayText = `Первые ${holidayMonths} ${results.creditHolidaysUnit === 'лет' ? 
                    (holidayMonths === 1 ? 'месяц' : holidayMonths < 5 ? 'месяца' : 'месяцев') : 
                    (results.creditHolidaysAmount === 1 ? 'месяц' : results.creditHolidaysAmount < 5 ? 'месяца' : 'месяцев')} - только проценты`;
                
                mobileElements[6].textContent = holidayText;
                console.log('Updated mobile credit holidays:', holidayText);
            }
            
            console.log('Updated mobile results');
        } else {
            console.warn('Mobile elements not found or insufficient count');
        }
    }

    generatePaymentSchedule(results) {
        console.log('generatePaymentSchedule called!');
        const tbody = document.getElementById('payment-schedule');
        if (!tbody) {
            console.error('Payment schedule tbody not found');
            return;
        }

        console.log('Found tbody, clearing content...');
        tbody.innerHTML = '';

        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        };

        const formatDate = (date) => {
            return date.toLocaleDateString('ru-RU');
        };

        console.log('Results schedule:', results.schedule);
        
        if (results.schedule && results.schedule.length > 0) {
            console.log('Using real data, schedule length:', results.schedule.length);
            console.log('First payment example:', results.schedule[0]);
            
            results.schedule.forEach((payment, index) => {
                const row = document.createElement('tr');
                
                // Формируем дату для описания
                const month = payment.date.getMonth() + 1;
                const year = payment.date.getFullYear();
                const descriptionDate = `${month.toString().padStart(2, '0')}/${year}`;
                const descriptionText = `Ежемесячный платеж за ${descriptionDate}`;
                
                // Проверяем, есть ли платеж за 11/2026
                if (descriptionDate === '11/2026') {
                    console.log('Found payment for 11/2026:', payment);
                }
                
                console.log(`Creating row for payment ${payment.month}:`, {
                    month: payment.month,
                    date: formatDate(payment.date),
                    descriptionDate: descriptionDate,
                    descriptionText: descriptionText
                });
                
                // Добавляем информацию о досрочном погашении в описание
                let finalDescription = descriptionText;
                if (payment.additionalPayment && payment.additionalPayment > 0) {
                    finalDescription += ` + досрочное погашение ${formatCurrency(payment.additionalPayment)}`;
                }
                
                // Добавляем информацию о кредитных каникулах
                if (results.creditHolidays && results.creditHolidaysAmount > 0) {
                    const holidayMonths = results.creditHolidaysUnit === 'лет' ? 
                        results.creditHolidaysAmount * 12 : results.creditHolidaysAmount;
                    if (payment.month <= holidayMonths) {
                        finalDescription += ` (кредитные каникулы - только проценты)`;
                    }
                }
                
                row.innerHTML = `
                    <td>${payment.month}</td>
                    <td>${formatDate(payment.date)}</td>
                    <td>${formatCurrency(payment.payment)}</td>
                    <td class="light" style="display: ${results.considerInflation ? 'table-cell' : 'none'}">
                        ${payment.inflationAdjustedPayment ? formatCurrency(payment.inflationAdjustedPayment) : ''}
                    </td>
                    <td>${formatCurrency(payment.principalPayment)}</td>
                    <td>${formatCurrency(payment.interestPayment)}</td>
                    <td>${formatCurrency(payment.remainingBalance)}</td>
                    <td class="light" style="display: ${results.considerInflation ? 'table-cell' : 'none'}">
                        ${payment.inflationAdjustedBalance ? formatCurrency(payment.inflationAdjustedBalance) : ''}
                    </td>
                    <td class="desc">${finalDescription}</td>
                `;



                tbody.appendChild(row);
            });
        } else {
            console.log('No schedule data, showing sample data');
            
            // Если нет данных, показываем пример с описанием
            const sampleData = [
                {
                    month: 1,
                    date: new Date('2025-09-08'),
                    payment: 15924.66,
                    inflationAdjustedPayment: 15924.66,
                    principalPayment: 0.00,
                    interestPayment: 15924.66,
                    remainingBalance: 1500000.00,
                    inflationAdjustedBalance: 1500000.00,
                    descriptionDate: '09/2025'
                },
                {
                    month: 2,
                    date: new Date('2025-10-07'),
                    payment: 15924.96,
                    inflationAdjustedPayment: 15924.96,
                    principalPayment: 0.00,
                    interestPayment: 15410.96,
                    remainingBalance: 1500000.00,
                    inflationAdjustedBalance: 1500000.00,
                    descriptionDate: '10/2025'
                },
                {
                    month: 3,
                    date: new Date('2025-11-07'),
                    payment: 15924.66,
                    inflationAdjustedPayment: 15924.66,
                    principalPayment: 0.00,
                    interestPayment: 15924.66,
                    remainingBalance: 1500000.00,
                    inflationAdjustedBalance: 1500000.00,
                    descriptionDate: '11/2025'
                },
                {
                    month: 4,
                    date: new Date('2026-11-07'),
                    payment: 15924.66,
                    inflationAdjustedPayment: 15924.66,
                    principalPayment: 0.00,
                    interestPayment: 15924.66,
                    remainingBalance: 1500000.00,
                    inflationAdjustedBalance: 1500000.00,
                    descriptionDate: '11/2026'
                }
            ];

            // Получаем состояние чекбокса инфляции
            const inflationCheckbox = document.getElementById('consider-inflation');
            const showInflation = inflationCheckbox ? inflationCheckbox.checked : false;
            
            sampleData.forEach((payment, index) => {
                const row = document.createElement('tr');
                
                // Проверяем, есть ли платеж за 11/2026 в sampleData
                if (payment.descriptionDate === '11/2026') {
                    console.log('Found 11/2026 payment in sampleData:', payment);
                }
                
                row.innerHTML = `
                    <td>${payment.month}</td>
                    <td>${formatDate(payment.date)}</td>
                    <td>${formatCurrency(payment.payment)}</td>
                    <td class="light" style="display: ${showInflation ? 'table-cell' : 'none'}">${formatCurrency(payment.inflationAdjustedPayment)}</td>
                    <td>${formatCurrency(payment.principalPayment)}</td>
                    <td>${formatCurrency(payment.interestPayment)}</td>
                    <td>${formatCurrency(payment.remainingBalance)}</td>
                    <td class="light" style="display: ${showInflation ? 'table-cell' : 'none'}">${formatCurrency(payment.inflationAdjustedBalance)}</td>
                    <td class="desc">Ежемесячный платеж за ${payment.descriptionDate}</td>
                `;

                tbody.appendChild(row);
            });
        }

        // Добавляем функциональность сортировки и выделения строк
        this.addTableInteractivity();
        
        // Обновляем видимость колонок инфляции
        const inflationCheckbox = document.getElementById('consider-inflation');
        if (inflationCheckbox) {
            this.toggleInflationColumns(inflationCheckbox.checked);
        }
    }

    toggleInflationColumns(show) {
        console.log('toggleInflationColumns called with show:', show);
        
        // Находим заголовки колонок с инфляцией
        const inflationHeaders = document.querySelectorAll('#inflation-header, #inflation-balance-header');
        console.log('Found inflation headers:', inflationHeaders.length);
        
        // Находим ячейки с данными инфляции (4-я и 8-я колонки)
        const inflationCells = document.querySelectorAll('#payment-schedule td:nth-child(4), #payment-schedule td:nth-child(8)');
        console.log('Found inflation cells:', inflationCells.length);

        if (inflationHeaders.length === 0) {
            console.warn('Inflation headers not found');
            return;
        }

        // Показываем/скрываем заголовки
        inflationHeaders.forEach(header => {
            header.style.display = show ? 'table-cell' : 'none';
            console.log('Header display set to:', header.style.display);
        });

        // Показываем/скрываем ячейки данных
        inflationCells.forEach(cell => {
            cell.style.display = show ? 'table-cell' : 'none';
            console.log('Cell display set to:', cell.style.display);
        });
        
        console.log('Inflation columns toggled successfully');
    }

    toggleAdvancedOptions(show) {
        const advancedOptions = document.getElementById('advanced-options');
        const advancedContainer = document.querySelector('.advanced-section .checkbox-container');
        
        if (advancedOptions) {
            if (show) {
                advancedOptions.classList.remove('hidden');
                if (advancedContainer) {
                    advancedContainer.classList.add('active');
                }
            } else {
                advancedOptions.classList.add('hidden');
                if (advancedContainer) {
                    advancedContainer.classList.remove('active');
                }
            }
        }
    }




    toggleBudgetOptions(show) {
        const budgetOptions = document.getElementById('budget-options');
        const budgetContainer = document.querySelector('.budget-section .checkbox-container');
        
        if (budgetOptions) {
            if (show) {
                budgetOptions.classList.remove('hidden');
                if (budgetContainer) {
                    budgetContainer.classList.add('active');
                }
            } else {
                budgetOptions.classList.add('hidden');
                if (budgetContainer) {
                    budgetContainer.classList.remove('active');
                }
            }
        }
    }

    toggleInflationActive(show) {
        const inflationContainer = document.querySelector('.bottom-section .checkbox-container');
        if (inflationContainer) {
            if (show) {
                inflationContainer.classList.add('active');
            } else {
                inflationContainer.classList.remove('active');
            }
        }
    }

    calculateBudgetOptimization(loanAmount, monthlyRate, paymentType, maxMonthlyPayment, optimizationPriority) {
        // Convert maxMonthlyPayment to number
        const maxPayment = this.parseNumber(maxMonthlyPayment);
        
        if (maxPayment <= 0) {
            return null;
        }

        let optimizedTerm = 0;
        let optimizedMonthlyPayment = 0;
        let optimizedTotalPayments = 0;
        let optimizedOverpayment = 0;
        let optimizationDetails = {};

        if (paymentType === 'annuity') {
            // Для аннуитетных платежей используем более точный алгоритм
            optimizationDetails = this.calculateAnnuityOptimization(loanAmount, monthlyRate, maxPayment, optimizationPriority);
        } else {
            // Для дифференцированных платежей
            optimizationDetails = this.calculateDifferentiatedOptimization(loanAmount, monthlyRate, maxPayment, optimizationPriority);
        }

        return {
            optimizedTerm: optimizationDetails.optimizedTerm,
            optimizedMonthlyPayment: optimizationDetails.optimizedMonthlyPayment,
            optimizedTotalPayments: optimizationDetails.optimizedTotalPayments,
            optimizedOverpayment: optimizationDetails.optimizedOverpayment,
            optimizationPriority,
            optimizationDetails: optimizationDetails.details,
            maxBudget: maxPayment,
            budgetUtilization: optimizationDetails.budgetUtilization
        };
    }

    calculateAnnuityOptimization(loanAmount, monthlyRate, maxPayment, priority) {
        let optimizedTerm = 0;
        let optimizedMonthlyPayment = 0;
        let optimizedTotalPayments = 0;
        let optimizedOverpayment = 0;
        let budgetUtilization = 0;
        let details = {};

        if (monthlyRate <= 0) {
            return { optimizedTerm: 1, optimizedMonthlyPayment: loanAmount, optimizedTotalPayments: loanAmount, optimizedOverpayment: 0, budgetUtilization: 0, details: { error: 'Некорректная процентная ставка' } };
        }

        // Проверяем минимально возможный платеж
        const minPossiblePayment = loanAmount * monthlyRate;
        if (maxPayment < minPossiblePayment) {
            return {
                optimizedTerm: 1,
                optimizedMonthlyPayment: minPossiblePayment,
                optimizedTotalPayments: minPossiblePayment,
                optimizedOverpayment: 0,
                budgetUtilization: (minPossiblePayment / maxPayment) * 100,
                details: { warning: 'Бюджет слишком мал для данного кредита' }
            };
        }

        // Бинарный поиск оптимального срока
        let left = 1;
        let right = 600; // Максимум 50 лет
        let bestTerm = 0;
        let bestScore = Infinity;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            // Рассчитываем платеж для данного срока
            const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, mid)) / (Math.pow(1 + monthlyRate, mid) - 1);
            
            if (payment <= maxPayment) {
                // Этот срок подходит, но может быть лучше
                const totalPayments = payment * mid;
                const overpayment = totalPayments - loanAmount;
                
                // Рассчитываем оценку в зависимости от приоритета
                let score = 0;
                switch (priority) {
                    case 'minimize-term':
                        score = mid; // Минимизируем срок
                        break;
                    case 'minimize-payment':
                        score = payment; // Минимизируем платеж
                        break;
                    case 'minimize-overpayment':
                        score = overpayment; // Минимизируем переплату
                        break;
                    default:
                        score = mid; // По умолчанию минимизируем срок
                }
                
                if (score < bestScore) {
                    bestScore = score;
                    bestTerm = mid;
                    optimizedMonthlyPayment = payment;
                    optimizedTotalPayments = totalPayments;
                    optimizedOverpayment = overpayment;
                    budgetUtilization = (payment / maxPayment) * 100;
                }
                
                right = mid - 1; // Ищем еще меньший срок
            } else {
                left = mid + 1; // Ищем больший срок
            }
        }

        optimizedTerm = bestTerm;
        
        // Дополнительные детали оптимизации
        details = {
            algorithm: 'binary_search',
            iterations: Math.log2(600),
            minPossiblePayment: minPossiblePayment,
            maxPossibleTerm: 600,
            paymentEfficiency: (optimizedMonthlyPayment / maxPayment) * 100,
            termEfficiency: (optimizedTerm / 600) * 100,
            overpaymentEfficiency: (optimizedOverpayment / loanAmount) * 100
        };

        return {
            optimizedTerm,
            optimizedMonthlyPayment,
            optimizedTotalPayments,
            optimizedOverpayment,
            budgetUtilization,
            details
        };
    }

    calculateDifferentiatedOptimization(loanAmount, monthlyRate, maxPayment, priority) {
        let optimizedTerm = 0;
        let optimizedMonthlyPayment = { first: 0, last: 0 };
        let optimizedTotalPayments = 0;
        let optimizedOverpayment = 0;
        let budgetUtilization = 0;
        let details = {};

        // Для дифференцированных платежей первый платеж самый большой
        // Ищем минимальный срок, при котором первый платеж не превышает бюджет
        let term = 1;
        let firstPayment = loanAmount / term + loanAmount * monthlyRate;
        
        while (firstPayment > maxPayment && term < 600) {
            term++;
            firstPayment = loanAmount / term + loanAmount * monthlyRate;
        }

        if (term >= 600) {
            return {
                optimizedTerm: 600,
                optimizedMonthlyPayment: { first: firstPayment, last: loanAmount / 600 + (loanAmount / 600) * monthlyRate },
                optimizedTotalPayments: this.calculateDifferentiatedTotalPayments(loanAmount, monthlyRate, 600),
                optimizedOverpayment: 0,
                budgetUtilization: (firstPayment / maxPayment) * 100,
                details: { warning: 'Максимальный срок достигнут' }
            };
        }

        optimizedTerm = term;
        
        // Рассчитываем все платежи для оптимизированного срока
        const principalPayment = loanAmount / optimizedTerm;
        let totalPayments = 0;
        let remainingBalance = loanAmount;
        let payments = [];
        
        for (let month = 1; month <= optimizedTerm; month++) {
            const interestPayment = remainingBalance * monthlyRate;
            const currentPayment = principalPayment + interestPayment;
            totalPayments += currentPayment;
            remainingBalance -= principalPayment;
            payments.push(currentPayment);
        }

        optimizedTotalPayments = totalPayments;
        optimizedOverpayment = totalPayments - loanAmount;
        optimizedMonthlyPayment = {
            first: payments[0],
            last: payments[payments.length - 1]
        };
        budgetUtilization = (payments[0] / maxPayment) * 100;

        // Дополнительные детали оптимизации
        details = {
            algorithm: 'linear_search',
            firstPayment: payments[0],
            lastPayment: payments[payments.length - 1],
            paymentRange: payments[0] - payments[payments.length - 1],
            averagePayment: totalPayments / optimizedTerm,
            paymentVariance: this.calculateVariance(payments)
        };

        return {
            optimizedTerm,
            optimizedMonthlyPayment,
            optimizedTotalPayments,
            optimizedOverpayment,
            budgetUtilization,
            details
        };
    }

    calculateDifferentiatedTotalPayments(loanAmount, monthlyRate, term) {
        const principalPayment = loanAmount / term;
        let totalPayments = 0;
        let remainingBalance = loanAmount;
        
        for (let month = 1; month <= term; month++) {
            const interestPayment = remainingBalance * monthlyRate;
            const currentPayment = principalPayment + interestPayment;
            totalPayments += currentPayment;
            remainingBalance -= principalPayment;
        }
        
        return totalPayments;
    }

    calculateVariance(payments) {
        const mean = payments.reduce((sum, payment) => sum + payment, 0) / payments.length;
        const variance = payments.reduce((sum, payment) => sum + Math.pow(payment - mean, 2), 0) / payments.length;
        return variance;
    }

    calculateBudgetOptimization(loanAmount, monthlyRate, paymentType, maxMonthlyPayment, optimizationPriority) {
        // Convert maxMonthlyPayment to number
        const maxPayment = this.parseNumber(maxMonthlyPayment);
        
        if (maxPayment <= 0) {
            return null;
        }

        let optimizedTerm = 0;
        let optimizedMonthlyPayment = 0;
        let optimizedTotalPayments = 0;
        let optimizedOverpayment = 0;
        let optimizationDetails = {};

        if (paymentType === 'annuity') {
            // Для аннуитетных платежей используем более точный алгоритм
            optimizationDetails = this.calculateAnnuityOptimization(loanAmount, monthlyRate, maxPayment, optimizationPriority);
        } else {
            // Для дифференцированных платежей
            optimizationDetails = this.calculateDifferentiatedOptimization(loanAmount, monthlyRate, maxPayment, optimizationPriority);
        }

        return {
            optimizedTerm: optimizationDetails.optimizedTerm,
            optimizedMonthlyPayment: optimizationDetails.optimizedMonthlyPayment,
            optimizedTotalPayments: optimizationDetails.optimizedTotalPayments,
            optimizedOverpayment: optimizationDetails.optimizedOverpayment,
            optimizationPriority,
            optimizationDetails: optimizationDetails.details,
            maxBudget: maxPayment,
            budgetUtilization: optimizationDetails.budgetUtilization
        };
    }

    calculateAnnuityOptimization(loanAmount, monthlyRate, maxPayment, priority) {
        let optimizedTerm = 0;
        let optimizedMonthlyPayment = 0;
        let optimizedTotalPayments = 0;
        let optimizedOverpayment = 0;
        let budgetUtilization = 0;
        let details = {};

        if (monthlyRate <= 0) {
            return { optimizedTerm: 1, optimizedMonthlyPayment: loanAmount, optimizedTotalPayments: loanAmount, optimizedOverpayment: 0, budgetUtilization: 0, details: { error: 'Некорректная процентная ставка' } };
        }

        // Проверяем минимально возможный платеж
        const minPossiblePayment = loanAmount * monthlyRate;
        if (maxPayment < minPossiblePayment) {
            return {
                optimizedTerm: 1,
                optimizedMonthlyPayment: minPossiblePayment,
                optimizedTotalPayments: minPossiblePayment,
                optimizedOverpayment: 0,
                budgetUtilization: (minPossiblePayment / maxPayment) * 100,
                details: { warning: 'Бюджет слишком мал для данного кредита' }
            };
        }

        // Бинарный поиск оптимального срока
        let left = 1;
        let right = 600; // Максимум 50 лет
        let bestTerm = 0;
        let bestScore = Infinity;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            // Рассчитываем платеж для данного срока
            const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, mid)) / (Math.pow(1 + monthlyRate, mid) - 1);
            
            if (payment <= maxPayment) {
                // Этот срок подходит, но может быть лучше
                const totalPayments = payment * mid;
                const overpayment = totalPayments - loanAmount;
                
                // Рассчитываем оценку в зависимости от приоритета
                let score = 0;
                switch (priority) {
                    case 'minimize-term':
                        score = mid; // Минимизируем срок
                        break;
                    case 'minimize-payment':
                        score = payment; // Минимизируем платеж
                        break;
                    case 'minimize-overpayment':
                        score = overpayment; // Минимизируем переплату
                        break;
                    default:
                        score = mid; // По умолчанию минимизируем срок
                }
                
                if (score < bestScore) {
                    bestScore = score;
                    bestTerm = mid;
                    optimizedMonthlyPayment = payment;
                    optimizedTotalPayments = totalPayments;
                    optimizedOverpayment = overpayment;
                    budgetUtilization = (payment / maxPayment) * 100;
                }
                
                right = mid - 1; // Ищем еще меньший срок
            } else {
                left = mid + 1; // Ищем больший срок
            }
        }

        optimizedTerm = bestTerm;
        
        // Дополнительные детали оптимизации
        details = {
            algorithm: 'binary_search',
            iterations: Math.log2(600),
            minPossiblePayment: minPossiblePayment,
            maxPossibleTerm: 600,
            paymentEfficiency: (optimizedMonthlyPayment / maxPayment) * 100,
            termEfficiency: (optimizedTerm / 600) * 100,
            overpaymentEfficiency: (optimizedOverpayment / loanAmount) * 100
        };

        return {
            optimizedTerm,
            optimizedMonthlyPayment,
            optimizedTotalPayments,
            optimizedOverpayment,
            budgetUtilization,
            details
        };
    }

    calculateDifferentiatedOptimization(loanAmount, monthlyRate, maxPayment, priority) {
        let optimizedTerm = 0;
        let optimizedMonthlyPayment = { first: 0, last: 0 };
        let optimizedTotalPayments = 0;
        let optimizedOverpayment = 0;
        let budgetUtilization = 0;
        let details = {};

        // Для дифференцированных платежей первый платеж самый большой
        // Ищем минимальный срок, при котором первый платеж не превышает бюджет
        let term = 1;
        let firstPayment = loanAmount / term + loanAmount * monthlyRate;
        
        while (firstPayment > maxPayment && term < 600) {
            term++;
            firstPayment = loanAmount / term + loanAmount * monthlyRate;
        }

        if (term >= 600) {
            return {
                optimizedTerm: 600,
                optimizedMonthlyPayment: { first: firstPayment, last: loanAmount / 600 + (loanAmount / 600) * monthlyRate },
                optimizedTotalPayments: this.calculateDifferentiatedTotalPayments(loanAmount, monthlyRate, 600),
                optimizedOverpayment: 0,
                budgetUtilization: (firstPayment / maxPayment) * 100,
                details: { warning: 'Максимальный срок достигнут' }
            };
        }

        optimizedTerm = term;
        
        // Рассчитываем все платежи для оптимизированного срока
        const principalPayment = loanAmount / optimizedTerm;
        let totalPayments = 0;
        let remainingBalance = loanAmount;
        let payments = [];
        
        for (let month = 1; month <= optimizedTerm; month++) {
            const interestPayment = remainingBalance * monthlyRate;
            const currentPayment = principalPayment + interestPayment;
            totalPayments += currentPayment;
            remainingBalance -= principalPayment;
            payments.push(currentPayment);
        }

        optimizedTotalPayments = totalPayments;
        optimizedOverpayment = totalPayments - loanAmount;
        optimizedMonthlyPayment = {
            first: payments[0],
            last: payments[payments.length - 1]
        };
        budgetUtilization = (payments[0] / maxPayment) * 100;

        // Дополнительные детали оптимизации
        details = {
            algorithm: 'linear_search',
            firstPayment: payments[0],
            lastPayment: payments[payments.length - 1],
            paymentRange: payments[0] - payments[payments.length - 1],
            averagePayment: totalPayments / optimizedTerm,
            paymentVariance: this.calculateVariance(payments)
        };

        return {
            optimizedTerm,
            optimizedMonthlyPayment,
            optimizedTotalPayments,
            optimizedOverpayment,
            budgetUtilization,
            details
        };
    }

    calculateDifferentiatedTotalPayments(loanAmount, monthlyRate, term) {
        const principalPayment = loanAmount / term;
        let totalPayments = 0;
        let remainingBalance = loanAmount;
        
        for (let month = 1; month <= term; month++) {
            const interestPayment = remainingBalance * monthlyRate;
            const currentPayment = principalPayment + interestPayment;
            totalPayments += currentPayment;
            remainingBalance -= principalPayment;
        }
        
        return totalPayments;
    }

    showBudgetOptimizationHelp() {
        const helpModal = this.createModal('💡 Как работает оптимизация по бюджету', `
            <div class="budget-help-content">
                <div class="help-section">
                    <h4>🎯 Что это такое?</h4>
                    <p>Оптимизация по бюджету помогает найти оптимальные условия кредита, исходя из максимальной суммы, которую вы можете платить ежемесячно.</p>
                </div>
                
                <div class="help-section">
                    <h4>📊 Приоритеты оптимизации:</h4>
                    <ul>
                        <li><strong>Минимизировать срок кредита</strong> - кредит будет погашен максимально быстро</li>
                        <li><strong>Минимизировать ежемесячный платеж</strong> - минимальная нагрузка на бюджет</li>
                        <li><strong>Минимизировать переплату</strong> - оптимальное соотношение срока и стоимости</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <h4>💡 Как использовать:</h4>
                    <ol>
                        <li>Введите максимальный ежемесячный платеж</li>
                        <li>Выберите приоритет оптимизации</li>
                        <li>Нажмите "Рассчитать"</li>
                        <li>Изучите результаты и рекомендации</li>
                    </ol>
                </div>
                
                <div class="help-section">
                    <h4>⚠️ Важно помнить:</h4>
                    <ul>
                        <li>Учитывайте непредвиденные расходы</li>
                        <li>Оставляйте резерв в бюджете</li>
                        <li>Регулярно отслеживайте график платежей</li>
                    </ul>
                </div>
            </div>
        `, () => {});
        
        // Убираем кнопку "Добавить" для модального окна помощи
        const saveButton = helpModal.querySelector('.save-modal');
        if (saveButton) {
            saveButton.style.display = 'none';
        }
        
        document.body.appendChild(helpModal);
    }

    updateBudgetValidation(input) {
        const value = this.parseNumber(input.value);
        const loanAmount = this.parseNumber(document.getElementById('loan-amount')?.value || '0');
        const monthlyRate = this.parseNumber(document.getElementById('interest-rate')?.value || '0') / 12 / 100;
        
        // Убираем предыдущие сообщения об ошибках
        const existingError = input.parentNode.querySelector('.validation-error');
        if (existingError) {
            existingError.remove();
        }
        
        if (value > 0) {
            // Проверяем минимально возможный платеж
            const minPayment = loanAmount * monthlyRate;
            if (value < minPayment) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'validation-error';
                errorDiv.innerHTML = `⚠️ Минимально возможный платеж: ${this.formatCurrency(minPayment)}`;
                input.parentNode.appendChild(errorDiv);
            }
        }
    }

    showInputHint(input, message) {
        // Убираем предыдущие подсказки
        const existingHint = document.querySelector('.input-hint');
        if (existingHint) {
            existingHint.remove();
        }
        
        const hint = document.createElement('div');
        hint.className = 'input-hint';
        hint.textContent = message;
        hint.style.cssText = `
            position: absolute;
            background: #007bff;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.85rem;
            z-index: 1000;
            max-width: 250px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: fadeIn 0.3s ease;
        `;
        
        const rect = input.getBoundingClientRect();
        hint.style.top = `${rect.bottom + 5}px`;
        hint.style.left = `${rect.left}px`;
        
        document.body.appendChild(hint);
        
        // Убираем подсказку через 3 секунды или при потере фокуса
        setTimeout(() => hint.remove(), 3000);
        input.addEventListener('blur', () => hint.remove(), { once: true });
    }

    updatePriorityDescription() {
        const prioritySelect = document.getElementById('optimization-priority');
        const descriptionDiv = document.getElementById('priority-description');
        
        if (!prioritySelect || !descriptionDiv) return;
        
        const descriptions = {
            'minimize-term': 'Кредит будет погашен максимально быстро, но ежемесячные платежи будут выше.',
            'minimize-payment': 'Минимальная нагрузка на бюджет, но срок кредита будет дольше.',
            'minimize-overpayment': 'Оптимальное соотношение между сроком кредита и общей стоимостью.'
        };
        
        descriptionDiv.textContent = descriptions[prioritySelect.value] || '';
    }

    showPriorityHint() {
        const prioritySelect = document.getElementById('optimization-priority');
        if (!prioritySelect) return;
        
        const hints = {
            'minimize-term': 'Выберите этот приоритет, если хотите погасить кредит как можно быстрее.',
            'minimize-payment': 'Выберите этот приоритет, если важно минимизировать ежемесячную нагрузку.',
            'minimize-overpayment': 'Выберите этот приоритет для оптимального соотношения срока и стоимости.'
        };
        
        const currentHint = hints[prioritySelect.value];
        if (currentHint) {
            this.showInputHint(prioritySelect, currentHint);
        }
    }

    displayBudgetOptimizationResults(optimizedResults) {
        // Create or update budget optimization results section
        let budgetResultsSection = document.getElementById('budget-optimization-results');
        if (!budgetResultsSection) {
            budgetResultsSection = document.createElement('div');
            budgetResultsSection.id = 'budget-optimization-results';
            budgetResultsSection.className = 'budget-optimization-results';
            
            // Insert after the main results summary
            const resultsSummary = document.querySelector('.results-summary');
            if (resultsSummary && resultsSummary.parentNode) {
                resultsSummary.parentNode.insertBefore(budgetResultsSection, resultsSummary.nextSibling);
            }
        }

        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        };

        const formatTerm = (months) => {
            if (months >= 12) {
                const years = Math.floor(months / 12);
                const remainingMonths = months % 12;
                if (remainingMonths === 0) {
                    return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}`;
                } else {
                    return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'} ${remainingMonths} ${remainingMonths === 1 ? 'месяц' : remainingMonths < 5 ? 'месяца' : 'месяцев'}`;
                }
            } else {
                return `${months} ${months === 1 ? 'месяц' : months < 5 ? 'месяца' : 'месяцев'}`;
            }
        };

        const formatPercentage = (value) => {
            return `${value.toFixed(1)}%`;
        };

        let monthlyPaymentText = '';
        if (typeof optimizedResults.optimizedMonthlyPayment === 'object') {
            monthlyPaymentText = `${formatCurrency(optimizedResults.optimizedMonthlyPayment.first)} ... ${formatCurrency(optimizedResults.optimizedMonthlyPayment.last)}`;
        } else {
            monthlyPaymentText = formatCurrency(optimizedResults.optimizedMonthlyPayment);
        }

        // Создаем индикатор использования бюджета
        const budgetUtilization = optimizedResults.budgetUtilization || 0;
        const budgetUtilizationClass = budgetUtilization > 95 ? 'high' : budgetUtilization > 80 ? 'medium' : 'low';
        const budgetUtilizationText = budgetUtilization > 95 ? 'Отличное использование бюджета' : 
                                     budgetUtilization > 80 ? 'Хорошее использование бюджета' : 
                                     'Есть резерв в бюджете';

        // Создаем детали оптимизации
        let optimizationDetailsHTML = '';
        if (optimizedResults.optimizationDetails) {
            const details = optimizedResults.optimizationDetails;
            optimizationDetailsHTML = `
                <div class="optimization-details">
                    <h4>Детали оптимизации:</h4>
                    <div class="details-grid">
                        ${details.algorithm ? `<div class="detail-item"><span>Алгоритм:</span> <span>${details.algorithm === 'binary_search' ? 'Бинарный поиск' : 'Линейный поиск'}</span></div>` : ''}
                        ${details.paymentEfficiency ? `<div class="detail-item"><span>Эффективность платежа:</span> <span>${formatPercentage(details.paymentEfficiency)}</span></div>` : ''}
                        ${details.termEfficiency ? `<div class="detail-item"><span>Эффективность срока:</span> <span>${formatPercentage(details.termEfficiency)}</span></div>` : ''}
                        ${details.overpaymentEfficiency ? `<div class="detail-item"><span>Эффективность переплаты:</span> <span>${formatPercentage(details.overpaymentEfficiency)}</span></div>` : ''}
                        ${details.warning ? `<div class="detail-item warning"><span>⚠️ ${details.warning}</span></div>` : ''}
                        ${details.error ? `<div class="detail-item error"><span>❌ ${details.error}</span></div>` : ''}
                    </div>
                </div>
            `;
        }

        budgetResultsSection.innerHTML = `
            <div class="budget-optimization-header">
                <h3>🎯 Результаты оптимизации по бюджету</h3>
                <div class="budget-utilization ${budgetUtilizationClass}">
                    <div class="utilization-bar">
                        <div class="utilization-fill" style="width: ${Math.min(budgetUtilization, 100)}%"></div>
                    </div>
                    <span class="utilization-text">${budgetUtilizationText} (${formatPercentage(budgetUtilization)})</span>
                </div>
            </div>
            
            <div class="budget-results-grid">
                <div class="budget-result-item primary">
                    <span class="budget-label">📅 Оптимальный срок:</span>
                    <span class="budget-value">${formatTerm(optimizedResults.optimizedTerm)}</span>
                </div>
                <div class="budget-result-item primary">
                    <span class="budget-label">💰 Ежемесячный платеж:</span>
                    <span class="budget-value">${monthlyPaymentText}</span>
                </div>
                <div class="budget-result-item">
                    <span class="budget-label">💳 Всего к выплате:</span>
                    <span class="budget-value">${formatCurrency(optimizedResults.optimizedTotalPayments)}</span>
                </div>
                <div class="budget-result-item">
                    <span class="budget-label">📊 Переплата:</span>
                    <span class="budget-value">${formatCurrency(optimizedResults.optimizedOverpayment)}</span>
                </div>
                <div class="budget-result-item">
                    <span class="budget-label">🎯 Приоритет оптимизации:</span>
                    <span class="budget-value">${this.getOptimizationPriorityText(optimizedResults.optimizationPriority)}</span>
                </div>
                <div class="budget-result-item">
                    <span class="budget-label">💵 Максимальный бюджет:</span>
                    <span class="budget-value">${formatCurrency(optimizedResults.maxBudget)}</span>
                </div>
            </div>
            
            ${optimizationDetailsHTML}
            
            <div class="budget-recommendations">
                <h4>💡 Рекомендации:</h4>
                <ul>
                    ${this.generateBudgetRecommendations(optimizedResults)}
                </ul>
            </div>
        `;

        // Добавляем стили для новых элементов
        this.addBudgetOptimizationStyles();
    }

    getOptimizationPriorityText(priority) {
        const priorityTexts = {
            'minimize-term': 'Минимизация срока кредита',
            'minimize-payment': 'Минимизация ежемесячного платежа',
            'minimize-overpayment': 'Минимизация переплаты'
        };
        return priorityTexts[priority] || priority;
    }

    generateBudgetRecommendations(optimizedResults) {
        const recommendations = [];
        const budgetUtilization = optimizedResults.budgetUtilization || 0;
        const overpaymentPercentage = (optimizedResults.optimizedOverpayment / (optimizedResults.optimizedTotalPayments - optimizedResults.optimizedOverpayment)) * 100;

        // Рекомендации по использованию бюджета
        if (budgetUtilization > 95) {
            recommendations.push('<li>🎯 <strong>Отличное использование бюджета!</strong> Ваш максимальный платеж практически полностью задействован.</li>');
        } else if (budgetUtilization > 80) {
            recommendations.push('<li>✅ <strong>Хорошее использование бюджета.</strong> У вас есть небольшой резерв для непредвиденных расходов.</li>');
        } else {
            recommendations.push('<li>💡 <strong>Есть резерв в бюджете.</strong> Вы можете рассмотреть увеличение суммы кредита или сокращение срока.</li>');
        }

        // Рекомендации по переплате
        if (overpaymentPercentage > 50) {
            recommendations.push('<li>⚠️ <strong>Высокая переплата.</strong> Рассмотрите возможность увеличения первоначального взноса или поиска более выгодных условий.</li>');
        } else if (overpaymentPercentage > 30) {
            recommendations.push('<li>📊 <strong>Средняя переплата.</strong> Стандартные условия кредитования.</li>');
        } else {
            recommendations.push('<li>✅ <strong>Низкая переплата.</strong> Отличные условия кредитования!</li>');
        }

        // Рекомендации по сроку кредита
        if (optimizedResults.optimizedTerm > 300) { // Более 25 лет
            recommendations.push('<li>⏰ <strong>Долгий срок кредита.</strong> Рассмотрите возможность досрочного погашения для экономии на процентах.</li>');
        } else if (optimizedResults.optimizedTerm > 180) { // Более 15 лет
            recommendations.push('<li>📅 <strong>Средний срок кредита.</strong> Умеренная финансовая нагрузка.</li>');
        } else {
            recommendations.push('<li>🚀 <strong>Короткий срок кредита.</strong> Быстрое погашение с минимальной переплатой.</li>');
        }

        // Рекомендации по приоритету
        switch (optimizedResults.optimizationPriority) {
            case 'minimize-term':
                recommendations.push('<li>⚡ <strong>Приоритет: минимальный срок.</strong> Кредит будет погашен максимально быстро.</li>');
                break;
            case 'minimize-payment':
                recommendations.push('<li>💰 <strong>Приоритет: минимальный платеж.</strong> Минимальная ежемесячная нагрузка на бюджет.</li>');
                break;
            case 'minimize-overpayment':
                recommendations.push('<li>🎯 <strong>Приоритет: минимальная переплата.</strong> Оптимальное соотношение срока и стоимости.</li>');
                break;
        }

        // Общие рекомендации
        recommendations.push('<li>📋 <strong>Регулярно отслеживайте</strong> график платежей и возможности досрочного погашения.</li>');
        recommendations.push('<li>💳 <strong>Создайте финансовую подушку</strong> на случай непредвиденных обстоятельств.</li>');

        return recommendations.join('');
    }

    showBudgetOptimizationHelp() {
        const helpModal = this.createModal('💡 Как работает оптимизация по бюджету', `
            <div class="budget-help-content">
                <div class="help-section">
                    <h4>🎯 Что это такое?</h4>
                    <p>Оптимизация по бюджету помогает найти оптимальные условия кредита, исходя из максимальной суммы, которую вы можете платить ежемесячно.</p>
                </div>
                
                <div class="help-section">
                    <h4>📊 Приоритеты оптимизации:</h4>
                    <ul>
                        <li><strong>Минимизировать срок кредита</strong> - кредит будет погашен максимально быстро</li>
                        <li><strong>Минимизировать ежемесячный платеж</strong> - минимальная нагрузка на бюджет</li>
                        <li><strong>Минимизировать переплату</strong> - оптимальное соотношение срока и стоимости</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <h4>💡 Как использовать:</h4>
                    <ol>
                        <li>Введите максимальный ежемесячный платеж</li>
                        <li>Выберите приоритет оптимизации</li>
                        <li>Нажмите "Рассчитать"</li>
                        <li>Изучите результаты и рекомендации</li>
                    </ol>
                </div>
                
                <div class="help-section">
                    <h4>⚠️ Важно помнить:</h4>
                    <ul>
                        <li>Учитывайте непредвиденные расходы</li>
                        <li>Оставляйте резерв в бюджете</li>
                        <li>Регулярно отслеживайте график платежей</li>
                    </ul>
                </div>
            </div>
        `, () => {});
        
        // Убираем кнопку "Добавить" для модального окна помощи
        const saveButton = helpModal.querySelector('.save-modal');
        if (saveButton) {
            saveButton.style.display = 'none';
        }
        
        document.body.appendChild(helpModal);
    }

    updateBudgetValidation(input) {
        const value = this.parseNumber(input.value);
        const loanAmount = this.parseNumber(document.getElementById('loan-amount')?.value || '0');
        const monthlyRate = this.parseNumber(document.getElementById('interest-rate')?.value || '0') / 12 / 100;
        
        // Убираем предыдущие сообщения об ошибках
        const existingError = input.parentNode.querySelector('.validation-error');
        if (existingError) {
            existingError.remove();
        }
        
        if (value > 0) {
            // Проверяем минимально возможный платеж
            const minPayment = loanAmount * monthlyRate;
            if (value < minPayment) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'validation-error';
                errorDiv.innerHTML = `⚠️ Минимально возможный платеж: ${this.formatCurrency(minPayment)}`;
                input.parentNode.appendChild(errorDiv);
            }
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    showInputHint(input, message) {
        // Убираем предыдущие подсказки
        const existingHint = document.querySelector('.input-hint');
        if (existingHint) {
            existingHint.remove();
        }
        
        const hint = document.createElement('div');
        hint.className = 'input-hint';
        hint.textContent = message;
        hint.style.cssText = `
            position: absolute;
            background: #007bff;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.85rem;
            z-index: 1000;
            max-width: 250px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: fadeIn 0.3s ease;
        `;
        
        const rect = input.getBoundingClientRect();
        hint.style.top = `${rect.bottom + 5}px`;
        hint.style.left = `${rect.left}px`;
        
        document.body.appendChild(hint);
        
        // Убираем подсказку через 3 секунды или при потере фокуса
        setTimeout(() => hint.remove(), 3000);
        input.addEventListener('blur', () => hint.remove(), { once: true });
    }

    updatePriorityDescription() {
        const prioritySelect = document.getElementById('optimization-priority');
        const descriptionDiv = document.getElementById('priority-description');
        
        if (!prioritySelect || !descriptionDiv) return;
        
        const descriptions = {
            'minimize-term': 'Кредит будет погашен максимально быстро, но ежемесячные платежи будут выше.',
            'minimize-payment': 'Минимальная нагрузка на бюджет, но срок кредита будет дольше.',
            'minimize-overpayment': 'Оптимальное соотношение между сроком кредита и общей стоимостью.'
        };
        
        descriptionDiv.textContent = descriptions[prioritySelect.value] || '';
    }

    showPriorityHint() {
        const prioritySelect = document.getElementById('optimization-priority');
        if (!prioritySelect) return;
        
        const hints = {
            'minimize-term': 'Выберите этот приоритет, если хотите погасить кредит как можно быстрее.',
            'minimize-payment': 'Выберите этот приоритет, если важно минимизировать ежемесячную нагрузку.',
            'minimize-overpayment': 'Выберите этот приоритет для оптимального соотношения срока и стоимости.'
        };
        
        const currentHint = hints[prioritySelect.value];
        if (currentHint) {
            this.showInputHint(prioritySelect, currentHint);
        }
    }

    addBudgetOptimizationStyles() {
        // Проверяем, не добавлены ли уже стили
        if (document.getElementById('budget-optimization-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'budget-optimization-styles';
        style.textContent = `
            .budget-optimization-results {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border: 1px solid #dee2e6;
                border-radius: 12px;
                padding: 24px;
                margin: 20px 0;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }

            .budget-optimization-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
                gap: 16px;
            }

            .budget-optimization-header h3 {
                margin: 0;
                color: #2c3e50;
                font-size: 1.4rem;
                font-weight: 600;
            }

            .budget-utilization {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 16px;
                border-radius: 20px;
                background: white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .budget-utilization.low {
                border-left: 4px solid #28a745;
            }

            .budget-utilization.medium {
                border-left: 4px solid #ffc107;
            }

            .budget-utilization.high {
                border-left: 4px solid #dc3545;
            }

            .utilization-bar {
                width: 60px;
                height: 8px;
                background: #e9ecef;
                border-radius: 4px;
                overflow: hidden;
            }

            .utilization-fill {
                height: 100%;
                background: linear-gradient(90deg, #28a745, #20c997);
                transition: width 0.3s ease;
            }

            .budget-utilization.high .utilization-fill {
                background: linear-gradient(90deg, #dc3545, #fd7e14);
            }

            .budget-utilization.medium .utilization-fill {
                background: linear-gradient(90deg, #ffc107, #fd7e14);
            }

            .utilization-text {
                font-size: 0.9rem;
                font-weight: 500;
                color: #495057;
                white-space: nowrap;
            }

            .budget-results-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 16px;
                margin-bottom: 20px;
            }

            .budget-result-item {
                background: white;
                padding: 16px;
                border-radius: 8px;
                border: 1px solid #dee2e6;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.3s ease;
            }

            .budget-result-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }

            .budget-result-item.primary {
                background: linear-gradient(135deg, #007bff, #0056b3);
                color: white;
                border-color: #0056b3;
            }

                    .budget-result-item.primary .budget-label,
        .budget-result-item.primary .budget-value {
            color: white;
        }

        /* Credit holidays styles */
        .result-label-7,
        .result-value-7 {
            display: inline-block;
            margin: 8px 0;
            padding: 8px 12px;
            background: linear-gradient(135deg, #e3f2fd, #bbdefb);
            border-radius: 8px;
            border-left: 4px solid #2196f3;
        }

        .result-label-7 {
            font-weight: 600;
            color: #1976d2;
            margin-right: 8px;
        }

        .result-value-7 {
            color: #1565c0;
            font-weight: 500;
        }

        #mobile-credit-holidays {
            background: linear-gradient(135deg, #e3f2fd, #bbdefb);
            border-left: 4px solid #2196f3;
            border-radius: 8px;
        }

        #mobile-credit-holidays .mobile-label {
            color: #1976d2;
            font-weight: 600;
        }

        #mobile-credit-holidays .mobile-value {
            color: #1565c0;
            font-weight: 500;
        }

            .budget-label {
                font-weight: 500;
                color: #495057;
                font-size: 0.95rem;
            }

            .budget-value {
                font-weight: 600;
                color: #2c3e50;
                font-size: 1rem;
            }

            .optimization-details {
                background: white;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                border: 1px solid #dee2e6;
            }

            .optimization-details h4 {
                margin: 0 0 16px 0;
                color: #2c3e50;
                font-size: 1.1rem;
                font-weight: 600;
            }

            .details-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 12px;
            }

            .detail-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background: #f8f9fa;
                border-radius: 6px;
                font-size: 0.9rem;
            }

            .detail-item.warning {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
            }

            .detail-item.error {
                background: #f8d7da;
                border: 1px solid #f5c6cb;
                color: #721c24;
            }

            .budget-recommendations {
                background: white;
                border-radius: 8px;
                padding: 20px;
                border: 1px solid #dee2e6;
            }

            .budget-recommendations h4 {
                margin: 0 0 16px 0;
                color: #2c3e50;
                font-size: 1.1rem;
                font-weight: 600;
            }

            .budget-recommendations ul {
                margin: 0;
                padding-left: 20px;
            }

            .budget-recommendations li {
                margin-bottom: 8px;
                line-height: 1.5;
                color: #495057;
            }

            .budget-recommendations li:last-child {
                margin-bottom: 0;
            }

            @media (max-width: 768px) {
                .budget-optimization-header {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .budget-results-grid {
                    grid-template-columns: 1fr;
                }

                .details-grid {
                    grid-template-columns: 1fr;
                }

                .budget-utilization {
                    width: 100%;
                    justify-content: space-between;
                }
            }

            /* Стили для подсказок и валидации */
            .input-hint {
                position: absolute;
                background: #007bff;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.85rem;
                z-index: 1000;
                max-width: 250px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: fadeIn 0.3s ease;
            }

            .validation-error {
                color: #dc3545;
                font-size: 0.85rem;
                margin-top: 4px;
                padding: 4px 8px;
                background: #f8d7da;
                border: 1px solid #f5c6cb;
                border-radius: 4px;
            }

            .priority-description {
                font-size: 0.9rem;
                color: #6c757d;
                margin-top: 8px;
                padding: 8px 12px;
                background: #f8f9fa;
                border-radius: 4px;
                border-left: 3px solid #007bff;
            }

            /* Стили для модального окна помощи */
            .budget-help-content {
                max-height: 60vh;
                overflow-y: auto;
            }

            .help-section {
                margin-bottom: 20px;
            }

            .help-section h4 {
                color: #2c3e50;
                margin-bottom: 8px;
                font-size: 1.1rem;
            }

            .help-section p {
                margin-bottom: 8px;
                line-height: 1.5;
                color: #495057;
            }

            .help-section ul, .help-section ol {
                margin: 8px 0;
                padding-left: 20px;
            }

            .help-section li {
                margin-bottom: 4px;
                line-height: 1.4;
                color: #495057;
            }

            /* Стили для кнопки помощи */
            .help-btn {
                background: #007bff;
                color: white;
                border: none;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
                margin-left: 8px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .help-btn:hover {
                background: #0056b3;
                transform: scale(1.1);
            }

            .help-btn:focus {
                outline: none;
                box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
            }



            /* Анимации */
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
        `;

        document.head.appendChild(style);
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

    shareCalculation() {
        const url = new URL(window.location);
        
        try {
            const formData = this.getFormData();

            // Add all parameters to URL
            const loanAmountInput = document.getElementById('loan-amount');
            const loanTermInput = document.getElementById('loan-term');
            const termTypeSelect = document.getElementById('term-type');
            const interestRateInput = document.getElementById('interest-rate');
            const rateTypeSelect = document.getElementById('rate-type');
            const ratePeriodSelect = document.getElementById('rate-period');
            const paymentTypeSelect = document.getElementById('payment-type');
            const loanDateInput = document.getElementById('loan-date');
            const considerInflationCheckbox = document.getElementById('consider-inflation');

            if (loanAmountInput && loanTermInput && interestRateInput && paymentTypeSelect) {
                url.searchParams.set('amount', loanAmountInput.value);
                url.searchParams.set('term', loanTermInput.value);
                url.searchParams.set('termType', termTypeSelect ? termTypeSelect.value : 'months');
                url.searchParams.set('rate', interestRateInput.value);
                url.searchParams.set('rateType', rateTypeSelect ? rateTypeSelect.value : 'fixed');
                url.searchParams.set('ratePeriod', ratePeriodSelect ? ratePeriodSelect.value : 'year');
                url.searchParams.set('type', paymentTypeSelect.value);
                url.searchParams.set('date', loanDateInput ? loanDateInput.value : '');
                url.searchParams.set('inflation', considerInflationCheckbox ? considerInflationCheckbox.checked : false);
            }

            navigator.clipboard.writeText(url.toString()).then(() => {
                this.showNotification('Ссылка скопирована в буфер обмена!');
            }).catch(() => {
                prompt('Скопируйте ссылку:', url.toString());
            });
        } catch (error) {
            console.error('Error sharing calculation:', error);
            this.showNotification('Ошибка при создании ссылки', 'error');
        }
    }

    exportToPDF() {
        try {
            const formData = this.getFormData();
            const results = this.performCalculation(formData);
            
            const printWindow = window.open('', '_blank');
            const formatCurrency = (amount) => {
                return new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(amount);
            };

            const formatDate = (date) => {
                return date.toLocaleDateString('ru-RU');
            };

            let tableHTML = '';
            if (results.schedule && results.schedule.length > 0) {
                tableHTML = `
                    <table style="border-collapse: collapse; width: 100%; margin: 20px 0; font-size: 12px;">
                        <thead>
                            <tr style="background-color: #4CAF50; color: white;">
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">№</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Дата</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Платеж</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Основной долг</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Проценты</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Остаток</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                results.schedule.forEach(payment => {
                    tableHTML += `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${payment.month}</td>
                            <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${formatDate(payment.date)}</td>
                            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${formatCurrency(payment.payment)}</td>
                            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${formatCurrency(payment.principalPayment)}</td>
                            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${formatCurrency(payment.interestPayment)}</td>
                            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${formatCurrency(payment.remainingBalance)}</td>
                        </tr>
                    `;
                });
                
                tableHTML += '</tbody></table>';
            }

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Расчёт кредита - FINCALCULATOR.RU</title>
                        <style>
                            body { 
                                font-family: 'Arial', sans-serif; 
                                margin: 20px; 
                                line-height: 1.6;
                                color: #333;
                            }
                            .header { 
                                text-align: center; 
                                border-bottom: 2px solid #4CAF50; 
                                padding-bottom: 10px; 
                                margin-bottom: 20px;
                            }
                            .summary { 
                                background-color: #f9f9f9; 
                                padding: 15px; 
                                border-radius: 5px; 
                                margin: 20px 0;
                            }
                            .summary-row { 
                                display: flex; 
                                justify-content: space-between; 
                                margin: 5px 0;
                            }
                            .label { font-weight: bold; }
                            .value { text-align: right; }
                            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #4CAF50; color: white; }
                            .footer { 
                                margin-top: 30px; 
                                text-align: center; 
                                font-size: 12px; 
                                color: #666;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>Расчёт кредита</h1>
                            <p>FINCALCULATOR.RU</p>
                            <p>Дата расчёта: ${new Date().toLocaleDateString('ru-RU')}</p>
                        </div>
                        
                        <div class="summary">
                            <h3>Параметры кредита:</h3>
                            <div class="summary-row">
                                <span class="label">Сумма кредита:</span>
                                <span class="value">${formatCurrency(formData.loanAmount)}</span>
                            </div>
                            <div class="summary-row">
                                <span class="label">Срок кредита:</span>
                                <span class="value">${formData.termInMonths} месяцев</span>
                            </div>
                            <div class="summary-row">
                                <span class="label">Процентная ставка:</span>
                                <span class="value">${formData.monthlyRate * 12 * 100}% годовых</span>
                            </div>
                            <div class="summary-row">
                                <span class="label">Тип платежей:</span>
                                <span class="value">${formData.paymentType === 'annuity' ? 'Аннуитетные' : 'Дифференцированные'}</span>
                            </div>
                            ${formData.creditHolidays && formData.creditHolidaysAmount > 0 ? `
                            <div class="summary-row">
                                <span class="label">Кредитные каникулы:</span>
                                <span class="value">Первые ${formData.creditHolidaysUnit === 'лет' ? 
                                    formData.creditHolidaysAmount * 12 : formData.creditHolidaysAmount} 
                                    ${formData.creditHolidaysUnit === 'лет' ? 
                                        (formData.creditHolidaysAmount * 12 === 1 ? 'месяц' : formData.creditHolidaysAmount * 12 < 5 ? 'месяца' : 'месяцев') : 
                                        (formData.creditHolidaysAmount === 1 ? 'месяц' : formData.creditHolidaysAmount < 5 ? 'месяца' : 'месяцев')} - только проценты</span>
                            </div>
                            ` : ''}
                        </div>
                        
                        <div class="summary">
                            <h3>Результаты расчёта:</h3>
                            <div class="summary-row">
                                <span class="label">Ежемесячный платеж:</span>
                                <span class="value">${typeof results.monthlyPayment === 'object' ? 
                                    `${formatCurrency(results.monthlyPayment.first)} - ${formatCurrency(results.monthlyPayment.last)}` : 
                                    formatCurrency(results.monthlyPayment)}</span>
                            </div>
                            <div class="summary-row">
                                <span class="label">Общая сумма платежей:</span>
                                <span class="value">${formatCurrency(results.totalPayments)}</span>
                            </div>
                            <div class="summary-row">
                                <span class="label">Переплата:</span>
                                <span class="value">${formatCurrency(results.overpayment)} (${results.overpaymentPercentage.toFixed(2)}%)</span>
                            </div>
                        </div>
                        
                        <h3>График платежей:</h3>
                        ${tableHTML}
                        
                        <div class="footer">
                            <p>Расчёт выполнен на сайте FINCALCULATOR.RU</p>
                            <p>Данный документ является предварительным расчётом и не является офертой</p>
                        </div>
                    </body>
                </html>
            `);

            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
            }, 500);
            
            this.showNotification('PDF готов к печати!');
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            this.showNotification('Ошибка при создании PDF', 'error');
        }
    }

    exportToExcel() {
        try {
            // Проверяем, загружена ли библиотека SheetJS
            if (typeof XLSX === 'undefined') {
                console.error('SheetJS library not loaded, trying to load it dynamically');
                this.loadSheetJSAndExport();
                return;
            }
            
            console.log('Starting Excel export...');
            
            // Проверяем, есть ли уже рассчитанные результаты
            let results = this.currentResults;
            let formData = this.currentFormData;
            
            // Если результатов нет, выполняем расчет
            if (!results || !formData) {
                console.log('No existing results, performing calculation...');
                formData = this.getFormData();
                results = this.performCalculation(formData);
                
                // Сохраняем результаты для повторного использования
                this.currentResults = results;
                this.currentFormData = formData;
            }
            
            console.log('Form data for export:', formData);
            console.log('Results for export:', results);
            console.log('Schedule length for export:', results.schedule ? results.schedule.length : 'undefined');
            console.log('First payment example:', results.schedule ? results.schedule[0] : 'no schedule');
            
            console.log('Form data for export:', formData);
            console.log('Results for export:', results);
            console.log('Schedule length for export:', results.schedule ? results.schedule.length : 'undefined');
            console.log('First payment example:', results.schedule ? results.schedule[0] : 'no schedule');
            
            // Создаем новую книгу Excel
            const workbook = XLSX.utils.book_new();
            
            // Функция форматирования валюты
            const formatCurrency = (amount) => {
                return new Intl.NumberFormat('ru-RU', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(amount);
            };
            
            // Функция форматирования даты
            const formatDate = (date) => {
                return date.toLocaleDateString('ru-RU');
            };
            
            // Создаем один лист со всеми данными
            const allData = [
                ['РАСЧЁТ КРЕДИТА - FINCALCULATOR.RU'],
                [''],
                ['Дата расчёта:', new Date().toLocaleDateString('ru-RU')],
                [''],
                ['ПАРАМЕТРЫ КРЕДИТА'],
                ['Параметр', 'Значение'],
                ['Сумма кредита', `${formatCurrency(formData.loanAmount)} ₽`],
                ['Срок кредита', `${formData.termInMonths} месяцев`],
                ['Процентная ставка', `${(formData.monthlyRate * 12 * 100).toFixed(2)}% годовых`],
                ['Тип платежей', formData.paymentType === 'annuity' ? 'Аннуитетные' : 'Дифференцированные'],
                ['Вид ставки', formData.rateType === 'fixed' ? 'Фиксированная' : 'Плавающая'],
                ['Дата начала кредита', formatDate(formData.loanDate)],
                ['Учёт инфляции', formData.considerInflation ? 'Да' : 'Нет']
            ];
            
            // Добавляем информацию о кредитных каникулах, если они есть
            if (formData.creditHolidays && formData.creditHolidaysAmount > 0) {
                const holidayMonths = formData.creditHolidaysUnit === 'лет' ? 
                    formData.creditHolidaysAmount * 12 : formData.creditHolidaysAmount;
                allData.push(['Кредитные каникулы', `Первые ${holidayMonths} ${formData.creditHolidaysUnit === 'лет' ? 
                    (holidayMonths === 1 ? 'месяц' : holidayMonths < 5 ? 'месяца' : 'месяцев') : 
                    (formData.creditHolidaysAmount === 1 ? 'месяц' : creditHolidaysAmount < 5 ? 'месяца' : 'месяцев')} - только проценты`]);
            }
            
            // Добавляем расширенные параметры, если они есть
            if (results.totalCommission > 0) {
                allData.push(['Комиссии', `${formatCurrency(results.totalCommission)} ₽`]);
            }
            
            // Добавляем пустые строки перед результатами
            allData.push([''], ['']);
            
            // Добавляем результаты расчета
            allData.push(['РЕЗУЛЬТАТЫ РАСЧЁТА']);
            allData.push(['']);
            allData.push(['Параметр', 'Значение']);
            allData.push(['Сумма кредита', `${formatCurrency(results.loanAmount)} ₽`]);
            allData.push(['Срок кредита', `${results.termInMonths} месяцев`]);
            allData.push(['Процентная ставка', `${(formData.monthlyRate * 12 * 100).toFixed(2)}% годовых`]);
            allData.push(['Тип платежей', formData.paymentType === 'annuity' ? 'Аннуитетные' : 'Дифференцированные']);
            allData.push(['']);
            allData.push(['Ежемесячный платеж', typeof results.monthlyPayment === 'object' ? 
                `${formatCurrency(results.monthlyPayment.first)} - ${formatCurrency(results.monthlyPayment.last)} ₽` : 
                `${formatCurrency(results.monthlyPayment)} ₽`]);
            allData.push(['Общая сумма платежей', `${formatCurrency(results.totalPayments)} ₽`]);
            allData.push(['Переплата', `${formatCurrency(results.overpayment)} ₽ (${results.overpaymentPercentage.toFixed(2)}%)`]);
            allData.push(['Полная стоимость кредита', `${results.totalCostPercentage.toFixed(3)}%`]);
            
            if (formData.considerInflation && results.inflationAdjustedOverpayment !== null) {
                allData.push(['Переплата с учётом инфляции', `${formatCurrency(results.inflationAdjustedOverpayment)} ₽ (${results.inflationAdjustedOverpaymentPercentage.toFixed(2)}%)`]);
                allData.push(['Общая сумма с учётом инфляции', `${formatCurrency(results.totalInflationAdjustedPayments)} ₽`]);
            }
            
            // Добавляем информацию о комиссиях, если они есть
            if (results.totalCommission > 0) {
                allData.push(['']);
                allData.push(['Комиссии', `${formatCurrency(results.totalCommission)} ₽`]);
            }
            
            // Добавляем пустые строки перед графиком платежей
            allData.push([''], ['']);
            
            // Добавляем заголовок графика платежей
            allData.push(['ГРАФИК ПЛАТЕЖЕЙ']);
            allData.push(['']);
            
            // Заголовки для графика платежей
            const scheduleHeaders = ['№', 'Дата', 'Сумма', 'Сумма с учетом инфляции', 'Погашение основного долга', 'Выплата % процентов', 'Остаток', 'Остаток с учетом инфляции', 'Описание'];
            
            // Если инфляция не учитывается, убираем колонки с инфляцией
            if (!formData.considerInflation) {
                scheduleHeaders = ['№', 'Дата', 'Сумма', 'Погашение основного долга', 'Выплата % процентов', 'Остаток', 'Описание'];
            }
            
            // Добавляем заголовки в общий массив
            allData.push(scheduleHeaders);
            
            console.log('Creating schedule data, headers:', scheduleHeaders);
            console.log('Processing', results.schedule.length, 'payments');
            
            results.schedule.forEach((payment, index) => {
                console.log(`Processing payment ${index + 1}:`, payment);
                // Формируем описание платежа
                const month = payment.date.getMonth() + 1;
                const year = payment.date.getFullYear();
                const descriptionDate = `${month.toString().padStart(2, '0')}/${year}`;
                let description = `Ежемесячный платеж за ${descriptionDate}`;
                
                // Добавляем информацию о досрочном погашении
                if (payment.additionalPayment && payment.additionalPayment > 0) {
                    description += ` + досрочное погашение ${formatCurrency(payment.additionalPayment)}`;
                }
                
                let row;
                
                if (formData.considerInflation) {
                    row = [
                        payment.month,
                        formatDate(payment.date),
                        Number(payment.payment) || 0,
                        Number(payment.inflationAdjustedPayment) || 0,
                        Number(payment.principalPayment) || 0,
                        Number(payment.interestPayment) || 0,
                        Number(payment.remainingBalance) || 0,
                        Number(payment.inflationAdjustedBalance) || 0,
                        description
                    ];
                } else {
                    row = [
                        payment.month,
                        formatDate(payment.date),
                        Number(payment.payment) || 0,
                        Number(payment.principalPayment) || 0,
                        Number(payment.interestPayment) || 0,
                        Number(payment.remainingBalance) || 0,
                        description
                    ];
                }
                
                allData.push(row);
            });
            
            // Добавляем итоговую строку
            let totalRow;
            
            if (formData.considerInflation) {
                totalRow = [
                    'ИТОГО',
                    '',
                    results.totalPayments,
                    results.totalInflationAdjustedPayments || 0,
                    results.loanAmount,
                    results.overpayment,
                    0,
                    0,
                    'Общая сумма всех платежей'
                ];
            } else {
                totalRow = [
                    'ИТОГО',
                    '',
                    results.totalPayments,
                    results.loanAmount,
                    results.overpayment,
                    0,
                    'Общая сумма всех платежей'
                ];
            }
            
            allData.push(totalRow);
            
            console.log('Final data length:', allData.length);
            console.log('Total row:', totalRow);
            
            // Создаем один лист со всеми данными
            const allDataSheet = XLSX.utils.aoa_to_sheet(allData);
            
            // Настройка стилей и форматирования
            const range = XLSX.utils.decode_range(allDataSheet['!ref']);
            
            // Форматирование заголовка "РАСЧЁТ КРЕДИТА - FINCALCULATOR.RU"
            const titleCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
            if (allDataSheet[titleCell]) {
                allDataSheet[titleCell].s = {
                    font: { bold: true, size: 16 },
                    alignment: { horizontal: "center" }
                };
            }
            
            // Форматирование заголовков "ПАРАМЕТРЫ КРЕДИТА" и "РЕЗУЛЬТАТЫ РАСЧЁТА"
            const paramsTitleCell = XLSX.utils.encode_cell({ r: 4, c: 0 });
            const resultsTitleCell = XLSX.utils.encode_cell({ r: 18, c: 0 });
            const scheduleTitleCell = XLSX.utils.encode_cell({ r: 32, c: 0 });
            
            if (allDataSheet[paramsTitleCell]) {
                allDataSheet[paramsTitleCell].s = {
                    font: { bold: true, size: 14 },
                    fill: { fgColor: { rgb: "E8F5E8" } }
                };
            }
            
            if (allDataSheet[resultsTitleCell]) {
                allDataSheet[resultsTitleCell].s = {
                    font: { bold: true, size: 14 },
                    fill: { fgColor: { rgb: "E8F5E8" } }
                };
            }
            
            if (allDataSheet[scheduleTitleCell]) {
                allDataSheet[scheduleTitleCell].s = {
                    font: { bold: true, size: 14 },
                    fill: { fgColor: { rgb: "E8F5E8" } }
                };
            }
            
            // Форматирование заголовков колонок графика платежей
            const scheduleHeadersRow = formData.considerInflation ? 34 : 34; // Строка с заголовками графика
            for (let col = 0; col < scheduleHeaders.length; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: scheduleHeadersRow, c: col });
                if (!allDataSheet[cellAddress]) continue;
                
                allDataSheet[cellAddress].s = {
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    fill: { fgColor: { rgb: "4CAF50" } },
                    alignment: { horizontal: "center" }
                };
            }
            
            // Форматирование числовых колонок в графике платежей
            let numericColumns;
            let inflationColumns;
            
            if (formData.considerInflation) {
                numericColumns = [2, 4, 5, 6]; // Сумма, Погашение основного долга, Выплата % процентов, Остаток
                inflationColumns = [3, 7]; // Сумма с учетом инфляции, Остаток с учетом инфляции
            } else {
                numericColumns = [2, 3, 4, 5]; // Сумма, Погашение основного долга, Выплата % процентов, Остаток
            }
            
            // Начинаем с строки после заголовков графика платежей
            const startRow = scheduleHeadersRow + 1;
            for (let row = startRow; row <= range.e.r; row++) {
                numericColumns.forEach(col => {
                    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                    if (allDataSheet[cellAddress]) {
                        allDataSheet[cellAddress].s = {
                            numFmt: '#,##0.00 ₽',
                            alignment: { horizontal: "right" }
                        };
                    }
                });
            }
            
            // Форматирование колонок с инфляцией
            if (formData.considerInflation && inflationColumns) {
                for (let row = startRow; row <= range.e.r; row++) {
                    inflationColumns.forEach(col => {
                        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                        if (allDataSheet[cellAddress] && allDataSheet[cellAddress].v !== '') {
                            allDataSheet[cellAddress].s = {
                                numFmt: '#,##0.00 ₽',
                                alignment: { horizontal: "right" },
                                fill: { fgColor: { rgb: "F0F8FF" } }
                            };
                        }
                    });
                }
            }
            
            // Форматирование итоговой строки
            const lastRow = range.e.r;
            for (let col = 0; col <= range.e.c; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: lastRow, c: col });
                if (allDataSheet[cellAddress]) {
                    allDataSheet[cellAddress].s = {
                        font: { bold: true, color: { rgb: "FFFFFF" } },
                        fill: { fgColor: { rgb: "2BB94C" } },
                        alignment: { horizontal: "center" }
                    };
                    
                    // Для числовых колонок применяем форматирование валюты
                    if (formData.considerInflation) {
                        if (col >= 2 && col <= 6) {
                            allDataSheet[cellAddress].s.numFmt = '#,##0.00 ₽';
                            allDataSheet[cellAddress].s.alignment.horizontal = "right";
                        }
                    } else {
                        if (col >= 2 && col <= 5) {
                            allDataSheet[cellAddress].s.numFmt = '#,##0.00 ₽';
                            allDataSheet[cellAddress].s.alignment.horizontal = "right";
                        }
                    }
                }
            }
            
            // Настройка ширины колонок для всего листа
            const maxCols = Math.max(...allData.map(row => row.length));
            const colWidths = [];
            
            for (let i = 0; i < maxCols; i++) {
                if (i === 0) colWidths.push({ width: 5 });   // №
                else if (i === 1) colWidths.push({ width: 12 });  // Дата
                else if (i === 2) colWidths.push({ width: 15 });  // Сумма
                else if (i === 3 && formData.considerInflation) colWidths.push({ width: 20 });  // Сумма с учетом инфляции
                else if (i === 3 || i === 4) colWidths.push({ width: 20 });  // Погашение основного долга
                else if (i === 4 || i === 5) colWidths.push({ width: 18 });  // Выплата % процентов
                else if (i === 5 || i === 6) colWidths.push({ width: 15 });  // Остаток
                else if (i === 6 || i === 7) colWidths.push({ width: 20 });  // Остаток с учетом инфляции
                else if (i === 7 || i === 8) colWidths.push({ width: 40 });  // Описание
                else colWidths.push({ width: 15 }); // По умолчанию
            }
            
            allDataSheet['!cols'] = colWidths;
            
            // Добавляем один лист со всеми данными в книгу
            XLSX.utils.book_append_sheet(workbook, allDataSheet, "Расчет кредита");
            
            // Генерируем файл и скачиваем
            const fileName = `credit_calculation_${new Date().toISOString().split('T')[0]}.xlsx`;
            console.log('Generating Excel file:', fileName);
            console.log('Workbook sheets:', workbook.SheetNames);
            console.log('All data sheet data range:', allDataSheet['!ref']);
            
            XLSX.writeFile(workbook, fileName);
            
            console.log('Excel file generated successfully');
            this.showNotification('Excel файл скачан!');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            console.error('Error details:', error.message);
            this.showNotification('Ошибка при создании Excel файла: ' + error.message, 'error');
        }
    }

    checkXLSXLibrary() {
        // Проверяем, загружена ли библиотека XLSX
        if (typeof XLSX !== 'undefined') {
            console.log('XLSX library is loaded');
        } else {
            console.warn('XLSX library not loaded, will load dynamically when needed');
        }
    }

    loadSheetJSAndExport() {
        // Пытаемся загрузить библиотеку динамически
        const script = document.createElement('script');
        script.src = 'xlsx.min.js';
        script.onload = () => {
            console.log('SheetJS loaded dynamically');
            this.exportToExcel();
        };
        script.onerror = () => {
            console.error('Failed to load SheetJS dynamically');
            this.showNotification('Ошибка загрузки библиотеки Excel', 'error');
        };
        document.head.appendChild(script);
    }

    createXLSXWithSheetJS() {
        try {
            const formData = this.getFormData();
            const results = this.performCalculation(formData);
            
            const formatCurrency = (amount) => {
                return new Intl.NumberFormat('ru-RU', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(amount);
            };
            
            const formatDate = (date) => {
                return date.toLocaleDateString('ru-RU');
            };

            // Создаем рабочую книгу
            const workbook = XLSX.utils.book_new();

            // Лист "Параметры"
            const paramsData = [
                ['Параметр', 'Значение'],
                ['Сумма кредита', `${formatCurrency(formData.loanAmount)} ₽`],
                ['Срок кредита', `${formData.termInMonths} месяцев`],
                ['Процентная ставка', `${(formData.monthlyRate * 12 * 100).toFixed(2)}% годовых`],
                ['Тип платежей', formData.paymentType === 'annuity' ? 'Аннуитетные' : 'Дифференцированные'],
                ['Вид ставки', formData.rateType === 'fixed' ? 'Фиксированная' : 'Плавающая'],
                ['Дата начала кредита', formatDate(formData.loanDate)],
                ['Учёт инфляции', formData.considerInflation ? 'Да' : 'Нет']
            ];
            
            if (results.totalCommission > 0) {
                paramsData.push(['Комиссии', `${formatCurrency(results.totalCommission)} ₽`]);
            }

            const paramsSheet = XLSX.utils.aoa_to_sheet(paramsData);
            XLSX.utils.book_append_sheet(workbook, paramsSheet, 'Параметры');

            // Лист "Результаты"
            const resultsData = [
                ['Параметр', 'Значение'],
                ['Ежемесячный платеж', typeof results.monthlyPayment === 'object' ? 
                    `${formatCurrency(results.monthlyPayment.first)} - ${formatCurrency(results.monthlyPayment.last)} ₽` : 
                    `${formatCurrency(results.monthlyPayment)} ₽`],
                ['Общая сумма платежей', `${formatCurrency(results.totalPayments)} ₽`],
                ['Переплата', `${formatCurrency(results.overpayment)} ₽ (${results.overpaymentPercentage.toFixed(2)}%)`],
                ['Полная стоимость кредита', `${results.totalCostPercentage.toFixed(3)}%`]
            ];
            
            if (formData.considerInflation && results.inflationAdjustedOverpayment !== null) {
                resultsData.push(['Переплата с учётом инфляции', 
                    `${formatCurrency(results.inflationAdjustedOverpayment)} ₽ (${results.inflationAdjustedOverpaymentPercentage.toFixed(2)}%)`]);
            }

            const resultsSheet = XLSX.utils.aoa_to_sheet(resultsData);
            XLSX.utils.book_append_sheet(workbook, resultsSheet, 'Результаты');

            // Лист "График платежей"
            const scheduleHeaders = ['№', 'Дата', 'Платеж (₽)', 'Основной долг (₽)', 'Проценты (₽)', 'Остаток (₽)'];
            
            if (formData.considerInflation) {
                scheduleHeaders.push('Платеж с учётом инфляции (₽)', 'Остаток с учётом инфляции (₽)');
            }

            const scheduleData = [scheduleHeaders];
            
            results.schedule.forEach(payment => {
                const row = [
                    payment.month,
                    formatDate(payment.date),
                    payment.payment.toFixed(2),
                    payment.principalPayment.toFixed(2),
                    payment.interestPayment.toFixed(2),
                    payment.remainingBalance.toFixed(2)
                ];
                
                if (formData.considerInflation && payment.inflationAdjustedPayment) {
                    row.push(
                        payment.inflationAdjustedPayment.toFixed(2),
                        payment.inflationAdjustedBalance ? payment.inflationAdjustedBalance.toFixed(2) : ''
                    );
                }
                
                scheduleData.push(row);
            });

            const scheduleSheet = XLSX.utils.aoa_to_sheet(scheduleData);
            XLSX.utils.book_append_sheet(workbook, scheduleSheet, 'График платежей');

            // Скачиваем файл
            const fileName = `credit_calculation_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(workbook, fileName);
            
            this.showNotification('Excel файл скачан!');
        } catch (error) {
            console.error('Error creating XLSX with SheetJS:', error);
            this.showNotification('Ошибка при создании Excel файла', 'error');
        }
    }

    exportToHTMLExcel() {
        try {
            // Если библиотека SheetJS доступна, используем её
            if (typeof XLSX !== 'undefined') {
                this.createXLSXWithSheetJS();
                return;
            }
            
            const formData = this.getFormData();
            const results = this.performCalculation(formData);
            
            const formatCurrency = (amount) => {
                return new Intl.NumberFormat('ru-RU', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(amount);
            };
            
            const formatDate = (date) => {
                return date.toLocaleDateString('ru-RU');
            };
            
            // Создаем HTML таблицу для Excel
            let htmlContent = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                    <meta charset="utf-8">
                    <title>Расчёт кредита - FINCALCULATOR.RU</title>
                    <style>
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                        th { background-color: #4CAF50; color: white; font-weight: bold; }
                        .header { background-color: #f0f0f0; font-weight: bold; }
                        .numeric { text-align: right; }
                        .date { text-align: center; }
                    </style>
                </head>
                <body>
                    <h1>Расчёт кредита - FINCALCULATOR.RU</h1>
                    <p>Дата расчёта: ${new Date().toLocaleDateString('ru-RU')}</p>
                    
                    <h2>Параметры кредита</h2>
                    <table>
                        <tr><td class="header">Параметр</td><td class="header">Значение</td></tr>
                        <tr><td>Сумма кредита</td><td>${formatCurrency(formData.loanAmount)} ₽</td></tr>
                        <tr><td>Срок кредита</td><td>${formData.termInMonths} месяцев</td></tr>
                        <tr><td>Процентная ставка</td><td>${(formData.monthlyRate * 12 * 100).toFixed(2)}% годовых</td></tr>
                        <tr><td>Тип платежей</td><td>${formData.paymentType === 'annuity' ? 'Аннуитетные' : 'Дифференцированные'}</td></tr>
                        <tr><td>Вид ставки</td><td>${formData.rateType === 'fixed' ? 'Фиксированная' : 'Плавающая'}</td></tr>
                        <tr><td>Дата начала кредита</td><td>${formatDate(formData.loanDate)}</td></tr>
                        <tr><td>Учёт инфляции</td><td>${formData.considerInflation ? 'Да' : 'Нет'}</td></tr>
            `;
            
            if (results.totalCommission > 0) {
                htmlContent += `<tr><td>Комиссии</td><td>${formatCurrency(results.totalCommission)} ₽</td></tr>`;
            }
            
            htmlContent += `
                    </table>
                    
                    <h2>Результаты расчёта</h2>
                    <table>
                        <tr><td class="header">Параметр</td><td class="header">Значение</td></tr>
                        <tr><td>Ежемесячный платеж</td><td>${typeof results.monthlyPayment === 'object' ? 
                            `${formatCurrency(results.monthlyPayment.first)} - ${formatCurrency(results.monthlyPayment.last)} ₽` : 
                            `${formatCurrency(results.monthlyPayment)} ₽`}</td></tr>
                        <tr><td>Общая сумма платежей</td><td>${formatCurrency(results.totalPayments)} ₽</td></tr>
                        <tr><td>Переплата</td><td>${formatCurrency(results.overpayment)} ₽ (${results.overpaymentPercentage.toFixed(2)}%)</td></tr>
                        <tr><td>Полная стоимость кредита</td><td>${results.totalCostPercentage.toFixed(3)}%</td></tr>
            `;
            
            if (formData.considerInflation && results.inflationAdjustedOverpayment !== null) {
                htmlContent += `<tr><td>Переплата с учётом инфляции</td><td>${formatCurrency(results.inflationAdjustedOverpayment)} ₽ (${results.inflationAdjustedOverpaymentPercentage.toFixed(2)}%)</td></tr>`;
            }
            
            htmlContent += `
                    </table>
                    
                    <h2>График платежей</h2>
                    <table>
                        <tr>
                            <th>№</th>
                            <th>Дата</th>
                            <th>Платеж (₽)</th>
                            <th>Основной долг (₽)</th>
                            <th>Проценты (₽)</th>
                            <th>Остаток (₽)</th>
            `;
            
            if (formData.considerInflation) {
                htmlContent += `
                            <th>Платеж с учётом инфляции (₽)</th>
                            <th>Остаток с учётом инфляции (₽)</th>
                `;
            }
            
            htmlContent += `</tr>`;
            
            results.schedule.forEach(payment => {
                htmlContent += `
                    <tr>
                        <td class="date">${payment.month}</td>
                        <td class="date">${formatDate(payment.date)}</td>
                        <td class="numeric">${payment.payment.toFixed(2)}</td>
                        <td class="numeric">${payment.principalPayment.toFixed(2)}</td>
                        <td class="numeric">${payment.interestPayment.toFixed(2)}</td>
                        <td class="numeric">${payment.remainingBalance.toFixed(2)}</td>
                `;
                
                if (formData.considerInflation && payment.inflationAdjustedPayment) {
                    htmlContent += `
                        <td class="numeric">${payment.inflationAdjustedPayment.toFixed(2)}</td>
                        <td class="numeric">${payment.inflationAdjustedBalance ? payment.inflationAdjustedBalance.toFixed(2) : ''}</td>
                    `;
                }
                
                htmlContent += `</tr>`;
            });
            
            htmlContent += `
                    </table>
                </body>
                </html>
            `;
            
            // Создаем blob и скачиваем файл
            const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `credit_calculation_${new Date().toISOString().split('T')[0]}.xls`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            this.showNotification('Excel файл скачан!');
        } catch (error) {
            console.error('Error exporting to HTML Excel:', error);
            this.exportToCSV();
        }
    }

    exportToCSV() {
        try {
            const formData = this.getFormData();
            const results = this.performCalculation(formData);
            
            let csvContent = "data:text/csv;charset=utf-8,";
            
            // Заголовок документа
            csvContent += "Расчёт кредита - FINCALCULATOR.RU\n";
            csvContent += `Дата расчёта: ${new Date().toLocaleDateString('ru-RU')}\n\n`;
            
            // Параметры кредита
            csvContent += "ПАРАМЕТРЫ КРЕДИТА\n";
            csvContent += "Параметр,Значение\n";
            csvContent += `Сумма кредита,${formData.loanAmount.toLocaleString('ru-RU')} ₽\n`;
            csvContent += `Срок кредита,${formData.termInMonths} месяцев\n`;
            csvContent += `Процентная ставка,${(formData.monthlyRate * 12 * 100).toFixed(2)}% годовых\n`;
            csvContent += `Тип платежей,${formData.paymentType === 'annuity' ? 'Аннуитетные' : 'Дифференцированные'}\n\n`;
            
            // Результаты расчёта
            csvContent += "РЕЗУЛЬТАТЫ РАСЧЁТА\n";
            csvContent += "Параметр,Значение\n";
            csvContent += `Ежемесячный платеж,${typeof results.monthlyPayment === 'object' ? 
                `${results.monthlyPayment.first.toLocaleString('ru-RU')} - ${results.monthlyPayment.last.toLocaleString('ru-RU')}` : 
                results.monthlyPayment.toLocaleString('ru-RU')} ₽\n`;
            csvContent += `Общая сумма платежей,${results.totalPayments.toLocaleString('ru-RU')} ₽\n`;
            csvContent += `Переплата,${results.overpayment.toLocaleString('ru-RU')} ₽ (${results.overpaymentPercentage.toFixed(2)}%)\n`;
            if (results.totalCommission > 0) {
                csvContent += `Комиссии,${results.totalCommission.toLocaleString('ru-RU')} ₽\n`;
            }
            csvContent += "\n";
            
            // График платежей
            csvContent += "ГРАФИК ПЛАТЕЖЕЙ\n";
            csvContent += "№,Дата,Платеж (₽),Основной долг (₽),Проценты (₽),Остаток (₽)";
            
            // Добавляем колонки с инфляцией, если они есть
            if (formData.considerInflation) {
                csvContent += ",Платеж с учетом инфляции (₽),Остаток с учетом инфляции (₽)";
            }
            csvContent += "\n";

            // Данные платежей
            results.schedule.forEach(payment => {
                let row = `${payment.month},${payment.date.toLocaleDateString('ru-RU')},${payment.payment.toFixed(2)},${payment.principalPayment.toFixed(2)},${payment.interestPayment.toFixed(2)},${payment.remainingBalance.toFixed(2)}`;
                
                if (formData.considerInflation && payment.inflationAdjustedPayment) {
                    row += `,${payment.inflationAdjustedPayment.toFixed(2)},${payment.inflationAdjustedBalance ? payment.inflationAdjustedBalance.toFixed(2) : ''}`;
                }
                
                csvContent += row + "\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `credit_calculation_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('CSV файл скачан!');
        } catch (error) {
            console.error('Error exporting to CSV:', error);
            this.showNotification('Ошибка при создании CSV файла', 'error');
        }
    }

    // Show commission modal
    showCommissionModal() {
        const modal = this.createModal('Добавить комиссию', `
            <div class="form-group">
                <label class="form-label">Название комиссии:</label>
                <input type="text" id="commissionParameters0.name" class="form-control" placeholder="Введите название комиссии">
            </div>
            <div class="form-group">
                <label class="form-label">Периодичность:</label>
                <select id="commissionParameters0.periodicityType" class="form-control">
                    <option value="1">Единовременно</option>
                    <option value="3">Ежемесячно</option>
                    <option value="2">Ежегодно</option>
                    <option value="4">При каждом платеже</option>
                    <option value="5">При досрочном погашении</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Сумма:</label>
                <input type="text" id="commissionParameters0.fixedAmount" class="form-control" placeholder="Введите сумму">
            </div>
            <div class="form-group">
                <label class="form-label">Тип суммы:</label>
                <select id="commissionParameters0.relativeAmountType" class="form-control">
                    <option value="-1">рублей</option>
                    <option value="1">% от суммы кредита</option>
                    <option value="2">% от остатка задолженности</option>
                    <option value="5">% от суммы кредита, увеличенного на</option>
                    <option value="6">% от остатка задолженности, увеличенной на</option>
                </select>
            </div>
            <div class="form-group" id="relative-rate-group" style="display: none;">
                <label class="form-label">Процент:</label>
                <input type="text" id="commissionParameters0.relativeRate" class="form-control" placeholder="Введите процент">
            </div>
            <div class="form-group" id="addition-percent-group" style="display: none;">
                <label class="form-label">Дополнительный процент:</label>
                <input type="text" id="commissionParameters0.relativeAdditionPercent" class="form-control" placeholder="Введите дополнительный процент">
            </div>
        `, () => {
            this.addCommission();
        });
        document.body.appendChild(modal);
    }

    // Show prepayment modal
    showPrepaymentModal() {
        const modal = this.createModal('Добавить досрочное погашение', `
            <div class="form-group">
                <label class="form-label">Дата досрочного погашения:</label>
                <input type="date" id="prepayment-date" class="form-control">
            </div>
            <div class="form-group">
                <label class="form-label">Сумма досрочного погашения:</label>
                <input type="text" id="prepayment-amount" class="form-control" placeholder="Введите сумму">
            </div>
            <div class="form-group">
                <label class="form-label">Тип досрочного погашения:</label>
                <select id="prepayment-type" class="form-control">
                    <option value="reduce-term">Сократить срок кредита</option>
                    <option value="reduce-payment">Уменьшить ежемесячный платеж</option>
                </select>
            </div>
        `, () => {
            this.addPrepayment();
        });
        document.body.appendChild(modal);
    }

    // Create modal helper
    createModal(title, content, onSave) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary close-modal">Отмена</button>
                    <button class="btn btn-primary save-modal">Добавить</button>
                </div>
            </div>
        `;

        // Event listeners
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });

        modal.querySelector('.save-modal').addEventListener('click', () => {
            onSave();
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        return modal;
    }

    // Add commission functionality
    addCommission() {
        const name = document.getElementById('commissionParameters0.name').value;
        const periodicityType = document.getElementById('commissionParameters0.periodicityType').value;
        const fixedAmount = document.getElementById('commissionParameters0.fixedAmount').value;
        const relativeRate = document.getElementById('commissionParameters0.relativeRate').value;
        const relativeAmountType = document.getElementById('commissionParameters0.relativeAmountType').value;
        const relativeAdditionPercent = document.getElementById('commissionParameters0.relativeAdditionPercent').value;

        if (!name) {
            this.showNotification('Пожалуйста, введите название комиссии', 'error');
            return;
        }

        // Store commission data
        if (!this.commissions) this.commissions = [];
        this.commissions.push({ 
            name, 
            periodicityType, 
            fixedAmount, 
            relativeRate, 
            relativeAmountType, 
            relativeAdditionPercent 
        });

        // Show success message
        this.showNotification('Комиссия добавлена успешно!');

        // Recalculate if results are visible
        if (!this.resultsSection.classList.contains('hidden')) {
            this.calculate();
        }
    }

    // Add prepayment functionality
    addPrepayment() {
        const date = document.getElementById('prepayment-date').value;
        const amount = document.getElementById('prepayment-amount').value;
        const type = document.getElementById('prepayment-type').value;

        if (!date || !amount) {
            this.showNotification('Пожалуйста, заполните все поля', 'error');
            return;
        }

        // Store prepayment data
        if (!this.prepayments) this.prepayments = [];
        this.prepayments.push({ date, amount: this.parseNumber(amount), type });

        // Show success message
        this.showNotification('Досрочное погашение добавлено успешно!');

        // Recalculate if results are visible
        if (!this.resultsSection.classList.contains('hidden')) {
            this.calculate();
        }
    }

    // Setup PWA install functionality
    setupPWAInstall() {
        let deferredPrompt;
        const installButton = document.getElementById('install-pwa');

        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            // Show install button
            if (installButton) {
                installButton.style.display = 'flex';
                installButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.installPWA(deferredPrompt);
                });
            }
        });

        // Handle successful installation
        window.addEventListener('appinstalled', () => {
            console.log('PWA установлено успешно');
            this.showNotification('Приложение установлено на рабочий стол!');
            deferredPrompt = null;
        });

        // For browsers that don't support PWA install
        if (installButton && !window.matchMedia('(display-mode: standalone)').matches) {
            installButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.showInstallInstructions();
            });
        }
    }

    // Install PWA
    async installPWA(deferredPrompt) {
        if (!deferredPrompt) {
            this.showInstallInstructions();
            return;
        }

        try {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('Пользователь принял установку PWA');
            } else {
                console.log('Пользователь отклонил установку PWA');
            }
        } catch (error) {
            console.error('Ошибка при установке PWA:', error);
            this.showInstallInstructions();
        }
    }

    // Show install instructions for unsupported browsers
    showInstallInstructions() {
        const instructions = this.getBrowserInstallInstructions();
        const modal = this.createModal('Установить на рабочий стол', `
            <div style="font-size: 12px;">
                ${instructions}
            </div>
        `, () => {});

        // Remove save button for instructions modal
        modal.querySelector('.save-modal').style.display = 'none';
        document.body.appendChild(modal);
    }

    // Get browser-specific install instructions
    getBrowserInstallInstructions() {
        const userAgent = navigator.userAgent.toLowerCase();

        if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
            return `
                <h4 style="font-weight: 600; margin-bottom: 8px;">Google Chrome:</h4>
                <ol style="list-style: decimal; padding-left: 20px; margin: 8px 0;">
                    <li style="margin: 4px 0;">Нажмите на иконку меню (три точки) в правом верхнем углу</li>
                    <li style="margin: 4px 0;">Выберите "Установить FINCALCULATOR.RU..."</li>
                    <li style="margin: 4px 0;">Подтвердите установку</li>
                </ol>
            `;
        } else if (userAgent.includes('firefox')) {
            return `
                <h4 style="font-weight: 600; margin-bottom: 8px;">Mozilla Firefox:</h4>
                <ol style="list-style: decimal; padding-left: 20px; margin: 8px 0;">
                    <li style="margin: 4px 0;">Нажмите на иконку меню (три линии) в правом верхнем углу</li>
                    <li style="margin: 4px 0;">Выберите "Установить это приложение"</li>
                    <li style="margin: 4px 0;">Подтвердите установку</li>
                </ol>
            `;
        } else if (userAgent.includes('safari')) {
            return `
                <h4 style="font-weight: 600; margin-bottom: 8px;">Safari (iOS/macOS):</h4>
                <ol style="list-style: decimal; padding-left: 20px; margin: 8px 0;">
                    <li style="margin: 4px 0;">Нажмите на кнопку "Поделиться" (квадрат со стрелкой)</li>
                    <li style="margin: 4px 0;">Выберите "На экран Домой" или "Добавить в Dock"</li>
                    <li style="margin: 4px 0;">Нажмите "Добавить"</li>
                </ol>
            `;
        } else {
            return `
                <h4 style="font-weight: 600; margin-bottom: 8px;">Общие инструкции:</h4>
                <p style="margin: 8px 0;">Добавьте эту страницу в закладки или на главный экран через меню вашего браузера.</p>
                <p style="margin: 8px 0;">Для лучшего опыта рекомендуем использовать Chrome, Firefox или Safari.</p>
            `;
        }
    }

    // Show notification helper
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-size: 14px;
            z-index: 1001;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Load calculation from URL parameters
    loadFromURL() {
        const urlParams = new URLSearchParams(window.location.search);

        const loanAmountInput = document.getElementById('loan-amount');
        const loanTermInput = document.getElementById('loan-term');
        const interestRateInput = document.getElementById('interest-rate');
        const paymentTypeSelect = document.getElementById('payment-type');

        if (urlParams.get('amount') && loanAmountInput) {
            loanAmountInput.value = urlParams.get('amount');
        }
        if (urlParams.get('term') && loanTermInput) {
            loanTermInput.value = urlParams.get('term');
        }
        if (urlParams.get('rate') && interestRateInput) {
            interestRateInput.value = urlParams.get('rate');
        }
        if (urlParams.get('type') && paymentTypeSelect) {
            paymentTypeSelect.value = urlParams.get('type');
        }

        // Auto-calculate if parameters are present
        if (urlParams.has('amount') && urlParams.has('term') && urlParams.has('rate')) {
            setTimeout(() => this.calculate(), 500);
        }
    }

    // Добавление интерактивности к таблице
    addTableInteractivity() {
        // Выделение строки по клику
        const rows = document.querySelectorAll(".payment-table tbody tr");
        rows.forEach(row => {
            row.addEventListener("click", () => {
                rows.forEach(r => r.classList.remove("active"));
                row.classList.add("active");
            });
        });

        // Сортировка таблицы
        document.querySelectorAll(".payment-table thead th").forEach((header, index) => {
            header.addEventListener("click", () => {
                this.sortTable(index);
            });
        });
    }

    // Функция сортировки таблицы
    sortTable(colIndex) {
        const table = document.querySelector(".payment-table");
        const tbody = table.tBodies[0];
        const rows = Array.from(tbody.querySelectorAll("tr"));
        const header = table.tHead.rows[0].cells[colIndex];
        const isAsc = !header.classList.contains("sort-asc");

        // убрать старые иконки сортировки
        Array.from(table.tHead.rows[0].cells).forEach(th => {
            th.classList.remove("sort-asc", "sort-desc");
        });
        header.classList.add(isAsc ? "sort-asc" : "sort-desc");

        rows.sort((a, b) => {
            let aText = a.cells[colIndex].innerText.trim().replace(/\s/g, "").replace(",", ".");
            let bText = b.cells[colIndex].innerText.trim().replace(/\s/g, "").replace(",", ".");

            let aNum = parseFloat(aText);
            let bNum = parseFloat(bText);

            if (!isNaN(aNum) && !isNaN(bNum)) {
                return isAsc ? aNum - bNum : bNum - aNum;
            } else {
                return isAsc ? aText.localeCompare(bText) : bText.localeCompare(aText);
            }
        });

        rows.forEach(row => tbody.appendChild(row));
    }
}

    // Initialize calculator when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        try {
            // Initialize calculator manager first
            window.calculatorManager = new CalculatorManager();
            
            const calculator = new CreditCalculator();
            calculator.loadFromURL();
            
            // Устанавливаем глобальную переменную для доступа из HTML
            window.creditCalculator = calculator;
            
            // Инициализация колонок инфляции при загрузке страницы
            const inflationCheckbox = document.getElementById('consider-inflation');
            if (inflationCheckbox) {
                calculator.toggleInflationColumns(inflationCheckbox.checked);
            }

            // Инициализация показа графика при загрузке страницы
            const showGraphToggle = document.getElementById('show-graph');
            const tableContainer = document.querySelector('.table-container');
            if (showGraphToggle && tableContainer) {
                // Таблица всегда показывается
                tableContainer.classList.remove('hidden');
                
                // Инициализируем графики, если чекбокс отмечен
                if (showGraphToggle.checked) {
                    if (window.chartsManager) {
                        window.chartsManager.toggleGraphsVisibility(true);
                    }
                }
            }

            // Инициализация описания приоритета оптимизации
            calculator.updatePriorityDescription();

            // Show admin toggle on triple click of logo
            const headerLink = document.querySelector('header a');
            if (headerLink) {
                let clickCount = 0;
                headerLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    clickCount++;
                    if (clickCount === 3) {
                        const adminToggle = document.getElementById('admin-toggle');
                        if (adminToggle) {
                            adminToggle.style.display = 'block';
                        }
                        clickCount = 0;
                    }
                    setTimeout(() => clickCount = 0, 1000);
                });
            }
        } catch (error) {
            console.error('Error initializing calculator:', error);
        }

    // Управление видимостью таблицы - отключено
    // Таблица теперь всегда видна
});