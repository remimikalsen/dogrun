<script>
    export let x;
    export let y;
    export let width = 150;
    export let height = 20;
</script>

<style>
    .platform {
        position: absolute;
        background-color: gray;
    }
</style>

<div class="platform" style="left: {x}px; top: {y}px; width: {width}px; height: {height}px;"></div>
