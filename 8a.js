function vowelCount(str) {
  const vowels = ['a','e','i','o','u'];
  const count = {};
  vowels.forEach(v => count[v] = 0);
  str.toLowerCase().split('').forEach(c => { if(count[c] !== undefined) count[c]++; });
  return `a, e, i, o, and u appear, respectively, ${vowels.map(v=>count[v]).join(', ')} times`;
}
console.log(vowelCount(process.argv[2]||"Le Tour de France"));



//npm start -- "Le Tour de France" = to run

//below in package.json
//"scripts": {
//"start": "node vowelCount.js"
//}

