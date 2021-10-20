import fs from "fs";
import Patient from "./patient.model";
import Email from "../email/email.model";
import { APIsuccess, APIerror } from "../helpers/API-responses";

// Process CSV file and create Patient entries
export const processPatientCsv = async (req, res) => {
	try {
		const { body } = req;
		const numColumns = 16

		const textData = fs.readFileSync("/Users/abisaid.fernandez/Downloads/inputData.txt", "utf8");
		const cleanupData = textData.replace(/(\r\n|\n|\r)/g, "|").split("|")
		const columns = cleanupData.splice(0 , numColumns)

		let columnIndex = 0
		let objectBuilder = {}
		const processedCsvToInsert = []
		const processedCsvToUpdate = []
		const patientsThatGaveConsent = []

		// Process CSV data 

		function processStep(i) {
			const newKey = columns[columnIndex]
			objectBuilder[newKey] = cleanupData[i].trim() || null
			columnIndex ++
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
		// Updates existing entries
		async function handleInsertOrUpdate(item) {
			const isPatientInDb = await Patient.findOne({ "Card Number": item["Card Number"] }, function (err, doc){
				if(!doc) return
				doc["Program Identifier"]= 	item["Program Identifier"] || null,
                doc["Data Source"]=  		item["Data Source"] || null,
                doc["Card Number"]= 		item["Card Number"] || null,
                doc["Member ID"]= 			item["Member ID"] || null,
                doc["First Name"]= 			item["First Name"] || null,
                doc["Last Name"]=  			item["Last Name"] || null,
                doc["Date of Birth"]=  		item["Date of Birth"] || null,
                doc["Address 1"]=  			item["Address 1"] || null,
                doc["Address 2"]= 			item["Address 2"] || null,
                doc["City"]= 				item["City"] || null,
                doc["State"]= 				item["State"] || null,
                doc["Zip code"]= 			item["Zip code"] || null,
                doc["Telephone number"]= 	item["Telephone number"] || null,
                doc["Email Address"]=  		item["Email Address"] || null,
                doc["CONSENT"]= 			item["CONSENT"] || null,
                doc["Mobile Phone"]=		item["Mobile Phone"] || null,
				doc.save();
			  });
			
			// console.log("isPatientInDb", isPatientInDb)
			if(!isPatientInDb) {
				processedCsvToInsert.push(item)
			} else {
				const itemToUpdate = item
				item["_id"] = isPatientInDb["_id"]
				processedCsvToUpdate.push(itemToUpdate)
			}
			if(item["CONSENT"] === "Y" && item["Email Address"]) {
				patientsThatGaveConsent.push(item)
			}
		}

		// Bulk creation of new entries
		if(processedCsvToInsert.length){
			const newPatients = await Patient.insertMany(processedCsvToInsert)
			// console.log(newPatients)
		}

		// Handle email scheduling while adding reference to the user who gave concent
		if(patientsThatGaveConsent.length) {
			const emailPayload = []
			const frequency = ["Day 1", "Day 2", "Day 3", "Day 4"]
			const dayInMs = 86400000
			patientsThatGaveConsent.map( patient => {
				frequency.map ( (day, index) => {
					const current = new Date()
					const correspondingDate = new Date(current.getTime() + (dayInMs * (index + 1)))
					const email = {
						"name": day,
						"scheduled_date": correspondingDate,
						"locator": patient["Email Address"] || patient["Card Number"]
					}
					emailPayload.push(email)
				})
				
			})
			const newEmails = await Email.insertMany(emailPayload)
			console.log("newEmails", newEmails)
		}




		return res.status(200).json(APIsuccess(200, {   processedCsvToInsert, processedCsvToUpdate, patientsThatGaveConsent }));
		// Validate patient data
		const { valid, errors } = await Patient.validatePatient(body);
		if (!valid) return res.status(400).json(APIerror(400, { errors }));

		// Get patient data
		const {
			email,
			password,
			//confirmPassword,
			mobileNumber,
			patientname
		} = body;

		// Check if patient with provided email exists in db
		const isPatientInDb = await Patient.findOne({ email });
		if (isPatientInDb) return res.status(400).json(APIerror(400, { existInDb: true }));


		// Create new patient
		const patient = new Patient({
			patientname,
			mobileNumber,
			password: hashedPassword,
			email
		});

		// Save new patient to db
		const newPatient = await patient.save();
		return res.status(200).json(
			APIsuccess(200, {
				patient: "Created.",
				redirect: true,
				patient: Patient.sanitizePatientData(newPatient)
			})
		);
	} catch (err) {
		return res.status(500).json(APIerror(500, { err }));
	}
};
