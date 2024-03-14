function runTableauxMethod(branches) {
   while(!branches.every(branch => isFinished(branch))) {
      const unfinishedCase = branches.find(branch => !isFinished(branch));
      const unfinishedFormule = unfinishedCase.find(formule => formule.length > 2);
      const [ formuleType, firstFormule, secondFormule ] = getFormuleType(unfinishedFormule);
      if(formuleType === 'alpha') {
         unfinishedCase.splice(unfinishedCase.indexOf(unfinishedFormule), 1, firstFormule, secondFormule);
      } else {
         const newBranch = unfinishedCase.slice();
         unfinishedCase.splice(unfinishedCase.indexOf(unfinishedFormule), 1, firstFormule);
         newBranch.splice(newBranch.indexOf(unfinishedFormule), 1, secondFormule);
         branches.push(newBranch);
      }
   }

   logSolution(branches);
}

function logSolution(branches) {
   console.log('The branches are:', branches);
   if(branches.every(branch => isClosed(branch))) {
      console.log('The formula is not satisfiable.');
   } else {
      console.log('The formula is satisfiable.');
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

function isFinished(branch) {
   return branch.every(formule => formule.length <= 2) || isClosed(branch);
}

function isClosed(branch) {
   for(const formule of branch) {
      const negatedFormule = negate(formule);
      if(branch.includes(negatedFormule)) {
         return true;
      }
   }
   return false;
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

if(Array.isArray(inputFormule)) {
   runTableauxMethod([ inputFormule ]);
} else {
   runTableauxMethod([ [ inputFormule ] ]);
}
