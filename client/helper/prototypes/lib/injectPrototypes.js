export const injectPrototypes = (nativeObject, newPrototypes) => {

  for (var key in newPrototypes) {

		if (nativeObject.hasOwnProperty(key)) continue;

		Object.defineProperty(nativeObject, key, {
			value: newPrototypes[key],
			writable: true
		});

	}

}
