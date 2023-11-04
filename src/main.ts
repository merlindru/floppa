import "./index.css";

const doc = {
	MyComponent: {
		MyComponent: {
			message: "Hello World!",
		},
	},
};

let result = "";

type Node = {
	[key: string]: Node | string;
};

const SLOT_VAR_NAME = "slot";

function render(node: Node) {
	for (const key in node) {
		const template = document
			.querySelector(`template#${key}`)
			?.cloneNode(true);

		if (!template || !(template instanceof HTMLElement)) continue;

		const slotIndex = template.innerHTML.indexOf(SLOT_VAR_NAME);
		const value = node[key];

		if (slotIndex !== -1 && typeof value === "object") {
			let slotHTML: string | undefined;

			slotHTML;
		}
	}
}
