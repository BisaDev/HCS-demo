import _ from "lodash";
import mongoose from "mongoose";
import config from "../../server/config/config"
import { getCleanupData, processData } from "../../server/helpers/csv-service";

beforeAll(async () => {
	mongoose.Promise = Promise;

	// connect to mongo db
	const mongoUri = config.mongo.host;
	mongoose.connect(mongoUri, { useNewUrlParser: true });
});
jest.setTimeout(60000);

let fileData;
// Toggle the console.logs to get a preview
describe("Tests the reading CSV tool", () => {
	test("Incoming CSV data should match with the current setup", () => {
		const dataToMatch = [
			"Program Identifier",
			"Data Source",
			"Card Number",
			"Member ID",
			"First Name",
			"Last Name",
			"Date of Birth",
			"Address 1",
			"Address 2",
			"City",
			"State",
			"Zip code",
			"Telephone number",
			"Email Address",
			"CONSENT",
			"Mobile Phone"
		];
		fileData = getCleanupData();
		const { columns } = fileData;
		const dataMatches = _.isEqual(dataToMatch, columns);
		expect(dataMatches).toBeTruthy();
	});
	test("Should catch patients with no First Name registered", async () => {
		const fileData = await processData();
		const { missingNamePatients = [] } = fileData;
		// console.log("missingNamePatients", missingNamePatients);
		expect(missingNamePatients.length).toBeTruthy();
	});

	test("Should catch patients with no Email registered, but consent is set to Y", async () => {
		const fileData = await processData();
		const { missingEmailPatients = [] } = fileData;
		// console.log("missingEmailPatients", missingEmailPatients);
		expect(missingEmailPatients.length).toBeTruthy();
	});

	test("When finished, Email entries should have been been created", async () => {
		const fileData = await processData();
		const { newEmails = [] } = fileData;
		// console.log("newEmails", newEmails);
		expect(newEmails.length).toBeTruthy();
	});
	test("Validate all schedule are properly set", async () => {
		const fileData = await processData();
		const { scheduleEval = [] } = fileData;
		const allArrayEvaluations = []
		// console.log("scheduleEval", scheduleEval);
		const hasError = scheduleEval.filter( array => {
			const evaluationArray = array.reduce( (prev , next) => {
				if(new Date(prev.scheduled_date).getTime() > new Date(prev.scheduled_date).getTime()) {
					return 1
				} else {
					return 0
				}
			})
			allArrayEvaluations.push(evaluationArray)
			return evaluationArray === 1
		})
		console.log("hasError", hasError);

		expect(hasError.length).toBeFalsy();
	});

});
