class Tree {
   constructor(value) {
      if(Array.isArray(value)) {
         value = new Set(value);
      } else {
         value = new Set([ value ]);
      }
      this.root = new TreeNode(value);
   }
}

class TreeNode {
   constructor(value, parent = null) {
      this.value = value;
      this.leftChild = null;
      this.rightChild = null;
      this.parent = parent;
   }

   setLeftChild(value) {
      this.leftChild = new TreeNode(value, this);
   }

   setRightChild(value) {
      this.rightChild = new TreeNode(value, this);
   }

   isClosed() {
      for(const value of this.value) {
         if(value.includes("closed")) {
            return true;
         }
      }
      return false;
   }

   toString() {
      return `{ ${ [...this.value].join(", ") } }`;
   }

   get parsedValue() {
      return this.toString();
   }
}

const testTree = new Tree("root node");
const root = testTree.root;
root.setLeftChild([ "inner node 1" ]);
root.leftChild.setLeftChild([ "closed node 1" ]);
root.leftChild.setRightChild([ "inner node 2" ]);
root.leftChild.rightChild.setLeftChild([ "inner node 3" ]);
root.leftChild.rightChild.leftChild.setLeftChild([ "open node 1" ]);
root.leftChild.rightChild.setRightChild([ "closed node 2" ]);
