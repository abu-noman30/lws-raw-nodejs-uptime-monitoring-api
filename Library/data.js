/*
 * Title: Data write and Read.
 * Description: The file 'Create Data file' 'Write Date' & 'Read Data'
 * Author: Md. Abu Noman
 * Date:  26- May- 2022
 *
 */

//Dependencies
const fs = require('fs');
const path = require('path');

//lib Object -Module scaffolding
const lib = {};

//base directory of the data folder
lib.basedir = path.join(__dirname, '/../.data/');

//write data to file - in create function
lib.createfile = (dir, file, data, callback) => {
	//open file for write Data(maindir/subdir/file.json'wx file flag)
	//console.log(lib.basedir);
	//console.log('User Object Data: ', data);
	fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			//making JSON-ObjData to JSON-String data using stringify()
			const stringData = JSON.stringify(data);

			//Write date to file
			fs.writeFile(fileDescriptor, stringData, (err) => {
				if (!err) {
					fs.close(fileDescriptor, (err) => {
						if (!err) {
							console.log('No Error Found at writing file');
							callback(err);
						} else {
							console.log('Error Found at writing file');
							callback(err);
						}
					});
				} else {
					console.log(err);

					callback('Could not Writing to File!');
				}
			});
		} else {
			console.log(err);
			callback('Could not create new file,it may already exist!');
		}
	});
};

//Read data from file - in create function
lib.readfile = (dir, file, callback) => {
	fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
		if (!err && data) {
			console.log('No Error Found at reading file');
			callback(err, data);
		} else {
			console.log('Error Found at reading file');
			callback(err, data);
		}
	});
};

//Update(write+read) data from file - in create function
lib.updatefile = (dir, file, data, callback) => {
	//open data file for reading + writing
	// file flag 'r+' --> for reading + writing
	fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			//convert date to string - stringify()
			const stringData = JSON.stringify(data);

			//Delete file data(Make file empty) - ftruncate()
			fs.ftruncate(fileDescriptor, (err) => {
				if (!err) {
					//Write date to file & then Close it
					fs.writeFile(fileDescriptor, stringData, (err) => {
						if (!err) {
							//Close the File
							fs.close(fileDescriptor, (err) => {
								if (!err) {
									console.log('Error not Found at closing file:');
									callback(err);
								} else {
									console.log('Error occur at closing file');
									callback(err);
								}
							});
						} else {
							console.log('Error occurs.Cannot writing data to file');
							callback(err);
						}
					});
				} else {
					console.log('Error truncating file');
					callback(err);
				}
			});
		} else {
			console.log('Error occurs. Updating file may not Exist');
			callback(err);
		}
	});
};

//Delete existing file - in create function
lib.deletefile = (dir, file, callback) => {
	//unlink file(delete)
	fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
		if (!err) {
			console.log('No Error found at delete file: ');
			callback(err);
		} else {
			console.log('Error found at deleting file ');
			callback(err);
		}
	});
};
//________________________________________
// list all the items in a directory
lib.list = (dir, callback) => {
	fs.readdir(`${lib.basedir + dir}/`, (err, fileNames) => {
		if (!err && fileNames && fileNames.length > 0) {
			const trimmedFileNames = [];
			fileNames.forEach((fileName) => {
				trimmedFileNames.push(fileName.replace('.json', ''));
			});
			callback(false, trimmedFileNames);
		} else {
			callback('Error reading directory!');
		}
	});
};

// Module exports
module.exports = lib;
