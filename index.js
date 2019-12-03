let customRolls = {};

window.addEventListener('load', () => {
	const storageStr = localStorage.getItem('customRolls');
	if (storageStr) {
		try {
			customRolls = JSON.parse(storageStr);
			if (Object.prototype.toString.call(customRolls) !== '[object Object]') {
				customRolls = {};
				localStorage.clear();
			}
		} catch (error) {
			console.error(error);
			localStorage.clear();
		}
		
	}

	const diceUnits = document.querySelectorAll('.Main-quickRollUnit');
	diceUnits.forEach((el) => {
		el.addEventListener('click', () => {
			const className = el.classList[el.classList.length - 1];
			let num = className.substring(1, className.length);
			if (num === 'X') {
				promptToRollMiniModal('How Many Sides?', 100, el);
			} else {
				const number = Number(num);
				rollDie(el, number);
			}
		});
	});

	Object.keys(customRolls).forEach(rowKey => {
		const row = customRolls[rowKey];

		const diceRow = document.createElement('div');
		diceRow.classList.add('Main-customRollsRow');
		diceRow.classList.add(rowKey);
		diceRow.innerHTML = `
			<div class="Main-customRollRoller">
				<div class="Main-customRollRollerButton"><i class="fas fa-dice"></i></div>
			</div>
			<div class="Main-customRollDiceUnits"></div>
			<div class="Main-customRollEdit">
				<div class="Main-customRollButton Main-customRollEditButton"><i class="fas fa-pen"></i></div>
				<div class="Main-customRollButton Main-customRollRemoveButton"><i class="fas fa-times"></i></div>
			</div>
		`;

		const diceContainer = diceRow.querySelector('.Main-customRollDiceUnits');
		Object.keys(row).forEach(dieKey => {
			const dieNum = row[dieKey];
			const dieEl = document.createElement('div');
			dieEl.classList.add('Main-customRollUnit');
			dieEl.classList.add(dieKey);
			dieEl.innerHTML = `
				<div class="Main-customRollDie">${dieNum}</div>
				<div class="Main-customRollResult"></div>
			`;
			const nLetter = dieNum.toString()[0] == '8' ? 'n' : '';
			dieEl.title = 'Click to Roll a' + nLetter + ' ' + dieNum + '-sided Die';
			diceContainer.appendChild(dieEl);
		});

		const customRollsEl = document.querySelector('.Main-customRolls');

		customRollsEl.insertBefore(diceRow, customRollsEl.querySelector('.Main-customRollsNew'));

		const diceUnitsBox = diceRow.querySelector('.Main-customRollDiceUnits');
		const diceUnits = diceUnitsBox.querySelectorAll('.Main-customRollUnit');
		const allDiceButton = diceRow.querySelector('.Main-customRollRollerButton');
		const uuid = diceRow.classList.item(1);

		allDiceButton.title = 'Roll All Dice';

		diceUnits.forEach(unit => {
			unit.addEventListener('click', () => {
				const rollItem = customRolls[uuid];
				const dieUUID = unit.classList.item(1);
				const number = rollItem[dieUUID];

				const random = Math.floor(Math.random() * number) + 1;

				allDiceButton.innerHTML = '<i class="fas fa-dice"></i>';
				const resultBox = unit.querySelector('.Main-customRollResult');
				resultBox.innerHTML = '<i class="fas fa-dice"></i>';
				setTimeout(() => {
					resultBox.textContent = random;
					resultBox.title = random;
				}, 150);
			});
		});

		allDiceButton.addEventListener('click', () => {
			const diceUnits = diceUnitsBox.querySelectorAll('.Main-customRollUnit');
			let val = 0;
			diceUnits.forEach(unit => {
				const dieUUID = unit.classList.item(1);
				const rollItem = customRolls[uuid];
				const number = rollItem[dieUUID];

				const random = Math.floor(Math.random() * number) + 1;
				val += random;

				const resultBox = unit.querySelector('.Main-customRollResult');
				resultBox.innerHTML = '<i class="fas fa-dice"></i>';
				setTimeout(() => {
					resultBox.textContent = random;
					resultBox.title = random;
				}, 150);
			});

			allDiceButton.innerHTML = val;
			allDiceButton.title = val;
		});

		const removeButton = diceRow.querySelector('.Main-customRollRemoveButton');
		const editButton = diceRow.querySelector('.Main-customRollEditButton');

		editButton.title = 'Edit this Roll';
		removeButton.title = 'Remove this Roll';

		removeButton.addEventListener('click', () => {
			delete customRolls[uuid];
			localStorage.setItem('customRolls', JSON.stringify(customRolls));
			diceRow.remove();
		});

		editButton.addEventListener('click', () => {
			openEditModal(uuid);
		});
	});

	document.querySelector('.Main-customRollsNew').addEventListener('click', () => {
		const uuidNum = genUUID();
		while (document.querySelector('.id' + uuidNum)) {
			uuidNum = genUUID();
		}
		const uuid = 'id' + uuidNum;
		customRolls[uuid] = {};
		localStorage.setItem('customRolls', JSON.stringify(customRolls));

		const diceRow = document.createElement('div');
		diceRow.classList.add('Main-customRollsRow');
		diceRow.classList.add(uuid);
		diceRow.innerHTML = `
			<div class="Main-customRollRoller">
				<div class="Main-customRollRollerButton"><i class="fas fa-dice"></i></div>
			</div>
			<div class="Main-customRollDiceUnits"></div>
			<div class="Main-customRollEdit">
				<div class="Main-customRollButton Main-customRollEditButton"><i class="fas fa-pen"></i></div>
				<div class="Main-customRollButton Main-customRollRemoveButton"><i class="fas fa-times"></i></div>
			</div>
		`;

		const allDiceButton = diceRow.querySelector('.Main-customRollRollerButton');

		allDiceButton.addEventListener('click', () => {
			const diceUnitsBox = diceRow.querySelector('.Main-customRollDiceUnits');
			const diceUnits = diceUnitsBox.querySelectorAll('.Main-customRollUnit');
			let val = 0;
			diceUnits.forEach(unit => {
				const dieUUID = unit.classList.item(1);
				const rollItem = customRolls[uuid];
				const number = rollItem[dieUUID];

				const random = Math.floor(Math.random() * number) + 1;
				val += random;

				const resultBox = unit.querySelector('.Main-customRollResult');
				resultBox.innerHTML = '<i class="fas fa-dice"></i>';
				setTimeout(() => {
					resultBox.textContent = random;
					resultBox.title = random;
				}, 150);
			});

			allDiceButton.innerHTML = val;
			allDiceButton.title = val;
		});

		const removeButton = diceRow.querySelector('.Main-customRollRemoveButton');
		const editButton = diceRow.querySelector('.Main-customRollEditButton');

		editButton.title = 'Edit this Roll';
		removeButton.title = 'Remove this Roll';

		removeButton.addEventListener('click', () => {
			delete customRolls[uuid];
			diceRow.remove();
		});

		editButton.addEventListener('click', () => {
			openEditModal(uuid);
		});

		const customRollsEl = document.querySelector('.Main-customRolls');

		customRollsEl.insertBefore(diceRow, customRollsEl.querySelector('.Main-customRollsNew'));

		openEditModal(uuid);
	});
});

