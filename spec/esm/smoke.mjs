const naturalModuleUrl = new URL('../../dist/esm/index.js', import.meta.url)

try {
	const { default: natural } = await import(naturalModuleUrl.href)

	const result = natural?.PorterStemmer?.stem('running')
	if (result !== 'run') {
		throw new Error(`Unexpected stem result: ${result}`)
	}

	console.log('ESM smoke test: OK')
} catch (error) {
	console.error('ESM smoke test: FAIL')
	console.error(error)
	process.exitCode = 1
}
