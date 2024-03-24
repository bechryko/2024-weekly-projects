class Drawer {
   #drawStyle;

   constructor(canvas) {
      this.canvas = canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.ctx = canvas.getContext('2d');
      this.fontSize = 20;
      this.ctx.font = `${ this.fontSize }px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
   }

   set drawStyle(style) {
      this.#drawStyle = style;
      this.ctx.fillStyle = style;
      // this.ctx.strokeStyle = style;
   }

   get drawStyle() {
      return this.#drawStyle;
   }

   get padding() {
      return this.fontSize * 2;
   }

   get nodeDistance() {
      return this.fontSize * 8;
   }

   line(x1, y1, x2, y2) {
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
   }
}

const closedColor = '#ff0000';
const openColor = '#228b22';

const canvas = document.getElementById('main-canvas');
const drawer = new Drawer(canvas);

function drawTableaux(tableauxTree, drawer) {
   drawNode(tableauxTree.root, drawer.canvas.width / 2, drawer.padding, drawer);
}

function drawNode(node, x, y, drawer) {
   if(node.rightChild) {
      drawNode(node.leftChild, x - drawer.nodeDistance, y + drawer.nodeDistance, drawer);
      drawer.line(x, y + drawer.padding, x - drawer.nodeDistance, y + drawer.nodeDistance - drawer.padding);
      const wasLeftOpen = drawer.drawStyle === openColor;

      drawNode(node.rightChild, x + drawer.nodeDistance, y + drawer.nodeDistance, drawer);
      drawer.line(x, y + drawer.padding, x + drawer.nodeDistance, y + drawer.nodeDistance - drawer.padding);
      const wasRightOpen = drawer.drawStyle === openColor;

      drawer.drawStyle = (wasLeftOpen || wasRightOpen) ? openColor : closedColor;
   } else if(node.leftChild) {
      drawNode(node.leftChild, x, y + drawer.nodeDistance, drawer);
      drawer.line(x, y + drawer.padding, x, y + drawer.nodeDistance - drawer.padding);
   } else {
      drawer.drawStyle = node.isClosed() ? closedColor : openColor;
   }

   drawer.ctx.fillText(node.parsedValue, x, y);
}

drawTableaux(testTree, drawer);
