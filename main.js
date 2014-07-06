// Initialize Phaser, and create a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.Auto, 'game_div');

// Create a new 'main' state that will contain the game
var main_state = {
    // Function called first to load all the assets
    preload: function() {
       // Change the background color of the game
       this.game.stage.backgroundColor = '#71C5CF';
       
       // Load the bird sprite
       this.game.load.image('bird', './assets/bird.png');
       
       // Load the pipe sprite
       this.game.load.image('pipe', './assets/pipe.png');
    },
    
    // Function called after 'preload' to setup the game
    create: function() {
        // Display the bird on screen
        this.bird = this.game.add.sprite(100, 245, 'bird');
        
        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;
        
        // Call the 'jump' function when the spacekey is hit
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this);
        
        // Create the pipes
        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe');
        
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);
        
        // Create the scoreboard
        this.score = 0;
        var style = {font: "30px Arial", fill: "#fff"};
        this.label_score = this.game.add.text(20, 20, "0", style);
    },
    
    // Function called 60 times per second
    update: function() {
        // If the bird is out of the world (too high or too low), call the restart_game function
        if (this.bird.inWorld === false) {
            this.restart_game();
        }
        
        this.game.physics.overlap(this.bird, this.pipes, this.restart_game, null, this);
    },
    
    // Function to make the bird jump
    jump: function() {
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
    },
    
    // Function to restart the game
    restart_game: function() {
        // Remove the timer
        this.game.time.events.remove(this.timer);
        
        // Start the 'main' state, which restarts the game
        this.game.state.start('main');
    },
    
    // Function to add pipes to the game
    add_one_pipe: function(x, y) {
       // Get the first dead pipe of the group
       var pipe = this.pipes.getFirstDead();
       
       // Set the new position of the pipe
       pipe.reset(x, y);
       
       // Add velocity to the pipe to make it move left
       pipe.body.velocity.x = -200;
       
       // Kill the pipe when it's no longer visible
       pipe.outOfBoundsKill = true;
    }, 
    
    // Function to display 6 pipes in a row with a hole somewhere
    add_row_of_pipes: function() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole +1) {
                this.add_one_pipe(400, i*60+10);
            }
        }
        
        this.score += 1;
        this.label_score.content = this.score
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', main_state);
game.state.start('main');