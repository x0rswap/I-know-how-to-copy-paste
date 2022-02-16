// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.8;

contract Counter {
  uint public maxprime = 1;
  error DividedBy(uint y);
  event NewMessage(address indexed from, uint256 timestamp, string message, uint256 maxprime);
  struct Message {
    address waver; // The address of the user who waved.
    string message; // The message the user sent.
    uint256 timestamp; // The timestamp when the user waved.
    uint256 prime_used;
}
  Message[] list_message;
  constructor() {
  }
  function all_messages() public view returns(Message[] memory) {
    return list_message;
  }
  function check_if_prime(uint x, uint sqrt_x) public pure returns(bool) {
    if(x == 1) revert DividedBy(1);
    require(sqrt_x * sqrt_x >= x, "Please give a good square root");
    uint y = sqrt_x;
    if (sqrt_x >= x-1)
      y = x-1;
    for(; y > 1; y--) {
      if (x % y == 0) revert DividedBy(y);
    }
    return true;
  }
  /*
  function new_message(string memory message, uint prime) public {
    //If no hint we compute it ourself the square root
    uint hint = 0;
    for (uint n = 1; n < prime; n++) {
      if (n * n >= prime) {
        hint = n;
        break;
      }
    }
    this.new_message(message, prime, hint);
  }
  */
  function new_message(string memory message, uint prime, uint hint) public {
    require(prime > maxprime); maxprime = prime;
    check_if_prime(prime, hint); //Reverts if not prime. Cannot return false
    emit NewMessage(msg.sender, block.timestamp, message, maxprime);
    list_message.push(Message(msg.sender, message, block.timestamp, maxprime));
  }
}
