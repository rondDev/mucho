<script lang="ts">
  import type { ActionData } from "./$types";
  import { PUBLIC_DOMAIN } from "$env/static/public";

  export let form: ActionData;
</script>

<svelte:head>
  <title>Register - {PUBLIC_DOMAIN}</title>
</svelte:head>

<div class="flex flex-col gap-10 text-white">
  <h1 class="text-3xl font-semibold">Register</h1>
  <form
    class="flex flex-col w-[22rem] gap-16 text-white"
    action="?/register"
    method="POST"
  >
    <div class="flex flex-col gap-4">
      <div class="m-1">
        <label class="label pb-2" for="username">Username</label>
        <input
          class="input h-12 p-5"
          id="username"
          name="username"
          type="text"
          required
        />
      </div>
      <div class="m-1">
        <label class="label pb-2" for="password">Password</label>
        <input
          class="input h-12 p-5"
          id="password"
          name="password"
          type="password"
          required
        />
      </div>
    </div>

    {#if form?.user}
      <p class="error">Username is taken.</p>
    {/if}

    {#if form?.registrationdisabled}
      <p class="error">Registration is disabled.</p>
    {/if}

    {#if form?.invalid}
      <p class="error">INVALID!</p>
    {/if}

    <button class="btn variant-filled-primary h-12" type="submit"
      >Register</button
    >
    <p class="self-end mt-[-2rem]">
      Already have an account? <a
        class="hover:underline btn-sm variant-form-material"
        href="/login"
      >
        Log in</a
      >
    </p>
  </form>
</div>
