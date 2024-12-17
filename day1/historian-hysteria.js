const fs = require("node:fs");
const readline = require("node:readline");

async function process_input(
  filename,
  reducer,
  initialValue
) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filename),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    initialValue = reducer(initialValue, line);
  }
  return initialValue;
}

const whitespace = /\s+/g
function into_lists(lists, line) {
  const [left, right] = lists
  const [l, r] = line.split(whitespace)
    .map(s => parseInt(s, 10));
  left.push(l);
  right.push(r);
  return lists;
}

function process_lists(lists) {
  const [left, right] = lists;
  left.sort();
  right.sort();.
  return left.reduce((sum, value, idx) => 
    sum + Math.abs(value - right[idx])  
  );
}

process_input("input", into_lists, [[],[]])
  .then(process_lists);
