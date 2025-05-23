alert('这是我的小猫哒哒哒，请帮助它吃掉所有的鱼吧！（点击确定开始游戏，请使用全屏游玩）');
  var parent = document.getElementById('parent');
  var game = new Phaser.Game(
      parent.clientWidth,
      parent.clientHeight,
      Phaser.CANVAS,
      'parent',
      {
          preload: preload,
          create: create,
          update: update
      }
  );

  window.addEventListener('resize', function() {
      game.scale.setGameSize(parent.clientWidth, parent.clientHeight);
  });

  var platforms;
  var fishes;
  var cat;
  var dogs;
  var dog=[];
  var left=[];
  var hp=3;
  var _hp=0;
  var diamond;
  var heart;
  var cursors;
  var score=0;
  var scoreText;

  function preload(){
      game.load.image('fish','images/fish.png');
      game.load.image('sky','images/sky.png');
      game.load.image('ground','images/platform.png');
      game.load.spritesheet('kitten','images/kitten.png',56,46);
      game.load.image('diamond','images/diamond.png');
      game.load.image('heart','images/heart.png');
      game.load.spritesheet('doggie','images/doggie.png',50,50);
  }

  function create(){

      game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
      game.physics.startSystem(Phaser.ARCADE);
      game.add.tileSprite(0, 0, game.width, game.height, 'sky');

      platforms = game.add.group();
      platforms.enableBody = true;

      var ledge = platforms.create(0, game.height*0.4+10, 'ground');
      ledge.body.immovable = true;
      ledge = platforms.create(game.width*0.5, game.height*0.66+10, 'ground');
      ledge.body.immovable = true;

      var ground = platforms.create(0, game.height-20, 'ground');
      ground.scale.setTo(game.width/400, 1);
      ground.body.immovable = true;

      cat = game.add.sprite(32, 32, 'kitten');
      game.physics.arcade.enable(cat);
      cat.body.gravity.y = 200;
      cat.body.collideWorldBounds = true;
      cat.animations.add('left',[0,1],10,true);
      cat.animations.add('right',[2,3],10,true);

      diamond = game.add.sprite(0,0,'diamond');
      game.physics.arcade.enable(diamond);
      heart = game.add.group();
      for (var i = 0; i < 3; i++) {
          heart.create(750+i*24,0,'heart');
          heart.scale.setTo(2,2);
      }
      diamond.x = -diamond.width;

      dogs = game.add.group();
      dogs.enableBody = true;
      for (var i = 0; i<4; i++) {
          dog[i] = dogs.create(i*game.width/4, game.height-32*2,'doggie');
      }
      dog[4] = dogs.create(
          900,
          game.height*0.66-32,
          'doggie'
      );
      dog[5] = dogs.create(
          100,
          game.height*0.4-32,
          'doggie'
      );
      for (var i = 0; i<6; i++) {
          dog[i].animations.add('left',[0,1],10,true);
          dog[i].animations.add('right',[2,3],10,true);
          left[i]=dog[i].x;
      }

      cursors = game.input.keyboard.createCursorKeys();

      fishes = game.add.group();
      fishes.enableBody = true;
      for (var i = 0; i<16; i++) {
          var fish = fishes.create(i*106,0,'fish');
          fish.body.gravity.y = 300;
          fish.body.bounce.y = 0.7+Math.random()*0.2;
      }

      scoreText = game.add.text(16,16,'score：'+ score,{fontSize:'32px',fill:'#000'});
  }

  var x=1;
  var direction='right';
  function update(){
      game.physics.arcade.collide(cat,platforms);
      game.physics.arcade.collide(fishes,platforms);
      game.physics.arcade.overlap(fishes,cat,kitteneatfish,null,this);

      if (cursors.left.isDown) {
          cat.body.velocity.x = -150;
          cat.animations.play('left');
      } else if (cursors.right.isDown) {
          cat.body.velocity.x = 150;
          cat.animations.play('right');
      } else {
          cat.body.velocity.x = 0;
          cat.frame = 4;
      }

      if (cursors.up.isDown && cat.body.touching.down) {
          cat.body.velocity.y = -350;
      }

      game.physics.arcade.overlap(cat,diamond,function(){
        diamond.kill();
        alert('哒哒哒成功吃掉了所有鱼！ヽ(=^･ω･^=)丿');
        location.reload();
      });

      game.physics.arcade.overlap(dogs,cat,isDead,null,this);
      for (var i = 0; i < dog.length; i++) {
          dog[i].x += x;
          dog[i].animations.play(direction);
          if (dog[i].x >= left[i]+250){
              x = -x;
              direction = 'left';
          }
          if (dog[i].x < left[i]){
              x = -x;
              direction = 'right';
          }
      }
  }

  function kitteneatfish(cat,fish){
      fish.kill();
      score +=1;
      scoreText.text = 'score：' + score;
      if (score == 16) {
          diamond.x = game.width/2-16;
          diamond.y = game.height/3-14;
      }
  }

  function isDead(cat,dogs){
      dogs.kill();
      heart.getChildAt(_hp).kill();
      hp -=1;
      _hp +=1;
      if (hp == 0) {
          alert('失败了，再试一次吧(=ｘェｘ=)');
          location.reload();
      }
  }
