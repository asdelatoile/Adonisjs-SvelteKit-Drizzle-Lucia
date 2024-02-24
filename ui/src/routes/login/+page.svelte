<script lang="ts">
	import { Mail, Lock } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import * as flashModule from 'sveltekit-flash-message/client';

	export let data;
	const { form, errors, message, constraints, enhance } = superForm(data.form, {
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

<SuperDebug data={$form} />

{#if $message}
	<!-- eslint-disable-next-line svelte/valid-compile -->
	<div class="status" class:error={$page.status >= 400} class:success={$page.status == 200}>
		{$message.message}
	</div>
{/if}

<div class="container mx-auto pt-8">
	<form method="post" use:enhance>
		<label
			class="input input-bordered flex items-center gap-2"
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
			{#if $errors.email && $errors.email.length > 0}
				<div class="label">
					<span class="label-text-alt">{$errors.email.join(',')}</span>
				</div>
			{/if}
		</label>

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
		{#if $errors.password && $errors.password.length > 0}
			<div class="label">
				<span class="label-text-alt">{$errors.password.join(',')}</span>
			</div>
		{/if}

		<div class="text-center mt-8">
			<button type="submit" class="btn btn-primary">Login</button>
		</div>
	</form>
</div>
