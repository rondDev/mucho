<script lang="ts">
  let { data } = $props();
</script>

<div>
  <p class="text-xl">Sessions</p>
  <p class="color-[#bababa] text-sm">Manage user sessions</p>
  <div class="h-[1px] bg-[#282828] mt-2 mb-4"></div>
  {#if data?.sessions}
    <table>
      <thead class="">
        <tr>
          <!-- <th scope="col">ID</th> -->
          <th scope="col">Logged in</th>
          <th scope="col">Last accessed</th>
          <th scope="col">Expires</th>
        </tr>
      </thead>
      <tbody>
        {#each data?.sessions as session}
          <tr>
            <!-- <td>{session.id}</td> -->
            <td>{session.createdAt.toLocaleString()}</td>
            <td>{session.updatedAt.toLocaleString()}</td>
            <td>{session.expire.toLocaleString()}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  table,
  th,
  td {
    border-collapse: collapse;
    margin-bottom: 10px;
    border: 1px solid #aaaaaa;
    padding: 3px 2px;
  }

  tbody tr:nth-child(odd) {
    background-color: #111111;
  }

  tbody tr:nth-child(even) {
    background-color: #212121;
  }
</style>
