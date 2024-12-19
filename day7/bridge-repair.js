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
	return (aim % last === 0 && is_solvable({
		aim: aim / last,
		values
	})) || is_solvable({
		aim: aim - last,
		values
	});
}

function process_part_one(problems) {
	return problems
		.filter(is_solvable)
	  .reduce((acc, { aim }) => acc + aim, 0);
}

function is_concatenated(num, to_test) {
	return num.toString().endsWith(to_test.toString());
	return result;
}

function split_end(num, to_test) {
	const result = parseInt(
		num.toString().slice(
			0,
			-1 * to_test.toString().length
		),
		10);
	return result;
}

function is_solvable_2({ aim, values }) {
	if (values.length === 0) {
    return false;
	}
	if (values.length === 1 && aim === values[0]) {
    return true;
	}
	const last = values.at(-1);
	values = values.slice(0, -1);
	return (aim % last === 0
		&& is_solvable_2({
			aim: aim / last,
			values
		}))
		|| (is_concatenated(aim, last)
			&& is_solvable_2({
				aim: split_end(aim, last),
				values
		})) || is_solvable_2({
		aim: aim - last,
		values
	});
}


function process_part_two(problems) {
	return problems
		.filter(is_solvable_2)
	  .reduce((acc, { aim }) => acc + aim, 0);
}

process_input("input", into_problems, [])
  .then((problems) => {
    console.log("Solution part one: ", process_part_one(problems));
    console.log("Solution part two: ", process_part_two(problems));
  })

