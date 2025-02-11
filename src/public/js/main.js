document.addEventListener("DOMContentLoaded", () => {

	const elements = ["navbar", "footer"];

	elements.forEach((element) => {
		const elementScript = document.createElement("script");
		elementScript.type = "module";
		elementScript.src = `/js/component/${element}.js`;
		elementScript.defer = true;
		document.head.appendChild(elementScript);
	});
});

//document.querySelectorAll('.card').forEach(card => {
//	card.addEventListener('click', () => {
//		card.classList.add('active');
//		setTimeout(() => card.classList.remove('active'), 300);
//	});
//});