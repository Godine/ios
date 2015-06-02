//This test is to check that it's possible to log in using the correct credential

describe("Owncloud.Login", function() {

	/////////////////////////////////////////////////
    //////////General functions to use util.js//////////////
   
	//get the correct tableview, it depends on the device and the orientation
	getTableViewContainer = function(target){
		var cont;
		if(isDeviceiPad(target)){
			cont = target.frontMostApp().mainWindow().tableViews()[1];
		}else{
			cont = target.frontMostApp().mainWindow().tableViews()[0];
		}
		return cont;

	}


	logout = function(obj){
		//target.frontMostApp().mainWindow().tableViews()[0].cells()[obj].dragInsideWithOptions({startOffset:{x:0.7, y:0.25}, endOffset:{x:0, y:0.25}, duration:0.25});
		target.frontMostApp().mainWindow().tableViews()[0].cells()[obj].dragInsideWithOptions({startOffset:{x:0.75, y:0.5}, endOffset:{x:0.25, y:0.5}, duration:0.25});
		target.frontMostApp().mainWindow().tableViews()[0].cells()[obj].buttons()["Delete"].tap();
	}

	goToSettingsAndLogout =function(obj){
		target.frontMostApp().mainWindow().tabBar().buttons()["Settings"].tap();
		logout(obj);
		target.delay(1);
	}

	//insert value in a file
	insertValue = function(element, value){
		element.tap();
		element.setValue("");
		target.delay(1);
		element.setValue(value);
		target.frontMostApp().keyboard().typeString("\n");

	}


	tapOnButton = function(element){
		//scroll up, to see the button if necessary
		if(!element.isVisible()){
			element.scrollToVisible();
		}

		element.tap();
	}

	login = function(container,server,user,password,button){
		insertValue(container.cells()[0].textFields()[0], server);

		//It waits x seconds or until the connections is established, to continue the test.
		waitUntilMessageIsShown(container.groups()["Connection Established"]);
		//target.pushTimeout(timeToPushTimeOut);
		//target.frontMostApp().mainWindow().tableViews()[0].groups()["Connection Established"];
		//target.popTimeout();

		insertValue(container.cells()[1].textFields()[0], user);
		insertValue(container.cells()[2].secureTextFields()[0], password);

		target.delay(1);

		tapOnButton(container.cells()[button]);

	}

	waitUntilMessageIsShown = function(elem){
		target.pushTimeout(timeToPushTimeOut);
		elem;
		target.popTimeout();
	}

	waitUntilMessageIsVisible = function(elem){
		target.pushTimeout(timeToPushTimeOut);
		elem.withValueForKey(1,"isVisible");
		target.popTimeout();
	}

	waitUntilMessageIsNotVisible = function(elem){
		target.pushTimeout(timeToPushTimeOut);
		elem.withValueForKey(0,"isVisible");
		target.popTimeout();
	}

	waitUntilMessageIsGone = function(elem){
		//It waits x seconds or until the loading disappear, to continue the test. 
		target.pushTimeout(timeToPushTimeOut);
		elem.waitForInvalid() == true;
		target.popTimeout();
	}


	//A convenience method for detecting that you're running on an iPad
	isDeviceiPad = function(obj) {
		return obj.model().match(/^iPad/) !== null;
	}

	//A convenience method for detecting that you're running on an iPhone or iPod touch
	isDeviceiPhone = function(obj) {
	      return obj.model().match(/^iPhone/) !== null;
	}



	//A convenience method for detecting that you're running on an iPhone with ios7
	isIos7 = function(obj) {
	      return obj.systemVersion().match(/^7/) !== null;
	}

	/////////////////////////////////////////////////////


	//Here we detect if an alert is shown
	UIATarget.onAlert = function onAlert(alert) {
		var title = alert.name();
		UIALogger.logMessage("Alert with title ’" + title + "’ encountered!");
		//if the alert is about user already exists, we return true
	    if (title == "The entered user already exists") {
	        alert.buttons()["OK"].tap();
	        return true; // bypass default handler
	    }
		return false; // use default handler
	}

	///////////////////////////////////////////////////
	///////////////Declare some variables
	var target = UIATarget.localTarget();

	var testName;
	
	//account1
	var serverAccount1 = "owncloudServerVar"; 
	var userAccount1 = "owncloudUserVar"; 
	var passwordAccount1 = "owncloudPasswordVar"; 

	var idCellAccount1 = "Settings Account Cell "+userAccount1 +"@"+ serverAccount1;

	//account2
	var serverAccount2 = "owncloudServer2Var"; 
	var userAccount2 = "owncloudUser2Var"; 
	var passwordAccount2 = "owncloudPasswordVar"; 

	var idCellAccount2 = "Settings Account Cell "+userAccount2 +"@"+ serverAccount2;

	//account3
	var serverAccount3 = "owncloudServer3Var"; 
	var userAccount3 = "owncloudUser3Var";
	//pasword wirh special characters 
	var passwordAccount3 = "owncloudPassword3Var"; 
	
	var idCellAccount3 = "Settings Account Cell "+userAccount3 +"@"+ serverAccount3;


	var incorrectServerAccount = "https://incorrect.owncloud.com/owncloud";
	var incorrectpasswordAccount = "Incorrect password";  


	var container;
	var tableViewContainer;
	var timeToPushTimeOut=180;

	///////////////////////////////////
	//Case to test
	it("login-portrait", function() {

		testName = "Login - Portrait";
		//test start
		UIALogger.logStart(testName);


		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);

		login(target.frontMostApp().mainWindow().tableViews()[0],serverAccount1,userAccount1,passwordAccount1,"Log in");

		//It waits x seconds or until the loading disappear, to continue the test. 
		waitUntilMessageIsGone(target.frontMostApp().mainWindow().activityIndicators()["In progress"]);

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().navigationBar().isValid()){
			//if the test if passed, to restore the app as it was found
			//Delete the account
			goToSettingsAndLogout(idCellAccount1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}
	}); 


	///////////////////////////////////
	//Case to test
	it("login-landscape", function() {
		testName = "Login - landscape";
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);

		login(target.frontMostApp().mainWindow().tableViews()[0],serverAccount1,userAccount1,passwordAccount1,"Log in");

		//It waits x seconds or until the loading disappear, to continue the test. 
		waitUntilMessageIsGone(target.frontMostApp().mainWindow().activityIndicators()["In progress"]);

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().navigationBar().isValid()){
			//if the test if passed, to restore the app as it was found
			//Delete the account
			goToSettingsAndLogout(idCellAccount1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}

	}); 

	///////////////////////////////////
	//Case to test
	it("login-landscape-rotate", function() {

		testName = "Login - landscape - rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);

		login(target.frontMostApp().mainWindow().tableViews()[0],serverAccount1,userAccount1,passwordAccount1,"Log in");

		target.delay(2);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);

		//It waits x seconds or until the loading disappear, to continue the test. 
		waitUntilMessageIsGone(target.frontMostApp().mainWindow().activityIndicators()["In progress"]);

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().navigationBar().isValid()){
			//if the test if passed, to restore the app as it was found
			//Delete the account
			goToSettingsAndLogout(idCellAccount1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}

	}); 

	///////////////////////////////////
	//Case to test
	it("login-portrait-rotate", function() {
		testName = "Login - Portrait - rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);

		//log in with account1
		insertValue(target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0], serverAccount1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);

		//It waits x seconds or until the connections is established, to continue the test.
		waitUntilMessageIsShown(target.frontMostApp().mainWindow().tableViews()[0].groups()["Connection Established"]);

		insertValue(target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0], userAccount1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);

		insertValue(target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0], passwordAccount1);

		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);

		tapOnButton(target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"]);

		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);

		//It waits x seconds or until the loading disappear, to continue the test. 
		waitUntilMessageIsGone(target.frontMostApp().mainWindow().activityIndicators()["In progress"]);

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().navigationBar().isValid()){
			//if the test if passed, to restore the app as it was found
			//Delete the account
			goToSettingsAndLogout(idCellAccount1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}
	}); 

	///////////////////////////////////
	//Case to test
	it("loginSpecialCharacter-landscape-portrait", function() {
		testName = "Login with a password with special character- Landscape - rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);

		insertValue(target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0], serverAccount3);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);

		//It waits x seconds or until the connections is established, to continue the test.
		waitUntilMessageIsShown(target.frontMostApp().mainWindow().tableViews()[0].groups()["Connection Established"]);

		insertValue(target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0], userAccount3);
		
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);

		insertValue(target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0], passwordAccount3);

		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);

		tapOnButton(target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"]);

		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);

		//It waits x seconds or until the loading disappear, to continue the test. 
		waitUntilMessageIsGone(target.frontMostApp().mainWindow().activityIndicators()["In progress"]);

		UIALogger.logMessage("Detect if the files screen is shown");

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid()).toBeTruthy();
		
		//Here it is checked if the test is passed
		if(target.frontMostApp().navigationBar().isValid()){
			//if the test if passed, to restore the app as it was found
			//Delete the account
			goToSettingsAndLogout(idCellAccount3);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}


	}); 

	///////////////////////////////////
	//Case to test
	it("multiaccount-portrait", function() {
		testName = "Login - Multiaccount - portrait";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);


		login(target.frontMostApp().mainWindow().tableViews()[0],serverAccount1,userAccount1,passwordAccount1,"Log in");

		//It waits x seconds or until the loading disappear, to continue the test. 
		waitUntilMessageIsGone(target.frontMostApp().mainWindow().activityIndicators()["In progress"]);

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid()).toBeTruthy();

		if(target.frontMostApp().navigationBar().isValid()){
		//if it's possible to login with the first account, the test keep on running
			
			container = target.frontMostApp().mainWindow();

			//select to add a new account
			container.tabBar().buttons()["Settings"].tap();
			container.tableViews()[0].cells()["Settings Add Account Cell"].tap();


			//get the correct tableview, it depends on the device and the orientation
			tableViewContainer = getTableViewContainer(target);


			login(tableViewContainer,serverAccount2,userAccount2,passwordAccount2,"Add");

			//It waits x seconds or until the loading disappear, to continue the test. 
			waitUntilMessageIsGone(target.frontMostApp().mainWindow().activityIndicators()["In progress"]);

			////CHECK USING JASMINE METHOD
			expect(container.tableViews()[0].cells()[idCellAccount1].isValid() && container.tableViews()[0].cells()[idCellAccount2].isValid()).toBeTruthy();

			//Here it is checked if the test is passed
			if(container.tableViews()[0].cells()[idCellAccount1].isValid() && container.tableViews()[0].cells()[idCellAccount2].isValid()){
				//if the test if passed, to restore the app as it was found
				//Delete the accounts
				logout(idCellAccount2);
				target.delay(1);

				//it's neccesary to tap anywhere, to delete after that the other account
				container.tableViews()[0].tapWithOptions({tapOffset:{x:0.67, y:0.59}});

				logout(idCellAccount1);
				
				target.delay(1);
				UIALogger.logPass(testName);
			}else{
				UIALogger.logFail(testName);
			}
		}else{
		//if it's not possible to login with the first account, the test fails
			UIALogger.logFail(testName);
		}

	}); 

	///////////////////////////////////
	//Case to test
	it("multiaccount-landscape", function() {
		testName = "Login - Multiaccount - landscape";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);


		login(target.frontMostApp().mainWindow().tableViews()[0],serverAccount1,userAccount1,passwordAccount1,"Log in");


		//It waits x seconds or until the loading disappear, to continue the test. 
		waitUntilMessageIsGone(target.frontMostApp().mainWindow().activityIndicators()["In progress"]);

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid()).toBeTruthy();

		if(target.frontMostApp().navigationBar().isValid()){
		//if it's possible to login with the first account, the test keep on running
			
			container = target.frontMostApp().mainWindow();

			//This is necessary after several rotation
			//container.tableViews()[0].tapWithOptions({tapOffset:{x:0.52, y:0.22}});

			//select to add a new account
			container.tabBar().buttons()["Settings"].tap();
			container.tableViews()[0].cells()["Settings Add Account Cell"].tap();


			tableViewContainer = getTableViewContainer(target);

			login(tableViewContainer,serverAccount2,userAccount2,passwordAccount2,"Add");

			//It waits x seconds or until the loading disappear, to continue the test. 
			waitUntilMessageIsGone(container.activityIndicators()["In progress"]);

			////CHECK USING JASMINE METHOD
			expect(container.tableViews()[0].cells()[idCellAccount1].isValid() && container.tableViews()[0].cells()[idCellAccount2].isValid()).toBeTruthy();

			//Here it is checked if the test is passed
			if(container.tableViews()[0].cells()[idCellAccount1].isValid() && container.tableViews()[0].cells()[idCellAccount2].isValid()){
				//if the test if passed, to restore the app as it was found
				//Delete the accounts
				logout(idCellAccount2);
				target.delay(1);

				//it's neccesary to tap anywhere, to delete after that the other account
				container.tableViews()[0].tapWithOptions({tapOffset:{x:0.67, y:0.59}});

				//delete the other account
				logout(idCellAccount1);
				target.delay(1);
				UIALogger.logPass(testName);
			}else{
				UIALogger.logFail(testName);
			}
		}else{
		//if it's not possible to login with the first account, the test fails
			UIALogger.logFail(testName);
		}

	}); 

	//Cases to test
	it("multiaccount-portrait-rotate", function() {
		testName = "Login - Multiaccount - portrait - rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);


		login(target.frontMostApp().mainWindow().tableViews()[0],serverAccount1,userAccount1,passwordAccount1,"Log in");

		//It waits x seconds or until the loading disappear, to continue the test. 
		waitUntilMessageIsGone(target.frontMostApp().mainWindow().activityIndicators()["In progress"]);

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid()).toBeTruthy();

		if(target.frontMostApp().navigationBar().isValid()){
		//if it's possible to login with the first account, the test keep on running
			
			target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
			target.delay(2);
			
			container = target.frontMostApp().mainWindow();

			//This is necessary after several rotation
			//container.tableViews()[0].tapWithOptions({tapOffset:{x:0.52, y:0.22}});

			//select to add a new account
			container.tabBar().buttons()["Settings"].tap();
			container.tableViews()[0].cells()["Settings Add Account Cell"].tap();

			//get the correct tableview, it depends on the device and the orientation
			tableViewContainer = getTableViewContainer(target);

			//log in with the other account
			insertValue(tableViewContainer.cells()[0].textFields()[0],serverAccount2);

			//It waits x seconds or until the connections is established, to continue the test.
			waitUntilMessageIsShown(tableViewContainer.groups()["Connection Established"]);

			//REVIEW
			target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
			target.delay(2);
			
			//get the correct tableview, it depends on the device and the orientation
			tableViewContainer = getTableViewContainer(target);

			insertValue(tableViewContainer.cells()[1].textFields()[0],userAccount2);

			insertValue(tableViewContainer.cells()[2].secureTextFields()[0],passwordAccount2);

			tapOnButton(tableViewContainer.cells()["Add"]);

			//It waits x seconds or until the loading disappear, to continue the test. 
			waitUntilMessageIsGone(container.activityIndicators()["In progress"]);


			////CHECK USING JASMINE METHOD
			expect(container.tableViews()[0].cells()[idCellAccount1].isValid() && container.tableViews()[0].cells()[idCellAccount2].isValid()).toBeTruthy();

			//Here it is checked if the test is passed
			if(container.tableViews()[0].cells()[idCellAccount1].isValid() && container.tableViews()[0].cells()[idCellAccount2].isValid()){
				//if the test if passed, to restore the app as it was found
				//Delete the accounts
				logout(idCellAccount2);
				target.delay(1);

				//it's neccesary to tap anywhere, to delete after that the other account
				container.tableViews()[0].tapWithOptions({tapOffset:{x:0.67, y:0.59}});

				//delete the other account 
				logout(idCellAccount1);
				target.delay(1);
				UIALogger.logPass(testName);
			}else{
				UIALogger.logFail(testName);
			}
		}else{
		//if it's not possible to login with the first account, the test fails
			UIALogger.logFail(testName);
		}
	}); 

	///////////////////////////////////
	//Case to test
	it("incorrectServer-portrait", function() {
		testName = "Login - incorrect server -portrait";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);

		//log in with the incorrect server
		insertValue(target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0], incorrectServerAccount);

		//It waits x seconds or until the connection test is finished, to continue the test.
		waitUntilMessageIsVisible(target.frontMostApp().mainWindow().tableViews()["Empty list"].groups()["Server not found"]);

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().mainWindow().tableViews()[0].groups()["Server not found"].isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().mainWindow().tableViews()[0].groups()["Server not found"].isValid()){
			//if the test if passed, to restore the app as it was found
			target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}
	}); 

	///////////////////////////////////
	//Case to test
	it("incorrectServer-landscape-rotate", function() {
		testName = "Login - incorrect server - landscape - rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);


		//log in with the incorrect server
		insertValue(target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0], incorrectServerAccount);


		//It waits x seconds or until the connection test is finished, to continue the test.
		waitUntilMessageIsNotVisible(target.frontMostApp().mainWindow().tableViews()[0].groups()["In progress"]);

		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);


		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().mainWindow().tableViews()[0].groups()["Server not found"].isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().mainWindow().tableViews()[0].groups()["Server not found"].isValid()){
			//if the test if passed, to restore the app as it was found
			//This is necessary after several rotation
			target.delay(1);
			target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}
	}); 

	///////////////////////////////////
	//Case to test
	it("emptyPassword-landscape", function() {
		testName = "Login - empty password - landscape";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);

		login(target.frontMostApp().mainWindow().tableViews()[0],serverAccount1,userAccount1,"","Log in");


		////CHECK USING JASMINE METHOD
		expect(!(target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isEnabled())).toBeTruthy();

		//Here it is checked if the test is passed (ipad o ihpone)
		if(!(target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isEnabled())){
			//if the test if passed, to restore the app as it was found
			target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
			target.delay(1);
			target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
			target.delay(1);
			target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");

			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}
	}); 

	///////////////////////////////////
	//Case to test
	it("emptyPassword-portrait", function() {
		testName = "Login - empty password - portrait";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);

		login(target.frontMostApp().mainWindow().tableViews()[0],serverAccount1,userAccount1,"","Log in");

		////CHECK USING JASMINE METHOD
		expect(!(target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isEnabled())).toBeTruthy();

		//Here it is checked if the test is passed (ipad o ihpone)
		if(!(target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isEnabled())){
			//if the test if passed, to restore the app as it was found
			target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
			target.delay(1);
			target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
			target.delay(1);
			target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}

	}); 

	///////////////////////////////////
	//Case to test
	it("emptyPassword-portrait-rotate", function() {
		testName = "Login - empty password - portrait - rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);

		//log in with account1
		insertValue(target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0], serverAccount1);

		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);

		//It waits x seconds or until the connections is established, to continue the test.
		waitUntilMessageIsShown(target.frontMostApp().mainWindow().tableViews()[0].groups()["Connection Established"]);

		insertValue(target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0], userAccount1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);

		insertValue(target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0], "");
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);

		tapOnButton(target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"]);

		////CHECK USING JASMINE METHOD
		expect(!(target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isEnabled())).toBeTruthy();

		//Here it is checked if the test is passed (ipad o ihpone)
		if(!(target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isEnabled())){
			//if the test if passed, to restore the app as it was found
			target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
			target.delay(1);
			target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
			target.delay(1);
			target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
			
			target.delay(1);
			UIALogger.logPass(testName);
			
		}else{
			UIALogger.logFail(testName);
		}

	}); 

	///////////////////////////////////
	//Case to test
	it("incorrectPassword-landscape", function() {
		testName = "Login - incorrect password - landscape";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);

		
		login(target.frontMostApp().mainWindow().tableViews()[0],serverAccount1,userAccount1,incorrectpasswordAccount,"Log in");

		//It waits x seconds or until the loading disappear, to continue the test. 
		waitUntilMessageIsGone(target.frontMostApp().mainWindow().activityIndicators()["In progress"]);

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().mainWindow().tableViews()[0].groups()["The user or password is incorrect"].isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().mainWindow().tableViews()[0].groups()["The user or password is incorrect"].isValid()){
			//if the test if passed, to restore the app as it was found
			//Set field as empty
			target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
			target.delay(1);
			target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
			target.delay(1);
			target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}
	}); 

	///////////////////////////////////
	//Case to test
	it("incorrectPassword-portrait", function() {
		testName = "Login - incorrect password - portrait";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);

		login(target.frontMostApp().mainWindow().tableViews()[0],serverAccount1,userAccount1,incorrectpasswordAccount,"Log in");

		//It waits x seconds or until the loading disappear, to continue the test. 
		waitUntilMessageIsGone(target.frontMostApp().mainWindow().activityIndicators()["In progress"]);

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().mainWindow().tableViews()[0].groups()["The user or password is incorrect"].isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().mainWindow().tableViews()[0].groups()["The user or password is incorrect"].isValid()){
			//if the test if passed, to restore the app as it was found
			//Set field as empty, to restore the app as it was found
			target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
			target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
			target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}
	}); 

	///////////////////////////////////
	//Case to test
	it("incorrectPassword-portrait-rotate", function() {
		testName = "Login - incorrect password - portrait - rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);

		login(target.frontMostApp().mainWindow().tableViews()[0],serverAccount1,userAccount1,incorrectpasswordAccount,"Log in");

		//It waits x seconds or until the loading disappear, to continue the test. 
		waitUntilMessageIsGone(target.frontMostApp().mainWindow().activityIndicators()["In progress"]);


		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().mainWindow().tableViews()[0].groups()["The user or password is incorrect"].isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().mainWindow().tableViews()[0].groups()["The user or password is incorrect"].isValid()){
			//if the test if passed, to restore the app as it was found
			//This is necessary after several rotation
			//target.frontMostApp().mainWindow().tableViews()[0].tapWithOptions({tapOffset:{x:0.52, y:0.22}});
			target.delay(1);
			//Set field as empty
			target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
			target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
			target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}

	}); 

	///////////////////////////////////
	//Case to test
	it("existingAccount-portrait", function() {
		testName = "Login - Existing account - portrait";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(2);


		login(target.frontMostApp().mainWindow().tableViews()[0],serverAccount1,userAccount1,passwordAccount1,"Log in");

		//It waits x seconds or until the loading disappear, to continue the test. 
		waitUntilMessageIsGone(target.frontMostApp().mainWindow().activityIndicators()["In progress"]);

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid()).toBeTruthy();

		if(target.frontMostApp().navigationBar().isValid()){
		//if it's possible to login with the first account, the test keep on running
			
			container = target.frontMostApp().mainWindow();

			//This is necessary after several rotation
			//container.tableViews()[0].tapWithOptions({tapOffset:{x:0.52, y:0.22}});

			//select to add a new account
			container.tabBar().buttons()["Settings"].tap();
			container.tableViews()[0].cells()["Settings Add Account Cell"].tap();

			//get the correct tableview, it depends on the device and the orientation
			tableViewContainer = getTableViewContainer(target);

			//log in with the same account
			login(tableViewContainer,serverAccount1,userAccount1,passwordAccount1,"Add");

			//It waits x seconds or until the loading disappear, to continue the test. 
			waitUntilMessageIsGone(container.activityIndicators()["In progress"]);

			////CHECK USING JASMINE METHOD
			expect(target.frontMostApp().alert().name()).toEqual("The entered user already exists");

			//Here it is checked if the test is passed
			if (target.frontMostApp().alert().name() == "The entered user already exists") {
				//if the test if passed, to restore the app as it was found
				target.frontMostApp().navigationBar().leftButton().tap();
				
				
				logout(idCellAccount1);	
				target.delay(1);

				UIALogger.logPass(testName);
			}else{
				UIALogger.logFail(testName);
			}
		}else{
		//if it's not possible to login with the first account, the test fails
			UIALogger.logFail(testName);
		}

	}); 

	///////////////////////////////////
	//Case to test
	it("existingAccount-landscape", function() {
		testName = "Login - Existing account - landscape";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);


		login(target.frontMostApp().mainWindow().tableViews()[0],serverAccount1,userAccount1,passwordAccount1,"Log in");

		//It waits x seconds or until the loading disappear, to continue the test. 
		waitUntilMessageIsGone(target.frontMostApp().mainWindow().activityIndicators()["In progress"]);

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid()).toBeTruthy();

		if(target.frontMostApp().navigationBar().isValid()){
		//if it's possible to login with the first account, the test keep on running
			
			
			container = target.frontMostApp().mainWindow();

			//This is necessary after several rotation
			//container.tableViews()[0].tapWithOptions({tapOffset:{x:0.52, y:0.22}});

			//select to add a new account
			container.tabBar().buttons()["Settings"].tap();
			container.tableViews()[0].cells()["Settings Add Account Cell"].tap();

			//get the correct tableview, it depends on the device and the orientation
			tableViewContainer = getTableViewContainer(target);

			//log in with the same account
			login(tableViewContainer,serverAccount1,userAccount1,passwordAccount1,"Add");

			//It waits x seconds or until the loading disappear, to continue the test. 
			waitUntilMessageIsGone(container.activityIndicators()["In progress"]);


			////CHECK USING JASMINE METHOD
			expect(target.frontMostApp().alert().name()).toEqual("The entered user already exists");

			//Here it is checked if the test is passed
			if (target.frontMostApp().alert().name() == "The entered user already exists") {
				//if the test if passed, to restore the app as it was found
				target.frontMostApp().navigationBar().leftButton().tap();
				target.delay(1);
				
				logout(idCellAccount1);	
				
				target.delay(1);
				UIALogger.logPass(testName);
			}else{
				UIALogger.logFail(testName);
			}
		}else{
			//if it's not possible to login with the first account, the test fails
			UIALogger.logFail(testName);
		}
	}); 

	///////////////////////////////////
	//Case to test
	it("existingAccount-landscape-rotate", function() {
		testName = "Login - Existing account - landscape -rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(2);


		login(target.frontMostApp().mainWindow().tableViews()[0],serverAccount1,userAccount1,passwordAccount1,"Log in");


		//It waits x seconds or until the loading disappear, to continue the test. 
		waitUntilMessageIsGone(target.frontMostApp().mainWindow().activityIndicators()["In progress"]);

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid()).toBeTruthy();

		if(target.frontMostApp().navigationBar().isValid()){
		//if it's possible to login with the first account, the test keep on running
			
			container = target.frontMostApp().mainWindow();

			//This is necessary after several rotation
			//container.tableViews()[0].tapWithOptions({tapOffset:{x:0.52, y:0.22}});

			//select to add a new account
			container.tabBar().buttons()["Settings"].tap();
			container.tableViews()[0].cells()["Settings Add Account Cell"].tap();

			//get the correct tableview, it depends on the device and the orientation
			tableViewContainer = getTableViewContainer(target);

			//log in with the same account
			insertValue(tableViewContainer.cells()[0].textFields()[0],serverAccount1);

			//It waits x seconds or until the connections is established, to continue the test.
			waitUntilMessageIsShown(tableViewContainer.groups()["Connection Established"]);

			insertValue(tableViewContainer.cells()[1].textFields()[0],userAccount1);

			target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
			target.delay(2);
			
			//get the correct tableview, it depends on the device and the orientation
			tableViewContainer = getTableViewContainer(target);

			insertValue(tableViewContainer.cells()[2].secureTextFields()[0],passwordAccount1);
			
			target.delay(1);

			tapOnButton(tableViewContainer.cells()["Add"]);


			//It waits x seconds or until the loading disappear, to continue the test. 
			waitUntilMessageIsGone(container.activityIndicators()["In progress"]);
			

			////CHECK USING JASMINE METHOD
			expect(target.frontMostApp().alert().name()).toEqual("The entered user already exists");

			//Here it is checked if the test is passed
			if (target.frontMostApp().alert().name() == "The entered user already exists") {
				//if the test if passed, to restore the app as it was found
				target.frontMostApp().navigationBar().leftButton().tap();
				
				target.delay(1);
				
				logout(idCellAccount1);	
				target.delay(1);
				UIALogger.logPass(testName);
			}else{
				UIALogger.logFail(testName);
			}
		}else{
		//if it's not possible to login with the first account, the test fails
			UIALogger.logFail(testName);
		}

	}); 


});
