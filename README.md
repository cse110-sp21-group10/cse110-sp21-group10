# cse110-sp21-group10
We'll be creating a Bullet Journal--a place for you to track your thoughts and daily life--through adherence to Agile development.

## Bullet Journal Site Link
[Click here to go to our BuJo app!](https://cse110-sp21-group10.github.io/cse110-sp21-group10/source/HTML/log.html)

## Tours of The Project

[Final Private Video](https://youtu.be/jhNIVRSKZSo)

[Final Public Video](https://youtu.be/vKG24SghsZk)

## Meet the Team!

To meet the PowellPuff coders, check out our [Group Intro Video!](https://youtu.be/TEGurr5URH4)

A more detailed introduction can be found at our [Team Page](https://github.com/cse110-sp21-group10/cse110-sp21-group10/wiki/Team-Page).

## Admin

The rules that define our team culture and the ethics of our team can be found [here](admin/misc/rules.md).

Meeting Notes can be found [here](admin/meetings).

The status videos and final project videos can be found [here](admin/videos/).

For people who want to contribute to the project, the full Onboarding Document can be found [here](https://github.com/cse110-sp21-group10/cse110-sp21-group10/wiki/Onboarding).

## CI/CD Pipeline

The JSDocs documentation for our code can be found [here](https://cse110-sp21-group10.github.io/).

The documentation for the testing in our pipeline can be found [here](specs/testing/testing.md)

Here is documentation for the [First Phase](admin/cipipeline/phase1.md) and the [Second Phase](admin/cipipeline/phase1.md) of the developement of the CI/CD Pipeline.

### Linter Status
[![GitHub Super-Linter](https://github.com/cse110-sp21-group10/cse110-sp21-group10/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/marketplace/actions/super-linter)

### CodeFactor Code Quality Status
[![CodeFactor](https://www.codefactor.io/repository/github/cse110-sp21-group10/cse110-sp21-group10/badge?s=82cdcb24bda34ada6b80cc659332725ca7fdfdca)](https://www.codefactor.io/repository/github/cse110-sp21-group10/cse110-sp21-group10)


## Design

Our design process is documented in the **/specs** folder, which can be found [here](specs/).

All **architectural decision records (ADRs)** can be found in [/adrs](specs/adrs/).

The process by which we documented our design can be found in [/brainstorm](specs/brainstorm/).

This process resulted in the final pitch, which can be found in [/pitch](specs/pitch/).

Models of how we decided to store objects in the database are found in [/data models](specs/data%20models/).

## Code

The **/source** folder, which can be found [here](source/), contains all the source code that implements the bullet journal. This includes 

- [/HTML](source/HTML/), which contains the HTML file where journal is displayed
- [/style](source/style/), which contains the central CSS style sheet for the whole journal
- [/classes](source/classes/), which contains the JavaScript classes for custom html elements and other helper classes
- [/scripts](source/scripts/), which contains the JavaScript scripts that load the app and allow for interaction with the program
- [/assets](source/assets/), which contains the media for the program
  
The **/testing** folder, which can be found [here](testing/), contains the End to End and Unit Tests that test the functions of our program.

## Onboarding

### Meet the Team
Welcome to the PowellPuff Coders team! The first thing you should do is get to know our current team members, which you can start to do by checking out our [team page](https://github.com/cse110-sp21-group10/cse110-sp21-group10/wiki/Team-Page). Don't forget to add your own entry to the team page as well!

### Read the Documentation
Before getting to work on the code for this project, you should read over the documentation we have compiled.

First up is our internal documentation, which most importantly includes our team rules, meeting notes, brainstorming artifacts, and design records/notes. Our team rules can be found in [this](https://github.com/cse110-sp21-group10/cse110-sp21-group10/blob/main/admin/misc/rules.md) document. Read over these rules and add your own signed copy in the [`admin/misc`](https://github.com/cse110-sp21-group10/cse110-sp21-group10/blob/main/admin/misc) folder. Our meeting notes can be found in the [`admin/meetings`](https://github.com/cse110-sp21-group10/cse110-sp21-group10/tree/main/admin/meetings) folder, and a quick scan over these meeting notes can help you get up to date on where the team is at currently and what was discussed in the past. The other internal documentation files are in the [`specs`](https://github.com/cse110-sp21-group10/cse110-sp21-group10/tree/main/specs) folder, and these are important to check out because they describe how our app is designed and both in terms of user interface, as shown in our wireframes in our project pitch, and in terms of code, like the JSON formats for our various custom elements.

Next we have our code documentation, which is probably just as you would expect. Our code documentation is automatically generated using JSDoc, and the documentation is published [here](https://cse110-sp21-group10.github.io/), so you can take a look at that to get an idea of how our code works and how the different functions and objects interact with each other.

### Clone the Repository
In order to commit code to our project, you will need to clone our repository so you can work on it locally. The process for cloning our repository is the same as any other git repository. The easiest way to do it is to open a terminal on your computer, navigate to the directory where you want to store the repository directory, and run the following command:
```
git clone https://github.com/cse110-sp21-group10/cse110-sp21-group10.git
```
That will clone the repository into a folder called `cse110-sp21-group10` on your computer, and you can then navigate through the files on the repo locally to make changes to commit to the repository!

### Contribute to the Project
Once you're ready to contribute to our bullet journal project, here are the steps you should take to do so:
1. Open an issue for the new feature or change you want to work on. You can do this by clicking on the green "New issue" button in the ["Issues"](https://github.com/cse110-sp21-group10/cse110-sp21-group10/issues) tab on the GitHub repository and selecting "Get Started" with the "Checklist Story" template we have set up. The checklist story template is geared toward larger features that are based off user stories, but if you are working on something smaller, like a bug fix or style change, you don't have to use that template and can instead create an issue from scratch with a description and list of tasks. Be sure to give the issue any applicable labels, which you can do on the right of the issue creation page. Once you open the issue, it will get automatically added to our [Project Board](https://github.com/cse110-sp21-group10/cse110-sp21-group10/projects/1) in the "To Do" column.
2. Write the code to implement your feature/change locally in your cloned repository, which you can do in VSCode or another editor. If you are working on a new feature, make sure to create a new branch for your changes. You can do this by using the VSCode branch interface (which you can bring up by clicking on the branch name on the bottom left of your VSCode window) or by running the following command:
```
git checkout -b <new-branch-name>
```
If you are working on some smaller bug fix or styling, you can make your changes on an existing branch that is appropriate for the changes being made. You can checkout an existing branch using the VSCode branch interface or by running the following command:
```
git checkout <branch-name>
```
3. Test your changes locally. Our app is a web application, so you can test it by opening it up on a local server. The easiest way to run our app on a local server is by using the VSCode Live Server extension. With that extension installed, you can click the "Go Live" button at the bottom right of your VSCode window to start up the app in your default browser on a local server. If you are presented with the repository file structure in your browser after you press "Go Live", simply navigate to `source/HTML/log.html` to run the application. When you have the application opened locally, interact with the application test out your new feature, making sure to interact with the application in different ways to produce various scenarios to check that your feature responds as it should.
4. Write unit tests. If you are working on a new feature, you can help out our testing team by writing some unit tests for your new feature. We are using Jest for our unit testing, and you can find our testing files in the [`tests`](https://github.com/cse110-sp21-group10/cse110-sp21-group10/tree/main/tests) directory. To write unit tests, you can create a new file in the [`tests`](https://github.com/cse110-sp21-group10/cse110-sp21-group10/tree/main/tests) directory containing your Jest tests, and these will run along with all our other unit tests when you push your code to GitHub.
5. Commit and push your code. To commit your changes in VSCode, navigate to the source control tab on the left side of your VSCode window, stage your changes using the plus button on your changed files, enter a commit message in the message box, and press the check button at the top. To commit your changes in your terminal, you can navigate into your cloned repository and enter the following commands:
```
git add -A
git commit -m "YOUR COMMIT MESSAGE HERE"
```
Note that the `git add -A` command stages all your changes to commit, so if you don't want to commit all your changes and instead only want to commit specific files, you can replace that command with `git add <file-name>`. To push your changes in VSCode, navigate to the source control tab and after you commit your changes, press the three dots next to the check (commit) button and press "Push". To push your changes in your terminal, you can navigate into your cloned repository and, after you have committed your changes, enter the following command:
```
git push
```
If you created a new branch, make sure to publish the branch when you push, so that it shows up on our GitHub repository. You will automatically be prompted to do so when you push your changes in VSCode, but to do so in your terminal you can enter:
```
git push -u origin <your-branch-name>
```
6. Update your issue on GitHub. Go to our repository on GitHub and navigate to the ["Issues"](https://github.com/cse110-sp21-group10/cse110-sp21-group10/issues) tab, then to the issue that you opened for your feature/change. Make sure you have completed all the tasks in the issue description (or update the issue description if anything changed) and check them off.
7. Open a pull request for your branch on GitHub. To do this, go to our repository on GitHub, navigate to your newly updated branch, and press the "Contribute" > "Open Pull Request" buttons (you can also do this by going to the ["Pull requests"](https://github.com/cse110-sp21-group10/cse110-sp21-group10/pulls) tab on the GitHub repository, pressing the green "New pull request" button, and selecting your branch to be merged). Enter a title for your pull request along with a description of what is included in the pull request. After you open the pull request, it will automatically get added to our [Project Board](https://github.com/cse110-sp21-group10/cse110-sp21-group10/projects/1) in the "In Progress" column. Additionally, after you open the pull request, be sure to link the corresponding issue (this can be done on the right side of the pull request view) that you opened for your feature/change. Finally, if there are any merge conflicts with your pull request, you can fix them in the GitHub web editor, which you can access at the bottom of your pull request when it prompts you to resolve merge conflicts.
8. Monitor the checks on your pull request. When you open the pull request, a series of code quality, linter, and testing workflows run automatically to make sure that the code you wrote is up to standard and works properly. It usually takes a few minutes for all the checks to finish running, so check in on your pull request after a few minutes to see the results of all those checks. If any of the checks fail (in which case you will see a red 'X' on your pull request), check the details of why the check failed and go back to your code to make the appropriate changes to satisfy the checks, then commit and push those changes to update the pull request (at which point the checks will automatically re-run). If all of the checks passed, your pull request is good to go.
9. Wait for reviews on your pull request. Members of our team will review pull requests when it is indicated on GitHub that they have passed all the checks. Reviewers may leave comments on your pull request, ask for changes on your pull request, in which case you can discuss those changes and potentially implement them, or approve your pull request. When someone requests changes on your pull request, it gets placed in the "Under Review" column on our [Project Board](https://github.com/cse110-sp21-group10/cse110-sp21-group10/projects/1). When someone approves your pull request, it will be labeled with the team label corresponding to the reviewer's subteam (so you can see which subteams have approved your pull request) and the pull request will be moved to the "Reviewer Approved" column on our [Project Board](https://github.com/cse110-sp21-group10/cse110-sp21-group10/projects/1). Once your pull request gets 3 approvals (preferably one person from each other subteam, since we currently have 4 subteams total), it will automatically get merged. The pull request will then get placed in the "Done" column on our [Project Board](https://github.com/cse110-sp21-group10/cse110-sp21-group10/projects/1). Additionally, the corresponding issue that you linked to the pull request will be automatically closed and moved to the "Done" column on our [Project Board](https://github.com/cse110-sp21-group10/cse110-sp21-group10/projects/1) as well.
10. Check the [`main` branch](https://github.com/cse110-sp21-group10/cse110-sp21-group10) and the [deployed application](https://cse110-sp21-group10.github.io/cse110-sp21-group10/source/HTML/log.html) to make sure your changes are reflected. When your pull request gets merged into `main`, you will see the commit message for your branch being merged, and the JSDoc for your changes (if you edited a JavaScript file) will be automatically generated and published on our [documentation site](https://cse110-sp21-group10.github.io/), so make sure all of that is there. Additionally, if the merge included any new code, our app deployment on GitHub Pages will automatically be updated, so after a few minutes you should can go to our [deployed application](https://cse110-sp21-group10.github.io/cse110-sp21-group10/source/HTML/log.html) and you should see your changes reflected there. If there are any issues with what you see on the [`main` branch](https://github.com/cse110-sp21-group10/cse110-sp21-group10) or the [deployed application](https://cse110-sp21-group10.github.io/cse110-sp21-group10/source/HTML/log.html), make sure to reach out to a fellow team member to help you.

## Thank You
Thank you for checking out our Bullet Journal Project. We hope all the documentation on the repository reflects the work and dedication that went into the process of making this BuJo!