const promptToRollMiniModal = (text, val, el) => {
	const miniModal = document.createElement('div');

	miniModal.classList.add('MiniModal');

	miniModal.innerHTML = `
		<div class="MiniModal-background"></div>
		<div class="MiniModal-box">
			<div class="MiniModal-header">
				<div class="MiniModal-close"><i class="fas fa-times"></i></div>
			</div>
			<div class="MiniModal-body">
				<h3>${text}</h3>
				<input type="number" value="${val}" min="0" class="MiniModal-input">
				<div class="MiniModal-button MiniModal-ok">OK</div>
			</div>
		</div>
	`;

	miniModal.querySelector('.MiniModal-ok').addEventListener('click', () => {
		const num = document.querySelector('.MiniModal-input').value;
		const number = Number(num);

		closeMiniModal();
		rollDie(el, number);
	});

	miniModal.addEventListener('keydown', e => {
		if (e.keyCode === 13) {
			const num = document.querySelector('.MiniModal-input').value;
			const number = Number(num);

			closeMiniModal();
			rollDie(el, number);
		}
	});

	miniModal.querySelector('.MiniModal-background').addEventListener('click', () => {
		closeMiniModal();
	});

	miniModal.querySelector('.MiniModal-close').addEventListener('click', () => {
		closeMiniModal();
	});

	miniModal.querySelector('.MiniModal-close').title = "Close Edit Window";

	document.body.appendChild(miniModal);
	document.querySelector('.MiniModal-input').focus();
};

const closeMiniModal = () => {
	const miniModal = document.querySelector('.MiniModal');
	miniModal.remove();
};

const rollDie = (diceUnit, num) => {
	const random = Math.floor(Math.random() * num) + 1;

	const resultBox = diceUnit.querySelector('.Main-quickRollResult, .Main-customRollResult');
	resultBox.innerHTML = '<i class="fas fa-dice"></i>';
	setTimeout(() => {
		resultBox.textContent = random;
		resultBox.title = random;
	}, 150);
};

// https://stackoverflow.com/a/2117523
const genUUID = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

