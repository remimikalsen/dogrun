<script>
    import Game from '$lib/Game.svelte';
    import { bonesCollected, currentLevel } from '$lib/stores.js'; // Import the store

    // No need for extra functions, the store will auto-update in this file
</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh;
        padding: 0 1rem;
    }

    header, footer {
        background-color: #333;
        color: white;
        text-align: center;
        padding: 1rem;
    }

    main {
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<div class="container">
    <header>
        <h1>Dog Run Game</h1>
        <p>At level: {$currentLevel}. Bones Collected: {$bonesCollected}</p> <!-- Automatically updates -->
    </header>

    <main>
        <Game />
    </main>

    <footer>
        <p>Good luck!</p>
    </footer>
</div>
