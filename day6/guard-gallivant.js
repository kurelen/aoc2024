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

function add_obstacle(coordinate, obstacles) {
	const [row, column] = coordinate;
	if (!(row in obstacles)) {
    obstacles[row] = {};
	}
	obstacles[row][column] = true; 
}

function into_state(state, line) {
	if (state.rows === 0) {
    state.columns = line.length;
	}
	for (let i = 0; i < line.length; i++) {
		const c = line[i];
		if (c === "#") {
			add_obstacle([state.rows, i], state.obstacles);
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

function contains_obstacle(coordinates, obstacles) {
	const [row, column] = coordinates;
  return obstacles?.[row]?.[column] ?? false;
}

function guard_cycles(state) {
  const path = new Set();
	let guard_posution;
	while (guard_in_map(state)) {
		const [guard_r, guard_c] = state.guard;
		const [d_r, d_c] = state.direction;
		const next = [guard_r + d_r, guard_c + d_c];
		if (contains_obstacle(next, state.obstacles)) {
      state.direction = turn(state.direction);
		} else {
			const directed_coordinate =
				to_coordinate([...next, ...state.direction])
			if (path.has(directed_coordinate)) {
        return true;
			}
			path.add(directed_coordinate);
			state.guard = next;
		}
	}
	return false;
}

function process_part_one(state) {
	state = structuredClone(state);
	const path = new Set();
	while (guard_in_map(state)) {
		const [guard_r, guard_c] = state.guard;
		const [d_r, d_c] = state.direction;
		const next = [guard_r + d_r, guard_c + d_c];
		if (contains_obstacle(next, state.obstacles)) {
      state.direction = turn(state.direction);
		} else {
			path.add(to_coordinate(next));
			state.guard = next;
		}
	}
	return path.size;
}

function process_part_two(state) {
	let cycles = 0;
	for (let row = 0; row < state.rows; row++) {
	  for (let column = 0; column < state.columns; column++) {
			if (contains_obstacle([row, column], state.obstacles)) {
        continue;
			}
			const copied_state = structuredClone(state);
			add_obstacle([row, column], copied_state.obstacles);
			if (guard_cycles(copied_state)) {
			  cycles++;
			}
	  }
	}
	return cycles;
}

process_input("input",
	into_state,
	{ rows: 0, columns: 0, obstacles: {}, guard: undefined, direction: [-1, 0]})
  .then((state) => {
    console.log("Solution part one: ", process_part_one(state));
    console.log("Solution part two: ", process_part_two(state));
  })
