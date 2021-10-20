# Human Care Systems code challenge

This is my submit for the challenge. Feel free to ignore any other file structure you may encounter. I used my boilerplate you get me started.

## Installation

After downloading the repo 
$ npm i
Change the inputData.txt file to a location that's easy to find like Download 
(where you place it is entirely up to you) .You need to make sure you change 
the .env with an example path provided on the FILE_LOCATION value

Once done you either start with npm run test to run the automated tests with:
$ npm run test

This server uses Mongo Atlas and it's preconfigured on the .env. You could also
 use a GUI like compass to follow the changes
on the schema and collections.

Finally, for review the implementation of the features requested,I've developed
using TDD on the csv-service.js while also exposing the logic to the patien.controller
file for use as an API.

## Caveats

Due to time constraints I wasn't able to resolve things around the app.Here a couple
of things:
- You'll need to escape from Jest when finishing a test
- While I managed to add an extra validation to prevent the app from creating infinite
number of patient entries, I can't say the same for the emails. I shouldn't affect
you experience.

## Contact

If there's any question you can contact me via e-mail: afernandezdelara@gmail.com

Cheers ! 

