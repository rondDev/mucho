<script lang="ts">
  import { browser } from '$app/environment';
  import { goto, pushState } from '$app/navigation';
  import { page } from '$app/state';
  import toast, { Toaster } from 'svelte-french-toast';

  let { form } = $props();
  if (page.data.justRegistered) {
    toast.success('Registration successful', {
      duration: 5000,
      position: 'bottom-center'
    });
    if (browser) {
      goto('/login', { replaceState: true, noScroll: true, keepFocus: true });
    }
  }
</script>

<svelte:head>
  <title>Login - mucho</title>
</svelte:head>

<Toaster />
<div class="flex flex-col gap-10 text-white">
  <h1 class="text-3xl font-semibold">Login</h1>
  <form
    class="flex flex-col w-[22rem] gap-16 text-white"
    action="?/login"
    method="POST"
  >
    <div class="flex flex-col gap-4">
      <div class="m-1 flex flex-col">
        <label class="label pb-2" for="username">Username</label>
        <input
          class="h-12 p-5 border focus:border-orange-600 rounded-lg"
          id="username"
          name="username"
          type="text"
          required
        />
      </div>
      <div class="m-1 flex flex-col">
        <label class="label pb-2" for="password">Password</label>
        <input
          class="h-12 p-5 border focus:border-orange-600 rounded-lg"
          id="password"
          name="password"
          type="password"
          required
        />
      </div>
    </div>

    {#if form?.invalid}
      <p class="error">Username and password is required.</p>
    {/if}

    {#if form?.credentials}
      <p class="error">You have entered the wrong credentials.</p>
    {/if}

    <button class="bg-orange-600 rounded-md h-12" type="submit">Log in</button>
    <p class="self-center mt-[-2rem]">
      Not yet registered? <a
        class="underline btn-sm variant-form-material"
        href="/register"
      >
        Register here!</a
      >
    </p>
  </form>
</div>
