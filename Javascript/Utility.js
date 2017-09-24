class Utility {
  /**
   * Creates a function maintaining the 'this' context.
   * @param owner
   * @param func
   * @returns {Function}
   * @constructor
   */
  static CreateFunction(owner, func) {
    return function() { return func.apply(owner, arguments) };
  }

  /**
   * Removes all elements from a node.
   * @param node
   * @constructor
   */
  static RemoveElements(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  static IsOdd(num) { return (num % 2) === 1;}
  static IsEven(num) { return (num % 2) === 0;}
}