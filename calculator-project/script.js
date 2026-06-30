(function () {
  "use strict";

  // ---- DOM refs ----
  const resultEl = document.getElementById("result");
  const expressionEl = document.getElementById("expression");
  const opIndicatorEl = document.getElementById("opIndicator");
  const keysEl = document.getElementById("keys");

  const MAX_DIGITS = 12;

  // ---- State ----
  let currentValue = "0";   // the value currently being typed / shown
  let previousValue = null; // operand stashed when an operator is pressed
  let operator = null;      // '+', '−', '×', '÷'
  let overwrite = true;     // next digit press replaces currentValue
  let justEvaluated = false; // true right after "=" — typing a digit starts fresh

  // ---- Formatting ----
  function formatNumber(numStr) {
    if (numStr === "Error") return numStr;
    const [intPart, decPart] = numStr.split(".");
    const sign = intPart.startsWith("-") ? "-" : "";
    const digits = sign ? intPart.slice(1) : intPart;
    const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return sign + withCommas + (decPart !== undefined ? "." + decPart : "");
  }

  function render() {
    resultEl.textContent = formatNumber(currentValue);
    resultEl.classList.toggle("is-error", currentValue === "Error");

    if (operator && previousValue !== null) {
      expressionEl.textContent = `${formatNumber(previousValue)} ${operator}`;
    } else {
      expressionEl.textContent = "";
    }

    if (operator) {
      opIndicatorEl.textContent = operator;
      opIndicatorEl.classList.add("is-visible");
    } else {
      opIndicatorEl.classList.remove("is-visible");
    }

    document.querySelectorAll(".key-op").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.op === operator);
    });
  }

  // ---- Core actions ----
  function inputDigit(digit) {
    if (currentValue === "Error" || overwrite || justEvaluated) {
      currentValue = digit;
      overwrite = false;
      justEvaluated = false;
    } else if (currentValue.replace("-", "").replace(".", "").length < MAX_DIGITS) {
      currentValue = currentValue === "0" ? digit : currentValue + digit;
    }
  }

  function inputDecimal() {
    if (currentValue === "Error" || overwrite || justEvaluated) {
      currentValue = "0.";
      overwrite = false;
      justEvaluated = false;
      return;
    }
    if (!currentValue.includes(".")) {
      currentValue += ".";
    }
  }

  function compute(a, op, b) {
    const x = parseFloat(a);
    const y = parseFloat(b);
    let result;
    switch (op) {
      case "+": result = x + y; break;
      case "−": result = x - y; break;
      case "×": result = x * y; break;
      case "÷":
        if (y === 0) return "Error";
        result = x / y;
        break;
      default: return b;
    }
    if (!isFinite(result)) return "Error";
    // trim floating point noise, cap precision
    let str = parseFloat(result.toPrecision(12)).toString();
    if (str.replace("-", "").replace(".", "").length > MAX_DIGITS) {
      str = result.toExponential(5);
    }
    return str;
  }

  function chooseOperator(nextOp) {
    if (currentValue === "Error") return;

    if (operator && !overwrite) {
      // chain: evaluate what's pending before applying the new operator
      currentValue = compute(previousValue, operator, currentValue);
    }

    previousValue = currentValue;
    operator = nextOp;
    overwrite = true;
    justEvaluated = false;
  }

  function equals() {
    if (operator === null || currentValue === "Error") return;
    if (previousValue === null) return;
    currentValue = compute(previousValue, operator, currentValue);
    operator = null;
    previousValue = null;
    overwrite = true;
    justEvaluated = true;
  }

  function clearAll() {
    currentValue = "0";
    previousValue = null;
    operator = null;
    overwrite = true;
    justEvaluated = false;
  }

  function backspace() {
    if (currentValue === "Error" || justEvaluated) {
      clearAll();
      return;
    }
    if (overwrite) return;
    currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
    if (currentValue === "-" ) currentValue = "0";
    if (currentValue === "0") overwrite = true;
  }

  function percent() {
    if (currentValue === "Error") return;
    const val = parseFloat(currentValue);
    currentValue = (previousValue !== null
      ? (parseFloat(previousValue) * (val / 100))
      : (val / 100)
    ).toString();
    overwrite = true;
  }

  // ---- Visual press feedback for a key element ----
  function pulse(el) {
    if (!el) return;
    el.classList.add("is-pressed");
    setTimeout(() => el.classList.remove("is-pressed"), 110);
  }

  // ---- Click handling ----
  keysEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".key");
    if (!btn) return;
    handleKey(btn);
  });

  function handleKey(btn) {
    pulse(btn);
    if (btn.dataset.num !== undefined) {
      btn.dataset.num === "." ? inputDecimal() : inputDigit(btn.dataset.num);
    } else if (btn.dataset.op) {
      chooseOperator(btn.dataset.op);
    } else if (btn.dataset.action === "equals") {
      equals();
    } else if (btn.dataset.action === "clear") {
      clearAll();
    } else if (btn.dataset.action === "backspace") {
      backspace();
    } else if (btn.dataset.action === "percent") {
      percent();
    }
    render();
  }

  // ---- Keyboard support ----
  const opMap = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  window.addEventListener("keydown", (e) => {
    const key = e.key;

    if (/^[0-9]$/.test(key)) {
      const btn = keysEl.querySelector(`[data-num="${key}"]`);
      handleKey(btn);
      return;
    }
    if (key === ".") {
      handleKey(keysEl.querySelector('[data-num="."]'));
      return;
    }
    if (opMap[key]) {
      e.preventDefault();
      handleKey(keysEl.querySelector(`[data-op="${opMap[key]}"]`));
      return;
    }
    if (key === "Enter" || key === "=") {
      e.preventDefault();
      handleKey(keysEl.querySelector('[data-action="equals"]'));
      return;
    }
    if (key === "Backspace") {
      handleKey(keysEl.querySelector('[data-action="backspace"]'));
      return;
    }
    if (key === "Escape") {
      handleKey(keysEl.querySelector('[data-action="clear"]'));
      return;
    }
    if (key === "%") {
      handleKey(keysEl.querySelector('[data-action="percent"]'));
      return;
    }
  });

  // ---- Init ----
  render();
})();
