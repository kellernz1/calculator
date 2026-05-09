class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    // Limpa todos os dados da tela
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    // Apaga o último número digitado
    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    // Adiciona um número ou ponto à tela
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    // Seleciona a operação (+, -, *, ÷)
    chooseOperation(operation) {
        if (this.currentOperand === '0' && this.previousOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    // Realiza o cálculo
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert("Não é possível dividir por zero!");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    // Formata o número para incluir vírgulas nos milhares (Padrão PT-BR adaptado)
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Atualiza a interface gráfica
    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// Seleção de elementos do DOM
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

// Instanciando a Calculadora
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Adicionando eventos aos botões
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
});

// Suporte para teclado
document.addEventListener('keydown', function(event) {
    let patternForNumbers = /[0-9]/g;
    let patternForOperators = /[+\-*\/]/g;
    if (event.key.match(patternForNumbers)) {
        event.preventDefault();
        calculator.appendNumber(event.key);
        calculator.updateDisplay();
    }
    if (event.key === '.') {
        event.preventDefault();
        calculator.appendNumber(event.key);
        calculator.updateDisplay();
    }
    if (event.key.match(patternForOperators)) {
        event.preventDefault();
        // Substituir a barra pelo símbolo de divisão e asterisco por multiplicação
        let operator = event.key;
        if (operator === '/') operator = '÷';
        if (operator === '*') operator = '×';
        calculator.chooseOperation(operator);
        calculator.updateDisplay();
    }
    if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
    }
    if (event.key === 'Backspace') {
        event.preventDefault();
        calculator.delete();
        calculator.updateDisplay();
    }
    if (event.key === 'Escape') {
        event.preventDefault();
        calculator.clear();
        calculator.updateDisplay();
    }
});

