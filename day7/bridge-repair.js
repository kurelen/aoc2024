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

function into_problems(value, line) {
  const [aim, ...values] = line
		.split(/:? /)
		.map(s => parseInt(s,10));
	value.push({
    aim,
		values
	});
	return value;	
}

function is_solvable({ aim, values }) {
	if (values.length === 0) {
    return false;
	}
	if (values.length === 1 && aim === values[0]) {
    return true;
	}
	const last = values.at(-1);
	values = values.slice(0, -1);
	if (aim % last === 0) {
    return is_solvable({
			aim: aim - last, 
			values
		}) || is_solvable({
			aim: aim / last,
			values
		});

	} else {
    return is_solvable({
			aim: aim - last,
			values
		});
	}
  return true;
}

function process_part_one(problems) {
	return problems
		.filter(is_solvable)
	  .reduce((acc, { aim }) => acc + aim, 0);
}

function process_part_two(lines) {
	return false;
}

process_input("input", into_problems, [])
  .then((problems) => {
    console.log("Solution part one: ", process_part_one(problems));
    console.log("Solution part two: ", process_part_two(problems));
  })

