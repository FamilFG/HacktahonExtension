document.addEventListener("mouseup", () => {
    let selection = window.getSelection().toString().trim();
    if (!selection) return;

    fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text: selection})
    })
    .then(res => res.json())
    .then(data => {
        showTooltip(data.answer);
    })
    .catch(err => console.error("Fetch error:", err));
});

function showTooltip(text) {
    const old = document.querySelector(".gpt-tooltip");
    if(old) old.remove();

    let tooltip = document.createElement('div');
    tooltip.className = "gpt-tooltip";

    // текст
    let content = document.createElement('div');
    content.innerText = text || "Здесь появится ответ!";
    tooltip.appendChild(content);

    document.body.appendChild(tooltip);

    // позиционируем рядом с выделением
    let selection = window.getSelection();
    if(selection.rangeCount > 0){
        let range = selection.getRangeAt(0);
        let rect = range.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + window.scrollY + 6}px`;
        tooltip.style.left = `${rect.left + window.scrollX}px`;
    }

    // Закрытие при клике вне тултипа
    function handleClickOutside(e) {
        if (!tooltip.contains(e.target)) {
            tooltip.remove();
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }
    setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    // автоудаление через 7 секунд
    setTimeout(() => {
        tooltip.style.opacity = 0;
        tooltip.style.transition = "opacity 0.3s ease";
        setTimeout(() => tooltip.remove(), 300);
    }, 7000);
}
