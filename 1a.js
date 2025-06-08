function translate(text) {
  return text.replace(/([bcdfghjklmnpqrstvwxyz])/gi, c => c + 'o' + c);
}
console.log(translate("this is fun ")); 