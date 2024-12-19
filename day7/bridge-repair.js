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

function into_lines(value, line) {
  const [aim, ...values] = line
		.split(/:? /)
		.map(s => parseInt(s,10));
	value.push({
    aim,
		values
	});
	return value;	
}

function process_part_one(lines) {
	return false;
}

function process_part_two(lines) {
	return false;
}

process_input("input", into_lines, [])
  .then((lines) => {
		console.log(lines);
    console.log("Solution part one: ", process_part_one(lines));
    console.log("Solution part two: ", process_part_two(lines));
  })

