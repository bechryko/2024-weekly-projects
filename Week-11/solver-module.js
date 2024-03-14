class Tree {
   constructor(value) {
      if(Array.isArray(value)) {
         value = new Set(value);
      } else {
         value = new Set([ value ]);
      }
      this.root = new TreeNode(value);
   }

   getUnfinishedNodes() {
      const unfinishedNodes = [];
      this.root.getUnfinishedNodes(unfinishedNodes);
      return unfinishedNodes;
   }

   getLeaves() {
      const leaves = [];
      this.root.getLeaves(leaves);
      return leaves;
   }

   log() {
      return this.root.log();
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

   isLeaf() {
      return this.leftChild === null && this.rightChild === null;
   }

   getLeaves(leaves) {
      if(this.isLeaf()) {
         leaves.push(this);
      } else {
         this.leftChild?.getLeaves(leaves);
         this.rightChild?.getLeaves(leaves);
      }
   }

   getUnfinishedNodes(unfinishedNodes) {
      if(this.isLeaf() && !this.isFinished()) {
         unfinishedNodes.push(this);
      } else {
         this.leftChild?.getUnfinishedNodes(unfinishedNodes);
         this.rightChild?.getUnfinishedNodes(unfinishedNodes);
      }
   }

   isFinished() {
      if(this.isClosed()) {
         return true;
      }

      let isOpen = true;
      this.value.forEach(formule => {
         if(formule.length > 2) {
            isOpen = false;
         }
      });
      return isOpen;
   }

   isClosed() {
      for(const formule of this.value) {
         const negatedFormule = negate(formule);
         if(this.value.has(negatedFormule)) {
            return true;
         }
      }
      return false;
   }

   getIterator() {
      return this.value[Symbol.iterator]();
   }

   convertToAssignment() {
      const assignment = {};
      this.value.forEach(formule => {
         const isNegated = formule[0] === '-';
         const formuleCore = isNegated ? formule.slice(1) : formule;
         if(formuleCore.length > 2) {
            throw Error('Only literal sets can be converted into assignments.');
         }
         if(assignment[formuleCore] !== undefined) {
            throw Error('Only satisfyable literal sets can be converted into assignments. Colliding literal: ' + formuleCore);
         }
         assignment[formuleCore] = !isNegated;
      });
      return assignment;
   }

   log() {
      const children = [];
      this.leftChild && children.push(this.leftChild);
      this.rightChild && children.push(this.rightChild);
      if(children.length === 0) {
         return this.value;
      } else {
         console.log(this.toString() + " -> " + children.map(node => node.toString()).join(", "));
      }

      children.forEach(child => child.log());
   }

   toString() {
      return `{ ${ [...this.value].join(", ") } }`;
   }
}

function runTableauxMethod(tree, debug = false) {
   let unfinishedNodes;
   while(unfinishedNodes = tree.getUnfinishedNodes(), unfinishedNodes.length) {
      const unfinishedCase = unfinishedNodes[0];

      let unfinishedFormule;
      for(const formule of unfinishedCase.value) {
         if(formule.length > 2) {
            unfinishedFormule = formule;
            break;
         }
      }

      const [ formuleType, firstFormule, secondFormule ] = getFormuleType(unfinishedFormule);
      if(formuleType === 'alpha') {
         const newBranch = new Set(unfinishedCase.getIterator());
         newBranch.delete(unfinishedFormule);
         newBranch.add(firstFormule);
         newBranch.add(secondFormule);
         unfinishedCase.setLeftChild(newBranch);
      } else {
         const newBranch1 = new Set(unfinishedCase.getIterator());
         newBranch1.delete(unfinishedFormule);
         newBranch1.add(firstFormule);
         unfinishedCase.setLeftChild(newBranch1);

         const newBranch2 = new Set(unfinishedCase.getIterator());
         newBranch2.delete(unfinishedFormule);
         newBranch2.add(secondFormule);
         unfinishedCase.setRightChild(newBranch2);
      }
   }

   logSolution(tree, debug);
}

function logSolution(tree, debug) {
   if(debug) {
      tree.log();
   }

   let satisfyingLeaf = tree.getLeaves().find(leaf => !leaf.isClosed());
   if(!satisfyingLeaf) {
      console.log('The formula is not satisfiable.');
   } else {
      console.log('The formula is satisfiable.\nA satisfying assignment is:', satisfyingLeaf.convertToAssignment());
   }
}

const logicalConnectives = ['&', '|', '>', '='];

function analyzeFormule(formule) {
   const isNegated = formule[0] === '-';
   const formuleCore = trimBrackets(isNegated ? formule.slice(1) : formule);

   let bracketDepth = 0;
   for(let i = 0; i < formuleCore.length; i++) {
      const char = formuleCore[i];
      if(char === '(') {
         bracketDepth++;
      } else if(char === ')') {
         bracketDepth--;
      } else if(bracketDepth === 0 && logicalConnectives.includes(char)) {
         return [ char, isNegated, formuleCore.slice(0, i), formuleCore.slice(i + 1) ];
      }
   }

   throw Error('No outest sign found: ' + formuleCore);
}

const alphaFormules = [
   {
      outestSign: '&',
      isNegated: false,
      firstFormule: (p, q) => p,
      secondFormule: (p, q) => q
   },
   {
      outestSign: '|',
      isNegated: true,
      firstFormule: (p, q) => negate(p),
      secondFormule: (p, q) => negate(q)
   },
   {
      outestSign: '>',
      isNegated: true,
      firstFormule: (p, q) => p,
      secondFormule: (p, q) => negate(q)
   },
   {
      outestSign: '=',
      isNegated: false,
      firstFormule: (p, q) => p + ">" + q,
      secondFormule: (p, q) => q + ">" + p
   
   }
];

const betaFormules = [
   {
      outestSign: '&',
      isNegated: true,
      firstFormule: (p, q) => negate(p),
      secondFormule: (p, q) => negate(q)
   },
   {
      outestSign: '|',
      isNegated: false,
      firstFormule: (p, q) => p,
      secondFormule: (p, q) => q
   },
   {
      outestSign: '>',
      isNegated: false,
      firstFormule: (p, q) => negate(p),
      secondFormule: (p, q) => q
   },
   {
      outestSign: '=',
      isNegated: true,
      firstFormule: (p, q) => negate("(" + p + ">" + q + ")"),
      secondFormule: (p, q) =>  negate("(" + q + ">" + p + ")")
   }
];

function getFormuleType(formule) {
   const [ outestSign, isNegated, firstPart, secondPart ] = analyzeFormule(formule);

   const alphaFormule = alphaFormules.find(formule => formule.outestSign === outestSign && formule.isNegated === isNegated);
   if(alphaFormule) {
      return [ 'alpha', alphaFormule.firstFormule(firstPart, secondPart), alphaFormule.secondFormule(firstPart, secondPart) ];
   }

   const betaFormule = betaFormules.find(formule => formule.outestSign === outestSign && formule.isNegated === isNegated);
   if(betaFormule) {
      return [ 'beta', betaFormule.firstFormule(firstPart, secondPart), betaFormule.secondFormule(firstPart, secondPart) ];
   }

   throw Error('No alpha nor beta formule found for: ' + formule);
}

function negate(formule) {
   return formule[0] === '-' ? formule.slice(1) : '-' + formule;
}

function trimBrackets(formule) {
   let bracketDepth = 0;
   for(let i = 0; i < formule.length; i++) {
      const char = formule[i];
      if(char === '(') {
         bracketDepth++;
      } else if(char === ')') {
         bracketDepth--;
      } else if(bracketDepth === 0) {
         return formule;
      }
   }

   if(formule[0] === '(' && formule[formule.length - 1] === ')') {
      return formule.slice(1, -1);
   }
   return formule;
}

const inputFormule = [ "p>q", "q>r", "-(p>-r)" ];
// const inputFormule = "-((p>(q>r))>((p>q)>(p>r)))";

runTableauxMethod(new Tree(inputFormule), true);
