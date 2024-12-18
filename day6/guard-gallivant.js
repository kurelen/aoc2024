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

function into_state(state, line) {
	if (state.rows === 0) {
    state.columns = line.length;
	}
	for (let i = 0; i < line.length; i++) {
		const c = line[i];
		if (c === "#") {
      state.obstacles.push([state.rows, i]);
		} else if (c === "^") {
      state.guard = [state.rows, i];
		}
	}
	state.rows++;
	return state;
}

function turn(direction) {
  const [dx, dy] = direction;
	return [dy, -dx];
}

function process_part_one(lines) {
	return false;
}

function process_part_two(lines) {
	return false;
}

process_input("input", into_state, { rows: 0, columns: 0, obstacles: [], guard: undefined, direction: [-1, 0]})
  .then((state) => {
		console.log(state)
    console.log("Solution part one: ", process_part_one(state));
    console.log("Solution part two: ", process_part_two(state));
  })
