const dslEditor = document.getElementById('dslEditor');
const lineNumbers = document.getElementById('lineNumbers');

const syncLineNumbers = () => {
    const lines = dslEditor.value.split('\n');
    lineNumbers.innerHTML = '';
    lines.forEach((_, i) => {
        const div = document.createElement('div');
        div.textContent = i + 1;
        lineNumbers.appendChild(div);
    });
};

dslEditor.addEventListener('input', syncLineNumbers);

dslEditor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = dslEditor.scrollTop;
});

syncLineNumbers();
