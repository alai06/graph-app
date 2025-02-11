class CustomNavbar extends HTMLElement {

	constructor() {

		super();

		const shadow = this.attachShadow({ mode: 'open' });

		const template = document.createElement('template');
		template.innerHTML = `
			<div class="border-up-down"></div>

			<nav class="navbar">
				<div class="nav-container">
					<a href="/" class="back-button" id="back-button">← Retour</a>
					<img class="branding" src="/images/branding/logo_title_terra_numerica.png" alt="Terra Numerica Logo">
					<h1 class="title"></h1>
				</div>
			</nav>

			<div class="border-up-down"></div>

			<style>
				.navbar {
					width: 100%;
					background-color: var(--darkBlue);
				}

				.nav-container {
					margin: 0 auto;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					align-items: center;
					position: relative;
				}

				.branding {
					max-height: 85px;
					padding: 20px 0;
				}

				.border-up-down {
					background-color: var(--blue);
					width: 100%;
					height: 42px;
				}

				.title {
					font-size: 32px;
					color: white;
					text-align: center;
				}

				.back-button {
					position: absolute;
					top: 20px;
					left: 20px;
					font-size: 16px;
					color: white;
					text-decoration: none;
					background-color: var(--blue);
					padding: 10px 15px;
					border-radius: 5px;
					transition: background-color 0.3s ease;
				}

				.back-button:hover {
					background-color: var(--lightBlue);
				}

				.back-button.hidden {
					display: none;
				}
			</style>
		`;

		shadow.appendChild(template.content.cloneNode(true));
	}

	static get observedAttributes() {
		return ['title'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'title') {
			const titleElement = this.shadowRoot.querySelector('.title');
			const backButton = this.shadowRoot.querySelector('.back-button');
			titleElement.textContent = newValue;

			if (newValue.trim() === "Accueil") {
				backButton.classList.add('hidden');
			} else {
				backButton.classList.remove('hidden');
			}
		}
	}

	connectedCallback() {
		if (!this.hasAttribute('title')) {
			this.setAttribute('title', 'Default Title');
		}

		const title = this.getAttribute('title');
		const backButton = this.shadowRoot.querySelector('.back-button');
		if (title.trim() === "Accueil") {
			backButton.classList.add('hidden');
		}
	}
}

customElements.define('custom-navbar', CustomNavbar);