<script lang="ts">
  import { enhance } from '$app/forms';
  import toast, { Toaster } from 'svelte-french-toast';

  let { data, form } = $props();
  let password = $state('');
  let confirmpassword = $state('');
  let passwordMatches = $derived(password !== confirmpassword);
  let passwordDisabled = $derived(passwordMatches || password === '');

  let username = $state(data.user.username || '');
  let usernameDisabled = $derived(
    username == data.user.username || username === ''
  );

  let successUsername = $derived(form?.successUsername);
  let successPassword = $derived(form?.successPassword);

  $effect(() => {
    if (successUsername) {
      toast.success('Username updated', {
        duration: 5000,
        position: 'bottom-center'
      });
    }
  });
</script>

<Toaster />
<div>
  <p class="text-xl">Details</p>
  <p class="color-[#bababa] text-sm">Manage account details</p>
  <div class="h-[1px] bg-[#282828] mt-2"></div>
</div>
<div>
  <form
    class="flex flex-col pt-4"
    action="?/updateUsername"
    method="POST"
    use:enhance={(result) => {
      return ({ result }) => {
        reset: false;
      };
    }}
  >
    <label class="text-lg pb-2" for="username">Username</label>
    <input
      id="username"
      name="username"
      type="text"
      bind:value={username}
      class="h-12 p-5 border focus:border-orange-600 rounded-lg"
    />
    <button
      type="submit"
      disabled={usernameDisabled}
      class="bg-[#f9467bff] rounded-md w-full h-12 mt-8 cursor-pointer disabled:cursor-not-allowed"
      >Update username</button
    >
    {#if form?.error.type === 'username'}
      <div class="relative">
        <div class="absolute left-2 text-red">{form?.error.message}</div>
      </div>
    {/if}
    <!-- TODO: fix this -->
    {#if form?.successUsername}
      <div class="relative">
        <div class="absolute left-2 text-green">
          Successfully updated username
        </div>
      </div>
    {/if}
    <!-- -->

    <p class="text-lg mt-8">Password</p>
    <label class="text-sm py-2 mt-4" for="username">Current password</label>
    <input
      id="oldpassword"
      name="oldpassword"
      type="text"
      class="h-12 p-5 border focus:border-orange-600 rounded-lg"
    />
    <label class="text-sm py-2" for="username">New password</label>
    <input
      id="newpassword"
      name="newpassword"
      type="text"
      bind:value={password}
      class={`h-12 p-5 border focus:border-orange-600 rounded-lg ${passwordMatches ? 'border-red' : ''}`}
    />
    <label class="text-sm py-2" for="username">Confirm password</label>
    <input
      id="confirmpassword"
      name="confirmpassword"
      type="text"
      bind:value={confirmpassword}
      class={`h-12 p-5 border focus:border-orange-600 rounded-lg ${passwordMatches ? 'border-red' : ''}`}
    />

    {#if passwordMatches}
      <div class="relative">
        <div class="absolute left-2 text-red">Password mismatch.</div>
      </div>
    {/if}
    {#if form?.successPassword}
      <div class="relative">
        <div class="absolute left-2 text-green">
          Successfully updated password
        </div>
      </div>
    {/if}
    <button
      type="submit"
      disabled={passwordDisabled}
      formaction="?/updatePassword"
      class="bg-[#f9467bff] rounded-md w-full h-12 mt-8 cursor-pointer disabled:cursor-not-allowed"
      >Update password</button
    >
  </form>
</div>
