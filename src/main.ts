import "./index.css";

type Props = {
	[key: string]: Prop;
};

type Prop = Props | Props[] | string | number | boolean | null | undefined;

declare global {
	interface Window {
		__floppa?: {
			childrenPropName?: string;
		};
	}
}

const CHILDREN_PROP_NAME = window.__floppa?.childrenPropName ?? "children";
const CHILDREN_PLACEHOLDER = "{" + CHILDREN_PROP_NAME + "}";

function renderTree(result: string, props: Props | null): string {
	for (const key in props) {
		const value = props[key];

		// If value is a primitive, it is a prop
		//
		// If value is an object or array of objects, it's a component (and the object is the props)
		// with the key being the component/template name

		if (typeof value === "object") {
			// -> key is template name
			const template = document.getElementById(key);

			if (
				template == null ||
				!(template instanceof HTMLTemplateElement)
			) {
				continue;
			}

			let renderedChildren = "";
			if (Array.isArray(value)) {
				for (const component of value) {
					renderedChildren += renderTree(
						template.innerHTML,
						component
					);
				}
			} else {
				renderedChildren = renderTree(template.innerHTML, value);
			}

			result = result.replace(CHILDREN_PLACEHOLDER, renderedChildren);
		} else {
			// props:    { foo: "someValue" }
			// template: <span>{foo}</span>
			//
			//        => <span>someValue</span>
			result = result.replace(`{${key}}`, value?.toString() ?? "");
		}
	}

	// Children are optional:
	// If you have a template like <span>{foo}</span>
	// but your JSON/payload doesn't have a "foo" prop, we'll render it as-is.
	// The final result will be <span>{foo}</span>.
	//
	// Not with {children}, though! They are the only optional prop.
	//
	// If you want optional props, just send an empty string as the value.
	//
	// So we'll remove any leftover {children} placeholders:
	result = result.replaceAll(CHILDREN_PLACEHOLDER, "");

	return result;
}

const root = 
