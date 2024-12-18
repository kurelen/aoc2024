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
	value.push(line);
	return value;	
}

const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
	[1, 1],
	[1, -1],
	[-1, 1],
	[-1, -1],
];

function to_string(row, column, length, lines, direction) {
	const [drow, dcolumn] = direction;
	let result = "";
	while (length > 0) { 
    result += lines?.[row]?.[column] ?? "";
		row += drow;
		column += dcolumn;
		length--;
	}
	return result;
}

function process_part_one(lines) {
	let result = 0;
	for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
			result += directions.map(
				direction => to_string(i, j, 4, lines, direction)
			  ).filter(word => word === "XMAS")
			.length;
		}
	}
	return result;
}

function to_cross(row, column, lines) {
  return [
    to_string(row-1, column-1, 3, lines, [1, 1]),
    to_string(row-1, column+1, 3, lines, [1, -1]),
	];
}

function is_x_mas(xs) {
  return xs.every(s => s === "MAS" || s === "SAM");
}

function process_part_two(lines) {
	let result = 0;
	for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
			const cross = to_cross(i, j, lines);
			if (is_x_mas(cross)) {
				result++;
			}
		}
	}
	return result;
}

process_input("input", into_lines, [])
  .then((lines) => {
    console.log("Solution part one: ", process_part_one(lines));
    console.log("Solution part two: ", process_part_two(lines));
  })
