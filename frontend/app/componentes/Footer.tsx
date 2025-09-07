import Link from "next/link";

export default function Footer() {
	return (
		<footer className="pt-0 border-t border-stone-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
			<div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-stone-700">
				<div>
					<h3 className="text-xl font-serif font-semibold text-stone-900">CafeShop</h3>
					<p className="mt-2 text-sm text-stone-600">Café de especialidad, seleccionado con cuidado y tostado con precisión.</p>
				</div>
				<nav className="grid grid-cols-2 gap-4 text-sm">
								<ul className="space-y-2">
									<li><Link className="hover:text-stone-900" href="/">Inicio</Link></li>
									<li><Link className="hover:text-stone-900" href="/products">Catálogo</Link></li>
									<li><a className="hover:text-stone-900" href="#">Sobre nosotros</a></li>
								</ul>
					<ul className="space-y-2">
						<li><a className="hover:text-stone-900" href="#">Contacto</a></li>
						<li><a className="hover:text-stone-900" href="#">Privacidad</a></li>
						<li><a className="hover:text-stone-900" href="/admin">Eres un administrador?</a></li>
					</ul>
				</nav>
				<div className="text-sm md:text-right">
					<p className="text-stone-600">© {new Date().getFullYear()} CafeShop. Todos los derechos reservados.</p>
					<p className="mt-2 text-stone-500">Hecho con pasión por el café.</p>
				</div>
			</div>
		</footer>
	);
}

