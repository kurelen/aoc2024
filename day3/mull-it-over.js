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

const mul_regex = /mul\((\d+),(\d+)\)/g
function into_number(result, line) {
	const matches = line.matchAll(mul_regex);
	for (const match of matches) {
		const a = parseInt(match[1], 10);
		const b = parseInt(match[2], 10);
		result += a * b;
	}
	return result;
}

function process_part_one(terms) {
	return terms
}

function process_part_two(reports) {
	return false
}

process_input("input", into_number, 0)
  .then((lists) => {
    console.log("Solution part one: ", process_part_one(lists));
    console.log("Solution part two: ", process_part_two(lists));
  })
