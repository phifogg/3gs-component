3 GS Viewer Custom Component
===============================================
This is a custom component for ServiceNow based on the UX Framework. The component uses the https://threejs.org/ library to allow rendering of 3D files in a ServiceNow page. Here is an exmaple how this can look in its simplest form:

![3GS Building](images\/3gs_building.gif)

You may use this repo / component as instructional or inspirational, it has not been fully tested or vetted for a productive use. I am in no shape or form a professional when it comes to using the Three.js library and its functionality or its risks.

Other resources to checkout:
- [Next Experience Center of Excellence](https://www.servicenow.com/community/next-experience-articles/next-experience-center-of-excellence/ta-p/2332092) - This is the main place where our Developer Advocates post Next Experience, Workspace, and UI Builder enablement materials.
- [ThreeJS](https://threejs.org/) - This is the library used in this component
- [My NowBytes](https://www.youtube.com/@DanielNOWBytes/) - My YouTube chanel where I randomly post content around anyhting ServiceNow that I find interesting enough. No video on this component yet, but who knows. Let me know if I should do one.


Content
========
- [Why?](#why-)
- [What?](#what-)
- [How?](#how-)

Why ?
=====
Some time ago I was on a customer hackathon, always a great place and time to be with lovely and cretaive minds. One of these minds approached me and asked 'Can ServiceNow work with 3JS files?' I had no idea if, but I was pretty sure we can make it happen. The use case presented made sense and actually, I can see a lot of other use cases where this can be useful. Image you produce heavy machinery and want to help your technicans with detailed instructions on how to repair or maintain these, or you want to have a digital twin of your products or facilities ... could be used to navigate customers through the campus, right?

Well, long story short, I was interessted and started digging around. This repository is one of the results.

What ?
=====
Based on the customer request I wanted to create a component to be used on any modern UX Framework based page. The component needs to contain the 3JS viewer and render a defined 3D file. The file needs to be stored on ServiceNow.

A custom component is for sure not a low-code capability anymore. You should be fine with command lines, VS Code (or similar) as editor and the general developer contexts of JavaScript.

How ?
=====
This section will explain the steps required to make this component work. I will refer to other available instructions or resources where applicable.

1. ServiceNow CLI

    You will need the [ServiceNow CLI](https://store.servicenow.com/store/app/ee71f36a1ba46a50a85b16db234bcbd4). If you have issues downloading it from the official store, there is also a GitHub repo at [@ServiceNow/servicenow-cli](https://github.com/ServiceNow/servicenow-cli) - just verify it has the latest version as it might not be updated as regularly as the store itself. 

    Follow this [guide](https://developer.servicenow.com/dev.do#!/reference/next-experience/xanadu/cli/getting-started) on how to install the CLI. It will also ask you to install NPM and NODE.JS in a specific version each. Make sure you have the extact version mentioned, otherwise the CLI will not work as it should.

    You also need to install the ui-component extension to get all the features required for building custom UI components. The instructions are on the same page.

1. Start a new project / component

    A good reference to start building your own custom component is also on the [developer page](https://developer.servicenow.com/dev.do#!/reference/next-experience/xanadu/cli/development-flow).

    Here are the steps I followed for this repository:

    1. Create a new folder on your local disk, name it _3gs-component_

    1. Open a terminal / command line in that folder
    
        I actually opened VS Code in that folder and used the terminal window within VS Code. Either way, we need to execute commands in that folder.

        1. Setup SNC connection to instance

            Use command ```snc configure profile set``` to initialize the connection to ServiceNow. Basic Authentication with your regular ServiceNow developer account will do.

        1. Scaffold component files

            Use command ```snc ui-component project --name @snc/3gs-component --description "A web component that renders 3D files."```

            Obviously name and description are free text choices, important is names cannot start with numbers and also cannot contain special characters. Once successful, this command will create a set of files and directories in your local store which serve as starting point for the component development.

            Last step before we dig into the component, run ```npm install``` to have npm fetch all needed dependencies and prepare us for testing.

        1. Testing the component

            You can test the component locally without the need to have a full ServiceNow instance. Running ```snc ui-component develop --open``` will start a local web server and direct your browser of choice to it. This is very useful, especially as it automatically updates the browser with any change you make on the files. The development server will keep running until you press 'Ctrl-C' in the terminal window.

    1. Adding new HTML to the component

        The default generated component will be a simple hello world example. Let's change that to something bespoke for us. For this open the src/index.js file which was generated. This index.js file is the main content, but as you see, it only imports folders. So explore the folder mentioned and open the index.js from within that folder instead. This file should look something like:

        ```import {createCustomElement} from '@servicenow/ui-core';
        import snabbdom from '@servicenow/ui-renderer-snabbdom';
        import styles from './styles.scss';

        const view = (state, {updateState}) => (
	        <div>
		        <h1>Example</h1>
		        <p>This is an example of a bare-bones component.</p>
		        <p>You might want to read the <a href ="https://developer.servicenow.com/dev.do#!/reference/next-experience/latest/ui-framework/getting-started/introduction">documentation</a> on the ServiceNow developer site.</p>
	        </div>
        );

        createCustomElement('snc-hello-world', {
	        renderer: {type: snabbdom},
	        view,
	        styles
        });
        ```

        Change the ```<h1>Example</h1>``` to anything you like and re-run the test in your browser. Can you see the change? Good. This is where you can change the content of your component to anything you need it to be.

    1. Import Three.JS library

        Now that we have a JavaScript file for our component, we need to let the environment know that we want to use Three.JS. First step is to install the library using npm, run ```npm install three.js```. This will load the necessary files and add them to the package.

        With that complete, we can load the library in the index.js file with

        ```import * as THREE from 'three';```

        From now on, it is a matter of following the instructions of ThreeJs. I will spare us the part here, inspect my component and read the relevant documentation on ThreeJS. I personally started with the example in their [ThreeJS GitHub](https://github.com/mrdoob/three.js/) page.

        


