const dropdownBtn = document.getElementById('notationBtn');
const dropdownMenu = document.getElementById('notationMenu');
const dropdownItems = document.querySelectorAll('.dropdown__item');

const toggleDropdown = (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('dropdown__menu--active');
};

const closeDropdown = () => {
    dropdownMenu.classList.remove('dropdown__menu--active');
};

const selectItem = (item) => {
    const value = item.getAttribute('data-value');
    const arrow = dropdownBtn.querySelector('.dropdown__arrow');
    dropdownBtn.firstChild.textContent = value + ' ';
    dropdownBtn.setAttribute('data-current', value);
    closeDropdown();
};

dropdownBtn.addEventListener('click', toggleDropdown);

dropdownItems.forEach(item => {
    item.addEventListener('click', () => selectItem(item));
});

window.addEventListener('click', () => {
    if (dropdownMenu.classList.contains('dropdown__menu--active')) {
        closeDropdown();
    }
});