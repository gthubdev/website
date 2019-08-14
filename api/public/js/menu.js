const ToggleMenu = () => {
const sideMenu = document.querySelector('.side-menu');
	sideMenu.classList.toggle('side-menu--out');
};

const openBtn = document.querySelector('#menuOpen');
const closeBtn = document.querySelector('#menuClose');

openBtn.addEventListener('click', ToggleMenu);
closeBtn.addEventListener('click', ToggleMenu);
