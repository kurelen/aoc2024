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
			if (!(state.rows in state.obstacles)) {
        state.obstacles[state.rows] = {};
			}
			state.obstacles[state.rows][i] = true; 
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

function guard_in_map(state) {
  const [row, column] = state.guard;
	const { rows, columns } = state;
	return 0 <= row && row < rows
		&& 0 <= column && column < columns;
}

function to_coordinate(xs) {
	return xs.join("-");
}

function process_part_one(state) {
	const path = new Set();
	while (guard_in_map(state)) {
		const [guard_r, guard_c] = state.guard;
		const [d_r, d_c] = state.direction;
		const next = [guard_r + d_r, guard_c + d_c];
		const [n_r, n_c] = next;
		if (state.obstacles?.[n_r]?.[n_c]) {
      state.direction = turn(state.direction);
		} else {
			path.add(to_coordinate(next));
			state.guard = next;
		}
	}
	return path.size;
}

function process_part_two(lines) {
	return false;
}

process_input("input",
	into_state,
	{ rows: 0, columns: 0, obstacles: {}, guard: undefined, direction: [-1, 0]})
  .then((state) => {
    console.log("Solution part one: ", process_part_one(state));
    console.log("Solution part two: ", process_part_two(state));
  })
