let expr = "";
let display = document.getElementById("display");
let historyEl = document.getElementById("history");
let isDeg = true;
let sciVisible = true;
let justCalculated = false; 

function update() {
  display.textContent = expr === "" ? "0" : expr.replaceAll(".", ",");
  display.classList.toggle("small", expr.length > 12);
}
function addFunc(v) {
  const isNumber = /[0-9.]/.test(v);
  const isStartNew = ['sin(', 'cos(', 'tan(', '√(', 'log(', 'ln(', '(', 'π', 'e'].includes(v);

  if(justCalculated && (isNumber || isStartNew)){
    expr = '';
    historyEl.textContent = '';
  }

  justCalculated = false;

  if(v === '1/') v = '1/(';
  expr += v;
  update();
}

function clearAll() {
  expr = "";
  historyEl.textContent = "";
  justCalculated = false; 

  update();
}
function backspace() {
  expr = expr.slice(0, -1);
  update();
}
function toggleDeg() {
  isDeg = !isDeg;
  document.getElementById("degBtn").textContent = isDeg ? "DEG" : "RAD";
}
function toggleSci() {
  sciVisible = !sciVisible;
  document
    .querySelectorAll(".sci")
    .forEach((b) => b.classList.toggle("hidden", !sciVisible));
  document.getElementById("toggleBtn").textContent = sciVisible
    ? "SCI ON"
    : "SCI OFF";
  document.getElementById("toggleBtn").classList.toggle("active", !sciVisible);
}
function factorial(n) {
  if (n < 0 || n !== Math.floor(n)) return NaN;
  if (n === 0) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
function calculate() {
  if(!expr) return;
  try{
    let e = expr
      .replaceAll('π', 'Math.PI')
      .replaceAll('e', 'Math.E')
      .replaceAll('√(', 'Math.sqrt(')
      .replaceAll('^', '**')
      .replaceAll('log(', 'Math.log10(')
      .replaceAll('ln(', 'Math.log(')
      .replaceAll('%', '/100');

    e = e.replace(/sin\(/g, isDeg ? 'Math.sin((Math.PI/180)*' : 'Math.sin(');
    e = e.replace(/cos\(/g, isDeg ? 'Math.cos((Math.PI/180)*' : 'Math.cos(');
    e = e.replace(/tan\(/g, isDeg ? 'Math.tan((Math.PI/180)*' : 'Math.tan(');
    e = e.replace(/(\d+)!/g, 'factorial($1)');

    let result = eval(e);
    if(!isFinite(result)) throw new Error();
    result = Math.round(result * 1000000000) / 1000000000;
    historyEl.textContent = expr + ' =';
    expr = String(result);
    justCalculated = true; // <-- ON DIT QU'ON VIENT DE CALCULER
    update();
  }catch{
    display.textContent = 'Erreur';
    expr = '';
    justCalculated = false;
  }
}
document.addEventListener("keydown", (e) => {
  if (/[0-9+\-*/().%^!]/.test(e.key)) addFunc(e.key);
  if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    calculate();
  }
  if (e.key === "Backspace") backspace();
  if (e.key === "Escape") clearAll();
});
update();
