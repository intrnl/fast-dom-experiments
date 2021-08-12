export function html (fragment) {
	let node = document.createElement('template');
	node.innerHTML = fragment;

	return node;
}

export function clone (template) {
	let fragment = template.content.cloneNode(true);
	let nodes = [fragment];

	let node;
	let walker = document.createTreeWalker(fragment, NodeFilter.SHOW_COMMENT);
	while (node = walker.nextNode()) {
		nodes.push(node);
	}

	return nodes;
}


export function traverse (node, ...indices) {
	let ref = node;

	for (let index of indices) {
		ref = ref.childNodes[index];
	}

	return ref;
}


export function append (node, ref) {
	ref.append(node);
}

export function before (node, ref) {
	ref.before(node);
}

export function after (node, ref) {
	ref.after(node);
}


export function remove (node) {
	node.remove();
}

export function removeAll (nodes) {
	for (let node of nodes) {
		remove(node);
	}
}

export function removeParts (ref1, ref2) {
	removeAll(getParts(ref1, ref2));
}


export function getParts (ref1, ref2) {
	let nodes = [];
	let node = ref1;

	while (node) {
		let next = node.nextSibling;
		nodes.push(node);

		if (!next || node === ref2) break;
		node = next;
	}

	return nodes;
}
