//Static Utility Variables
readline = null;
rl = null;

class Utility {
  static CreateFunction(owner, func) {
    return function() { return func.apply(owner, arguments) };
  }
}