const categories = ["HOGAR", "ELECTRÓNICA", "ROPA", "DEPORTE"];

export const products = Array.from({ length: 1000 }, (_, index) => ({
	id: String(index + 1),
	name: `Producto ${String(index + 1).padStart(4, "0")}`,
	price: Math.floor(Math.random() * 990) + 10,
	category: categories[index % categories.length],
}));
