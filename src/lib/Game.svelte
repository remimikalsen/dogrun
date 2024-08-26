    <script>
        import { onMount, tick } from 'svelte';
        import { bonesCollected, currentLevel } from '$lib/stores.js';
        import { levels } from '$lib/levels.js'; 
        import Dog from '$lib/Dog.svelte'; // comes with certain default values
        import Goal from '$lib/Goal.svelte';
        import Spike from '$lib/Spike.svelte';
        import Platform from '$lib/Platform.svelte';
        import Bone from '$lib/Bone.svelte';    

        let gameContainer; // Reference to the game container
        
        let pressedKeys = new Set();
        let lastDirection = null; // Track the last direction pressed        

        let gameOver;
        let reachedGoal;
        let velocityY;
        let speed;
        let cameraOffsetX;
        let dogSpeed;
        let jumping;
        let directionChanged;
        let screenWidth;
        let groundHeight;

        let gravity = 0.5;
        let defaultSpeed = 2;
        const gameContainerHeight = 400;

        let dog = {};
        let goal = {};
        let platforms = [];
        let spikes = [];
        let bones = [];
        
        let dogState = 'normal';
        let showGame = false;
        let message = '';
        let showMessageWrapper = false;

        $: if (showGame) {
            // If the game is active, focus on the gameContainer and calculate the width
            tick().then(() => {
                if (gameContainer) {
                    gameContainer.focus();
                    screenWidth = gameContainer.clientWidth;
                }
            });
        }

        onMount(() => {
            generateLevel($currentLevel);

            // Automatically focus the game container when the component is mounted
            //gameContainer.focus();

            const gameLoop = setInterval(() => {
                if (!gameOver) {
                    update();
                }
            }, 10);
            return () => clearInterval(gameLoop);
        });


        function generateLevel(level) {
            if (level < 1 || level > levels.length) {
                throw new Error(`Invalid current level: ${level}`);
            }

            const levelData = levels[level - 1];

            if (!levelData) {
                throw new Error(`Level data is undefined for level: ${level}`);
            }

            pressedKeys = new Set();
            lastDirection = null; // Track the last direction pressed

            groundHeight = gameContainerHeight - levelData.groundHeight;
            console.log(groundHeight);

            platforms = levelData.platforms.map(platform => ({
                ...platform,
                y: groundHeight - platform.y,
            }));
            console.log("Platforms:", platforms);
            spikes = levelData.spikes.map(spike => ({
                ...spike,
                y: groundHeight - spike.y - spike.height,
            }));
            console.log("Spikes:", spikes);
            bones = levelData.bones.map(bone => ({
                ...bone,
                y: groundHeight - bone.y - bone.height,
            }));
            console.log("Bones:", bones);
            dog = { ...levelData.dog };
            // Adjust the dog's y to be relative to the ground height
            dog.y = groundHeight - dog.y;
            console.log(dog);

            goal = { ...levelData.goal };
            // Adjust the goal's y to match the ground height
            goal.y = groundHeight - goal.y;
            console.log(goal);

            velocityY = 0;
            cameraOffsetX = 0;
            dogSpeed = 0;
            speed = defaultSpeed;
            reachedGoal = false;
            gameOver = false;
            jumping = false;
            directionChanged = false;


            showGame = true;
            showMessageWrapper = false;
        }

        function update() {

            if (!showGame) {
                return;
            }

            velocityY += gravity;
            dog.y += velocityY;


            // Determine the dog's state based on velocity and direction
            
            if (velocityY < gravity) {
                if (dogSpeed < 0) {
                    dogState = 'jumping-left';
                } else {
                    dogState = 'jumping-right';
                }
            } else if (velocityY > gravity) {
                if (dogSpeed < 0) {
                    dogState = 'landing-left';
                } else {
                    dogState = 'landing-right';
                }
            } else if (dogSpeed < 0) {
                dogState = 'turning-left';
            } else {
                 dogState = 'turning-right';
            }
            
            
            if (goal.x - cameraOffsetX + goal.width <= 0) {
                gameOver = true;
                handleGameOver();
            } else if (goal.x - cameraOffsetX <= screenWidth - goal.width) {
                reachedGoal = true;
                //speed = 1; // Reduced speed to make the game feel more continuous when goal is in sight
                cameraOffsetX += speed;
            } else {
                cameraOffsetX += speed;
            }
            
            dog.x += dogSpeed;

            if (dog.x < 0) dog.x = 0;
            if (dog.x > screenWidth - dog.width) dog.x = screenWidth - dog.width;

            let onGround = false;
            let inHole = true;

            platforms.forEach(platform => {
                if (dog.x + dog.width > platform.x - cameraOffsetX && dog.x < platform.x + platform.width - cameraOffsetX) {
                    if (dog.y + dog.height > platform.y && dog.y + dog.height < platform.y + platform.height + 10) {
                        dog.y = platform.y - dog.height;
                        velocityY = 0;
                        onGround = true;
                        inHole = platform.type !== 'hole';
                        jumping = false;
                        directionChanged = false;
                    }
                }
            });

            if (!onGround && dog.y + dog.height >= groundHeight) {
                dog.y = groundHeight - dog.height;
                velocityY = 0;
                jumping = false;
                directionChanged = false;
                inHole = false;
            }

            spikes.forEach(spike => {
                if (checkCollision(dog, { ...spike, x: spike.x - cameraOffsetX })) {
                    gameOver = true;
                    handleGameOver();
                }
            });

            bones = bones.filter(bone => {
                if (checkCollision(dog, { ...bone, x: bone.x - cameraOffsetX })) {
                    bonesCollected.update(n => n + 1); // Update the bone count directly
                    return false;
                }
                return true;
            });

            if (checkCollision({ ...dog, x: dog.x + cameraOffsetX }, goal)) {
                reachedGoal = true;
                speed = 0;
                handleLevelCompletion();
            }

            if (inHole && dog.y + dog.height >= groundHeight) {
                gameOver = true;
                handleGameOver();
            }
        }

        function checkCollision(rect1, rect2) {
            return (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y
            );
        }

        function handleKeyDown(event) {
            
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                // Prevent default action for ArrowUp and ArrowDown keys
                event.preventDefault();
                return;
            }            

            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === ' ') {
                pressedKeys.add(event.key);
            }

            if (event.key === 'ArrowRight') {
                dogSpeed = 5;
                lastDirection = 'right';
            } else if (event.key === 'ArrowLeft') {
                dogSpeed = -5;
                lastDirection = 'left';
            } else if (event.key === ' ') {
                jump();
            }
        }

        function handleKeyUp(event) {
            pressedKeys.delete(event.key);

            if (!pressedKeys.has('ArrowRight') && !pressedKeys.has('ArrowLeft')) {
                dogSpeed = 0;
            } else if (pressedKeys.has('ArrowRight')) {
                dogSpeed = 5;
                lastDirection = 'right';
            } else if (pressedKeys.has('ArrowLeft')) {
                dogSpeed = -5;
                lastDirection = 'left';
            }
        }

        function jump() {
            if (dog.y + dog.height >= groundHeight || platforms.some(p => dog.y + dog.height == p.y)) {
                velocityY = -12;
                jumping = true;
                directionChanged = false;
            }
        }

        function handleVirtualKey(direction) {
            if (direction === 'right') {
                //if (!jumping || (jumping && !directionChanged)) {
                    dogSpeed = 5;
                //    if (jumping) directionChanged = true;
                //}
            } else if (direction === 'left') {
                //if (!jumping || (jumping && !directionChanged)) {
                    dogSpeed = -5;
                //    if (jumping) directionChanged = true;
                //}
            } else if (direction === 'jump') {
                jump();
            }
        }

        function handleVirtualKeyUp() {
            dogSpeed = 0;
        }

        function handleLevelCompletion() {
            showGame = false;
            showMessageWrapper = true;
            if ($currentLevel < levels.length) {
                message = `Level ${$currentLevel} of ${levels.length} complete! Ready for the next level?`;
            } else {
                message = `You won! Final Score: ${$bonesCollected}`;
            }
        }

        function handleGameOver() {
            showGame = false;
            showMessageWrapper = true;
            message = `Game Over. Final Score: ${$bonesCollected}`;
        }    
    </script>

    <style>
        .game-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 20px;
            width: 100%;
        }

        .game-wrapper.game-paused {
            display: none;
        }
        .game-container {
            width: 100%;
            max-width: 900px;
            min-width: 300px;
            height: 400px;
            border: 2px solid black;
            position: relative;
            overflow: hidden;
            background-color: skyblue;
        }

        .ground {
            position: absolute;
            width: 100%;
            height: 50px;
            background-color: green;
            bottom: 0;
        }

        .platform {
            position: absolute;
            background-color: gray;
        }

        .spike {
            position: absolute;
            background-color: red;
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }

        .bone {
            position: absolute;
            background-color: yellow;
        }
        
        .virtual-keypad {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        .virtual-key {
            width: 50px;
            height: 50px;
            margin: 5px;
            background-color: lightgray;
            text-align: center;
            line-height: 50px;
            font-size: 20px;
            border: 2px solid black;
            border-radius: 10px;
            cursor: pointer;
        }
        .message-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 20px;
            width: 100%;
            text-align: center;
        }

        .message-wrapper h1 {
            margin-bottom: 20px;
        }

        .message-wrapper button {
            padding: 10px 20px;
            font-size: 16px;
            margin-top: 10px;
            cursor: pointer;
        }

    </style>

    {#if showMessageWrapper}
        <div class="message-wrapper">
            <h1>{message}</h1>
            {#if reachedGoal && $currentLevel < levels.length}
                <button on:click={() => { currentLevel.update(n => n + 1); generateLevel($currentLevel); }}>Next Level</button>
            {/if}
            {#if gameOver}
                <button on:click={() => { location.reload(); }}>Restart</button>
            {/if}
            {#if reachedGoal && $currentLevel >= levels.length}
                <button on:click={() => { location.reload(); }}>Play Again</button>
            {/if}
        </div>
    {/if}

    {#if showGame}
    <div class="game-wrapper">
        <div
            bind:this={gameContainer}
            class="game-container"
            on:keydown={handleKeyDown}
            on:keyup={handleKeyUp}
            tabindex="0"
        >
            <div class="ground"></div>
            {#if !gameOver && showGame}
                <Dog x={dog.x} y={dog.y} state={dogState} />
                {#each platforms as platform}
                    {#if platform.type !== 'hole'}
                    <Platform x={platform.x - cameraOffsetX} y={platform.y} width={platform.width} height={platform.height}  />
                    {/if}
                {/each}
                {#each spikes as spike}
                    <Spike x={spike.x - cameraOffsetX} y={spike.y} width={spike.width} height={spike.height} />
                {/each}
                {#each bones as bone}
                    <Bone x={bone.x - cameraOffsetX} y={bone.y} width={bone.width} height={bone.height} />
                {/each}
                <Goal x={goal.x - cameraOffsetX} y={goal.y} />
            {:else}
                <h1>Game Over</h1>
                <p>Score: {$bonesCollected}</p>
                <button on:click={() => location.reload()}>Restart</button>
            {/if}
        </div>

        <div class="virtual-keypad">
            <div class="virtual-key" on:mousedown={() => handleVirtualKey('left')} on:mouseup={handleVirtualKeyUp}>◀</div>
            <div class="virtual-key" on:mousedown={() => handleVirtualKey('jump')} on:mouseup={handleVirtualKeyUp}>▲</div>
            <div class="virtual-key" on:mousedown={() => handleVirtualKey('right')} on:mouseup={handleVirtualKeyUp}>▶</div>
        </div>
    </div>
    {/if}