const openEditModal = uuid => {
	const modal = document.createElement('div');

	const newRowObj = JSON.parse(JSON.stringify(customRolls[uuid]));

	modal.classList.add('Modal');
	modal.innerHTML = `
		<div class="Modal-background"></div>
		<div class="Modal-box">
			<div class="Modal-header">
				<h1>Edit Roll</h1>
				<div class="Modal-close"><i class="fas fa-times"></i></div>
			</div>
			<div class="Modal-body">
				<div class="Modal-diceUnits"></div>
			</div>
			<div class="Modal-footer">
				<div class="Modal-button Modal-save">Save</div>
			</div>
		</div>
	`;

	const diceContainer = modal.querySelector('.Modal-diceUnits');

	Object.keys(newRowObj).forEach(dieKey => {
		const dieNum = newRowObj[dieKey];
		const dieEl = document.createElement('div');
		dieEl.classList.add('Modal-diceUnit');
		dieEl.classList.add(dieKey);
		dieEl.innerHTML = `
			<input type="number" value="${dieNum}" min="0" class="Modal-diceInput">
			<div class="Modal-diceRemove"><i class="fas fa-times"></i></div>
		`;
		diceContainer.appendChild(dieEl);

		const removeButton = dieEl.querySelector('.Modal-diceRemove');
		const inputField = dieEl.querySelector('.Modal-diceInput');

		removeButton.addEventListener('click', () => {
			delete newRowObj[dieKey];
			dieEl.remove();
		});
		removeButton.title = "Remove Die";

		inputField.addEventListener('input', e => {
			const num = e.target.value;
			if (num != '' && !isNaN(Number(num))) {
				newRowObj[dieKey] = Number(num);
			}
		});
		inputField.title = inputField.value + "-sided Die";
	});

	const addButton = document.createElement('div');
	addButton.className = 'Modal-diceUnit Modal-diceUnitNew';
	addButton.innerHTML = `
		<div class="Modal-diceAdd"><i class="far fa-plus-square"></i></div>
	`;
	addButton.title = "Add New Die";

	diceContainer.appendChild(addButton);

	document.body.appendChild(modal);

	modal.querySelector('.Modal-close').addEventListener('click', () => {
		modal.remove();
	});
	modal.querySelector('.Modal-close').title = "Close Edit Window";

	modal.querySelector('.Modal-background').addEventListener('click', () => {
		modal.remove();
	});

	modal.querySelector('.Modal-save').addEventListener('click', () => {
		customRolls[uuid] = newRowObj;
		localStorage.setItem('customRolls', JSON.stringify(customRolls));

		const diceRow = document.querySelector('.' + uuid);
		const diceContainer = diceRow.querySelector('.Main-customRollDiceUnits');
		diceContainer.innerHTML = '';
		Object.keys(newRowObj).forEach(dieKey => {
			const dieNum = newRowObj[dieKey];
			const dieEl = document.createElement('div');
			dieEl.classList.add('Main-customRollUnit');
			dieEl.classList.add(dieKey);
			dieEl.innerHTML = `
				<div class="Main-customRollDie">${dieNum}</div>
				<div class="Main-customRollResult"></div>
			`;
			const nLetter = dieNum.toString()[0] == '8' ? 'n' : '';
			dieEl.title = 'Click to Roll a' + nLetter + ' ' + dieNum + '-sided Die';
			diceContainer.appendChild(dieEl);
		});
		diceRow.querySelector('.Main-customRollRollerButton').innerHTML = '<i class="fas fa-dice"></i>';
		diceRow.querySelector('.Main-customRollRollerButton').title = 'Roll All Dice';

		const diceUnits = diceRow.querySelectorAll('.Main-customRollUnit');
		diceUnits.forEach(unit => {
			unit.addEventListener('click', () => {
				const rollItem = customRolls[uuid];
				const dieUUID = unit.classList.item(1);
				const number = rollItem[dieUUID];

				const random = Math.floor(Math.random() * number) + 1;

				diceRow.querySelector('.Main-customRollRollerButton').innerHTML = '<i class="fas fa-dice"></i>';
				const resultBox = unit.querySelector('.Main-customRollResult');
				resultBox.innerHTML = '<i class="fas fa-dice"></i>';
				setTimeout(() => {
					resultBox.textContent = random;
					resultBox.title = random;
				}, 150);
			});
		});

		modal.remove();
	});
	modal.querySelector('.Modal-save').title = "Save Roll";

	addButton.addEventListener('click', () => {
		let dieUUIDNum = genUUID();
		while (document.querySelector('.id' + dieUUIDNum)) {
			dieUUIDNum = genUUID();
		}
		const dieUUID = 'id' + dieUUIDNum;
		const dieEl = document.createElement('div');
		dieEl.classList.add('Modal-diceUnit');
		dieEl.classList.add(dieUUID);
		dieEl.innerHTML = `
			<input type="number" value="6" min="0" class="Modal-diceInput">
			<div class="Modal-diceRemove"><i class="fas fa-times"></i></div>
		`;
		diceContainer.insertBefore(dieEl, addButton);
		newRowObj[dieUUID] = 6;

		dieEl.querySelector('.Modal-diceRemove').addEventListener('click', () => {
			delete newRowObj[dieUUID];
			dieEl.remove();
		});

		dieEl.querySelector('.Modal-diceInput').addEventListener('input', e => {
			const num = e.target.value;
			if (num != '' && !isNaN(Number(num))) {
				newRowObj[dieUUID] = Number(num);
			}
		});
	});
};
