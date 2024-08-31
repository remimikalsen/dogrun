<script>
    import Game from '$lib/Game.svelte';
    // No need for extra functions, the store will auto-update in this file
</script>


<header>
    <h1>DogRun</h1>
    <p>Save the dog!</p>
</header>
<main>
    <Game  />
</main>
<footer>
    <p>Laget til deg av Sunniva og Kaja</p>
    <p>View the source code on <a href="https://github.com/remimikalsen/pacmaze">GitHub</a></p>
</footer>

<style>
    header {
      background-color: #1b263b;
      padding: 20px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
    
    header p {
      color: white;
    }
    
    h1 {
      font-size: 3rem;
      color: #e94560;
      margin: 0;
      font-family: 'Courier New', Courier, monospace;
    }
    
    p {
      margin: 10px 0;
      font-size: 1.2rem;
    }
    
    a {
      color: #f0a500;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    main {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    footer {
      background-color: #1b263b;
      padding: 20px;
      text-align: center;
      box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.3);
    }
    
    footer p {
      color: white;
    }
    
    footer p {
      margin: 5px 0;
    }
    
    /* Responsive Adjustments */
    @media (max-width: 600px) {
      h1 {
        font-size: 2rem;
      }
    
      p {
        font-size: 1rem;
      }
    
      main {
        padding: 10px;
      }
    
    }
</style>