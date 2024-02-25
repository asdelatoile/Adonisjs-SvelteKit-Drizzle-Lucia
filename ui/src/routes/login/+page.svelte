<script lang="ts">
	import { Mail, Lock } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	// import SuperDebug from 'sveltekit-superforms';
	import * as flashModule from 'sveltekit-flash-message/client';

	export let data;
	const { form, errors, constraints, enhance } = superForm(data.form, {
		resetForm: false,
		flashMessage: {
			module: flashModule
		},
		syncFlashMessage: true
	});
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<!-- <SuperDebug data={$form} /> -->

<div class="min-h-screen bg-base-200 flex items-center">
	<div class="card mx-auto w-full max-w-5xl shadow-xl">
		<div class="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
			<div class="">
				<div
					class="hero min-h-full rounded-l-xl bg-base-200 bg-center bg-cover bg-no-repeat bg-[url('https://picsum.photos/id/60/367/267')]"
				></div>
			</div>
			<div class="py-24 px-10">
				<h2 class="text-2xl font-semibold mb-2 text-center">Login</h2>

				<form method="post" use:enhance>
					<div class="mb-4">
						<label
							class="input input-bordered flex items-center gap-2 mt-10"
							class:input-error={$errors.email && $errors.email.length > 0}
						>
							<Mail size={20} strokeWidth={1} class="opacity-70" />
							<input
								type="email"
								class="grow"
								placeholder="Email"
								name="email"
								id="email"
								on:input={() => {
									$errors.email = [];
								}}
								aria-invalid={$errors.email && $errors.email.length > 0 ? 'true' : undefined}
								bind:value={$form.email}
								{...$constraints.email}
							/>
						</label>
						<!-- {#if $errors.email && $errors.email.length > 0}
							<div class="label">
								<span class="label-text-alt">{$errors.email.join(',')}</span>
							</div>
						{/if} -->

						<label
							class="input input-bordered flex items-center gap-2 mt-5"
							class:input-error={$errors.password && $errors.password.length > 0}
						>
							<Lock size={20} strokeWidth={1} class="opacity-70" />
							<input
								type="password"
								class="grow"
								placeholder="Password"
								name="password"
								id="password"
								on:input={() => {
									$errors.password = [];
								}}
								aria-invalid={$errors.email && $errors.email.length > 0 ? 'true' : undefined}
								bind:value={$form.password}
								on:input={() => {
									$errors.password = [];
								}}
								{...$constraints.password}
								required
							/>
						</label>
						<!-- {#if $errors.password && $errors.password.length > 0}
							<div class="label">
								<span class="label-text-alt">{$errors.password.join(',')}</span>
							</div>
						{/if} -->
					</div>

					<div class="text-right text-primary">
						<a href="/forgot">
							<span
								class="text-sm inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200"
								>Forgot Password?</span
							>
						</a>
					</div>

					<button type="submit" class="btn mt-10 w-full btn-primary">Login</button>

					<div class="text-center mt-4">
						Don't have an account yet? <a href="/register"
							><span
								class=" inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200"
								>Register</span
							></a
						>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
