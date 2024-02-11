const cursor = { x: 0, y: 0, movement: 0 };

document.addEventListener('mousemove', event => {
   cursor.movement = (event.clientX - cursor.x) ** 2 + (event.clientY - cursor.y) ** 2;
   cursor.x = event.clientX;
   cursor.y = event.clientY;
});

function tick(deltaTime) {
   deltaTime = Math.min(0.1, deltaTime);
   
   theButton.tick(deltaTime);
}

function getDistanceFromCursor(position) {
   return Math.sqrt((cursor.x - position.x) ** 2 + (cursor.y - position.y) ** 2);
}

function calculateBasicPanicingButtonSpeed(position) {
   return (window.innerWidth - Math.abs(cursor.x - position.x)) + (window.innerHeight - Math.abs(cursor.y - position.y)) / 25 * cursor.movement
}

const fearP = document.getElementById('fear');
const curiosityP = document.getElementById('curiosity');

class Button {
   static CURIOSITY_RANGE = 100;
   static FEAR_RANGE = 200;

   #element;
   #fear = 100;
   #curiosity = 60;
   #friend = false;
   #state = 'wandering';
   #waiting = 0;
   #stateRemainingTime = 3;
   #stateData = {};

   constructor(elementId) {
      this.#element = document.getElementById(elementId);
      this.position = new Position(window.innerWidth / 2, window.innerHeight / 2, this.#element);
      this.chooseRandomState();

      this.#element.onclick = () => {
         this.click();
      };

      document.addEventListener('mousedown', _ => {
         this.#curiosity = Math.min(100, this.#curiosity + 1);
      });
   }

   tick(deltaTime) {
      this.#fear = Math.max(0, this.#fear - deltaTime);
      this.#curiosity = Math.min(100, this.#curiosity + deltaTime);

      if(this.#waiting > 0) {
         this.#waiting -= deltaTime;
      } else {
         this.move(deltaTime);
         this.#stateRemainingTime -= deltaTime;
         if(this.#stateRemainingTime <= 0) {
            this.chooseRandomState();
            console.log(this.#state);
         }
      }

      if(this.#state !== 'fleeing' && ((this.#fear > 30 && cursor.movement > 2) || cursor.movement > 10 || (getDistanceFromCursor(this.position) < Button.FEAR_RANGE && this.#fear > 0))) {
         this.#fear = Math.min(100, this.#fear + 40 * deltaTime);
         if(this.isInCalmState()) {
            this.#curiosity = Math.max(0, this.#curiosity - 20);
         }
         this.#state = 'running';
         this.#waiting = 0;
         this.#stateRemainingTime = 1;
         this.#stateData = {
            directionX: -Math.sign(cursor.x - this.position.x),
            directionY: -Math.sign(cursor.y - this.position.y),
            speed: calculateBasicPanicingButtonSpeed(this.position)
         };
      }

      if(this.#friend) {
         this.position.x = cursor.x;
         this.position.y = cursor.y;
      }

      this.sync();
   }

   move(deltaTime) {
      switch(this.#state) {
         case 'running':
            const distance = getDistanceFromCursor(this.position);
         case 'wandering':
         case 'fleeing':
         case 'inspecting':
            this.position.x += this.#stateData.directionX * deltaTime * this.#stateData.speed;
            this.position.y += this.#stateData.directionY * deltaTime * this.#stateData.speed;
            if(this.#state === 'running') {
               const newDistance = getDistanceFromCursor(this.position);
               if(newDistance < distance) {
                  this.#stateData.directionX *= -1;
                  this.#stateData.directionY *= -1;
               }
            }
            break;
      }

      let outOfBoundsX = true;
      if(this.position.x < 0) {
         this.position.x = 0;
      } else if(this.position.x > window.innerWidth) {
         this.position.x = window.innerWidth;
      } else {
         outOfBoundsX = false;
      }
      if(outOfBoundsX) {
         this.#stateData.directionX *= -1;
      }

      let outOfBoundsY = true;
      if(this.position.y < 0) {
         this.position.y = 0;
      } else if(this.position.y > window.innerHeight) {
         this.position.y = window.innerHeight;
      } else {
         outOfBoundsY = false;
      }
      if(outOfBoundsY) {
         this.#stateData.directionY *= -1;
      }

      if(outOfBoundsX && outOfBoundsY && this.#state === 'running') {
         this.#state = 'fleeing';
         this.#stateRemainingTime = 1;
         this.#waiting = 0;
         const rand = Math.random();
         this.#stateData = {
            directionX: rand > 0.5 ? 1 : 0,
            directionY: rand > 0.5 ? 0 : 1,
            speed: calculateBasicPanicingButtonSpeed(this.position)
         };
      }
   }

   sync() {
      this.#element.style.top = `${ Math.round(this.position.y - this.#element.offsetHeight / 2) }px`;
      this.#element.style.left = `${ Math.round(this.position.x - this.#element.offsetWidth / 2) }px`;

      fearP.textContent = `Fear: ${ Math.round(this.#fear) }`;
      curiosityP.textContent = `Curiosity: ${ Math.round(this.#curiosity) }`;
   }

   chooseRandomState() {
      if(this.#curiosity >= 60 && getDistanceFromCursor(this.position) > Button.CURIOSITY_RANGE && Math.random() < this.#curiosity / 100) {
         this.#state = "inspecting";
         this.#stateRemainingTime = 3;
         this.#stateData = {
            directionX: (cursor.x - this.position.x) - Button.CURIOSITY_RANGE * Math.sign(cursor.x - this.position.x),
            directionY: (cursor.y - this.position.y) - Button.CURIOSITY_RANGE * Math.sign(cursor.y - this.position.y),
            speed: 0.1
         };
         this.#waiting = 0;
         return;
      }
      this.#state = "wandering";
      this.#stateRemainingTime = 3;
      this.#stateData = {
         directionX: Math.random() * 2 - 1,
         directionY: Math.random() * 2 - 1,
         speed: Math.random() * 40 + 20
      };
      this.#waiting = Math.random() * 3;
   }

   click() {
      if(this.#friend) {
         alert("Hihihi");
      } else if(!this.isInCalmState()) {
         alert("You clicked the button, but at what cost??? He died from shock! You monster!");
      } else {
         alert("Congratulations! You befriended the button! Now he loves you and want to be with you forever!");
         this.#friend = true;
      }
   }

   isInCalmState() {
      return this.#state === 'wandering' || this.#state === 'inspecting';
   }
}

class Position {
   #x;
   #y;

   constructor(x, y) {
      this.#x = x;
      this.#y = y;
   }

   set x(value) {
      this.#x = value;
   }
   get x() {
      return this.#x;
   }

   set y(value) {
      this.#y = value;
   }
   get y() {
      return this.#y;
   }
}

const theButton = new Button('the-button');

function startTick() {
   let lastTime = Date.now();
   function nextTick() {
      const time = Date.now();
      const deltaTime = time - lastTime;
      lastTime = time;
      tick(deltaTime / 1000);
      requestAnimationFrame(nextTick);
   }
   requestAnimationFrame(nextTick);
}

startTick();
