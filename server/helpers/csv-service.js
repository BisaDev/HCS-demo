import fs from "fs";

export function getCleanupData(numColumns= 16) {
	const textData = fs.readFileSync("/Users/abisaid.fernandez/Downloads/inputData.txt", "utf8");
	const cleanupData = textData.replace(/(\r\n|\n|\r)/g, "|").split("|");
	const columns = cleanupData.splice(0, numColumns);

	return { cleanupData, columns };
}

export async function processData () {

	const numColumns = 16
	const {cleanupData = [] , columns = []} = getCleanupData(numColumns)

	const processedCsvToInsert = []
	const processedCsvToUpdate = []
	const patientsThatGaveConsent = []
	const missingNamePatients = []
	const missingEmailPatients = []
	
	
	let columnIndex = 0
	let objectBuilder = {}

	function processStep(i) {
		const newKey = columns[columnIndex]
		objectBuilder[newKey] = cleanupData[i].trim() || null
		columnIndex ++
	}

	function handleInsertOrUpdate(item) {
		if(item["CONSENT"] === "Y" && item["Email Address"]) {
			patientsThatGaveConsent.push(item)
		}
		if(item["CONSENT"] === "Y" && !item["Email Address"]) {
			missingEmailPatients.push(item)
		}
	
		if(!item["First Name"]) {
			missingNamePatients.push(item)
		}
	}


	for (let i = 0; i < cleanupData.length; i++) {

		if(columnIndex === columns.length) {
			await handleInsertOrUpdate(objectBuilder)
			objectBuilder = {}
			columnIndex = 0
			processStep(i)

		} else {
			processStep(i)
		}
	}

	return {
		processedCsvToInsert,
		processedCsvToUpdate,
		patientsThatGaveConsent,
		missingNamePatients,
		missingEmailPatients,
	} 

}
