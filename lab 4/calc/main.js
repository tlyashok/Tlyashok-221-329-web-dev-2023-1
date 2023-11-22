function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

function isDigit(str) {
    return /^\d{1}$/.test(str);
}

function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && 
                   isOperation(stack[stack.length - 1]) && 
                   priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

function evaluate(str) {
    const tokens = str.split(' ');
    const stack = [];

    for (const token of tokens) {
        if (isNumeric(token)) {
            stack.push(parseFloat(token));
        } else if (isOperation(token)) {
            const b = stack.pop();
            const a = stack.pop();
            if (token === '+') {
                stack.push(a + b);
            } else if (token === '-') {
                stack.push(a - b);
            } else if (token === '*') {
                stack.push(a * b);
            } else if (token === '/') {
                if (b === 0) {
                    throw new Error('Division by zero');
                }
                stack.push(a / b);
            }
        }
    }

    if (stack.length !== 1) {
        throw new Error('Invalid expression');
    }

    return stack[0];
}

function addToScreen(value) {
    const screen = document.querySelector('.screen span');
    screen.textContent += value;
}

function clearScreen() {
    const screen = document.querySelector('.screen span');
    screen.textContent = '';
}

function evaluateExpression() {
    const screen = document.querySelector('.screen span');
    const expression = screen.textContent;

    const rpnExpression = compile(expression);

    try {
        const result = evaluate(rpnExpression);
        screen.textContent = result.toFixed(2);
    } catch (error) {
        console.error('Error during evaluation:', error.message);
        screen.textContent = 'Error';
        setTimeout(()=>{screen.textContent = ''}, 2000);
    }
}

window.onload = function () {
    document.querySelector('.buttons').addEventListener('click', clickHandler);

    function clickHandler(event) {
        const target = event.target;

        if (target.classList.contains('digit') || target.classList.contains('operation') || target.classList.contains('bracket')) {
            addToScreen(target.textContent);
        } else if (target.classList.contains('clear')) {
            clearScreen();
        } else if (target.classList.contains('result')) {
            evaluateExpression();
        }
    }
};
