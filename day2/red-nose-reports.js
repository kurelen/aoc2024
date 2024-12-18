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
function into_lists(reports, line) {
  const report = line.split(whitespace)
    .map(s => parseInt(s, 10));
  reports.push(report);
	return reports;
}

function safe_report(report) {
	if (report.length <= 1) {
    return true;
	}
	let signum = report[0] - report[1] < 0 ? -1 : 1;
	for (let i = 1; i < report.length; i++) {
		const diff = signum * (report[i-1] - report[i]);
		if (diff <= 0 || diff > 3) {
			return false;
		}
	}
	return true;
}

function remove_nth(xs, n) {
  return xs.filter((_, idx) => idx !== n);
}

function damped_safe_report(report) {
	return safe_report(report)
		|| report.some((_, idx) =>
			safe_report(remove_nth(report, idx)));
}

function process_part_one(reports) {
	return reports.filter(safe_report).length;
}

function process_part_two(reports) {
	return reports.filter(damped_safe_report).length;
}

process_input("input", into_lists, [])
  .then((lists) => {
    console.log("Solution part one: ", process_part_one(lists));
    console.log("Solution part two: ", process_part_two(lists));
  })
