<script>
    export let x;
    export let y;
    export let width = 20;
    export let height = 20;
</script>

<style>
    .bone {
        position: absolute;
        background-color: yellow;
    }
</style>

<div class="bone" style="left: {x}px; top: {y}px; width: {width}px; height: {height}px;"></div>
