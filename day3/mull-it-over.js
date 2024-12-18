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

const DONT_OP = 0
const DO_OP = 1
const MUL_OP = 2

const parser_regex = /(?<do_op>do\(\))|(?<dont_op>dont\(\))|(?<mul_op>mul)\((?<a>\d+),(?<b>\d+)\)/g
function into_operations(result, line) {
	const matches = line.matchAll(parser_regex);
	for (const match of matches) {
		const groups = match.groups;
		if (groups.do_op) {
      result.push([DO_OP]);
		} else if (groups.dont_op) {
      result.push([DONT_OP]);
		} else if (groups.mul_op) {
			const a = parseInt(groups.a, 10);
			const b = parseInt(groups.b, 10);
			result.push([MUL_OP, a, b]);
		}
	}
	return result;
}

function process_part_one(ops) {
	return ops.reduce(
		(acc, [op, a, b]) => op === MUL_OP ? acc + a * b : acc
		, 0
	);
}

function process_part_two(ops) {
	return false
}

process_input("input", into_operations, [])
  .then((ops) => {
    console.log("Solution part one: ", process_part_one(ops));
    //console.log("Solution part two: ", process_part_two(lists));
  })
