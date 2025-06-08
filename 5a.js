function pluralize(noun, count) {
  const irregular = { sheep: 'sheep', goose: 'geese' };
  let word = irregular[noun] || (count === 1 ? noun : noun + 's');
  return `${count} ${word}`;
}
console.log(pluralize("cat", 5)); // 5 cats
console.log(pluralize("goose", 2)); // 2 geese
console.log(pluralize("dog", 1));