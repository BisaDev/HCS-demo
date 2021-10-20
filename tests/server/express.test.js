import _ from "lodash"
import { getCleanupData, processData } from '../../server/helpers/csv-service';

describe('Tests the reading CSV tool', () => {
  test('Incoming CSV data should match with the current setup',  () => {
    const dataToMatch = [
      'Program Identifier', 'Data Source',
      'Card Number',        'Member ID',
      'First Name',         'Last Name',
      'Date of Birth',      'Address 1',
      'Address 2',          'City',
      'State',              'Zip code',
      'Telephone number',   'Email Address',
      'CONSENT',            'Mobile Phone'
    ]
    const fileData = getCleanupData()	
    const { columns} = fileData
    const dataMatches = _.isEqual(dataToMatch,columns)
    expect(dataMatches).toBeTruthy();

    //expect(foo).toBe(404);
    //expect(status).toBe(404);
    //expect(data).toHaveProperty('msg');
    //expect(data.msg).toContain('404');
    // done();
  });
  test('Should catch patients with no First Name registered', async () => {
    const fileData = await processData()	
    const { missingNamePatients = [] } = fileData
    console.log("missingNamePatients", missingNamePatients)
    expect(missingNamePatients.length).toBeTruthy();
  });
  test('Should catch patients with no Email registered, but consent is set to Y', async () => {
    const fileData = await processData()	
    const { missingEmailPatients = [] } = fileData
    console.log("missingEmailPatients", missingEmailPatients)
    expect(missingEmailPatients.length).toBeTruthy();
  });
});

