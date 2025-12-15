// Tipos globales para imports de assets y estilos en TypeScript
declare module '*.css' {
	const content: { [className: string]: string } | string;
	export default content;
}

declare module '*.module.css' {
	const classes: { [key: string]: string };
	export default classes;
}

declare module '*.scss' {
	const content: { [className: string]: string } | string;
	export default content;
}

declare module '*.module.scss' {
	const classes: { [key: string]: string };
	export default classes;
}

declare module '*.png' {
	const src: string;
	export default src;
}
declare module '*.jpg' {
	const src: string;
	export default src;
}
declare module '*.jpeg' {
	const src: string;
	export default src;
}
declare module '*.svg' {
	const src: string;
	export default src;
}

export {};

