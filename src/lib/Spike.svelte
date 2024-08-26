<script>
    export let x;
    export let y;
    export let width = 20;
    export let height = 20;
</script>

<style>
    .spike {
        position: absolute;
        background-color: red;
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    }
</style>

<div class="spike" style="left: {x}px; top: {y}px; width: {width}px; height: {height}px;"></div>
