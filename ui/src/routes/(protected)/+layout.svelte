<div class="min-h-screen bg-base-200 p-6">
	<div class="navbar bg-base-100 shadow-xl rounded-box">
		<div class="flex-1">
			<a href="/admin/dashboard" title="Admin" class="btn btn-ghost text-xl">Admin</a>
		</div>
		<div class="flex-none gap-2">
			<div class="dropdown dropdown-end">
				<div tabindex="-1" role="button" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						<img
							alt="Tailwind CSS Navbar component"
							src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
						/>
					</div>
				</div>
				<ul
					tabindex="-1"
					class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
				>
					<li>
						<form action="/logout" method="POST">
							<button type="submit" class="">Log out</button>
						</form>
					</li>
				</ul>
			</div>
		</div>
	</div>

	<slot />
</div>
