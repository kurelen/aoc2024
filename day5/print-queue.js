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

function to_ints(ss) {
	return ss.map(s => parseInt(s, 10));
}

function into_queue(queue, line) {
	if (line.includes("|")) {
		const [smaller, bigger] = to_ints(line.split("|"));
		if (smaller in queue.rules) {
			queue.rules[smaller].add(bigger);
		} else {
			queue.rules[smaller] = new Set([bigger]);
		}
	} else if (line.includes(",")) {
		queue.updates.push(to_ints(line.split(",")));
	}
	return queue;	
}

function update_is_valid(rules) {
	return (update) => {
	  for (let i = 0; i < update.length; i++) {
	  	for (let j = 0; j < update.length; j++) {
				if ( (i < j && rules[update[j]]?.has(update[i]))
				  || (i > j && rules[update[i]]?.has(update[j]))) {
          return false;
		  	}
		  }
	  }
	  return true;
	};
}

function fix_update(rules) {
	return function fix(update) {
  	const copy = [...update]
  	for (let i = 0; i < copy.length; i++) {
  		for (let j = 0; j < copy.length; j++) {
  		  if ( (i < j && rules[copy[j]]?.has(copy[i]))
  		    || (i > j && rules[copy[i]]?.has(copy[j]))) {
  				const a = copy[i];
  				const b = copy[j];
  				copy[i] = b;
  				copy[j] = a;
  				i = 0;
  				j = 0;
  		 	}
  		}
  	}
  	return copy
	}
}

function add_middle(result, update) {
	const mid = (update.length - 1) / 2;
  return result + update[mid];
}

function process_part_one(queue) {
	const { updates, rules } = queue;
	return updates
		.filter(update_is_valid(rules))
	  .reduce(add_middle, 0);
}

function process_part_two(queue) {
	const { updates, rules } = queue;
	const validate = update_is_valid(rules);
	return updates
		.filter(update => !validate(update))
	  .map(fix_update(rules))
	  .reduce(add_middle, 0);
}

process_input("input", into_queue, { rules: {}, updates: []})
  .then((queue) => {
    console.log("Solution part one: ", process_part_one(queue));
    console.log("Solution part two: ", process_part_two(queue));
  })
